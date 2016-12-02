import unittest
from datetime import datetime as dt

import mock as mock

from django.contrib.auth.models import User
from rest_framework.reverse import reverse
from rest_framework.test import APIClient
from autofixture import AutoFixture

from mohawkapi import test_utils
from hierarchy.models import Specification, Machine, Department, Site
from hierarchy.serializers import SpecificationSerializer


class SpecificationGet(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.query = Specification.objects.all().order_by('-id')
        cls.date = test_utils.get_date_object(dt(2016, 6, 5), dt(2016, 12, 5))
        cls.user = User(username='developer')

        Site(name="SITE1").save()
        cls.site = Site.objects.get(name="SITE1")
        Department(name='DEPT1', site=cls.site).save()
        cls.department = Department.objects.get(name='DEPT1')
        Machine(name='MCH1', department=cls.department).save()
        Machine(name='MCH2', department=cls.department).save()
        mch1 = Machine.objects.get(name='MCH1')
        mch2 = Machine.objects.get(name='MCH2')
        cls.specification_fixture = AutoFixture(Specification, field_values={
            'createDate': test_utils.get_random([dt(2016, 9, 5), dt(2016, 9, 1), dt(2016, 8, 5),]),
            'modifyDate': test_utils.get_random([dt(2016, 9, 5), dt(2016, 9, 1), dt(2016, 8, 5),]),
            'machine': test_utils.get_random([mch1, mch2]),
            'lotNumber': test_utils.get_random(['LOT1', 'lot1', 'no match']),
            'fileName': test_utils.get_random(['FILE1', 'file1', 'Fil3']),
            'active': test_utils.get_random([True, False]),
        })
        cls.specification_fixture.create(100)
        cls.first = Specification.objects.first()

    @classmethod
    def tearDownClass(cls):
        Specification.objects.all().delete()
        Machine.objects.all().delete()

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_specification_view_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('specificationview', kwargs={}))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data, {"detail":"Authentication credentials were not provided."})

    def test_specification_view_get_one(self):
        response = self.client.get('/api/v1/hierarchy/specifications/{}/'.format(self.first.id))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.first.id)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_specification_view_get_all(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/specifications/')
        expected = SpecificationSerializer(self.query.order_by('-id'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    def test_specification_view_get_filter_modify_date(self):
        response = self.client.get('/api/v1/hierarchy/specifications/?startdate=082516&enddate=090216')
        expected = SpecificationSerializer(self.query.filter(modifyDate__range=(dt(2016, 8, 25), dt(2016, 9, 2))),
                                           many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_specification_view_get_filter_machine_name(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/specifications/?machine=mch1')
        expected = SpecificationSerializer(self.query.filter(machine__name__iexact='mch1'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_specification_view_get_filter_filename_contains(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/specifications/?filename=file')
        expected = SpecificationSerializer(self.query.filter(fileName__icontains='file'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_specification_view_get_filter_lotnumber_contains(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/specifications/?lotnumber=lot1')
        expected = SpecificationSerializer(self.query.filter(lotNumber__icontains='lot1'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_specification_view_get_filter_department(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/specifications/?department={}'
                                   .format(self.department.id))
        expected = SpecificationSerializer(self.query.filter(machine__department__id=self.department.id), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_specification_view_get_filter_active_true(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/specifications/?active=true')
        expected = SpecificationSerializer(self.query.filter(active=True), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_specification_view_get_filter_active_false(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/specifications/?active=false')
        expected = SpecificationSerializer(self.query.filter(active=False), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)
