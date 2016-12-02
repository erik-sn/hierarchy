import json
import unittest
from datetime import datetime as dt

from django.contrib.auth.models import User, Permission
from django.db.models import F
from rest_framework.reverse import reverse
from rest_framework.test import APIClient
from autofixture import AutoFixture

from mohawkapi import test_utils
from hierarchy.models import Machine, Site, Department
from hierarchy.serializers import MachineSerializer


class MachineGet(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.query = Machine.objects.all().filter(active=True).order_by('name')
        cls.user = User(username='developer')

        Site(name='site1').save()
        cls.site1 = Site.objects.get(name='site1')
        Department(name='department1', site=cls.site1).save()
        Department(name='department2', site=cls.site1).save()
        cls.department1 = Department.objects.get(name='department1')
        cls.department2 = Department.objects.get(name='department2')

        cls.fixture = AutoFixture(Machine, field_values={
            'department': test_utils.get_random([cls.department1, cls.department2]),
            'name': test_utils.get_random(['NAME1', 'name1', 'Name2', 'no name match']),
            'type': test_utils.get_random(['TYPE1', 'type1', 'Type2', 'no type match']),
            'createDate': test_utils.get_random([dt(2016, 9, 5), dt(2016, 9, 1), dt(2016, 8, 5),]),
            'modifyDate': test_utils.get_random([dt(2016, 9, 6), dt(2016, 9, 2), dt(2016, 8, 6),]),
            'active': test_utils.get_random([True, True, True, False]),
        })
        cls.fixture.create(100)
        cls.first = Machine.objects.first()

    @classmethod
    def tearDownClass(cls):
        Machine.objects.all().delete()
        Department.objects.all().delete()
        Site.objects.all().delete()

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_machine_view_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('machineview', kwargs={}))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.content, b'{"detail":"Authentication credentials were not provided."}')

    def test_machine_view_get_one(self):
        response = self.client.get('/api/v1/hierarchy/machines/{}/'.format(self.first.id))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.first.id)

    def test_machine_view_get_all(self):
        response = self.client.get('/api/v1/hierarchy/machines/')
        expected = MachineSerializer(self.query, many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    def test_machine_view_get_filter_label(self):
        response = self.client.get('/api/v1/hierarchy/machines/?name=name1')
        expected = MachineSerializer(self.query.filter(name__iexact='name1'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    def test_machine_view_get_filter_department(self):
        response = self.client.get('/api/v1/hierarchy/machines/?department=department1')
        expected = MachineSerializer(self.query.filter(department__name__iexact='department1'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)


class MachineModify(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.no_permission, cls.post, cls.post_modify, cls.post_modify_delete = test_utils.create_test_users(Machine)

        Site(name='site1').save()
        cls.site1 = Site.objects.get(name='site1')
        Department(name='department1', site=cls.site1).save()
        Department(name='department2', site=cls.site1).save()
        cls.department1 = Department.objects.get(name='department1')
        cls.department2 = Department.objects.get(name='department2')
        Machine(department=cls.department1, createDate=dt.now(), modifyDate=dt.now(), name='Machine1').save()
        Machine(department=cls.department2, createDate=dt.now(), modifyDate=dt.now(), name='Machine2').save()
        cls.update_id = Machine.objects.get(name='Machine1').id
        cls.delete_id = Machine.objects.get(name='Machine2').id
        cls.Machine = {'department': cls.department1.id, 'createDate': test_utils.get_timestamp(days=1), 'modifyDate': test_utils.get_timestamp(),
                          'name': 'Machine3'}

    @classmethod
    def tearDownClass(cls):
        Machine.objects.all().delete()
        Department.objects.all().delete()
        Site.objects.all().delete()
        User.objects.all().delete()
        Permission.objects.all().delete()

    def setUp(self):
        self.client = APIClient()

    def test_setpoint_view_post(self):
        self.client.force_authenticate(user=self.post)
        response = self.client.post('/api/v1/hierarchy/machines/', json.dumps(self.Machine),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_setpoint_view_put(self):
        self.client.force_authenticate(user=self.post_modify)
        response = self.client.put('/api/v1/hierarchy/machines/{}/'.format(self.update_id),
                                   json.dumps(self.Machine), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_setpoint_view_delete(self):
        self.client.force_authenticate(user=self.post_modify_delete)
        response = self.client.delete('/api/v1/hierarchy/machines/{}/'.format(self.delete_id))
        self.assertEqual(response.status_code, 204)

    def test_setpoint_view_post_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.post('/api/v1/hierarchy/machines/', json.dumps(self.Machine),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_put_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/api/v1/hierarchy/machines/{}/'.format(self.update_id),
                                   json.dumps(self.Machine), content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_delete_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/api/v1/hierarchy/machines/{}/'.format(self.delete_id),
                                   json.dumps(self.Machine), content_type='application/json')
        self.assertEqual(response.status_code, 403)


class TestMachineSerializer(unittest.TestCase):
    """
    Testing Post serializer for Machine
    """

    @classmethod
    def setUpClass(cls):
        Site(name='site4').save()
        cls.site1 = Site.objects.get(name='site4')
        Department(name='department3', site=cls.site1).save()
        cls.department1 = Department.objects.get(name='department3')

        cls.Machine = {'createDate': test_utils.get_timestamp(days=1), 'modifyDate': test_utils.get_timestamp(),
                          'name': 'Machine3', 'department': cls.department1.id}
        cls.Machine_malformed = {'createDate': 'bad', 'modifyDate': 'bad', 'department': 'bad', 'name': 1}
        cls.Machine_blank = {'createDate': '', 'modifyDate': '', 'department': '', 'name': ''}
        cls.Machine_missing = {}

        cls.malformed_checks = ['createDate', 'modifyDate', 'department', ]
        cls.blank_checks = ['createDate', 'modifyDate', 'name']
        cls.missing_checks = ['name']

    @classmethod
    def tearDownClass(cls):
        Department.objects.all().delete()
        Site.objects.all().delete()

    def test_serializer_good(self):
        self.assertTrue(MachineSerializer(data=self.Machine).is_valid())

    def test_serializer_malformed(self):
        serializer = MachineSerializer(data=self.Machine_malformed)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.malformed_checks))
        for field in self.malformed_checks:
            self.assertTrue(field in serializer.errors)

    def test_serializer_blank(self):
        serializer = MachineSerializer(data=self.Machine_blank)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.blank_checks))
        for field in self.blank_checks:
            self.assertTrue(field in serializer.errors)

    def test_serializer_missing(self):
        serializer = MachineSerializer(data=self.Machine_missing)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.missing_checks))
        for field in self.missing_checks:
            self.assertTrue(field in serializer.errors)
