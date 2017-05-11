from rest_framework import serializers
from sample.models import SampleData


class SampleDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = SampleData
        fields = ('created', 'machine', 'module', 'value')
