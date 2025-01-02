import os
from django.conf import settings
from django.db import models
from django.core import validators
from django.utils.text import slugify
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from decimal import Decimal

class User(AbstractUser):
    USER = 'user'
    SELLER = 'seller'
    ADMIN = 'admin'

    ROLE_CHOICES = [
        (USER, 'User'),
        (SELLER, 'Seller'),
        (ADMIN, 'Admin'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=USER)

    def __str__(self):
        return f"{self.username} ({self.role})"

    @property
    def is_admin(self):
        return self.role == self.ADMIN

    @property
    def is_seller(self):
        return self.role == self.SELLER

    @property
    def is_user(self):
        return self.role == self.USER

    # Add related_name to prevent conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.'
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        symmetrical=False
    )



class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)  
    slug = models.SlugField(unique=True, null=True, blank=True)
    description = models.TextField(blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)  

    class Meta:
        ordering = ['name']  

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100) 
    description = models.TextField() 
    price = models.DecimalField(max_digits=10, decimal_places=2)  
    image = models.ImageField(upload_to='products/') 
    stock = models.PositiveIntegerField(default=0)  
    brand = models.CharField(max_length=255,null=True, blank=True)  
    rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0.0,
        validators=[validators.MinValueValidator(0), validators.MaxValueValidator(5)]
    )  
    num_ratings = models.PositiveIntegerField(default=0)  
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)  

    class Meta:
        ordering = ['-created_at']  

    def update_rating(self, new_rating):
        """Recalculate average rating based on a new rating."""
        total_rating = self.rating * self.num_ratings + new_rating
        self.num_ratings += 1
        self.rating = total_rating / self.num_ratings
        self.save()

    def __str__(self):
        return self.name  

    def delete(self, *args, **kwargs):
        """Delete associated image file when the product is deleted."""
        if self.image:
            image_path = os.path.join(settings.MEDIA_ROOT, self.image.name)
            if os.path.exists(image_path):
                os.remove(image_path)

        super().delete(*args, **kwargs)

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('Pending', 'Pending'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled')
    ], default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order {self.id} - {self.user.username}"
    
    def calculate_total(self):
        total = sum(item.price * item.quantity for item in self.items.all())
        self.total_price = total
        self.save()

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    
    def get_total_price(self):
        return self.quantity * self.price

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField('Product', through='CartItem', related_name='carts')
    
    def __str__(self):
        return f"Cart for {self.user.username}"
    
    def get_total(self):
        total = sum(item.get_total_price() for item in self.items.all())
        return total

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    
    def get_total_price(self):
        return self.quantity * self.product.price

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('Credit Card', 'Credit Card'),
        ('PayPal', 'PayPal'),
        ('Bank Transfer', 'Bank Transfer'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
    ]
    
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='payments')  # ForeignKey to Order
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES)  # Payment method
    payment_status = models.CharField(max_length=50, choices=PAYMENT_STATUS_CHOICES, default='Pending')  # Payment status
    transaction_id = models.CharField(max_length=255, unique=True)  # Unique payment transaction ID
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for when payment is made

    def __str__(self):
        return f"Payment for Order {self.order.id} - {self.payment_status}"

class ShippingAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # ForeignKey to User
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='shipping_address')  # ForeignKey to Order
    address_line_1 = models.CharField(max_length=255)  # Address line 1
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)  # Address line 2 (optional)
    city = models.CharField(max_length=100)  # City
    state = models.CharField(max_length=100)  # State/Province
    postal_code = models.CharField(max_length=20)  # Postal code
    country = models.CharField(max_length=100)  # Country

    def __str__(self):
        return f"Shipping Address for Order {self.order.id} - {self.user.username}"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')  
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='reviews')  # ForeignKey to Product
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)]) 
    comment = models.TextField()  
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"Review for {self.product.name} by {self.user.username}"

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')  # ForeignKey to User
    products = models.ManyToManyField('Product', related_name='wishlists')  # Many-to-many relationship with Product

    def __str__(self):
        return f"Wishlist of {self.user.username}"

class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)  
    discount = models.DecimalField(max_digits=5, decimal_places=2)  
    valid_from = models.DateTimeField()  
    valid_until = models.DateTimeField()  
    active = models.BooleanField(default=True) 

    def __str__(self):
        return f"Coupon {self.code} - Active: {self.active}"
    
    def is_valid(self):
        """Check if the coupon is valid."""
        from django.utils import timezone
        now = timezone.now()
        return self.active and self.valid_from <= now <= self.valid_until
