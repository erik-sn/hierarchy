from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view

from sample.models import SampleData
from sample.serializers import SampleDataSerializer


# Create your views here.
class SampleView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, *args, **kwargs):
        keyword = request.GET.get('keyword', None)
        machine = request.GET.get('machine', None)
        module = request.GET.get('module', None)

        query = SampleData.objects.all()
        query = query.filter(keyword__icontains=keyword) if keyword else query
        query = query.filter(machine=machine) if machine else query
        query = query.filter(module=module) if module else query

        serializer = SampleDataSerializer(query, many=True)
        return Response(serializer.data, 200)


overview = {
    'safety': {
        'january': {
            'first_aid': 1,
            'near_misses': 2,
            'recordables': 0,
        },
        'february': {
            'first_aid': 1,
            'near_misses': 1,
            'recordables': 1,
        },
        'march': {
            'first_aid': 3,
            'near_misses': 1,
            'recordables': 0,
        },
        'april': {
            'first_aid': 0,
            'near_misses': 0,
            'recordables': 1,
        },
        'may': {
            'first_aid': 1,
            'near_misses': 3,
            'recordables': 0,
        },
        'june': {
            'first_aid': 2,
            'near_misses': 2,
            'recordables': 0,
        },
        'july': {
            'first_aid': 1,
            'near_misses': 4,
            'recordables': 0,
        },
        'august': {
            'first_aid': 1,
            'near_misses': 0,
            'recordables': 1,
        },
        'september': {
            'first_aid': 1,
            'near_misses': 3,
            'recordables': 1,
        },
        'october': {
            'first_aid': 1,
            'near_misses': 1,
            'recordables': 1,
        },
        'november': {
            'first_aid': 2,
            'near_misses': 3,
            'recordables': 0,
        },
        'december': {
            'first_aid': 1,
            'near_misses': 1,
            'recordables': 0,
        },
    },
    'variances': {
        'january': {
            'mro': 5000,
            'labor': 1357,
            'utilities': -1000,
        },
        'february': {
            'mro': 4300,
            'labor': 2000,
            'utilities': -2000,
        },
        'march': {
            'mro': 3200,
            'labor': 1800,
            'utilities': -250,
        },
        'april': {
            'mro': -1500,
            'labor': 1357,
            'utilities': -1000,
        },
        'may': {
            'mro': 2200,
            'labor': -500,
            'utilities': -500,
        },
    },

}

class OverviewView(APIView):
    permission_classes = (permissions.AllowAny, )
    queryset = SampleData.objects.none()

    def get(self, request, *args, **kwargs):
        return Response(overview)
