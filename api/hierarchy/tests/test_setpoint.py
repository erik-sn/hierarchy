import json
import unittest
from datetime import datetime as dt

import mock as mock

from django.contrib.auth.models import User, Permission
from rest_framework.reverse import reverse
from rest_framework.test import APIClient
from autofixture import AutoFixture

from hierarchyapi import test_utils
from hierarchy.models import Machine, Setpoint, Department, Site
from hierarchy.serializers import SetpointSerializer


class SetpointGet(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.query = Setpoint.objects.all().order_by('specName')
        cls.date = test_utils.get_date_object(dt(2016, 6, 5), dt(2016, 12, 5))
        cls.user = User(username='developer')

        cls.site = Site.objects.create(name='site')
        cls.department = Department.objects.create(name='department', site=cls.site)
        mch1 = Machine.objects.create(name='MCH1', department=cls.department)
        mch2 = Machine.objects.create(name='MCH2', department=cls.department)

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
            'created': test_utils.get_random([dt(2016, 9, 5), dt(2016, 9, 1), dt(2016, 8, 5), ]),
            'modified': test_utils.get_random([dt(2016, 9, 5), dt(2016, 9, 1), dt(2016, 8, 5), ]),
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
        Department.objects.all().delete()
        Site.objects.all().delete()
        User.objects.all().delete()

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_setpoint_view_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('setpointview', kwargs={}))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data, {"detail": "Authentication credentials were not provided."})

    def test_setpoint_view_get_one(self):
        response = self.client.get('/hierarchy/setpoints/{}/'.format(self.first.id))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.first.id)

    @mock.patch('hierarchyapi.utility.ParsedDate')
    def test_setpoint_view_get_all(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/hierarchy/setpoints/')
        expected = SetpointSerializer(self.query, many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), len(expected))

    @mock.patch('hierarchyapi.utility.ParsedDate')
    def test_setpoint_view_get_filter_specName(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/hierarchy/setpoints/?specname=spec')
        expected = SetpointSerializer(self.query.filter(specName__icontains='spec')
                                      .order_by('specName'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('hierarchyapi.utility.ParsedDate')
    def test_setpoint_view_get_filter_tagname(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/hierarchy/setpoints/?tagname=pi')
        expected = SetpointSerializer(self.query.filter(piTagName__icontains='pi')
                                      .order_by('specName'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('hierarchyapi.utility.ParsedDate')
    def test_setpoint_view_get_filter_itemname(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/hierarchy/setpoints/?itemname=itemname1')
        expected = SetpointSerializer(self.query.filter(itemName__icontains='itemname1')
                                      .order_by('specName'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('hierarchyapi.utility.ParsedDate')
    def test_setpoint_view_get_filter_groupname(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/hierarchy/setpoints/?groupname=groupname1')
        expected = SetpointSerializer(self.query.filter(groupName__icontains='groupname1')
                                      .order_by('specName'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('hierarchyapi.utility.ParsedDate')
    def test_setpoint_view_get_filter_machine_name(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/hierarchy/setpoints/?machine=mch1')
        expected = SetpointSerializer(self.query.filter(machine__name__iexact='mch1')
                                      .order_by('specName'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)
