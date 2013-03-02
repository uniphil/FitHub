# -*- coding: utf-8 -*-
"""
    awesome.config
    ~~~~~~~~~~~~~~

    blah

    :copyright: (c) 2013 by people
    :license: Reserved, see the license file for more details.
"""


import os
import logging
from awesome import app


app.config.update(
    SECRET_KEY='so secure',
    HOST='127.0.0.1',
    PORT=5000,
)


try:
    app.config.from_envvar('FITHUB_CONFIG')
except RuntimeError:
    logging.warning('WHOA-- no config file loaded. using dev defaults')


if str(os.environ.get('DEBUG')).lower() in ['true', 'on', 'yes', 'debug']:
    logging.warning('Debug turned on from envrionment variable!')
    app.config['DEBUG'] = True
    

