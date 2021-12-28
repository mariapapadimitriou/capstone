from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import numpy as np
import json
from django.http import JsonResponse


@csrf_exempt 
def index(request):

    post_result = request.POST

    result_store = {
        "routetypes": {},
        "colours": [],
        "coordinates": {},
        "overrides":[]
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

    # USING RANDOM VALUES FOR NOW BUT WILL EVENTUALLY NEED TO CODE STUFF TO GET THESE NUMBERS

    cost_plot = {"colours": [], "label": [], "datapoints":[]}

    for i in range(len(result_store["colours"])):

        if result_store["routetypes"]["sharrows"][i] == "1":
            label = "Route " + str(i + 1) + " - Sharrows"
            cost_plot["label"].append(label)
            cost_plot["colours"].append(result_store["colours"][i])
            cost_plot["datapoints"].append(list(np.random.rand(2)))
        if result_store["routetypes"]["striped"][i] == "1":
            label = "Route " + str(i + 1) + " - Striped"
            cost_plot["label"].append(label)
            cost_plot["colours"].append(result_store["colours"][i])
            cost_plot["datapoints"].append(list(np.random.rand(2)))
        if result_store["routetypes"]["protected"][i] == "1":
            label = "Route " + str(i + 1) + " - Protected"
            cost_plot["label"].append(label)
            cost_plot["colours"].append(result_store["colours"][i])
            cost_plot["datapoints"].append(list(np.random.rand(2)))
        
    ridership_plot = list(np.random.rand(2))
    emissions_plot = list(np.random.rand(2))
    trafficvolume_plot = list(np.random.rand(2))
    safety_plot = list(np.random.rand(2))

    context = {
        "cost_plot_colours" : json.dumps(cost_plot["colours"]),
        "cost_plot_labels" : cost_plot["label"],
        "cost_plot_data" : cost_plot["datapoints"],
        "ridership_plot" : json.dumps(ridership_plot),
        "emissions_plot" : json.dumps(emissions_plot),
        "trafficvolume_plot" : json.dumps(trafficvolume_plot),
        "safety_plot" : json.dumps(safety_plot)
    }

    return render(request, 'frontend/index.html', context)

@csrf_exempt 
def index2(request):

    post_result = request.POST

    result_store = {
        "routetypes": {},
        "colours": [],
        "coordinates": {},
        "overrides":[]
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

    # USING RANDOM VALUES FOR NOW BUT WILL EVENTUALLY NEED TO CODE STUFF TO GET THESE NUMBERS

    colours_plot = []
    labels_plot = []

    cost_data = []
    ridership_data = []
    emissions_data = []
    traffic_data = []
    safety_data = []

    for i in range(len(result_store["colours"])):

        if result_store["routetypes"]["sharrows"][i] == "1":
            label = "Sharrows"
            labels_plot.append(label)
            colours_plot.append(result_store["colours"][i])
            cost_data.append(list(np.random.rand(2)))
            ridership_data.append(list(np.random.rand(2)))
            emissions_data.append(list(np.random.rand(2)))
            traffic_data.append(list(np.random.rand(2)))
            safety_data.append(list(np.random.rand(2)))
        if result_store["routetypes"]["striped"][i] == "1":
            label = "Striped"
            labels_plot.append(label)
            colours_plot.append(result_store["colours"][i])
            cost_data.append(list(np.random.rand(2)))
            ridership_data.append(list(np.random.rand(2)))
            emissions_data.append(list(np.random.rand(2)))
            traffic_data.append(list(np.random.rand(2)))
            safety_data.append(list(np.random.rand(2)))
        if result_store["routetypes"]["protected"][i] == "1":
            label = "Protected"
            labels_plot.append(label)
            colours_plot.append(result_store["colours"][i])
            cost_data.append(list(np.random.rand(2)))
            ridership_data.append(list(np.random.rand(2)))
            emissions_data.append(list(np.random.rand(2)))
            traffic_data.append(list(np.random.rand(2)))
            safety_data.append(list(np.random.rand(2)))
        
    context = {
        "colours_plot" : colours_plot,
        "labels_plot" : labels_plot,
        "cost_data" : cost_data,
        "ridership_data" : ridership_data,
        "emissions_data" : emissions_data,
        "traffic_data" : traffic_data,
        "safety_data" : safety_data
    }
    return JsonResponse(context)



def getIndices(index_nums):

    return index_nums[0], index_nums[-1]