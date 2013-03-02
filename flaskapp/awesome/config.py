# -*- coding: utf-8 -*-
"""
    awesome.config
    ~~~~~~~~~~~~~~

    Sensible development defaults are defined here, overridden by environment
    variables, if they exist. Heroku likes environmet variables for
    configuration, so this is convenient.

    :copyright: (c) 2013 by people
    :license: Reserved, see the license file for more details.
"""


import os
import logging
from awesome import app


if str(os.environ.get('DEBUG')).lower() in ['true', 'on', 'yes', 'debug']:
    logging.warning('Debug turned on from envrionment variable!')
    app.config['DEBUG'] = True
    

app.config.update(
    SECRET_KEY=os.environ.get('SECRET_KEY', 'so secure'),
    HOST=os.environ.get('IP', '127.0.0.1'),
    PORT=os.environ.get('PORT', 5000),
    ORGANIZATION_NAME='Queen\'s Applied Sustainability',
    MONGO_DBNAME='awesome'
)
