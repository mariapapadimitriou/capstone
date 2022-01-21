from django.urls import path
from .views import index, index2, saveRouteRequest, saveOverridesRequest, getOverridesRequest, getRouteRequest, login, register

urlpatterns = [
    path('', index),
    path('plotcharts', index2),
    path('saveroute', saveRouteRequest),
    path('saveoverrides', saveOverridesRequest),
    path('getoverrides', getOverridesRequest),
    path('getroute', getRouteRequest),
    path('login.html', login),
    path('register.html', register),
]
