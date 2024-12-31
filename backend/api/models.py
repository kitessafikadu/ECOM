import os
from django.conf import settings
from django.db import models
from django.core import validators

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)  # Category name (unique)
    description = models.TextField(blank=True, null=True)  # Optional description
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when category is created
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp when category is last updated

    def __str__(self):
        return self.name  # Return category name when the object is printed

class Product(models.Model):
    name = models.CharField(max_length=100)  # Product name
    description = models.TextField()  # Product description
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price with decimal precision
    image = models.ImageField(upload_to='products/')  # Product image, uploaded to 'products/' folder
    stock = models.IntegerField(default=0)  # Product stock, default is 0
    rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0.0,
        validators=[validators.MinValueValidator(0), validators.MaxValueValidator(5)]
    )
    num_ratings = models.IntegerField(default=0)

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')  # Foreign key to Category model
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when product is created
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp when product is last updated

    def update_rating(self, new_rating):
        # Recalculate average rating based on new rating
        total_rating = self.rating * self.num_ratings + new_rating
        self.num_ratings += 1
        self.rating = total_rating / self.num_ratings
        self.save()

    def __str__(self):
        return self.name  # Return product name when the object is printed
    
    def delete(self, *args, **kwargs):
        if self.image:
            image_path = os.path.join(settings.MEDIA_ROOT, self.image.name)
            if os.path.exists(image_path):
                os.remove(image_path)  # Delete the image file

        super().delete(*args, **kwargs)
