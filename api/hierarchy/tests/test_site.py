import json
import unittest
from datetime import datetime as dt
import mock as mock

from django.contrib.auth.models import User, Permission
from rest_framework.reverse import reverse
from rest_framework.test import APIClient
from autofixture import AutoFixture

from hierarchyapi import test_utils
from hierarchy.models import Site
from hierarchy.serializers import SiteSerializer


class SiteGet(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.query = Site.objects.all().filter(active=True).order_by('name')
        cls.user = User(username='developer')
        cls.date = test_utils.get_date_object(dt(2016, 6, 5), dt(2016, 12, 5))
        cls.fixture = AutoFixture(Site, field_values={
            'name': test_utils.get_random(['NAME1', 'name1', 'Name2', 'no name match']),
            'code': test_utils.get_random(['CODE1', 'code1', 'Code2', 'no code match']),
            'location': test_utils.get_random(['LOCATIon1', 'location1', 'Location2', 'no match']),
            'created': test_utils.get_random([dt(2016, 9, 5), dt(2016, 9, 1), dt(2016, 8, 5),]),
            'modified': test_utils.get_random([dt(2016, 9, 6), dt(2016, 9, 2), dt(2016, 8, 6),]),
            'active': test_utils.get_random([True, False]),
            'directory': test_utils.get_random(['URL1', 'url1', 'Url2', 'no match']),
        })
        cls.fixture.create(500)
        cls.first = Site.objects.first()

    @classmethod
    def tearDownClass(cls):
        Site.objects.all().delete()

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_Site_view_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('siteview', kwargs={}))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data, {"detail": "Authentication credentials were not provided."})

    @mock.patch('hierarchyapi.utility.ParsedDate')
    def test_Site_view_get_all(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/hierarchy/sites/')
        expected = SiteSerializer(self.query, many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    def test_Site_view_get_one(self):
        response = self.client.get('/hierarchy/sites/{}/'.format(self.first.id))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.first.id)

    @mock.patch('hierarchyapi.utility.ParsedDate')
    def test_Site_view_get_filter_name(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/hierarchy/sites/?name=name1')
        expected = SiteSerializer(self.query.filter(name__iexact='name1'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)


class SiteModify(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.no_permission, cls.post, cls.post_modify, cls.post_modify_delete = test_utils.create_test_users(Site)

        Site(created=dt.now(), modified=dt.now(), name='site1', code='code1', location='loc1', active=True, directory='dir1').save()
        Site(created=dt.now(), modified=dt.now(), name='site2', code='code2', location='loc2', active=False, directory='dir2').save()
        cls.update_id = Site.objects.get(name='site1').id
        cls.delete_id = Site.objects.get(name='site2').id
        cls.site = {'created': test_utils.get_timestamp(days=1), 'modified': test_utils.get_timestamp(),
                         'name': 'site3', 'code': 'code3', 'location': 'loc3', 'active': True, 'directory': 'dir3'}

    @classmethod
    def tearDownClass(cls):
        Site.objects.all().delete()
        User.objects.all().delete()
        Permission.objects.all().delete()

    def setUp(self):
        self.client = APIClient()

    def test_setpoint_view_post(self):
        self.client.force_authenticate(user=self.post)
        response = self.client.post('/hierarchy/sites/', json.dumps(self.site),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_setpoint_view_put(self):
        self.client.force_authenticate(user=self.post_modify)
        response = self.client.put('/hierarchy/sites/{}/'.format(self.update_id),
                                   json.dumps(self.site), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_setpoint_view_delete(self):
        self.client.force_authenticate(user=self.post_modify_delete)
        response = self.client.delete('/hierarchy/sites/{}/'.format(self.delete_id))
        self.assertEqual(response.status_code, 204)

    def test_setpoint_view_post_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.post('/hierarchy/sites/', json.dumps(self.site),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_put_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/hierarchy/sites/{}/'.format(self.update_id),
                                   json.dumps(self.site), content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_delete_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/hierarchy/sites/{}/'.format(self.delete_id),
                                   json.dumps(self.site), content_type='application/json')
        self.assertEqual(response.status_code, 403)


class TestSiteSerializer(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.site = {'created': test_utils.get_timestamp(days=1), 'modified': test_utils.get_timestamp(),
                         'name': 'site3', 'code': 'code3', 'location': 'loc3', 'active': True, 'directory': 'dir3'}
        cls.site_malformed = {'created': 'bad', 'modified': 'bad', 'name': 'site3', 'code': 'code3',
                                   'location': 'loc3', 'active': 'bad', 'directory': 'dir3'}
        cls.site_blank = {'created': '', 'modified': '', 'name': '', 'code': '',
                                   'location': '', 'active': '', 'directory': ''}
        cls.site_missing = {}

        cls.malformed_checks = ['created', 'modified', 'active']
        cls.blank_checks = ['name', 'code', 'created', 'modified', 'active']
        cls.missing_checks = ['name', 'code']

    def test_serializer_good(self):
        self.assertTrue(SiteSerializer(data=self.site).is_valid())

    def test_serializer_malformed(self):
        serializer = SiteSerializer(data=self.site_malformed)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.malformed_checks))
        for field in self.malformed_checks:
            self.assertTrue(field in serializer.errors)

    def test_serializer_blank(self):
        serializer = SiteSerializer(data=self.site_blank)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.blank_checks))
        for field in self.blank_checks:
            self.assertTrue(field in serializer.errors)

    def test_serializer_missing(self):
        serializer = SiteSerializer(data=self.site_missing)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.missing_checks))
        for field in self.missing_checks:
            self.assertTrue(field in serializer.errors)
