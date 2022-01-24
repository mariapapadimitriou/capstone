from django.db import models

import sqlite3
import pandas as pd

from .saved import getConnCurs

def getLocationBounds(location_id):

    sqlQuery = "SELECT bounds FROM location_bounds where location_id = {}".format(location_id)
    
    conn, curs = getConnCurs()

    curs.execute(sqlQuery)    
    bounds = curs.fetchone()[0]

    curs.close()
    conn.close()

    bounds = {'bounds':[float(x) for x in bounds[1:-1].split(',')]}

    return bounds