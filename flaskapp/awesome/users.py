# -*- coding: utf-8 -*-
"""
    awesome.users
    ~~~~~~~~~~~~~

    User account model and business.

    :copyright: (c) 2013 by people
    :license: Reserved, see the license file for more details.
"""

from passlib.hash import pbkdf2_sha256
from flask.ext.login import LoginManager, UserMixin
from awesome import app


login_manager = LoginManager()
login_manager.setup_app(app)


login_manager.login_view = 'login'


class User(UserMixin):
    """User accounts are instances of this class. Check out kModel for the db
    side of things.
    """

    _access_levels = ['admin', 'casual']

    def __init__(self, username, password, email=None, name=None,
                 access='casual'):
        self.username = username
        self.set_password(password)
        self.email = email
        self.name = name or username
        assert access in self._access_levels
        self.access = access or 'casual'

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
    #return User.find_one({'username': username})
    return None

