from django.db import models

import sqlite3
import pandas as pd

OVERRIDE_COLUMNS = ['override_name', 'sharrows_cost_min', 'sharrows_cost_max', 'striped_cost_min', 'striped_cost_max', 'protected_cost_min', 'protected_cost_max', 
                    'bicycle_commuters_min', 'bicycle_commuters_max', 'new_riders_min', 'new_riders_max', 'emissions_per_km_min', 'emissions_per_km_max']
ROUTE_COLUMNS = ['route_name', 'start_coordinates', 'end_coordinates']

OVERRIDE_PLACEHOLDERS = ("?,"*len(OVERRIDE_COLUMNS))[:-1]
ROUTE_PLACEHOLDERS = ("?,"*len(ROUTE_COLUMNS))[:-1]


# override_dict = {
#     'override_name': 'test_override',
#     'sharrows_cost_min': '5000',
#     'sharrows_cost_max': '6000',
#     'striped_cost_min': '10000',
#     'striped_cost_max': '12000',
#     'protected_cost_min': '150000',
#     'protected_cost_max': '200000',
#     'bicycle_commuters_min': '5',
#     'bicycle_commuters_max': '7',
#     'new_riders_min': '15',
#     'new_riders_max': '20',
#     'emissions_per_km_min': '140',
#     'emissions_per_km_max': '150',
#     # 'user': 'NULL'
# }

# route_dict = {
#     'route_name': 'test_route'
#     'start_coordinates': 
#     'end_coordinates': 
# }

def getConnCurs():
    
    conn = sqlite3.connect('data.db')
    curs = conn.cursor()
    
    return conn, curs
    

def getAllNames(name_type):
    # name_type is either "override" or "route"
    
    conn, curs = getConnCurs()

    curs.execute("SELECT {0}_name FROM saved_{0}s".format(name_type))    
    names = curs.fetchall()
    
    curs.close()
    conn.close()
    
    names = [x[0] for x in names]
    
    return names    


### SAVE VALUES

    # Status = 0 on success
    # Status = 1 on error

def saveOverride(override_dict):
    
    override_name = override_dict['override_name']
        
    if override_name in getAllNames("override"):
        status = "This override name is already in use. Please choose another name and try again."
        return status
    
    
    columns = ",".join(OVERRIDE_COLUMNS)
    override_vals = tuple(override_dict.values())
    sqlQuery = "INSERT INTO saved_overrides ({0}) VALUES ({1})".format(columns, OVERRIDE_PLACEHOLDERS)

    conn, curs = getConnCurs()

    try:
        curs.execute(sqlQuery, override_vals)
        conn.commit()
        status = override_name + " has been successfully saved."
    except:
        status = "Error - Please try again."
        
    finally:
        curs.close()
        conn.close()
    
    return status

    def saveRoute(route_dict):
    
    route_name = route_dict['route_name']
        
    if route_name in getAllNames("route"):
        status = 1
        status_message = "This route name is already in use. Please choose another name and try again."
        return status_message, status
    
    columns = ",".join(ROUTE_COLUMNS)
    route_vals = tuple(route_dict.values())
    sqlQuery = "INSERT INTO saved_routes ({0}) VALUES ({1})".format(columns, ROUTE_PLACEHOLDERS)

    conn, curs = getConnCurs()

    try:
        curs.execute(sqlQuery, route_vals)
        conn.commit()
        status = 0
        status_message = route_name + " has been successfully saved."
    except:
        status = 1
        status_message = "Error - Please try again."
        
    finally:
        curs.close()
        conn.close()
    
    return status, status_message

### RETRIEVE VALUES

def getSavedOverride(override_name):
    
    sqlQuery = "SELECT * FROM saved_overrides where override_name = '{}'".format(override_name)
    
    conn, curs = getConnCurs()

    curs.execute(sqlQuery)    
    override_vals = curs.fetchone()
    
    curs.close()
    conn.close()
    
    override = {}
    
    for i, col in enumerate(OVERRIDE_COLUMNS):
        override[col] = override_vals[i]
    
    return override

def getSavedRoute(route_name):
    
    sqlQuery = "SELECT * FROM saved_routes where route_name = '{}'".format(route_name)
    
    conn, curs = getConnCurs()

    curs.execute(sqlQuery)    
    route_vals = curs.fetchone()
    
    curs.close()
    conn.close()
    
    route = {}
    
    for i, col in enumerate(ROUTE_COLUMNS):
        route[col] = route_vals[i]
    
    return route

### EDIT

def editOverride(override_dict):
    
    override_name = override_dict['override_name']
        
    if override_name not in getAllNames("override"):
        status, status_message = 1, "Error: This override does not exist."
        return status, status_message
    
    sqlQuery = "UPDATE saved_overrides SET "
    for col in OVERRIDE_COLUMNS[1:]:
        sqlQuery = sqlQuery + "{col} = {value}, ".format(col=col, value=override_dict[col])
    
    sqlQuery = sqlQuery + "update_time = CURRENT_TIMESTAMP WHERE override_name = '{}'".format(override_name)
    
    conn, curs = getConnCurs()

    try:
        curs.execute(sqlQuery)
        conn.commit()
        status, status_message = 0, override_name + " has been successfully updated."
    except:
        status, status_message = 1,  "Error - Please try again."
        
    finally:
        curs.close()
        conn.close()
        
    return status, status_message

    def editRoute(route_dict):
    
    route_name = route_dict['route_name']
        
    if route_name not in getAllNames("route"):
        status, status_message = 1, "Error: This route does not exist."
        return status, status_message
    
    sqlQuery = "UPDATE saved_routes SET "
    for col in ROUTE_COLUMNS[1:]:
        sqlQuery = sqlQuery + "{col} = {value}, ".format(col=col, value=route_dict[col])
    
    sqlQuery = sqlQuery + "update_time = CURRENT_TIMESTAMP WHERE route_name = '{}'".format(route_name)
    
    conn, curs = getConnCurs()

    try:
        curs.execute(sqlQuery)
        conn.commit()
        status, status_message = 0, route_name + " has been successfully updated."
    except:
        status, status_message = 1,  "Error - Please try again."
        
    finally:
        curs.close()
        conn.close()
        
    return status, status_message
