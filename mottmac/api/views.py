from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def main(request):
    for i in range(5):
        HttpResponse('hello')
    return HttpResponse('hello')