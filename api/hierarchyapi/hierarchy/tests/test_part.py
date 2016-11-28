import json
import unittest
from datetime import datetime as dt
import mock as mock

from django.contrib.auth.models import User, Permission
from rest_framework.reverse import reverse
from rest_framework.test import APIClient
from autofixture import AutoFixture

from mohawkapi import test_utils
from hierarchy.models import Part, Site, Department, Machine, Position
from hierarchy.serializers import PartSerializer, PartSerializerPost


class PartGet(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.query = Part.objects.all().filter(active=True).order_by('-modifyDate')
        cls.user = User(username='developer')
        cls.date = test_utils.get_date_object(dt(2016, 6, 5), dt(2016, 12, 5))

        Site(name='site1').save()
        site1 = Site.objects.get(name='site1')
        Department(name='department3', site=site1).save()
        department1 = Department.objects.get(name='department3')
        Machine(name='machine1', department=department1).save()
        Machine(name='machine2', department=department1).save()
        Position(label='position1', department=department1).save()
        Position(label='position2', department=department1).save()
        cls.machine1 = Machine.objects.get(name='machine1')
        cls.machine2 = Machine.objects.get(name='machine2')
        cls.position1 = Position.objects.get(label='position1')
        cls.position2 = Position.objects.get(label='position2')
        cls.fixture = AutoFixture(Part, field_values={
            'input1': test_utils.get_random(['ONE_INPUT', 'One_input', 'One_Input2', 'no one input match']),
            'input2': test_utils.get_random(['TWO_INPUT', 'Two_input', 'Two_Input2', 'no two input match']),
            'input3': test_utils.get_random(['THREE_INPUT', 'Three_input', 'Three_Input2', 'no three input match']),
            'input4': test_utils.get_random(['FOUR_INPUT', 'Four_input', 'Four_Input2', 'no four input match']),
            'machine': test_utils.get_random([cls.machine1, cls.machine2]),
            'position': test_utils.get_random([cls.position1, cls.position2]),
            'type': test_utils.get_random(['Type1', 'type1', 'Type2', 'no type match']),
            'createDate': test_utils.get_random([dt(2016, 9, 5), dt(2016, 9, 1), dt(2016, 8, 5),]),
            'modifyDate': test_utils.get_random([dt(2016, 9, 6), dt(2016, 9, 2), dt(2016, 8, 6),]),
        })
        cls.fixture.create(100)
        cls.first = Part.objects.first()

    @classmethod
    def tearDownClass(cls):
        Part.objects.all().delete()
        Machine.objects.all().delete()
        Position.objects.all().delete()
        Department.objects.all().delete()
        Site.objects.all().delete()

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_Part_view_get_unauthenticated(self, mock_date):
        mock_date.return_value = self.date
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('partview', kwargs={}))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.content, b'{"detail":"Authentication credentials were not provided."}')

    def test_Part_view_get_one(self):
        response = self.client.get('/api/v1/hierarchy/parts/{}/'.format(self.first.id))
        self.assertEqual(response.status_code, 200)
        print(response.data)
        self.assertEqual(response.data['id'], self.first.id)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_Part_view_get_all(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/parts/')
        expected = PartSerializer(self.query, many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    def test_specification_view_get_filter_modify_date(self):
        response = self.client.get('/api/v1/hierarchy/parts/?startdate=082516&enddate=090216')
        expected = PartSerializer(self.query.filter(modifyDate__range=(dt(2016, 8, 25), dt(2016, 9, 2))), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)

    @mock.patch('mohawkapi.utility.ParsedDate')
    def test_Part_view_get_filter_type(self, mock_date):
        mock_date.return_value = self.date
        response = self.client.get('/api/v1/hierarchy/parts/?type=type1')
        expected = PartSerializer(self.query.filter(type__iexact='type1'), many=True).data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)


class PartModify(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.no_permission, cls.post, cls.post_modify, cls.post_modify_delete = test_utils.create_test_users(Part)
        Site(name='site1').save()
        site1 = Site.objects.get(name='site1')
        Department(name='department3', site=site1).save()
        department1 = Department.objects.get(name='department3')
        Machine(name='machine1', department=department1).save()
        Machine(name='machine2', department=department1).save()
        Position(label='position1', department=department1).save()
        Position(label='position2', department=department1).save()
        cls.machine1 = Machine.objects.get(name='machine1')
        cls.machine2 = Machine.objects.get(name='machine2')
        cls.position1 = Position.objects.get(label='position1')
        cls.position2 = Position.objects.get(label='position2')

        Part(machine=cls.machine1, position=cls.position1, input1='one1', input2='one2', input3='one3',
             input4='one4', createDate=dt.now(), modifyDate=dt.now(), type='Part1', active=True).save()
        Part(machine=cls.machine2, position=cls.position2, input1='one1', input2='one2', input3='one3',
             input4='one4', createDate=dt.now(), modifyDate=dt.now(), type='Part2', active=True).save()
        cls.update_id = Part.objects.get(type='Part1').id
        cls.delete_id = Part.objects.get(type='Part2').id
        cls.part = {'machine': cls.machine2.id, 'position': cls.position2.id, 'input1': 'three1', 'input2': 'three2',
                    'input3': 'three3',  'input4': 'three4', 'type': 'Part2'}

    @classmethod
    def tearDownClass(cls):
        User.objects.all().delete()
        Permission.objects.all().delete()
        Part.objects.all().delete()
        Position.objects.all().delete()
        Machine.objects.all().delete()
        Department.objects.all().delete()
        Site.objects.all().delete()

    def setUp(self):
        self.client = APIClient()

    def test_setpoint_view_post(self):
        self.client.force_authenticate(user=self.post)
        response = self.client.post('/api/v1/hierarchy/parts/', json.dumps(self.part),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_setpoint_view_put(self):
        self.client.force_authenticate(user=self.post_modify)
        response = self.client.put('/api/v1/hierarchy/parts/{}/'.format(self.update_id),
                                   json.dumps(self.part), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_setpoint_view_delete(self):
        self.client.force_authenticate(user=self.post_modify_delete)
        response = self.client.delete('/api/v1/hierarchy/parts/{}/'.format(self.delete_id),
                                      json.dumps(self.part),
                                      content_type='application/json')
        self.assertEqual(response.status_code, 204)

    def test_setpoint_view_post_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.post('/api/v1/hierarchy/parts/', json.dumps(self.part),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_put_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/api/v1/hierarchy/parts/{}/'.format(self.update_id),
                                   json.dumps(self.part), content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_setpoint_view_delete_no_permission(self):
        self.client.force_authenticate(user=self.no_permission)
        response = self.client.put('/api/v1/hierarchy/parts/{}/'.format(self.delete_id),
                                   json.dumps(self.part), content_type='application/json')
        self.assertEqual(response.status_code, 403)


class TestPartSerializer(unittest.TestCase):
    """
    Testing Post serializer for Part
    """

    @classmethod
    def setUpClass(cls):
        Site(name='site1').save()
        site1 = Site.objects.get(name='site1')
        Department(name='department3', site=site1).save()
        department1 = Department.objects.get(name='department3')
        Machine(name='machine1', department=department1).save()
        Position(label='position1', department=department1).save()
        cls.machine1 = Machine.objects.get(name='machine1')
        cls.position1 = Position.objects.get(label='position1')

        cls.part = {'machine': cls.machine1.id, 'position': cls.position1.id, 'input1': 'three1', 'input2': 'three2',
                    'input3': 'three3',  'input4': 'three4', 'type': 'Part2'}
        cls.part_malformed = {'machine': 'bad', 'position': 'bad', 'input1': 'three1', 'input2': 'three2',
                    'input3': 'three3',  'input4': 'three4', 'type': 'Part2', 'createDate': 'bad', 'modifyDate': 'bad'}
        cls.part_blank = {'machine': '', 'position': '', 'input1': '', 'input2': '',
                    'input3': '',  'input4': '', 'type': '', 'modifyDate': '', 'createDate': '', 'active': ''}
        cls.part_missing = {}
        cls.malformed_checks = ['machine', 'position']
        cls.blank_checks = ['machine', 'type', 'input1']
        cls.missing_checks = ['machine', 'type', 'input1']

    @classmethod
    def tearDownClass(cls):
        User.objects.all().delete()
        Permission.objects.all().delete()
        Part.objects.all().delete()
        Position.objects.all().delete()
        Machine.objects.all().delete()
        Department.objects.all().delete()
        Site.objects.all().delete()

    def test_serializer_good(self):
        test = PartSerializerPost(data=self.part)
        test.is_valid()
        print(test.errors)
        self.assertTrue(PartSerializerPost(data=self.part).is_valid())

    def test_serializer_malformed(self):
        serializer = PartSerializerPost(data=self.part_malformed)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.malformed_checks))
        for field in self.malformed_checks:
            self.assertTrue(field in serializer.errors)

    def test_serializer_blank(self):
        serializer = PartSerializerPost(data=self.part_blank)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.blank_checks))
        for field in self.blank_checks:
            self.assertTrue(field in serializer.errors)

    def test_serializer_missing(self):
        serializer = PartSerializerPost(data=self.part_missing)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), len(self.missing_checks))
        for field in self.missing_checks:
            self.assertTrue(field in serializer.errors)
