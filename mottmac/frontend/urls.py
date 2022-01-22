from django.urls import path
from .views import *

urlpatterns = [
    path('', index),
    path('plotcharts', index2),
    path('saveroute', saveRouteRequest),
    path('saveoverrides', saveOverridesRequest),
    path('getoverrides', getOverridesRequest),
    path('getroute', getRouteRequest),
    path('updateroute', updateRouteRequest),
    path('deleteroute', deleteRouteRequest), 
    path('login.html', login),
    path('register.html', register),
]
