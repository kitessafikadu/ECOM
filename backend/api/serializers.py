from rest_framework import serializers
from .models import User, Category, Product, Order, OrderItem, Cart, CartItem, Payment, ShippingAddress, Review, Wishlist, Coupon, User
import re

class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'first_name', 'last_name', 'profile_picture']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True},
            'username': {'required': True},
            'email': {'required': False},
            'last_name': {'required': True},
            'role': {'required': True},
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)  # Hash password before saving
        user.save()
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'created_at', 'updated_at']


class ProductSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='id', read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    category = CategorySerializer(read_only=True)
    in_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['product_id', 'name', 'description', 'price', 'image', 'stock', 
                  'brand', 'rating', 'num_ratings', 'category', 'category_id', 
                  'in_stock', 'created_at', 'updated_at']

    def get_in_stock(self, obj):
        return obj.stock > 0


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price', 'total_price']

    def get_total_price(self, obj):
        return obj.quantity * obj.price


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    items = OrderItemSerializer(source='items.all', read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_price', 'status', 'created_at', 'updated_at', 'items']


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['product', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return obj.quantity * obj.product.price


class CartSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    items = CartItemSerializer(source='items.all', read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_price']


class PaymentSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = ['order', 'payment_method', 'payment_status', 'transaction_id', 'created_at']


class ShippingAddressSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    order = OrderSerializer(read_only=True)

    class Meta:
        model = ShippingAddress
        fields = ['user', 'order', 'address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country']


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['user', 'product', 'rating', 'comment', 'created_at']


class WishlistSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ['user', 'products']


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['code', 'discount', 'valid_from', 'valid_until', 'active']

    def validate(self, data):
        # You can add validation to check the coupon's validity
        if data['valid_from'] > data['valid_until']:
            raise serializers.ValidationError("The 'valid_from' date cannot be later than 'valid_until'.")
        return data
