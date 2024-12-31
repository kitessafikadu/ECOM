from django.urls import path, include
from django.contrib import admin
from .views import ProductDetailView, ProductRatingUpdateView, ProductUploadView
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)  # Register ProductViewSet for CRUD operations
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    ]
