# -*- coding: utf-8 -*-
"""
    awesome.__init__
    ~~~~~~~~~~~~~~~~

    The structure of awesome follows the Simple Packages pattern:
    http://flask.pocoo.org/docs/patterns/packages/#simple-packages

    The components here require the app instance, so there is a circular import
    back to awesome (__init__) to get app. This is ok.

    :copyright: (c) 2013 by people
    :license: Reserved, see the license file for more details.
"""

# Set up the application first…
from flask import Flask
app = Flask(__name__)

# …then import the components.
import awesome.config
import awesome.db
import awesome.users
# import awesome.forms
import awesome.views
