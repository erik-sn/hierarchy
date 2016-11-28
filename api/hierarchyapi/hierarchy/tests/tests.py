import unittest

from django.contrib.auth.models import User
from rest_framework.test import APIClient

from hierarchy import views


class GeneralTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.user = User(username='developer')

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_index_routing(self):
        found = resolve('/api/v1/hierarchy/')
        self.assertEqual(found.func, views.index)

    def test_specification_file_get_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/v1/hierarchy/specifications/files/test/')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data, {"detail":"Authentication credentials were not provided."})

    def test_specification_file_get_directory_not_found(self):
        response = self.client.get('/api/v1/hierarchy/specifications/files/wrong_directory/')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {'error': 'This machine does not exist in the file directory'})

    def test_specification_file_get(self):
        response = self.client.get('/api/v1/hierarchy/specifications/files/test/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

