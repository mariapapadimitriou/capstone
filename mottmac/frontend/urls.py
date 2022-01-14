from django.urls import path
from .views import index, index2, saveRoute, saveOverrides

urlpatterns = [
    path('', index),
    path('plotcharts', index2),
    path('saveroute', saveRoute),
    path('saveoverrides', saveOverrides),
]
