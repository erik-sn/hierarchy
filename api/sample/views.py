from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response

from sample.models import SampleData
from sample.serializers import SampleDataSerializer


# Create your views here.
class SampleView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, *args, **kwargs):
        machine = request.GET.get('machine', None)
        module = request.GET.get('module', None)

        query = SampleData.objects.all()
        query = query.filter(machine=machine) if machine else query
        query = query.filter(module=module) if module else query

        serializer = SampleDataSerializer(query, many=True)
        return Response(serializer.data, 200)


