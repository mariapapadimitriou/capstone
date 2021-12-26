from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

@csrf_exempt 
def index(request):

    lane_types = {}

    for i in request.POST:
        types = i[:-2]
        lane_types[types] = request.POST.getlist(i)
    print(lane_types)

    return render(request, 'frontend/index.html')