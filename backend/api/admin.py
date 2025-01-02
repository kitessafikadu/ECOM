from django.contrib import admin
from .models import (
    User, Category, Product, Order, OrderItem, Cart, CartItem, Payment,
    ShippingAddress, Review, Wishlist, Coupon
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'date_joined')
    search_fields = ('username', 'email')
    list_filter = ('role', 'is_active')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')  
    search_fields = ('name',)  
    ordering = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'rating', 'category', 'created_at')  
    search_fields = ('name', 'description')  
    list_filter = ('category', 'rating', 'stock')  
    ordering = ('-created_at',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'status', 'created_at')  
    search_fields = ('user__username', 'status')  
    list_filter = ('status', 'created_at')  
    ordering = ('-created_at',)

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')  
    search_fields = ('product__name', 'order__id')  

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')  
    search_fields = ('user__username',)

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'quantity')  
    search_fields = ('product__name',)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order', 'payment_method', 'payment_status', 'transaction_id', 'created_at')  
    search_fields = ('transaction_id', 'order__id')  
    list_filter = ('payment_method', 'payment_status')

@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('order', 'user', 'address_line_1', 'city', 'postal_code', 'country')  
    search_fields = ('user__username', 'city', 'postal_code')  

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'created_at')  
    search_fields = ('product__name', 'user__username')  
    list_filter = ('rating', 'created_at')

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user',)  
    search_fields = ('user__username',)

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount', 'valid_from', 'valid_until', 'active')  
    search_fields = ('code',)  
    list_filter = ('active', 'valid_from', 'valid_until')  
