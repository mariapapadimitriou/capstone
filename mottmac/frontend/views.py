from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import numpy as np

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

    cost_plot = np.random.rand(2)
    ridership_plot = np.random.rand(2)
    emissions_plot = np.random.rand(2)
    trafficvolume_plot = np.random.rand(2)
    safety_plot = np.random.rand(2)

    print(safety_plot)

    return render(request, 'frontend/index.html', {
        "cost_plot" : cost_plot,
        "ridership_plot" : ridership_plot,
        "emissions_plot" : emissions_plot,
        "trafficvolume_plot" : trafficvolume_plot,
        "safety_plot" : safety_plot
    })

def getIndices(index_nums):

    return index_nums[0], index_nums[-1]