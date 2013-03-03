#!/usr/bin/python
# -*- coding: utf-8 -*-
"""
    manage
    ~~~~~~

    Basic management stuff
    http://flask-script.readthedocs.org/en/latest/

    Simple Packages pattern:
    http://flask.pocoo.org/docs/patterns/packages/#simple-packages

    :copyright: (c) 2013 by some people
    :license: Reserved, see the license file for more details.
"""

try:
    import imp
    imp.load_source('activate_this', 'venv/bin/activate_this.py')
except IOError:
    print 'couldn\'t import activate'
from flask.ext.script import Server, Manager
from awesome import app


manager = Manager(app)


@manager.command
def mongoinit():
    """set up indices on mongo"""
    # from flask.ext.pymongo import pymongo
    # from awesome.db import mongo
    # from awesome.users import User
    # collection_indices = {
    #     'user': {
    #         'args': ('username',),
    #         'kwargs': {'unique': True, 'drop_dups': True},
    #     },
    # }
    # print 'creating indices...'
    # for collection, index in collection_indices.items():
    #     print collection
    #     mongo.db[collection].create_index(*index['args'], **index['kwargs'])

    # print 'creating admin account...'
    # admin = User(username='admin', passwod='password',
    #              name='Administrator', access='admin')
    # try:
    #     admin.save()
    # except pymongo.errors.DuplicateKeyError:
    #     print 'admin account exists.'
    #     if raw_input('reset? ').lower() in ['y', 'yes', 't', 'true']:
    #         User.collection.remove({'username': admin.username})
    #         admin.save()
    #         print 'admin account reset'

    from awesome.fixtures import create_all
    create_all()


@manager.command
def activate(env='venv'):
    """activate the current shell's virtualenv"""
    import os
    venv_path = os.path.join(env, 'bin', 'activate')
    os.system('/bin/bash --rcfile {}'.format(venv_path))


class DebugServer(Server):
    """Run a local development server"""

    def handle(self, app, *args, **kwargs):
        app.config['DEBUG'] = self.use_debugger
        # use a threaded environment
        app.config['THREADED'] = True
        super(DebugServer, self).handle(app, *args, **kwargs)


server = Server(use_debugger=True)
manager.add_command('runserver', DebugServer(use_debugger=True))


if __name__ == '__main__':
    manager.run()
