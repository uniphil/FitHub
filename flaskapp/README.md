qssfl
=====


REST API
--------

No authentication is used right now.

URL root: `http://fithub.org/api/`


Log Workout
~~~~~~~~~~~

```
POST /workout/new
```

Example parameters (change this however make sense, since it doesn't exist yet)
```json
{
    # do IDs make more sense keywords?
    "username": "demo",
    "workout": {
        "type": "jumpingjacks",
        "reps": 9000,
        "...": "awesome workout data!"
    }
}
```

Example response
```
200 OK ... is it useful to send a document back?
```
