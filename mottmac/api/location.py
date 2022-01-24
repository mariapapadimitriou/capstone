from django.db import models

import sqlite3
import pandas as pd

from .saved import getConnCurs

def getLocationCoords(location_id):

    sqlQuery = "SELECT bounds, starting_position FROM [location.city_bounds] where location_id = {}".format(location_id)
    
    conn, curs = getConnCurs()

    curs.execute(sqlQuery)    
    location = curs.fetchone()

    curs.close()
    conn.close()

    location = {
        'bounds':[float(x) for x in location[0][1:-1].split(',')],
        'starting_position':[float(x) for x in location[1][1:-1].split(',')]
    }

    return location

def getAllRoutesbyLocation(location_id):

    conn, curs = getConnCurs()

    curs.execute("SELECT route_name FROM [saved.routes] WHERE location_id = {}".format(location_id))
    names = curs.fetchall()

    curs.close()
    conn.close()

    names = [x[0] for x in names]

    return names