import json
import unittest
from datetime import datetime as dt
from autofixture import AutoFixture

from django.contrib.auth.models import User, Permission
from rest_framework.reverse import reverse
from rest_framework.test import APIClient

from mohawkapi import test_utils
from hierarchy.models import Data, ProcessLog


class DataViewGet(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.user = User(username='developer')

    @classmethod
    def tearDownClass(cls):
        ProcessLog.objects.all().delete()

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.datapoints = (
            {'date': '2016-09-12T12:10:00', 'machine': 'TEST1', 'name': 'test_type', 'value': 13.12},
            {'date': '2016-09-12T12:11:00', 'machine': 'TEST1', 'name': 'test_type', 'value': 10.12},
            {'date': '2016-09-12T12:12:00', 'machine': 'TEST1', 'name': 'test_type', 'value': 15.12},
            {'date': '2016-09-12T12:13:00', 'machine': 'TEST1', 'name': 'test_type', 'value': 20.12},
            {'date': '2016-09-12T12:14:00', 'machine': 'TEST1', 'name': 'test_type', 'value': 21.12},
            {'date': '2016-09-14T12:18:00', 'machine': 'TEST1', 'name': 'test_type', 'value': 23.12},
            {'date': '2016-09-12T12:19:00', 'machine': 'TEST1', 'name': 'test_type', 'value': 24.12},
            {'date': '2016-09-12T12:20:00', 'machine': 'TEST1', 'name': 'test_type', 'value': 25.12},
            {'date': '2016-09-12T12:21:00', 'machine': 'TEST1', 'name': 'test_type', 'value': 26.12},
            {'date': '2016-09-12T12:22:00', 'machine': 'TEST1', 'name': 'test_type', 'value': 27.12},
            {'date': '2016-09-12T12:23:00', 'machine': 'TEST2', 'name': 'test_type', 'value': 28.12},
            {'date': '2016-09-12T12:10:00', 'machine': 'TEST2', 'name': 'test_type2', 'value': 13.12},
            {'date': '2016-09-12T12:11:00', 'machine': 'TEST2', 'name': 'test_type2', 'value': 10.12},
            {'date': '2016-09-12T12:12:00', 'machine': 'TEST2', 'name': 'test_type', 'value': 15.12},
            {'date': '2016-09-12T12:13:00', 'machine': 'TEST2', 'name': 'test_type2', 'value': 20.12},
            {'date': '2016-09-12T12:14:00', 'machine': 'TEST2', 'name': 'test_type', 'value': 21.12},
            {'date': '2016-09-14T12:18:00', 'machine': 'TEST2', 'name': 'test_type', 'value': 23.12},
            {'date': '2016-09-14T12:19:00', 'machine': 'TEST2', 'name': 'test_type2', 'value': 24.12},
            {'date': '2016-09-14T12:20:00', 'machine': 'TEST2', 'name': 'test_type', 'value': 25.12},
            {'date': '2016-09-14T12:21:00', 'machine': 'TEST2', 'name': 'test_type2', 'value': 26.12},
            {'date': '2016-09-12T12:22:00', 'machine': 'TEST2', 'name': 'test_type', 'value': 27.12},
            {'date': '2016-09-12T12:23:00', 'machine': 'TEST2', 'name': 'test_type2', 'value': 28.12},
        )
        for d in self.datapoints:
            data = Data(date=d['date'], machine=d['machine'], name=d['name'], value=d['value'])
            data.save()
        self.single = Data.objects.first()

    def test_data_view_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('dataview', kwargs={}))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.content, b'{"detail":"Authentication credentials were not provided."}')

    def test_data_view_get_one(self):
        response = self.client.get('/api/v1/hierarchy/data/{}/'.format(self.single.id))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.single.id)

    def test_data_view_get_all(self):
        response = self.client.get('/api/v1/hierarchy/data/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), len(Data.objects.all()))

    def test_data_view_get_filter_machine(self):
        response = self.client.get('/api/v1/hierarchy/data/?machine=TEST1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), len(Data.objects.all().filter(machine='TEST1')))

    def test_data_view_get_filter_name(self):
        response = self.client.get('/api/v1/hierarchy/data/?name=test_type2')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), len(Data.objects.all().filter(name='test_type2')))

    def test_data_view_get_filter_date(self):
        response = self.client.get('/api/v1/hierarchy/data/?startdate=091316')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), len(Data.objects.all().filter(date__gt=dt(2016, 9, 13))))

        response = self.client.get('/api/v1/hierarchy/data/?enddate=091316')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), len(Data.objects.all().filter(date__lt=dt(2016, 9, 13))))


class DataViewModify(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.no_permission, cls.post, cls.post_modify, cls.post_modify_delete = test_utils.create_test_users(Data)
        Data(date=dt.now(), machine='Test3', name='test_name', value=2).save()
        Data(date=dt.now(), machine='Test4', name='test_name', value=2).save()
        cls.update_id = Data.objects.get(machine='Test3').id
        cls.delete_id = Data.objects.get(machine='Test4').id

        cls.datapoint = {'date': '2016-09-12T12:10:00', 'machine': 'TEST1', 'name': 'test_type', 'value': 13.12}
        cls.datapoint_malformed = {'date': '201610:00', 'machine': 'TEST1', 'name': 'test_type', 'value': 'test'}
        cls.datapoint_missing = {}

    @classmethod
    def tearDownClass(cls):
        User.objects.all().delete()
        Permission.objects.all().delete()
        Data.objects.all().delete()

    def setUp(self):
        self.client = APIClient()

    def test_data_view_post(self):
        self.client.force_authenticate(user=self.post)
        response = self.client.post('/api/v1/hierarchy/data/', json.dumps(self.datapoint), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_data_view_post_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.post('/api/v1/hierarchy/data/', json.dumps(self.datapoint), content_type='application/json')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.content, b'{"detail":"You do not have permission to perform this action."}')

    def test_data_view_post_bad_format(self):
        self.client.force_authenticate(user=self.post)
        response = self.client.post('/api/v1/hierarchy/data/', json.dumps(self.datapoint_malformed),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)

        self.assertEqual(response.data, {'date': ['Datetime has wrong format. Use one of these formats instead: '
                                            'YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z].'],
                                   'value': ['A valid number is required.']})

    def test_data_view_post_missing_data(self):
        self.client.force_authenticate(user=self.post)
        response = self.client.post('/api/v1/hierarchy/data/', json.dumps(self.datapoint_missing),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)

        self.assertEqual(response.data['date'], ['This field is required.'])
        self.assertEqual(response.data['value'], ['This field is required.'])

    def test_data_view_put(self):
        self.client.force_authenticate(user=self.post_modify)
        response = self.client.put('/api/v1/hierarchy/data/{}/'.format(self.update_id), json.dumps(self.datapoint),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_data_view_put_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/api/v1/hierarchy/data/1/', json.dumps(self.datapoint),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.content, b'{"detail":"You do not have permission to perform this action."}')

    def test_data_view_put_bad_format(self):
        self.client.force_authenticate(user=self.post_modify)
        response = self.client.put('/api/v1/hierarchy/data/{}/'.format(self.update_id), json.dumps(self.datapoint_malformed),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {'date': ['Datetime has wrong format. Use one of these formats instead: '
                                            'YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z].'],
                                   'value': ['A valid number is required.']})

    def test_data_view_put_missing_data(self):
        self.client.force_authenticate(user=self.post_modify)
        response = self.client.put('/api/v1/hierarchy/data/{}/'.format(self.update_id), json.dumps(self.datapoint_missing),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['date'], ['This field is required.'])
        self.assertEqual(response.data['value'], ['This field is required.'])

    def test_data_view_delete(self):
        self.client.force_authenticate(user=self.post_modify_delete)
        response = self.client.delete('/api/v1/hierarchy/data/{}/'.format(self.delete_id), json.dumps(self.datapoint),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.content, b'')

    def test_data_view_delete_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/api/v1/hierarchy/data/{}/'.format(self.delete_id), json.dumps(self.datapoint),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.content, b'{"detail":"You do not have permission to perform this action."}')