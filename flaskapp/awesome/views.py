# -*- coding: utf-8 -*-
"""
    awesome.views
    ~~~~~~~~~~~~~

    url routing n stuff

    :copyright: (c) 2013 by people
    :license: Reserved, see the license file for more details.
"""


from flask import render_template, request, session, redirect, url_for, abort
from flask.ext.login import login_required, login_user, logout_user, \
                            current_user
from awesome import app
from awesome.forms import LoginForm, SignupForm
from awesome.users import User, load_user, Interested


@app.route('/', methods=['GET', 'POST'])
def main():
    form = SignupForm(request.form)
    signed_up = session.get('signed_up', False)

    if request.method == 'POST' and form.validate():
        thou = Interested(name=form.email.name, email=form.email.data)
        thou.save()
        message = render_template('post-signup.html', you=thou)
        # send the email..
        # if email sent successfully,
            # mark Interested.emailed True
        form = SignupForm() # reset
        session['signed_up'] = True

    return render_template('main.html', form=form)


@app.route('/register', methods=['GET', 'POST'])
def register():
    return redirect(url_for('main'))

    # DO THIS IF TIME (because it's fun to fill out forms when exploring)
    form = RegistrationForm(request.form)
    if request.method == 'POST' and form.validate():
        pass


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm(request.form)

    if request.method == 'POST' and form.validate():
        user = User.find_one({'username': form.username.data})
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

