# -*- coding: utf-8 -*-
"""
    awesome.config
    ~~~~~~~~~~~~~~

    blah

    :copyright: (c) 2013 by people
    :license: Reserved, see the license file for more details.
"""


import os
from awesome import app


config = dict(
    SECRET_KEY='so secure',
    HOST='127.0.0.1',
    PORT=5000,
)


app.config.from_object('{name}.config'.format(name=__name__))
app.config.from_envvar('FITHUB_CONFIG')


if str(os.environ.get('DEBUG')).lower() in ['true', 'on', 'yes', 'debug']:
    logging.warning('Debug turned on from envrionment variable!')
    app.config['DEBUG'] = True
    

