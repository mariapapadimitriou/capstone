from django.urls import path
from .views import index, index2, saveRoute, saveOverrides, getOverrides, getRoutes, login, register

urlpatterns = [
    path('', index),
    path('plotcharts', index2),
    path('saveroute', saveRoute),
    path('saveoverrides', saveOverrides),
    path('getoverrides', getOverrides),
    path('getroutes', getRoutes),
    path('login.html', login),
    path('register.html', register),
]
