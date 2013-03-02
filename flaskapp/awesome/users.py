# -*- coding: utf-8 -*-
"""
    awesome.users
    ~~~~~~~~~~~~~

    User account model and business.
    And twitter and stuff

    twitter: http://pythonhosted.org/Flask-OAuth/
    eg: https://github.com/Queens-Hacks/tweetmatch

    :copyright: (c) 2013 by people
    :license: Reserved, see the license file for more details.
"""

from passlib.hash import pbkdf2_sha256
from flask.ext.login import LoginManager, UserMixin
from awesome import app
from awesome.db import Model


login_manager = LoginManager()
login_manager.setup_app(app)


login_manager.login_view = 'login'


class User(Model, UserMixin):
    """User accounts are instances of this class. yep."""

    _collection_name = 'users'

    def __init__(self, **kwargs):
        """this is a bit ugly, but not that bad. it works. and optional is."""
        if kwargs:
            # WEEEEOOOOOEEEEOOOOEEEEOO watch out
            self.username = kwargs['username']
            self.name = kwargs['username']
            self.set_password(kwargs['password'])
            self.new_user = True

    def set_password(self, password):
        self.pw_hash = pbkdf2_sha256.encrypt(password)

    def check_password(self, password):
        return pbkdf2_sha256.verify(password, self.pw_hash)

    def get_id(self):
        return self.username

    def is_admin(self):
        return self.access == 'admin'


@login_manager.user_loader
def load_user(username):
    """Retrieve a user by username. Returns None if the user cannot be found."""
    that_guy = User.find_one({'username': username})
    return that_guy


class Interested(Model):
    """Signup to say we've got users"""

    _collection_name = 'interested_yo'

    def __init__(self, **kwargs):
        if kwargs:
            self.name = kwargs['name']
            self.email = kwargs['email']
            self.emailed = False


