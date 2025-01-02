from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin


class IsSellerUser(BasePermission):
    """
    Allows access only to seller users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_seller


class IsRegularUser(BasePermission):
    """
    Allows access only to regular users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_user
