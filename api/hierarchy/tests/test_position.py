import json
import unittest
from datetime import datetime as dt

from django.contrib.auth.models import User, Permission
from django.db.models import F
from rest_framework.reverse import reverse
from rest_framework.test import APIClient
from autofixture import AutoFixture

from hierarchyapi import test_utils
from hierarchy.models import Position, Site, Department
from hierarchy.serializers import PositionSerializer


class PositionGet(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.query = Position.objects.all().filter(active=True).order_by('department', 'label')
        cls.user = User(username='developer')

        Site(name='site1').save()
        cls.site1 = Site.objects.get(name='site1')
        Department(name='department1', site=cls.site1).save()
        Department(name='department2', site=cls.site1).save()
        cls.department1 = Department.objects.get(name='department1')
        cls.department2 = Department.objects.get(name='department2')

        cls.fixture = AutoFixture(Position, field_values={
            'department': test_utils.get_random([cls.department1, cls.department2]),
            'label': test_utils.get_random(['NAME1', 'name1', 'Name2', 'no name match']),
            'created': test_utils.get_random([dt(2016, 9, 5), dt(2016, 9, 1), dt(2016, 8, 5),]),
            'modified': test_utils.get_random([dt(2016, 9, 6), dt(2016, 9, 2), dt(2016, 8, 6),]),
            'active': test_utils.get_random([True, True, True, False]),
        })
        cls.fixture.create(100)
        cls.first = Position.objects.first()

    @classmethod
    def tearDownClass(cls):
        Position.objects.all().delete()
        Department.objects.all().delete()
        Site.objects.all().delete()

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_Position_view_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('positionview', kwargs={}))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data, {"detail": "Authentication credentials were not provided."})

    def test_Position_view_get_one(self):
        response = self.client.get('/hierarchy/positions/{}/'.format(self.first.id))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.first.id)

    def test_Position_view_get_all(self):
        response = self.client.get('/hierarchy/positions/')
        expected = self.query.annotate(siteName=F('department__site__name'), departmentName=F('department__name'))\
            .values('id', 'siteName', 'departmentName', 'label')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), len(expected))

    def test_Position_view_get_filter_label(self):
        response = self.client.get('/hierarchy/positions/?label=name1')
        expected = self.query.filter(label__iexact='name1').annotate(siteName=F('department__site__name'), departmentName=F('department__name'))\
            .values('id', 'siteName', 'departmentName', 'label')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), len(expected))

    def test_Position_view_get_filter_department(self):
        response = self.client.get('/hierarchy/positions/?department=department1')
        expected = self.query.filter(department__name__iexact='department1').annotate(siteName=F('department__site__name'), departmentName=F('department__name'))\
            .values('id', 'siteName', 'departmentName', 'label')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), len(expected))


class PositionModify(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.no_permission, cls.post, cls.post_modify, cls.post_modify_delete = test_utils.create_test_users(Position)

        Site(name='site1').save()
        cls.site1 = Site.objects.get(name='site1')
        Department(name='department1', site=cls.site1).save()
        Department(name='department2', site=cls.site1).save()
        cls.department1 = Department.objects.get(name='department1')
        cls.department2 = Department.objects.get(name='department2')
        Position(department=cls.department1, created=dt.now(), modified=dt.now(), label='Position1').save()
        Position(department=cls.department2, created=dt.now(), modified=dt.now(), label='Position2').save()
        cls.update_id = Position.objects.get(label='Position1').id
        cls.delete_id = Position.objects.get(label='Position2').id
        cls.Position = {'site': cls.site1.id, 'created': test_utils.get_timestamp(days=1), 'modified': test_utils.get_timestamp(),
                          'label': 'Position3'}

    @classmethod
    def tearDownClass(cls):
        Position.objects.all().delete()
        Department.objects.all().delete()
        Site.objects.all().delete()
        User.objects.all().delete()
        Permission.objects.all().delete()

    def setUp(self):
        self.client = APIClient()

    def test_setpoint_view_post(self):
        self.client.force_authenticate(user=self.post)
        response = self.client.post('/hierarchy/positions/', json.dumps(self.Position),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_setpoint_view_put(self):
        self.client.force_authenticate(user=self.post_modify)
        response = self.client.put('/hierarchy/positions/{}/'.format(self.update_id),
                                   json.dumps(self.Position), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_setpoint_view_delete(self):
        self.client.force_authenticate(user=self.post_modify_delete)
        response = self.client.delete('/hierarchy/positions/{}/'.format(self.delete_id))
        self.assertEqual(response.status_code, 204)

    def test_setpoint_view_post_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.post('/hierarchy/positions/', json.dumps(self.Position),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_put_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/hierarchy/positions/{}/'.format(self.update_id),
                                   json.dumps(self.Position), content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_delete_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/hierarchy/positions/{}/'.format(self.delete_id),
                                   json.dumps(self.Position), content_type='application/json')
        self.assertEqual(response.status_code, 403)


class TestPositionSerializer(unittest.TestCase):
    """
    Testing Post serializer for Position
    """

    @classmethod
    def setUpClass(cls):
        Site(name='site4').save()
        cls.site1 = Site.objects.get(name='site4')
        Department(name='department3', site=cls.site1).save()
        cls.department1 = Department.objects.get(name='department3')

        cls.Position = {'created': test_utils.get_timestamp(days=1), 'modified': test_utils.get_timestamp(),
                          'label': 'Position3', 'department': cls.department1.id}
        cls.Position_malformed = {'created': 'bad', 'modified': 'bad', 'department': 'bad', 'label': 1}
        cls.Position_blank = {'created': '', 'modified': '', 'department': '', 'label': ''}
        cls.Position_missing = {}

        cls.malformed_checks = ['created', 'modified', 'department', ]
        cls.blank_checks = ['created', 'modified', 'label']
        cls.missing_checks = ['label']

    @classmethod
    def tearDownClass(cls):
        Department.objects.all().delete()
        Site.objects.all().delete()

    def test_serializer_good(self):
        self.assertTrue(PositionSerializer(data=self.Position).is_valid())

    def test_serializer_malformed(self):
        serializer = PositionSerializer(data=self.Position_malformed)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.malformed_checks))
        for field in self.malformed_checks:
            self.assertTrue(field in serializer.errors)

    def test_serializer_blank(self):
        serializer = PositionSerializer(data=self.Position_blank)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.blank_checks))
        for field in self.blank_checks:
            self.assertTrue(field in serializer.errors)

    def test_serializer_missing(self):
        serializer = PositionSerializer(data=self.Position_missing)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.missing_checks))
        for field in self.missing_checks:
            self.assertTrue(field in serializer.errors)
