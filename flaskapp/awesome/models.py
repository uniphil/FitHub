# -*- coding: utf-8 -*-
"""
    awesome.models
    ~~~~~~~~~~~~~~

    blah blah bla

    :copyright: (c) 2013 by people
    :license: Reserved, see the license file for more details.
"""


from awesome.db import Model


class ExerciseType(Model):

    _collection_name = 'exercise.types'

    def __init__(self, **kwargs):
        if kwargs:
            self.name = kwargs.get('name')
            self.status = kwargs.get('status')
            self.description = kwargs.get('description')
            self.diagram = kwargs.get('diagram')
            self.tags = kwargs.get('tags')
            slugin = kwargs.get('slug', '')
            if slugin:
                self.slug = slugin
            else:
                self.slug = kwargs.get('name').replace(' ', '-').lower()

    @property
    def status_name(self):
        levels = ['Needs improvement', 'On your way', 'Expert']
        return levels[self.status]


class Exercise(Model):

    _collection_name = 'exercise.entries'

    def __init__(self, **kwargs):
        pass


class Message(Model):
    """people wanna talk to us???"""

    _collection_name = 'received_messages'

    def __init__(self, **kwargs):
        """ugh"""
        if kwargs:
            self.recipient = kwargs.get('recipient')
            self.sender = kwargs.get('sender')
            self.subject = kwargs.get('subject')
            self.body = kwargs.get('body', '')


class MailSendLog(Model):

    _collection_name = 'mail_post_logs'
