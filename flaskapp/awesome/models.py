# -*- coding: utf-8 -*-
"""
    awesome.models
    ~~~~~~~~~~~~~~

    blah blah bla

    :copyright: (c) 2013 by people
    :license: Reserved, see the license file for more details.
"""


from awesome import app
from awesome.db import Model


class ExerciseType(Model):

    _collection_name = 'exercise.types'

    def __init__(self, **kwargs):
        self.name = kwargs.get('name')
        self.status = kwargs.get('status')
        self.description = kwargs.get('description')
        self.diagram = kwargs.get('diagram')
        self.tags = kwargs.get('tags')
        

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
            self.sender = kwargs.get('sender')
            self.recipient = kwargs.get('recipient')
            self.subject = kwargs.get('subject', '')
