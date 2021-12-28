from django.urls import path
from .views import index, index2

urlpatterns = [
    path('', index),
    path('hi', index2),
]
