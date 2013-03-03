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
    MAILGUN_API_KEY='key-79b0vbmpre-5y-brhqglnbkou9xbmio3',
    MAILGUN_API_URL='https://api.mailgun.net/v2/fithub.mailgun.org',
)


try:
    app.config.from_envvar('FITHUB_CONFIG')
except RuntimeError:
    logging.warning('WHOA-- no config file loaded. using dev defaults')


if str(os.environ.get('DEBUG')).lower() in ['true', 'on', 'yes', 'debug']:
    logging.warning('Debug turned on from envrionment variable!')
    app.config['DEBUG'] = True
else:
    from werkzeug.contrib.fixers import ProxyFix
    app.wsgi_app = ProxyFix(app.wsgi_app)    

