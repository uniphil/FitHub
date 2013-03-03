from exercise_types import create_types


__all__ = (create_types,)


def create_all(clear=True):
    for stuff in __all__:
        stuff(clear)


if __name__ == '__main__':
    create_types()
