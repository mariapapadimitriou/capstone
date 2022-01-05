from django.db import models

import warnings
from statistics import mean
import sqlite3

from shapely.wkt import loads
from shapely.geometry import Polygon
import shapely.ops as ops

from geopy.distance import distance
from functools import partial
import pyproj

#import geopandas as gpd
import pandas as pd

conn = sqlite3.connect('data.db')
neighbourhood_data = pd.read_sql_query("SELECT * FROM neighbourhood_data", conn)

neighbourhood_data['coordinates'] = neighbourhood_data['coordinates'].apply(lambda x: loads(x))

neighbourhood_coords = neighbourhood_data.set_index('neighbourhoodID')['coordinates']

SAFETY = {
    'sharrows': [0,3], 
    'striped': [1,3],
    'protected': [2,5]
}

route_types = ["sharrows", "striped", "protected"]

### Metric Calculations

def getSurroundingArea(route_start, route_end, radius_km=1):
    # start: (long, lat) of route start
    # end: (long, lat) of route end
    # radius in km of area around route
    
    route_north = route_start if max(route_start[0], route_end[0]) == route_start[0] else route_end
    route_south = route_start if min(route_start[0], route_end[0]) == route_start[0] else route_end
    route_east = route_start if max(route_start[1], route_end[1]) == route_start[1] else route_end
    route_west = route_start if min(route_start[1], route_end[1]) == route_start[1] else route_end
    
    # 0: North, 90: East, 180: South, 270: West
    area_north = distance(kilometers=radius_km).destination(route_north, bearing=0)[0]
    area_south = distance(kilometers=radius_km).destination(route_south, bearing=180)[0]
    area_east = distance(kilometers=radius_km).destination(route_east, bearing=90)[1]
    area_west = distance(kilometers=radius_km).destination(route_west, bearing=270)[1]

    area_coords = [
        (area_north, area_west),
        (area_north, area_east),
        (area_south, area_east),
        (area_south, area_west),
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

def getIntersectionPopulation(neighbourhoodID, area):

    neighbourhood = neighbourhood_data[neighbourhood_data.neighbourhoodID == neighbourhoodID]

    intersection = neighbourhood['coordinates'].values[0].intersection(area)

    intersection_area = getNeighbourhoodArea(intersection)
    neighbourhood_area = neighbourhood['neighbourhoodArea'].values[0]

    intersection_percentage = neighbourhood_area/intersection_area

    intersection_population = neighbourhood['workingPopulation'].values[0]*intersection_percentage

    return round(intersection_population)

def getRoutePopulation(area):

    neighbourhood_populations = []
    neighbourhoods = getNeighbourhoods(area)

    for neighbourhood in neighbourhoods:
        neighbourhood_populations.append(getIntersectionPopulation(neighbourhood, area))

    route_population = sum(neighbourhood_populations)

    return route_population


def getRidershipEmissions(start_coords, end_coords, riders, emissions_per_km):

    surrounding_area = getSurroundingArea(start_coords, end_coords)
    
    route_population = getRoutePopulation(surrounding_area)

    ridership = [route_population*riders[0]/100, route_population*riders[1]/100]

    ## UNCERTAINTY ARITHMETIC OR WHATEVER SCOTT WAS TALKING ABOUT
    emissions = [ridership[i]*emissions_per_km[i] for i in range(len(ridership))]

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

# Traffic Congestion
def getTraffic():

    traffic = 0

    return traffic

# Ridership and Emissions

# All Metrics
def getMetrics(route_type, unit_cost, length_of_path, start_coords, end_coords, riders, emissions):

    cost = getCost(unit_cost, length_of_path)
    ridership, emissions = getRidershipEmissions(start_coords, end_coords, riders, emissions)
    safety = getSafety(route_type)
    traffic = getTraffic()

    return cost, ridership, emissions, safety, traffic 

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

    if max_current == min_current:
        scaled = 0.5
    else:
        scaled = ((val-min_current)/(max_current-min_current))*(max_desired-min_desired) + min_desired

    return scaled
