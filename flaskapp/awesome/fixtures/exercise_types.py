# status should be on the user model...


def create_types(clear=True):
    from awesome.models import ExerciseType

    if clear:
        ExerciseType.collection.remove({})

    for type_ in types:
        exercise = ExerciseType(**type_)
        exercise.save()


types = [
    {
        'name': 'Jumping Jacks',
        'slug': 'demo',
        'status': 2,
        'description': 'Start feet together and arms at sides. Jump up and spread legs shoulder width apart while raising hands straight above your head. Then jump back to the original position.',
        'diagram': '',
        'tags': ['cardio'],
    },
    {
        'name': 'Ball Crunch',
        'slug': '',
        'status': 2,
        'description': 'Keep feet flat on the floor and raise upper body toward ceiling, contracting your abdominal muscles as you lift keeping tension on abs.',
        'diagram': '',
        'tags': ['abs'],
    },
    {
        'name': 'Reverse Ball Crunch',
        'slug': '',
        'status': 2,
        'description': 'Keep head and neck relaxed and back pressed into the floor.',
        'diagram': '',
        'tags': ['abs'],
    },
    {
        'name': 'Abdominal Crunch',
        'slug': '',
        'status': 1,
        'description': 'Keep head and neck relaxed and lower back pressed into the floor while squeezing the lower abdominal muscles.',
        'diagram': '',
        'tags': ['abs'],
    },
    {
        'name': 'Seated Cable Row',
        'slug': '',
        'status': 1,
        'description': 'Lay flat on floor with a resistance ball placed under legs. ',
        'diagram': '',
        'tags': ['back'],
    },
    {
        'name': 'Back Extension',
        'slug': '',
        'status': 1,
        'description': 'Rise back up into your starting position on an exhale and lift your chest. The full cycle should take 3 to 5 seconds.',
        'diagram': '',
        'tags': ['back'],
    },
    {
        'name': 'Assisted Pull-Up',
        'slug': '',
        'status': 1,
        'description': 'Pull body up toward handles, trying to aim the chest toward the bar.',
        'diagram': '',
        'tags': ['back'],
    },
    {
        'name': 'Ball Superman',
        'slug': '',
        'status': 0,
        'description': 'Lay over the physioball facing down so hips are supported.',
        'diagram': '',
        'tags': ['back'],
    },
    {
        'name': 'Preacher Curl',
        'slug': '',
        'status': 0,
        'description': 'Keep elbows in contact with the pad and curl bar toward body while exhaling.',
        'diagram': '',
        'tags': ['bicep'],
    },
    {
        'name': 'Standing Bicep Curl',
        'slug': '',
        'status': 0,
        'description': 'Keep elbows close to waist & squeeze the bicep while keeping finger grip loose.',
        'diagram': '',
        'tags': ['bicep'],
    },
    {
        'name': 'Dumbbell Bicep Curl',
        'slug': '',
        'status': 0,
        'description': 'Slowly life the dumbbells up towards the shoulders.',
        'diagram': '',
        'tags': ['bicep'],
    },
    {
        'name': 'Push-Ups',
        'slug': '',
        'status': 0,
        'description': 'Maintaining straight, strong legs to keep the torso in one straight line.',
        'diagram': '',
        'tags': ['chest'],
    },
]

