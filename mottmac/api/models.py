from django.db import models

import warnings
from statistics import mean
import sqlite3
import random

from shapely.wkt import loads
from shapely.geometry import Polygon
import shapely.ops as ops

from geopy.distance import distance
from functools import partial
import pyproj

import pandas as pd

conn = sqlite3.connect('data.db')
neighbourhood_data = pd.read_sql_query("SELECT * FROM neighbourhood_data", conn)
conn.close()

neighbourhood_data['coordinates'] = neighbourhood_data['coordinates'].apply(lambda x: loads(x))

neighbourhood_coords = neighbourhood_data.set_index('neighbourhood_id')['coordinates']

SAFETY = {
    'sharrows': [-1.25, 0.79], 
    'striped': [-0.48, 0.68],
    'protected': [0.46, 0.98]
}

route_types = ["sharrows", "striped", "protected"]

### Metric Calculations

# Ridership and Emissions
def getSurroundingArea(route_start, route_end):
    # start: (long, lat) of route start
    # end: (long, lat) of route end
    # radius in km of area around route
    route_start = (float(route_start[1]), float(route_start[0]))
    route_end = (float(route_end[1]), float(route_end[0]))
    
    route_north = route_start if max(route_start[0], route_end[0]) == route_start[0] else route_end
    route_south = route_start if min(route_start[0], route_end[0]) == route_start[0] else route_end
    route_east = route_start if max(route_start[1], route_end[1]) == route_start[1] else route_end
    route_west = route_start if min(route_start[1], route_end[1]) == route_start[1] else route_end
    
    dist = distance(kilometers=1)
    # 0: North, 90: East, 180: South, 270: West
    area_north = dist.destination(route_north, bearing=0)[0]
    area_south = dist.destination(route_south, bearing=180)[0]
    area_east = dist.destination(route_east, bearing=90)[1]
    area_west = dist.destination(route_west, bearing=270)[1]

    area_coords = [
        (area_west, area_north),
        (area_east, area_north),
        (area_east, area_south),
        (area_west, area_south),
            ]
    
    return Polygon(area_coords)

def getNeighbourhoodArea(coords):

    with warnings.catch_warnings():
        warnings.filterwarnings("ignore", category=FutureWarning)
        projected_shape = ops.transform(
            partial(
                pyproj.transform,
                pyproj.Proj(init='EPSG:4326'),
                pyproj.Proj(
                    proj='aea',
                    lat_1=coords.bounds[1],
                    lat_2=coords.bounds[3])),
            coords)
    
    return round(projected_shape.area)

def getNeighbourhoods(area):
    
    intersections = []

    for neighbourhood in neighbourhood_coords.keys():

        if neighbourhood_coords[neighbourhood].intersects(area):
            intersections.append(neighbourhood)

    return intersections

def getIntersectionPopulation(neighbourhood_id, area):

    neighbourhood = neighbourhood_data[neighbourhood_data.neighbourhood_id == neighbourhood_id]

    intersection = neighbourhood['coordinates'].values[0].intersection(area)

    intersection_area = getNeighbourhoodArea(intersection)
    neighbourhood_area = neighbourhood['neighbourhood_area'].values[0]

    intersection_percentage = intersection_area/neighbourhood_area

    intersection_population = neighbourhood['working_population'].values[0]*intersection_percentage

    return round(intersection_population)

def getRoutePopulation(area):

    neighbourhood_populations = []
    neighbourhoods = getNeighbourhoods(area)

    for neighbourhood in neighbourhoods:
        neighbourhood_populations.append(getIntersectionPopulation(neighbourhood, area))

    route_population = sum(neighbourhood_populations)

    return route_population


def intervalMultiply(ab,cd):
    # Interval Arithmetic: https://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node45.html
    # [a,b]*[c,d] = [min(ac,ad,bc,bd), max(ac,ad,bc,bd)]
    
    values = []
    for i in range(2):
        for j in range(2):
            values.append(ab[i]*cd[j])
    
    prod = [min(values), max(values)]
    return prod

def getRidershipEmissions(start_coords, end_coords, length_of_path, riders, new_riders, emissions_per_km):

    # Ridership
    surrounding_area = getSurroundingArea(start_coords, end_coords)   
    route_population = getRoutePopulation(surrounding_area)
    ridership = [x*route_population/100 for x in riders] # Percentage to decimals

    # Modal Shift and Emissions
    new_riders = [x/100 for x in new_riders] # Percentage to decimals
    modal_shift = intervalMultiply(ridership, new_riders)
    emissions = [x*length_of_path/1000 for x in intervalMultiply(emissions_per_km,modal_shift)]

    return ridership, emissions

# Cost
def getCost(unit_cost, length_of_path):
    
    min_cost = -unit_cost[0]*length_of_path
    max_cost = -unit_cost[1]*length_of_path

    cost = [min_cost, max_cost]
    
    return cost

# Safety
def getSafety(route_type):

    safety = SAFETY[route_type]

    return safety

# # Traffic Congestion
# def getTraffic(route_type):
#     # average road lane width: 3.25 m 
#     # minimum road lane width: 3 m 
#     # width of striped lane: 1.75 m
#     # width of protected lane: 2 m (This is a bit of an estimate)
#     traffic = TRAFFIC[route_type]

#     return traffic

# All Metrics
def getMetrics(route_type, unit_cost, length_of_path, start_coords, end_coords, riders, modal_shift, emissions):

    cost = getCost(unit_cost, length_of_path)
    ridership, emissions = getRidershipEmissions(start_coords, end_coords, length_of_path, riders, modal_shift, emissions)
    safety = getSafety(route_type)
    # traffic = getTraffic(route_type)

    return cost, ridership, emissions, safety#, traffic 

# Scaled Metrics for Multi-Objective
def getScaledMetrics(cost_data, ridership_data, emissions_data, safety_data):

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

    emissions = {
        'mean': [mean(route) for route in emissions_data],
        'max': [max(route) for route in emissions_data],
        'min': [min(route) for route in emissions_data],
        'total_max': max([max(route) for route in emissions_data]),
        'total_min': min([min(route) for route in emissions_data])
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

    emissions_scaled = {
        'mean': [scale(route, emissions['total_max'], emissions['total_min']) for route in emissions['mean']],
        'max': [scale(route, emissions['total_max'], emissions['total_min']) for route in emissions['max']],
        'min': [scale(route, emissions['total_max'], emissions['total_min']) for route in emissions['min']]
    }

    safety_scaled = { 
        'mean': [scale(route, safety['total_max'], safety['total_min']) for route in safety['mean']],
        'max': [scale(route, safety['total_max'], safety['total_min']) for route in safety['max']],
        'min': [scale(route, safety['total_max'], safety['total_min']) for route in safety['min']]
    }

    scaled_avg, scaled_max, scaled_min, scaled_add, scaled_subtract = [], [], [], [], []

    for route in range(len(cost_scaled['mean'])):
        scaled_avg.append([cost_scaled['mean'][route], ridership_scaled['mean'][route], emissions_scaled['mean'][route], safety_scaled['mean'][route]])
        scaled_max.append([cost_scaled['max'][route], ridership_scaled['max'][route], emissions_scaled['max'][route], safety_scaled['max'][route]])
        scaled_min.append([cost_scaled['min'][route], ridership_scaled['min'][route], emissions_scaled['min'][route], safety_scaled['min'][route]])

        scaled_add.append([max_val - avg_val for max_val, avg_val in zip(scaled_max[route], scaled_avg[route])])
        scaled_subtract.append([avg_val - min_val for avg_val, min_val in zip(scaled_avg[route], scaled_min[route])])

    return [scaled_avg, scaled_add, scaled_subtract]

def scale(val, max_current, min_current, max_desired = 1, min_desired = 0):

    if max_current == min_current:
        scaled = 0.5
    else:
        scaled = ((val-min_current)/(max_current-min_current))*(max_desired-min_desired) + min_desired

    return scaled
