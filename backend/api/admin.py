from django.contrib import admin
from .models import Product, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')  # Show 'name' and 'created_at' in admin
    search_fields = ('name',)  # Allow searching by category name

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'rating', 'category', 'created_at')  # Show important fields
    search_fields = ('name',)  # Allow searching by product name
    list_filter = ('category', 'rating', 'stock')  # Filter products by category, rating, or stock
