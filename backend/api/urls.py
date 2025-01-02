from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, OrderViewSet, CartViewSet, PaymentViewSet, ShippingAddressViewSet, ReviewViewSet, WishlistViewSet, CouponViewSet

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'cart', CartViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'shipping-addresses', ShippingAddressViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'wishlist', WishlistViewSet)
router.register(r'coupons', CouponViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Include all the registered routes
]
