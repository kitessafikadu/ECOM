from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView, CreateAPIView
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from django.http import HttpResponse

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view

@api_view(['PUT'])
def rate_product(request, pk):
    print("Request data:", request.data)  # Debugging line

    product = get_object_or_404(Product, pk=pk)
    new_rating = request.data.get('rating')  # Should now parse correctly

    if new_rating is not None:
        try:
            new_rating = float(new_rating)
            if 0 <= new_rating <= 5:
                product.rating = new_rating
                product.save()
                return JsonResponse({
                    "id": product.id,
                    "name": product.name,
                    "rating": product.rating,
                    "message": "Rating updated successfully",
                })
            else:
                return JsonResponse({"error": "Rating must be between 0 and 5"}, status=400)
        except ValueError:
            return JsonResponse({"error": "Invalid rating value"}, status=400)
    return JsonResponse({"error": "Rating is required"}, status=400)



def home(request):
    return HttpResponse("Welcome to the E-Commerce API!")


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# 2. Category ViewSet (for performing CRUD operations on categories)
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# 2. Product Detail View (for viewing details of a single product)
class ProductDetailView(RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'pk'  # This means you'll access this view with the product's primary key (ID)

    # Optionally, you can override the update method to handle specific logic (like rating updates).

# 3. Product Rating Update View (to update the product's rating)
class ProductRatingUpdateView(APIView):
    def put(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get the rating from the request data
        rating = request.data.get('rating')

        # Validate the rating value
        if rating is None or rating < 1 or rating > 5:
            return Response({"error": "Invalid rating, must be between 1 and 5."}, status=status.HTTP_400_BAD_REQUEST)

        # Update the product rating using the formula: (total rating / number of ratings)
        total_rating = product.rating * product.num_ratings
        product.num_ratings += 1
        product.rating = (total_rating + rating) / product.num_ratings
        product.save()

        # Return the updated product data
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

# 4. Product Upload View (for creating a new product)
class ProductUploadView(CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        # Save the product instance to the database
        serializer.save()

    def post(self, request, *args, **kwargs):
        # Handle the POST request for creating a product
        return super().post(request, *args, **kwargs)
    
