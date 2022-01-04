# source .venv/bin/activate
# python3 manage.py runserver

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import numpy as np
import json
from django.http import JsonResponse

from api.models import *
np.random.seed(1)

# Cost Constants [lower bound, upper bound] (CHANGE TO REAL NUMBERS)
# SET AT <!-- OVERRIDES - SET DEFAULTS HERE-->  in index.html
SHARROWS_UNIT_COST = [10000,15000]
STRIPED_UNIT_COST = [20000,40000]
PROTECTED_UNIT_COST = [40000,60000]
BIKE_RIDERS = [0, 100]
EMISSIONS = [134, 134]

@csrf_exempt 
def index(request):

    context = {
        "SHARROWS_UNIT_COST_MIN": SHARROWS_UNIT_COST[0],
        "SHARROWS_UNIT_COST_MAX": SHARROWS_UNIT_COST[1],
        "STRIPED_UNIT_COST_MIN": STRIPED_UNIT_COST[0],
        "STRIPED_UNIT_COST_MAX": STRIPED_UNIT_COST[1],
        "PROTECTED_UNIT_COST_MIN": PROTECTED_UNIT_COST[0],
        "PROTECTED_UNIT_COST_MAX": PROTECTED_UNIT_COST[1],
        "BIKE_RIDERS_MIN": BIKE_RIDERS[0],
        "BIKE_RIDERS_MAX": BIKE_RIDERS[1],
        "EMISSIONS_MIN": EMISSIONS[0],
        "EMISSIONS_MAX": EMISSIONS[1]
    }
    
    return render(request, 'frontend/index.html', context)

@csrf_exempt 
def index2(request):

    post_result = request.POST

    result_store = {
        "routetypes": {},
        "colours": [],
        "route_length": [],
        "coordinates": {},
        "overrides":{},
    }

    for result in post_result:

        if "routetypes" in result:
            if "sharrows" in result:
                result_store["routetypes"]["sharrows"] = post_result.getlist(result)
            if "striped" in result:
                result_store["routetypes"]["striped"] = post_result.getlist(result)
            if "protected" in result:
                result_store["routetypes"]["protected"] = post_result.getlist(result)

        if "colours" in result:
            result_store["colours"] = post_result.getlist(result)

        if "coordinates" in result:
            route_id = result.replace("coordinates", "")

            indices = getIndices(route_id[:-2].replace("[", " ").replace("]", " ").split(" ")[1:-1])[0]
            
            if indices not in result_store["coordinates"]:
                result_store["coordinates"][indices] = [post_result.getlist(result)]
            else:
                result_store["coordinates"][indices].append(post_result.getlist(result))
        if "overrides" in result:
            
            if "cost_sharrows" in result:
                result_store["overrides"]["cost_sharrows"] = post_result.getlist(result)
                for i in range(len(result_store["overrides"]["cost_sharrows"])):
                    result_store["overrides"]["cost_sharrows"][i] = float(result_store["overrides"]["cost_sharrows"][i])
            if "cost_striped" in result:
                result_store["overrides"]["cost_striped"] = post_result.getlist(result)
                for i in range(len(result_store["overrides"]["cost_striped"])):
                    result_store["overrides"]["cost_striped"][i] = float(result_store["overrides"]["cost_striped"][i])
            if "cost_protected" in result:
                result_store["overrides"]["cost_protected"] = post_result.getlist(result)
                for i in range(len(result_store["overrides"]["cost_protected"])):
                    result_store["overrides"]["cost_protected"][i] = float(result_store["overrides"]["cost_protected"][i])
            
            if "riders" in result:
                result_store["overrides"]["riders"] = post_result.getlist(result)
                for i in range(len(result_store["overrides"]["riders"])):
                    result_store["overrides"]["riders"][i] = float(result_store["overrides"]["riders"][i])
        
        if "length" in result:
            result_store["route_length"] = post_result.getlist(result)
            for i in range(len(result_store["route_length"])):
                result_store["route_length"][i] = float(result_store["route_length"][i])


    # USING RANDOM VALUES FOR NOW BUT WILL EVENTUALLY NEED TO CODE STUFF TO GET THESE NUMBERS

    colours_plot = []
    labels_plot = []

    cost_data = []
    ridership_data = []
    emissions_data = []
    traffic_data = []
    safety_data = []

    unit_costs = {
        'sharrows': result_store["overrides"]["cost_sharrows"], 
        'striped': result_store["overrides"]["cost_striped"],
        'protected': result_store["overrides"]["cost_protected"]
        }

    for i in range(len(result_store["colours"])):

        for route_type in route_types:

            if result_store["routetypes"][route_type][i] == "1":
                route_num_type = "Route " + str(i + 1) + " " + route_type.capitalize()
                labels_plot.append(route_num_type)
                colours_plot.append(result_store["colours"][i])

                cost, ridership, emissions, safety, traffic = getMetrics(
                    route_type=route_type, 
                    unit_cost=unit_costs[route_type], 
                    length_of_path=result_store["route_length"][i], 
                    start_coords=result_store["coordinates"][str(i)][0], 
                    end_coords=result_store["coordinates"][str(i)][1],
                    riders=result_store["overrides"]["riders"],
                    emissions=[133,135] #switch to override when available
                )

                cost_data.append(cost)
                ridership_data.append(ridership)
                emissions_data.append(emissions)
                traffic_data.append(traffic)
                safety_data.append(safety)

    multi_data = getScaledMetrics(cost_data, ridership_data, safety_data)
  
    context = {
        "SHARROWS_UNIT_COST": SHARROWS_UNIT_COST,
        "STRIPED_UNIT_COST": STRIPED_UNIT_COST,
        "PROTECTED_UNIT_COST":PROTECTED_UNIT_COST,
        "BIKE_RIDERS":BIKE_RIDERS,
        "colours_plot" : colours_plot,
        "labels_plot" : labels_plot,
        "cost_data" : cost_data,
        "ridership_data" : ridership_data,
        "emissions_data" : emissions_data,
        "traffic_data" : traffic_data,
        "safety_data" : safety_data,
        "multi_data": multi_data,
    }
    return JsonResponse(context)


def getIndices(index_nums):

    return index_nums[0], index_nums[-1]





