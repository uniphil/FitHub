# -*- coding: utf-8 -*-
"""
    awesome.forms
    ~~~~~~~~~~~~~

    All user-input forms used in the app should be collected here.

    :copyright: (c) 2013 by people.
    :license: Reserved, see the license file for more details.
"""


from flask.ext.wtf import Form, TextField, PasswordField, Required, Length, \
                          Email


class LoginForm(Form):
    username = TextField('username', validators=[Required()])
    password = PasswordField('password', validators=[Required(), Length(4)])


class SignupForm(Form):
    name = TextField('name')
    email = TextField('email', validators=[Required(), Email()])
