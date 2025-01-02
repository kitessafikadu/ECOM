from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status
from .models import Product, Category, Order, OrderItem, Cart, CartItem, Payment, ShippingAddress, Review, Wishlist, Coupon
from .serializers import ProductSerializer, CategorySerializer, OrderSerializer, OrderItemSerializer, CartSerializer, CartItemSerializer, PaymentSerializer, ShippingAddressSerializer, ReviewSerializer, WishlistSerializer, CouponSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    ordering_fields = ['price', 'created_at', 'rating']
    filterset_fields = ['category', 'price', 'rating']
    permission_classes = [AllowAny]

    @action(detail=True, methods=['put'])
    def rate(self, request, pk=None):
        product = self.get_object()
        new_rating = request.data.get('rating')
        if new_rating is None or not (0 <= float(new_rating) <= 5):
            return Response({"error": "Rating must be between 0 and 5."}, status=status.HTTP_400_BAD_REQUEST)

        product.update_rating(float(new_rating))
        return Response(self.get_serializer(product).data)


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'], url_path='(?P<category_name>[^/.]+)/products')
    def products_by_category(self, request, category_name=None):
        category = get_object_or_404(Category, name=category_name)
        products = Product.objects.filter(category=category)
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = ProductSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['put'])
    def add_item(self, request, pk=None):
        order = self.get_object()
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        product = get_object_or_404(Product, pk=product_id)

        # Ensure product is in stock
        if product.stock < quantity:
            return Response({"error": "Not enough stock available."}, status=status.HTTP_400_BAD_REQUEST)

        # Add product to order
        order_item, created = OrderItem.objects.get_or_create(order=order, product=product)
        if not created:
            order_item.quantity += quantity
            order_item.save()

        order.calculate_total()
        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=['put'])
    def remove_item(self, request, pk=None):
        order = self.get_object()
        order_item_id = request.data.get('order_item_id')
        order_item = get_object_or_404(OrderItem, pk=order_item_id, order=order)
        order_item.delete()
        order.calculate_total()
        return Response(OrderSerializer(order).data)


class CartViewSet(ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['put'])
    def add_item(self, request, pk=None):
        cart = self.get_object()
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        product = get_object_or_404(Product, pk=product_id)

        # Ensure product is in stock
        if product.stock < quantity:
            return Response({"error": "Not enough stock available."}, status=status.HTTP_400_BAD_REQUEST)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response(CartSerializer(cart).data)

    @action(detail=True, methods=['put'])
    def remove_item(self, request, pk=None):
        cart = self.get_object()
        cart_item_id = request.data.get('cart_item_id')
        cart_item = get_object_or_404(CartItem, pk=cart_item_id, cart=cart)
        cart_item.delete()
        return Response(CartSerializer(cart).data)


class PaymentViewSet(ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def perform_create(self, serializer):
        serializer.save(order=self.request.data.get('order'))


class ShippingAddressViewSet(ModelViewSet):
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WishlistViewSet(ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CouponViewSet(ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer

    @action(detail=True, methods=['get'])
    def validate_coupon(self, request, pk=None):
        coupon = self.get_object()
        if coupon.is_valid():
            return Response({"valid": True})
        return Response({"valid": False}, status=status.HTTP_400_BAD_REQUEST)
