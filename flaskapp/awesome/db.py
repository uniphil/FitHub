# -*- coding: utf-8 -*-
"""
    awesome.db
    ~~~~~~~~~~

    http://flask-pymongo.readthedocs.org/

    :copyright: (c) 2013 by people
    :license: Reserved, see the license file for more details.
"""


from flask.ext.pymongo import PyMongo
from awesome import app


mongo = PyMongo(app)


class AttrDict(dict):
    """lovingly stolen
    https://github.com/slacy/minimongo/blob/master/minimongo/model.py
    """
    def __init__(self, initial=None, **kwargs):
        # Make sure that during initialization, that we recursively apply
        # AttrDict.  Maybe this could be better done with the builtin
        # defaultdict?
        if initial:
            for key, value in initial.iteritems():
                # Can't just say self[k] = v here b/c of recursion.
                self.__setitem__(key, value)

        # Process the other arguments (assume they are also default values).
        # This is the same behavior as the regular dict constructor.
        for key, value in kwargs.iteritems():
            self.__setitem__(key, value)

        super(AttrDict, self).__init__()

    # These lines make this object behave both like a dict (x['y']) and like
    # an object (x.y).  We have to translate from KeyError to AttributeError
    # since model.undefined raises a KeyError and model['undefined'] raises
    # a KeyError.  we don't ever want __getattr__ to raise a KeyError, so we
    # 'translate' them below:
    def __getattr__(self, attr):
        try:
            return super(AttrDict, self).__getitem__(attr)
        except KeyError as excn:
            raise AttributeError(excn)

    def __setattr__(self, attr, value):
        try:
            # Okay to set directly here, because we're not recursing.
            self[attr] = value
        except KeyError as excn:
            raise AttributeError(excn)

    def __delattr__(self, key):
        try:
            return super(AttrDict, self).__delitem__(key)
        except KeyError as excn:
            raise AttributeError(excn)

    def __setitem__(self, key, value):
        # Coerce all nested dict-valued fields into AttrDicts
        new_value = value
        if isinstance(value, dict):
            new_value = AttrDict(value)
        return super(AttrDict, self).__setitem__(key, new_value)


class GetClassProperty(property):
    """Make a property-like thing that works on classes and instances.
    
    It's nice to have access to the collection as a property. It's nice not to
    have to instantiate the model just to get that property.

    Json R. Coombs on StackOverflow: http://stackoverflow.com/a/1383402/1299695
    """
    def __get__(self, cls, owner):
        return self.fget.__get__(None, owner)()


class Model(AttrDict):
    """wooooooooooo I'm hungry for lunch."""

    @GetClassProperty
    @classmethod
    def _collection_name(cls):
        """You can just define this straight-up as a normal attribute
        
        >>> class MyModel(KaleModel):
        ...     _collection_name = 'anycollection'
        """
        return cls.__name__.lower() + 's'

    @GetClassProperty
    @classmethod
    def collection(cls):
        return mongo.db[cls._collection_name]

    @classmethod
    def from_mongo(cls, mongodict):
        blah = cls()
        Model.__init__(blah, mongodict) # init from here!
        return blah

    def save(self):
        """Create or update the instance in the database. Returns the
        pymongo.ObjectId if it's new.
        """
        if '_id' in self:
            # updating an old object
            self.collection.update({'_id': self._id}, self)
        else:
            # inserting a new one!
            _id = self.collection.insert(self)
            self._id = _id
            return _id

    @classmethod
    def find_one(self, query={}):
        founddb = self.collection.find_one(query)
        modeled = self.from_mongo(founddb)
        return modeled
