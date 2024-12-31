from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']  # Explicitly include 'id'

class ProductSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='id', read_only=True)  # Adding product ID explicitly
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    category = CategorySerializer(read_only=True)  # Nested category for read operations

    class Meta:
        model = Product
        fields = ['product_id', 'name', 'description', 'price', 'stock', 'rating', 'category', 'category_id', 'image', 'created_at', 'updated_at']
