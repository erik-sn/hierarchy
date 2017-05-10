import json
import unittest
from datetime import datetime as dt

from django.contrib.auth.models import User, Permission
from rest_framework.reverse import reverse
from rest_framework.test import APIClient
from autofixture import AutoFixture

from hierarchyapi import test_utils
from hierarchy.models import Department, Site
from hierarchy.serializers import DepartmentSerializer, DepartmentSerializerPost


class DepartmentGet(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.query = Department.objects.all().filter(active=True).order_by('name')
        cls.user = User(username='developer')
        Site(name='site1').save()
        Site(name='site2').save()
        cls.site1 = Site.objects.get(name='site1')
        cls.site2 = Site.objects.get(name='site2')
        cls.fixture = AutoFixture(Department, field_values={
            'site': test_utils.get_random([cls.site1, cls.site2]),
            'name': test_utils.get_random(['NAME1', 'name1', 'Name2', 'no name match']),
            'created': test_utils.get_random([dt(2016, 9, 5), dt(2016, 9, 1), dt(2016, 8, 5),]),
            'modified': test_utils.get_random([dt(2016, 9, 6), dt(2016, 9, 2), dt(2016, 8, 6),]),
            'active': test_utils.get_random([True, False]),
        })
        cls.fixture.create(100)
        cls.first = Department.objects.first()

    @classmethod
    def tearDownClass(cls):
        Department.objects.all().delete()
        Site.objects.all().delete()
        User.objects.all().delete()
        Permission.objects.all().delete()

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_Department_view_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('departmentview', kwargs={}))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data, {'detail': 'Authentication credentials were not provided.'})

    def test_Department_view_get_one(self):
        response = self.client.get('/hierarchy/departments/{}/'.format(self.first.id))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.first.id)

    def test_Department_view_get_all(self):
        response = self.client.get('/hierarchy/departments/')
        expected = DepartmentSerializer(self.query, many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    def test_Department_view_get_filter_name(self):
        response = self.client.get('/hierarchy/departments/?name=name1')
        expected = DepartmentSerializer(self.query.filter(name__iexact='name1'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    def test_Department_view_get_filter_id(self):
        response = self.client.get('/hierarchy/departments/?id={}'.format(self.first.id))
        expected = DepartmentSerializer(self.query.filter(id__exact=self.first.id), many=True).data
        self.assertEqual(response.status_code, 200)


class DepartmentModify(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.no_permission, cls.post, cls.post_modify, cls.post_modify_delete = test_utils.create_test_users(Department)

        cls.site1 = Site.objects.create(name='site1')
        cls.site2 = Site.objects.create(name='site2')
        Department(site=cls.site1, created=dt.now(), modified=dt.now(), name='Department1', active=True).save()
        Department(site=cls.site2, created=dt.now(), modified=dt.now(), name='Department2', active=False).save()
        cls.update_id = Department.objects.get(name='Department1').id
        cls.delete_id = Department.objects.get(name='Department2').id
        cls.department = {'site': cls.site1.id, 'created': test_utils.get_timestamp(days=1), 'modified': test_utils.get_timestamp(),
                          'name': 'Department3'}

    @classmethod
    def tearDownClass(cls):
        Department.objects.all().delete()
        Site.objects.all().delete()
        User.objects.all().delete()
        Permission.objects.all().delete()

    def setUp(self):
        self.client = APIClient()

    def test_setpoint_view_post(self):
        self.client.force_authenticate(user=self.post)
        response = self.client.post('/hierarchy/departments/', json.dumps(self.department),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_setpoint_view_put(self):
        self.client.force_authenticate(user=self.post_modify)
        response = self.client.put('/hierarchy/departments/{}/'.format(self.update_id),
                                   json.dumps(self.department), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_setpoint_view_delete(self):
        self.client.force_authenticate(user=self.post_modify_delete)
        response = self.client.delete('/hierarchy/departments/{}/'.format(self.delete_id))
        self.assertEqual(response.status_code, 204)

    def test_setpoint_view_post_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.post('/hierarchy/departments/', json.dumps(self.department),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_put_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/hierarchy/departments/{}/'.format(self.update_id),
                                   json.dumps(self.department), content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_delete_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/hierarchy/departments/{}/'.format(self.delete_id),
                                   json.dumps(self.department), content_type='application/json')
        self.assertEqual(response.status_code, 403)


class TestDepartmentSerializer(unittest.TestCase):
    '''
    Testing Post serializer for department
    '''

    @classmethod
    def setUpClass(cls):
        cls.site4 = Site.objects.create(name='site4')
        cls.department = {'created': test_utils.get_timestamp(days=1), 'modified': test_utils.get_timestamp(),
                          'name': 'Department3', 'site': cls.site4.id}
        cls.department_malformed = {'created': 'bad', 'modified': 'bad', 'name': 'Department3', 'code': 'code3',
                                    'location': 'loc3', 'directory': 'dir3', 'site': 'bad'}
        cls.department_blank = {'created': '', 'modified': '', 'name': '', 'directory': '', 'site': ''}
        cls.department_missing = {}
        cls.malformed_checks = ['created', 'modified', 'site']
        cls.blank_checks = ['created', 'modified', 'name', 'site']
        cls.missing_checks = ['name', 'site']

    @classmethod
    def tearDownClass(cls):
        Site.objects.all().delete()

    def test_serializer_good(self):
        self.assertTrue(DepartmentSerializerPost(data=self.department).is_valid())

    def test_serializer_malformed(self):
        serializer = DepartmentSerializerPost(data=self.department_malformed)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.malformed_checks))
        for field in self.malformed_checks:
            self.assertTrue(field in serializer.errors)

    def test_serializer_blank(self):
        serializer = DepartmentSerializerPost(data=self.department_blank)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.blank_checks))
        for field in self.blank_checks:
            self.assertTrue(field in serializer.errors)

    def test_serializer_missing(self):
        serializer = DepartmentSerializerPost(data=self.department_missing)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.missing_checks))
        for field in self.missing_checks:
            self.assertTrue(field in serializer.errors)
