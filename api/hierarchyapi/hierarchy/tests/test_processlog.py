import json
import unittest
from datetime import datetime as dt
import mock as mock

from django.contrib.auth.models import User, Permission
from rest_framework.reverse import reverse
from rest_framework.test import APIClient
from autofixture import AutoFixture

from mohawkapi import test_utils, utility
from hierarchy.models import ProcessLog
from hierarchy.serializers import ProcessLogSerializer


class ProcessLogGet(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.user = User(username='developer')
        cls.date = test_utils.get_date_object(dt(2016, 6, 5), dt(2016, 12, 5))
        cls.fixture = AutoFixture(ProcessLog, field_values={
            'timestamp': test_utils.get_random([dt(2016, 9, 5), dt(2016, 9, 1), dt(2016, 8, 5),]),
            'machine': test_utils.get_random(['TEST1', 'Test1', 'TEST3']),
            'description': test_utils.get_random(['DESC1', 'desc1', 'no match']),
            'userName': test_utils.get_random(['USER1', 'user1', 'User3']),
            'oldValue': test_utils.get_random([1.5, 3, 4.5]),
            'newValue': test_utils.get_random([5, 15, 25]),
        })
        cls.fixture.create(500)
        cls.first = ProcessLog.objects.first()

    @classmethod
    def tearDownClass(cls):
        ProcessLog.objects.all().delete()

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_processlog_view_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('processlogview', kwargs={}))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.content, b'{"detail":"Authentication credentials were not provided."}')

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_processlog_view_get_all(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/processlog/')
        expected = ProcessLogSerializer(ProcessLog.objects.all().order_by('-id'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    def test_processlog_view_get_one(self):
        response = self.client.get('/api/v1/hierarchy/processlog/{}/'.format(self.first.id))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.first.id)

    def test_processlog_view_get_filter_dates(self):
        response = self.client.get('/api/v1/hierarchy/processlog/?startdate=082516&enddate=090216')
        expected = ProcessLogSerializer(ProcessLog.objects.all()
                                          .filter(timestamp__range=(dt(2016, 8, 25), dt(2016, 9, 2)))
                                          .order_by('-id'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_processlog_view_get_filter_machine(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/processlog/?machine=TEST1')
        expected = ProcessLogSerializer(ProcessLog.objects.all().filter(machine__iexact='TEST1')
                                        .order_by('-id'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_processlog_view_get_filter_name(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/processlog/?username=User1')
        expected = ProcessLogSerializer(ProcessLog.objects.all().filter(userName__iexact='user1')
                                        .order_by('-id'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_processlog_view_get_filter_name(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/processlog/?description=desc')
        expected = ProcessLogSerializer(ProcessLog.objects.all().filter(description__icontains='desc')
                                        .order_by('-id'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)


class ProcessLogModify(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.no_permission, cls.post, cls.post_modify, cls.post_modify_delete = test_utils.create_test_users(ProcessLog)

        ProcessLog(timestamp=dt.now(), machine='mch1', userName='user1', description='desc1', oldValue='3', newValue='1').save()
        ProcessLog(timestamp=dt.now(), machine='mch2', userName='user2', description='desc2', oldValue='4', newValue='2').save()
        cls.update_id = ProcessLog.objects.get(machine='mch1').id
        cls.delete_id = ProcessLog.objects.get(machine='mch2').id

        cls.datapoint = {'timestamp': test_utils.get_timestamp(), 'machine': 'mch3', 'userName': 'user3',
                         'description': 'desc3', 'oldValue': 15, 'newValue': 10}
        cls.datapoint_malformed = {'timestamp': 'test', 'machine': 'mch3', 'userName': 'user3', 'description': '',
                         'oldValue': 15, 'newValue': 10}
        cls.datapoint_blank = {'timestamp': '', 'machine': '', 'userName': '', 'description': '',
                         'oldValue': '', 'newValue': ''}
        cls.datapoint_missing = {}

    @classmethod
    def tearDownClass(cls):
        ProcessLog.objects.all().delete()
        User.objects.all().delete()
        Permission.objects.all().delete()

    def setUp(self):
        self.client = APIClient()

    def test_setpoint_view_post(self):
        self.client.force_authenticate(user=self.post)
        response = self.client.post('/api/v1/hierarchy/processlog/', json.dumps(self.datapoint),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_setpoint_view_put(self):
        self.client.force_authenticate(user=self.post_modify)
        response = self.client.put('/api/v1/hierarchy/processlog/{}/'.format(self.update_id),
                                   json.dumps(self.datapoint), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_setpoint_view_delete(self):
        self.client.force_authenticate(user=self.post_modify_delete)
        response = self.client.delete('/api/v1/hierarchy/processlog/{}/'.format(self.delete_id),
                                      json.dumps(self.datapoint),
                                      content_type='application/json')
        self.assertEqual(response.status_code, 204)

    def test_setpoint_view_post_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.post('/api/v1/hierarchy/processlog/', json.dumps(self.datapoint),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_put_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/api/v1/hierarchy/processlog/{}/'.format(self.update_id),
                                   json.dumps(self.datapoint), content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_delete_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/api/v1/hierarchy/processlog/{}/'.format(self.delete_id),
                                   json.dumps(self.datapoint), content_type='application/json')
        self.assertEqual(response.status_code, 403)


class TestProcesslogSerializer(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.datapoint = {'timestamp': test_utils.get_timestamp(), 'machine': 'mch3', 'userName': 'user3',
                         'description': 'desc3', 'oldValue': 15, 'newValue': 10}
        cls.datapoint_malformed = {'timestamp': 'test', 'machine': 'mch3', 'userName': 'user3', 'description': 'nope',
                         'oldValue': 15, 'newValue': 10}
        cls.datapoint_blank = {'timestamp': '', 'machine': '', 'userName': '', 'description': '',
                         'oldValue': '', 'newValue': ''}
        cls.datapoint_missing = {}

        cls.malformed_checks = ['timestamp']
        cls.blank_checks = ['machine', 'userName', 'description', 'oldValue', 'newValue', 'timestamp']
        cls.missing_checks = ['machine', 'userName', 'description', 'oldValue', 'newValue', 'timestamp']

    def test_serializer_good(self):
        self.assertTrue(ProcessLogSerializer(data=self.datapoint).is_valid())

    def test_serializer_malformed(self):
        serializer = ProcessLogSerializer(data=self.datapoint_malformed)
        self.assertFalse(serializer.is_valid())
        print(serializer.errors)
        self.assertEqual(len(serializer.errors), len(self.malformed_checks))
        for field in self.malformed_checks:
            self.assertTrue(field in serializer.errors)

    def test_serializer_blank(self):
        serializer = ProcessLogSerializer(data=self.datapoint_blank)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.blank_checks))
        for field in self.blank_checks:
            self.assertTrue(field in serializer.errors)

    def test_serializer_missing(self):
        serializer = ProcessLogSerializer(data=self.datapoint_missing)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.missing_checks))
        for field in self.missing_checks:
            self.assertTrue(field in serializer.errors)