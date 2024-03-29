# -*- coding: utf-8 -*-
"""
    awesome.views
    ~~~~~~~~~~~~~

    url routing n stuff

    :copyright: (c) 2013 by people
    :license: Reserved, see the license file for more details.
"""

import random
from flask import render_template, request, session, redirect, url_for, \
    make_response
from flask.ext.login import login_user, logout_user
import requests
from awesome import app
from awesome.forms import LoginForm, SignupForm
from awesome.users import User, Interested
from awesome.models import Message, ExerciseType, MailSendLog


@app.route('/', methods=['GET', 'POST'])
def main():
    form = SignupForm(request.form)
    first_video = random.choice([True, False])
    response_code = 200

    if request.method == 'POST':
        if form.validate():
            thou = Interested(name=form.email.name, email=form.email.data)
            thou.save()
            message = render_template('signup-email.html', you=thou)
            data = {
                'to': thou.email,
                'from': 'hello@fithub.mailgun.org',
                'subject': 'FitHub: Your Pocket Personal Trainer',
                'html': message,
            }
            auth = ('api', app.config['MAILGUN_API_KEY'])
            send_url = '/'.join([app.config['MAILGUN_API_URL'], 'messages'])
            r = requests.post(send_url, auth=auth, data=data)

            log = MailSendLog()
            log.code = r.status_code
            log.text = r.text
            log.save()

            thou.emailed = True if log.code == 200 else 'ERR'
            thou.save()

            form = SignupForm()  # reset
            session['signed_up'] = True
        else:
            # form didn't validate
            response_code = 400

    return render_template('main.html', form=form, first_video=first_video), response_code


@app.route('/training')
def training():
    exercises = ExerciseType.find()
    return render_template('training.html', exercises=exercises, currtraining='curr')


@app.route('/exercise/<slug>')
def exercise(slug):
    if slug == 'demo':
        return redirect(url_for('demo'))
    ex = ExerciseType.find_one({'slug': slug})
    return render_template('stats.html')


@app.route('/stats')
def stats():
    return render_template('stats.html', currstats='curr')


@app.route('/register', methods=['GET', 'POST'])
def register():
    return redirect(url_for('main'))
    # DO THIS IF TIME (because it's fun to fill out forms when exploring)
    # form = RegistrationForm(request.form)
    # if request.method == 'POST' and form.validate():
    #     pass


@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('stats.html')

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


@app.route('/clearsession')
def clear_session():
    session.clear()
    return redirect(url_for('main'))


@app.route('/messages/', methods=['POST'])
def recieve_message():
    if request.method == 'POST':
        message = Message(
            recipient=request.form.get('recipient'),
            subject=request.form.get('subject', ''),
            body=request.form.get('body-plain', ''),
        )

        message.save()
        return make_response('cool cool', 200)


@app.route('/demo')
def demo():
    return render_template('demo.html',
                           live=request.args.get('live', 'false') == 'true')


@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404
