# -*- coding: utf-8 -*-
"""
    awesome.db
    ~~~~~~~~~~

    http://flask-pymongo.readthedocs.org/

    :copyright: (c) 2013 by people
    :license: Reserved, see the license file for more details.
"""


from flask.ext.pymongo import PyMongo
from awesome import app


mongo = PyMongo(app)
