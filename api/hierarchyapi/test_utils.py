from random import randint
from datetime import datetime as dt
import math
from dateutil.relativedelta import relativedelta

from django.contrib.auth.models import User, Permission
from django.contrib.contenttypes.models import ContentType

from hierarchyapi import utility


def create_test_users(permission_class):
    """
    Intended for use when authenticating using DRF's DjangoModelPermissions
    Given a Django model, create three permissions in the django database - add, change, delete. Then
    create four users that have varying degrees of permissions for the input model:
        - no_permission: has no permissions for the model
        - post: can add data to the model
        - post_modify: can add and change data to the model
        - post_modify_delete: can add, change and delete data

    :param permission_class: Django Model class
    :return: four users
    """

    User.objects.create_user(username='no_permission')
    User.objects.create_user(username='post')
    User.objects.create_user(username='post_modify')
    User.objects.create_user(username='post_modify_delete')

    class_name = permission_class.__name__.lower()
    content_type = ContentType.objects.get_for_model(permission_class)
    try:
        post_permission = Permission.objects.get(codename='add_{}'.format(class_name))
    except:
        post_permission = Permission.objects.create(codename='add_{}'.format(class_name),
                                                    content_type=content_type)
    try:
        modify_permission = Permission.objects.get(codename='change_{}'.format(class_name))
    except:
        modify_permission = Permission.objects.create(codename='change_{}'.format(class_name),
                                                      content_type=content_type)
    try:
        delete_permission = Permission.objects.get(codename='delete_{}'.format(class_name))
    except:
        delete_permission = Permission.objects.create(codename='delete_{}'.format(class_name),
                                                      content_type=content_type)

    no_permission = User.objects.get(username='no_permission')
    post = User.objects.get(username='post')
    post_modify = User.objects.get(username='post_modify')
    post_modify_delete = User.objects.get(username='post_modify_delete')

    post.user_permissions.add(post_permission)
    post_modify.user_permissions.add(post_permission, modify_permission)
    post_modify_delete.user_permissions.add(post_permission, modify_permission, delete_permission)
    return no_permission, post, post_modify, post_modify_delete


def get_random(array):
    """
    Given an input array, return an *uncalled* function that returns a random
    value in that array. Intended for use with django-autofixture for testing
    utilities
    :param array: Array containing values
    :return: function
    """
    def random():
        return array[randint(0, len(array) - 1)]
    return random if isinstance(array, list) else None


def get_date_object(start, end):
    """
    Generate a valid utility.ParsedDate object for use in testing
    :param start: datetime object
    :param end: datetime object
    :return: ParsedDate object
    """
    if start > end:
        raise ValueError('Start date must be before end date')

    date = utility.ParsedDate(None)
    date.start = start
    date.end = end
    date.diff = end - start
    date.valid = True
    date.start_valid = True
    date.end_valid = True
    return date


def get_timestamp(**kwargs):
    return (dt.now() - relativedelta(kwargs)).strftime('%Y-%m-%dT%H:%M:%S')


class TestCell():

    def __init__(self, val):
        self.value = val


class TestSheet():

    def __init__(self, rows, cols):
        self.ncols = rows
        self.nrows = cols
        self.array = []
        for _ in range(0, rows):
            row = []
            for _ in range(0, math.floor(cols / 2)):
                val = randint(1, 100)
                row.append(TestCell('value{}'.format(val)))
                row.append(TestCell(str(val)))
            self.array.append(row)


    def cell(self, row, col):
        return self.array[row - 1][col - 1]


class TestWorkbook():

    def __init__(self, rows, cols):
        self.sheet = TestSheet(rows, cols)

    def sheet_by_index(self, _):
        return self.sheet
