from django.db import models

from statistics import mean

import sqlite3

import geopandas as gpd
import pandas as pd

from shapely.wkt import loads
from shapely.geometry.polygon import Polygon

conn = sqlite3.connect('data.db')
neighbourhood_data = pd.read_sql_query("SELECT * FROM neighbourhood_data", conn)

neighbourhood_data['coordinates'] = neighbourhood_data['coordinates'].apply(lambda x: loads(x))
neighbourhood_data = gpd.GeoDataFrame(neighbourhood_data, geometry='coordinates')

SAFETY = {
    'sharrows': [0,3], 
    'striped': [1,3],
    'protected': [2,5]
}

route_types = ["sharrows", "striped", "protected"]

### Metric Calculations

def getMetrics(route_type, unit_cost, length_of_path, start_coords, end_coords, riders, emissions):

    cost = getCost(unit_cost, length_of_path)
    ridership, emissions = getRidershipEmissions(start_coords, end_coords, length_of_path, riders, emissions)
    safety = getSafety(route_type)
    traffic = getTraffic()

    return cost, ridership, emissions, safety, traffic 

# Cost
def getCost(unit_cost, length_of_path):
    
    min_cost = -unit_cost[0]*length_of_path
    max_cost = -unit_cost[1]*length_of_path

    cost = [min_cost, max_cost]
    
    return cost

# Ridership and Emissions
def getRidershipEmissions(start_coords, end_coords, length_of_path, riders, emissions):
    ## Don't need length of path

    if length_of_path > 1:
        ridership = [(1-(1/length_of_path))*10, (1-(1/length_of_path))*30] # Fake Calcs
    else:
        ridership = [length_of_path*5, length_of_path*15]

    ## UNCERTAINTY ARITHMETIC OR WHATEVER SCOTT WAS TALKING ABOUT
    emissions = [x*0.5 for x in ridership]

    return ridership, emissions

# Safety
def getSafety(route_type):

    safety = SAFETY[route_type]

    return safety

# Traffic Congestion
def getTraffic():

    traffic = 0

    return traffic


# Scaled Metrics for Multi-Objective
def getScaledMetrics(cost_data, ridership_data, safety_data):

    if len(cost_data) == 0 or len(ridership_data) == 0 or len(safety_data) == 0:
        return [[],[],[]]

    # set cost values to positive
    cost_data = [[-cost for cost in route] for route in cost_data]

    cost = {
        'mean': [mean(route) for route in cost_data],
        'max': [max(route) for route in cost_data],
        'min': [min(route) for route in cost_data],
        'total_max': max([max(route) for route in cost_data]),
        'total_min': min([min(route) for route in cost_data])
    }

    ridership = {
        'mean': [mean(route) for route in ridership_data],
        'max': [max(route) for route in ridership_data],
        'min': [min(route) for route in ridership_data],
        'total_max': max([max(route) for route in ridership_data]),
        'total_min': min([min(route) for route in ridership_data])
    }

    safety = {
        'mean': [mean(route) for route in safety_data],
        'max': [max(route) for route in safety_data],
        'min': [min(route) for route in safety_data],
        'total_max': max([max(route) for route in safety_data]),
        'total_min': min([min(route) for route in safety_data])
    }

    cost_scaled = { # 1-scaled to flip (so lower cost is better)
        'mean': [1-scale(route, cost['total_max'], cost['total_min']) for route in cost['mean']],
        'max': [1-scale(route, cost['total_max'], cost['total_min']) for route in cost['max']],
        'min': [1-scale(route, cost['total_max'], cost['total_min']) for route in cost['min']]
    }

    ridership_scaled = {
        'mean': [scale(route, ridership['total_max'], ridership['total_min']) for route in ridership['mean']],
        'max': [scale(route, ridership['total_max'], ridership['total_min']) for route in ridership['max']],
        'min': [scale(route, ridership['total_max'], ridership['total_min']) for route in ridership['min']]
    }

    safety_scaled = { 
        'mean': [scale(route, safety['total_max'], safety['total_min']) for route in safety['mean']],
        'max': [scale(route, safety['total_max'], safety['total_min']) for route in safety['max']],
        'min': [scale(route, safety['total_max'], safety['total_min']) for route in safety['min']]
    }

    scaled_avg, scaled_max, scaled_min, scaled_add, scaled_subtract = [], [], [], [], []

    for route in range(len(cost_scaled['mean'])):
        scaled_avg.append([cost_scaled['mean'][route], ridership_scaled['mean'][route], safety_scaled['mean'][route]])
        scaled_max.append([cost_scaled['max'][route], ridership_scaled['max'][route], safety_scaled['max'][route]])
        scaled_min.append([cost_scaled['min'][route], ridership_scaled['min'][route], safety_scaled['min'][route]])

        scaled_add.append([max_val - avg_val for max_val, avg_val in zip(scaled_max[route], scaled_avg[route])])
        scaled_subtract.append([avg_val - min_val for avg_val, min_val in zip(scaled_avg[route], scaled_min[route])])

    return [scaled_avg, scaled_add, scaled_subtract]

def scale(val, max_current, min_current, max_desired = 1, min_desired = 0):

    scaled = ((val-min_current)/(max_current-min_current))*(max_desired-min_desired) + min_desired

    return scaled
