
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from api.saved import *
from api.location import getLocationCoords, getAllRoutesbyLocation

@csrf_exempt 
def saveRouteRequest(request):

    request_dic = dict(request.POST)

    status, message, route_id = saveRoute(request_dic)

    context = {
        "status": status,
        "message": message,
        "route_id": route_id
    }
    return JsonResponse(context)


@csrf_exempt 
def saveOverridesRequest(request):

    request_dic = dict(request.POST)

    status, message = saveOverrides(request_dic)
    print(status, message)

    context = {
        "status": status,
        "message": message
    }
    return JsonResponse(context)

@csrf_exempt 
def updateRouteRequest(request):

    request_dic = dict(request.POST)

    status, message = updateRoute(request_dic)
    print(status, message)
    
    context = {
        "status": status,
        "message": message
    }
    return JsonResponse(context)

@csrf_exempt 
def deleteRouteRequest(request):

    request_dic = dict(request.POST)

    status, message = deleteRoute(request_dic)
    print(status, message)
    
    context = {
        "status": status,
        "message": message
    }
    return JsonResponse(context)

@csrf_exempt 
def renameRouteRequest(request):

    request_dic = dict(request.POST)

    status, message = renameRoute(request_dic)
    print(status, message)
    
    context = {
        "status": status,
        "message": message
    }
    return JsonResponse(context)


@csrf_exempt 
def getOverridesRequest(request):

    request_dic = dict(request.POST)["name"]
    override = getOverrides(request_dic[0])

    return JsonResponse(override)


@csrf_exempt 
def getRouteRequest(request):

    request_dic = dict(request.POST)["name"]
    route = getRoute(request_dic[0])

    route["start_coordinates"] = [float(route["start_coordinates"][0]),float(route["start_coordinates"][1])]
    route["end_coordinates"] = [float(route["end_coordinates"][0]),float(route["end_coordinates"][1])]
    route["route_ids"] = getAllSaved('route').set_index('route_id').to_dict()['route_name']
    
    return JsonResponse(route)


@csrf_exempt 
def getLocationRequest(request):

    request_dic = dict(request.POST)["location_id"]
    
    location = getLocationCoords(request_dic[0])
    names = getAllRoutesbyLocation(request_dic[0])

    context = {
        "bounds": location["bounds"],
        "starting_position": location["starting_position"],
        "names": names
        }

    return JsonResponse(context)
