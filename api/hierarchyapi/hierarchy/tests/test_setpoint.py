import json
import unittest
from datetime import datetime as dt

import mock as mock

from django.contrib.auth.models import User, Permission
from rest_framework.reverse import reverse
from rest_framework.test import APIClient
from autofixture import AutoFixture

from mohawkapi import test_utils
from hierarchy.models import Machine, Setpoint
from hierarchy.serializers import SetpointSerializer


class SetpointGet(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.query = Setpoint.objects.all().order_by('specName').filter(active__exact=True)
        cls.date = test_utils.get_date_object(dt(2016, 6, 5), dt(2016, 12, 5))
        cls.user = User(username='developer')
        Machine(name='MCH1').save()
        Machine(name='MCH2').save()
        mch1 = Machine.objects.get(name='MCH1')
        mch2 = Machine.objects.get(name='MCH2')
        cls.setpoint_fixture = AutoFixture(Setpoint, field_values={
            'specName': test_utils.get_random(['SPEC1', 'spec1', ' no match']),
            'piTagName': test_utils.get_random(['PITAG1', 'PiTag1', 'pi no match']),
            'lowLimit': test_utils.get_random(['LOWLIMIT1', 'LowLimit1', 'limit match']),
            'highLimit': test_utils.get_random(['HIGHLIMIT1', 'HighLimit1', 'no match']),
            'percentage': test_utils.get_random([True, False]),
            'itemName': test_utils.get_random(['ITEMNAME1', 'ItemName1', 'itemname2', 'no match']),
            'contains': test_utils.get_random([True, False]),
            'groupName': test_utils.get_random(['GROUPNAME1', 'GroupName1', 'groupname2', 'no match']),
            'machine': test_utils.get_random([mch1, mch2]),
            'createDate': test_utils.get_random([dt(2016, 9, 5), dt(2016, 9, 1), dt(2016, 8, 5), ]),
            'modifyDate': test_utils.get_random([dt(2016, 9, 5), dt(2016, 9, 1), dt(2016, 8, 5), ]),
            'specValue': test_utils.get_random(['SPECVALUE1', 'SpecValue1', 'specvalue2', 'no match']),
            'piTagValue': test_utils.get_random(['PITAGVALUE1', 'PiTagValue1', 'pitagvalue2', 'no match']),
            'piTagDate': test_utils.get_random([dt(2016, 9, 5), dt(2016, 9, 1), dt(2016, 8, 5), ]),
            'active': test_utils.get_random([True, False]),
            'onSpec': test_utils.get_random([True, False]),
        })
        cls.setpoint_fixture.create(100)
        cls.first = Setpoint.objects.first()

    @classmethod
    def tearDownClass(cls):
        Setpoint.objects.all().delete()
        Machine.objects.all().delete()

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_setpoint_view_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('setpointview', kwargs={}))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data, {"detail": "Authentication credentials were not provided."})

    def test_setpoint_view_get_one(self):
        response = self.client.get('/api/v1/hierarchy/setpoints/{}/'.format(self.first.id))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.first.id)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_setpoint_view_get_all(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/setpoints/')
        expected = SetpointSerializer(self.query, many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), len(expected))

    def test_setpoint_view_get_filter_modify_date(self):
        response = self.client.get('/api/v1/hierarchy/setpoints/?startdate=082516&enddate=090216')
        expected = SetpointSerializer(self.query
                                      .filter(modifyDate__range=(dt(2016, 8, 25), dt(2016, 9, 2)))
                                      .order_by('specName'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_setpoint_view_get_filter_specName(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/setpoints/?specname=spec')
        expected = SetpointSerializer(self.query.filter(specName__icontains='spec')
                                      .order_by('specName'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_setpoint_view_get_filter_tagname(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/setpoints/?tagname=pi')
        expected = SetpointSerializer(self.query.filter(piTagName__icontains='pi')
                                      .order_by('specName'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_setpoint_view_get_filter_itemname(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/setpoints/?itemname=itemname1')
        expected = SetpointSerializer(self.query.filter(itemName__icontains='itemname1')
                                      .order_by('specName'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_setpoint_view_get_filter_groupname(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/setpoints/?groupname=groupname1')
        expected = SetpointSerializer(self.query.filter(groupName__icontains='groupname1')
                                      .order_by('specName'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_setpoint_view_get_filter_machine_name(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/setpoints/?machine=mch1')
        expected = SetpointSerializer(self.query.filter(machine__name__iexact='mch1')
                                      .order_by('specName'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_setpoint_view_get_filter_onspec_true(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/setpoints/?onspec=true')
        expected = SetpointSerializer(self.query.filter(onSpec__exact=True)
                                      .order_by('specName'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_setpoint_view_get_filter_onspec_true(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/setpoints/?onspec=false')
        expected = SetpointSerializer(self.query.filter(onSpec__exact=False)
                                      .order_by('specName'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)


class SetpointViewModify(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        Machine(name='MCH1').save()
        Machine(name='MCH2').save()
        mch1 = Machine.objects.get(name='MCH1')
        mch2 = Machine.objects.get(name='MCH2')
        cls.no_permission, cls.post, cls.post_modify, cls.post_modify_delete = test_utils.create_test_users(Setpoint)

        Setpoint(modifyDate=dt.now(), machine=mch1, specName='spec1', specValue=3, piTagName='pitag1', itemName='test_item1',
                 groupName='group1', piTagValue=2, highLimit=3, lowLimit=3).save()
        Setpoint(modifyDate=dt.now(), machine=mch2, specName='spec2', specValue=5, piTagName='pitag2', itemName='test_item2',
                 groupName='group2', piTagValue=5, highLimit=10, lowLimit=10).save()
        cls.update_id = Setpoint.objects.get(specName='spec1').id
        cls.delete_id = Setpoint.objects.get(specName='spec2').id

        cls.datapoint = {'itemName': 'test_name', 'machine': mch1.id, 'specValue': 1, 'piTagValue': 1,
                         'highLimit': 15, 'lowLimit': 10, 'piTagName': 'tag1'}
        cls.datapoint_malformed = {'machine': mch1.id, 'specValue': 1, 'piTagValue': 1,
                         'highLimit': 15, 'lowLimit': 10, 'piTagName': 'tag1', 'random_attritubte': False}
        cls.datapoint_missing = {}

    @classmethod
    def tearDownClass(cls):
        Setpoint.objects.all().delete()
        Machine.objects.all().delete()
        User.objects.all().delete()
        Permission.objects.all().delete()

    def setUp(self):
        self.client = APIClient()

    def test_setpoint_view_post(self):
        self.client.force_authenticate(user=self.post)
        response = self.client.post('/api/v1/hierarchy/setpoints/', json.dumps(self.datapoint),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_setpoint_view_post_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.post('/api/v1/hierarchy/setpoints/', json.dumps(self.datapoint),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_put_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/api/v1/hierarchy/setpoints/1/', json.dumps(self.datapoint),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_delete_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/api/v1/hierarchy/setpoints/{}/'.format(self.delete_id),
                                   json.dumps(self.datapoint),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_post_missing_data(self):
        self.client.force_authenticate(user=self.post)
        response = self.client.post('/api/v1/hierarchy/setpoints/', json.dumps(self.datapoint_missing),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_setpoint_view_post_malformed_data(self):
        self.client.force_authenticate(user=self.post)
        response = self.client.post('/api/v1/hierarchy/setpoints/', json.dumps(self.datapoint_malformed),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_setpoint_view_put(self):
        self.client.force_authenticate(user=self.post_modify)
        response = self.client.put('/api/v1/hierarchy/setpoints/{}/'.format(self.update_id),
                                   json.dumps(self.datapoint), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_setpoint_view_put_missing_data(self):
        self.client.force_authenticate(user=self.post_modify)
        response = self.client.put('/api/v1/hierarchy/setpoints/{}/'.format(self.update_id),
                                   json.dumps(self.datapoint_missing),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_setpoint_view_delete(self):
        self.client.force_authenticate(user=self.post_modify_delete)
        response = self.client.delete('/api/v1/hierarchy/setpoints/{}/'.format(self.delete_id),
                                      json.dumps(self.datapoint),
                                      content_type='application/json')
        self.assertEqual(response.status_code, 204)


class SetpointModelMethods(unittest.TestCase):

    def test_is_on_spec_none(self):
        setpoint = Setpoint(specValue=None, piTagValue=1)
        self.assertIsNone(setpoint.is_on_spec())
        setpoint = Setpoint(specValue=1, piTagValue=None)
        self.assertIsNone(setpoint.is_on_spec())
        setpoint = Setpoint(specValue=None, piTagValue=None)
        self.assertIsNone(setpoint.is_on_spec())
        # case where limits are not set
        setpoint = Setpoint(specValue=1, piTagValue=1)
        self.assertIsNone(setpoint.is_on_spec())

    def test_is_on_spec_true(self):
        setpoint = Setpoint(specValue=1, piTagValue=1, lowLimit=0, highLimit=0)
        self.assertTrue(setpoint.is_on_spec())
        setpoint = Setpoint(specValue=10, piTagValue=5, lowLimit=5, highLimit=0)
        self.assertTrue(setpoint.is_on_spec())
        setpoint = Setpoint(specValue=10, piTagValue=15, lowLimit=0, highLimit=5)
        self.assertTrue(setpoint.is_on_spec())
        setpoint = Setpoint(specValue=10, piTagValue=12, lowLimit=5, highLimit=5)
        self.assertTrue(setpoint.is_on_spec())
        setpoint = Setpoint(specValue=10, piTagValue=8, lowLimit=5, highLimit=5)
        self.assertTrue(setpoint.is_on_spec())

    def test_is_on_spec_false(self):
        setpoint = Setpoint(specValue=10, piTagValue=11, lowLimit=5, highLimit=0)
        self.assertFalse(setpoint.is_on_spec())
        setpoint = Setpoint(specValue=10, piTagValue=8, lowLimit=0, highLimit=5)
        self.assertFalse(setpoint.is_on_spec())
        setpoint = Setpoint(specValue=10, piTagValue=18, lowLimit=5, highLimit=5)
        self.assertFalse(setpoint.is_on_spec())
        setpoint = Setpoint(specValue=10, piTagValue=4, lowLimit=5, highLimit=5)
        self.assertFalse(setpoint.is_on_spec())

    def test_clear_spec_value(self):
        setpoint = Setpoint(specValue=5)
        self.assertEqual(setpoint.specValue, 5)
        setpoint.clear_spec_value()
        self.assertIsNone(setpoint.specValue)

    def test_clean_spec_value(self):
        setpoint = Setpoint()
        self.assertEqual(setpoint.clean_spec_value(1), 1)
        self.assertEqual(setpoint.clean_spec_value(1.5), 1.5)
        self.assertEqual(setpoint.clean_spec_value(-1), -1)
        self.assertEqual(setpoint.clean_spec_value('1'), 1)
        self.assertEqual(setpoint.clean_spec_value('1.5'), 1.5)
        self.assertEqual(setpoint.clean_spec_value('-1'), -1)

    def test_find_matching_spec_value_exact_none(self):
        setpoint = Setpoint(specName='TestSpec1', contains=False)
        map = [
            ['motor', 0], ['bearing', 1], ['shell', 2], ['gearbox', 4], ['pump', 5]
        ]
        setpoint.find_matching_spec_value(map)
        self.assertEqual(setpoint.specValue, None)
        setpoint = Setpoint(specName='TestSpec1', contains=False)
        setpoint.find_matching_spec_value(None)
        self.assertEqual(setpoint.specValue, None)

    def test_find_matching_spec_value_exact(self):
        setpoint = Setpoint(specName='TestSpec1', contains=False)
        map = [
            ['motor', 0], ['bearing', 1], ['shell', 2], ['testspec1', '3'], ['gearbox', 4], ['pump', 5]
        ]
        setpoint.find_matching_spec_value(map)
        self.assertEqual(setpoint.specValue, 3)

    def test_find_matching_spec_value_contains(self):
        setpoint = Setpoint(specName='TestSpec1', contains=True)
        map = [
            ['motor', 0], ['bearing', 1], ['shell', 2], ['This is TestSpec1 Value', '3'], ['gearbox', 4], ['pump', 5]
        ]
        setpoint.find_matching_spec_value(map)
        self.assertEqual(setpoint.specValue, 3)