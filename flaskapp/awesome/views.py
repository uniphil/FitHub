# -*- coding: utf-8 -*-
"""
    awesome.views
    ~~~~~~~~~~~~~

    url routing n stuff

    :copyright: (c) 2013 by people
    :license: Reserved, see the license file for more details.
"""


from flask import render_template, request, redirect, url_for, abort
from flask.ext.login import login_required, login_user, logout_user, \
                            current_user
from awesome import app
from awesome.forms import LoginForm
from awesome.users import User, load_user


@app.route('/')
def main():
    return render_template('main.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm(request.form)

    if request.method == 'POST' and form.validate():
        user = User.collection.find_one({'username': form.username.data})
        if user and user.check_password(form.password.data):
            login_user(user)
            return redirect(url_for('main'))

    return render_template('login.html', form=form)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('main'))


@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

