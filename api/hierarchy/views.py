import json

from django.contrib.auth.models import User
from django.contrib.auth import models
from django.utils.timezone import utc
from django.db.models import F
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly

from hierarchyapi import utility
from hierarchy.serializers import *
from rest_framework.response import Response

"""
Views for Hierarchy

All Model views have full Create (POST), Update (PUT), Delete (DELETE)
and List (GET) methods. All views in this module require authentication through active
directory and use Django Admin's model permissions to grant permissions.

For GET requests all models start with a base query which filters to only show active,
and sorts by a default field (if any). Any additional filtering is applied through
request parameters.

"""


@api_view(['GET'])
def auth_view(request):
    """
    Return the request's username and IP address - depending on windows authentication
    set up
    :param request: HTTP request
    :return:
    """
    name = request.META['USER'] if 'USER' in request.META else request.META['USERNAME']
    ip = request.META['REMOTE_ADDR'] or None
    try:
        user = User.objects.get(username=name)
    except models.ObjectDoesNotExist:
        user = User(is_active=True, is_staff=False, is_superuser=False, username=name)
        user.save()
    return Response({'id': user.id, 'username': user.username, 'ip': ip, 'admin': user.is_staff}, status=200)


class ApiCallView(generics.ListCreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    """
    View for application modules
    Methods supported:
        GET - from list method below
        POST - generics
        PUT/PATCH - generics
        DELETE - generics
    """
    queryset = ApiCall.objects.all().order_by('id')
    serializer_class = ApiCallSerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        if 'id' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            inactive = request.GET.get('inactive', None)

            data = self.get_queryset().filter(active=True) if inactive is None else self.get_queryset()
            serializer = ApiCallSerializer(data, many=True)
            return Response(serializer.data, 200)


class DepartmentView(generics.ListCreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    """
    View for application hierarchy
    Methods supported:
        GET - from list method below
        POST - generics
        PUT/PATCH - generics
        DELETE - generics
    """
    queryset = Department.objects.all().order_by('name')
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT']:
            return DepartmentSerializerPost
        return DepartmentSerializer

    def get(self, request, *args, **kwargs):
        if 'id' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            name = request.GET.get('name', None)
            inactive = request.GET.get('inactive', None)

            data = self.get_queryset().filter(active=True) if inactive is None else self.get_queryset()
            data = data.filter(name__iexact=name) if name else data
            serializer = DepartmentSerializer(data, many=True)
            return Response(serializer.data, 200)


class MachineView(generics.ListCreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    # TODO Tests!
    """
    View for application hierarchy
    Methods supported:
        GET - from list method below
        POST - generics
        PUT/PATCH - generics
        DELETE - generics
    """
    queryset = Machine.objects.all().order_by('name')
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT']:
            return MachineSerializerPost
        return MachineSerializer

    def get(self, request, *args, **kwargs):
        if 'id' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            department = request.GET.get('department', None)
            name = request.GET.get('name', None)
            inactive = request.GET.get('inactive', None)

            data = self.get_queryset().filter(active=True) if inactive is None else self.get_queryset()
            data = data.filter(department__id=department) if department else data
            data = data.filter(name__iexact=name) if name else data
            serializer = MachineSerializer(data, many=True)
            return Response(serializer.data, 200)


class ModuleView(generics.ListCreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    """
    View for application modules
    Methods supported:
        GET - from list method below
        POST - generics
        PUT/PATCH - generics
        DELETE - generics
    """
    queryset = Module.objects.all().order_by('name')
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'POST']:
            return ModuleSerializerPost
        return ModuleSerializer

    def get(self, request, *args, **kwargs):
        if 'id' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            name = request.GET.get('name', None)
            inactive = request.GET.get('inactive', None)

            data = self.get_queryset().filter(active=True) if inactive is None else self.get_queryset()
            data = data.filter(name__icontains=name) if name else data
            serializer = ModuleSerializer(data, many=True)
            return Response(serializer.data, 200)


class PartView(generics.ListCreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    """
    Methods supported:
        GET - from list method below
        POST - generics
        PUT/PATCH - generics
        DELETE - generics
    """
    queryset = Part.objects.all()
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT']:
            return PartSerializerPost
        return PartSerializer

    def get(self, request, *args, **kwargs):
        if 'id' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            dates = utility.ParsedDate(request, weeks=4)
            if not dates.valid:
                return Response(dates.error, 400)
            type = request.GET.get('type', None)

            data = self.queryset.filter(active=True).order_by('-modified').filter(modified__range=(dates.start, dates.end))
            data = data.filter(type__iexact=type) if type else data
            serializer = PartSerializer(data, many=True)
            return Response(serializer.data, 200)


class PositionView(generics.ListCreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    """
    Methods supported:
        GET - from list method below
        POST - generics
        PUT/PATCH - generics
        DELETE - generics
    """
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        if 'id' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            department = request.GET.get('department', None)
            label = request.GET.get('label', None)
            inactive = request.GET.get('inactive', None)

            positions = self.get_queryset().filter(active=True) if inactive is None else self.get_queryset()
            positions = positions.filter(active=True).order_by('label')
            positions = positions.filter(label__iexact=label) if label else positions
            positions = positions.filter(department__name__iexact=department) if department else positions
            data = positions.annotate(siteName=F('department__site__name'), departmentName=F('department__name'))\
                .values('id', 'siteName', 'departmentName', 'label')
            return Response(data, 200)


class ProcessLogView(generics.ListCreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    """
    View for process log - read only
        GET - from list method below
    """
    queryset = ProcessLog.objects.all().order_by('-id')
    serializer_class = ProcessLogSerializer
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT']:
            return ProcessLogSerializerPost
        return ProcessLogSerializer

    def get(self, request, *args, **kwargs):
        if 'id' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            dates = utility.ParsedDate(request, weeks=2)
            if not dates.valid:
                return Response(dates.error, 400)
            
            department = request.GET.get('department', None)
            machine = request.GET.get('machine', None)
            user = request.GET.get('username', None)
            description = request.GET.get('description', None)

            data = self.queryset.filter(timestamp__range=(dates.start, dates.end))
            data = data.filter(machine__department__id=department) if department else data
            data = data.filter(machine__name__iexact=machine) if machine else data
            data = data.filter(userName__icontains=user) if user else data
            data = data.filter(description__icontains=description) if description else data
            for item in data:
                item.timestamp.replace(tzinfo=utc)
            serializer = ProcessLogSerializer(data, many=True)
            return Response(serializer.data, 200)


class ReportView(generics.ListAPIView, generics.RetrieveAPIView):

    queryset = Report.objects.all().filter(active=True)
    serializer_class = ReportSerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        if 'id' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            department = kwargs.get('department')
            data = self.get_queryset().filter(department__id=department)
            serializer = self.serializer_class(data, many=True)
            return Response(serializer.data, 200)


class SetpointView(generics.ListCreateAPIView, generics.RetrieveAPIView):
    queryset = Setpoint.objects.all().order_by('specName').filter(active__exact=True)
    serializers = (SetpointSerializer)
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT']:
            return SetpointBasicSerializer
        return SetpointSerializer

    def post(self, request, *args, **kwargs):
        data = utility.convert_to_list(JSONParser().parse(request))
        serializer = SetpointBasicSerializer(data=data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, 201)
        return Response(serializer.errors, 400)

    def get(self, request, *args, **kwargs):
        if 'id' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            specName = request.GET.get('specname', None)
            piTagName = request.GET.get('tagname', None)
            itemName = request.GET.get('itemname', None)
            groupName = request.GET.get('groupname', None)
            machine = request.GET.get('machine', None)
            onSpec = utility.get_url_boolean(request.GET.get('onspec', None))

            data = Setpoint.objects.all().order_by('specName')
            data = data.filter(specName__icontains=specName) if specName else data
            data = data.filter(piTagName__icontains=piTagName) if piTagName else data
            data = data.filter(itemName__icontains=itemName) if itemName else data
            data = data.filter(groupName__icontains=groupName) if groupName else data
            data = data.filter(machine__name__iexact=machine) if machine else data
            data = data.filter(onSpec__exact=onSpec) if onSpec else data

            serializer = SetpointSerializer(data, many=True)
            return Response(serializer.data, 200)


class SiteView(generics.ListCreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    """
    View for application hierarchy
    Methods supported:
        GET - from list method below
        POST - generics
        PUT/PATCH - generics
        DELETE - generics
    """
    queryset = Site.objects.all().order_by('name')
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT']:
            return SiteSerializerPost
        return SiteSerializer

    def get(self, request, *args, **kwargs):
        print(request.user)
        if 'id' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            inactive = request.GET.get('inactive', None)
            name = request.GET.get('name', None)

            data = self.get_queryset().filter(active=True) if inactive is None else self.get_queryset()
            data = data.filter(name__iexact=name) if name else data
            serializer = SiteSerializer(data, many=True)
            return Response(serializer.data, 200)


class SpecificationView(generics.ListCreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView):
    queryset = Specification.objects.all().order_by('-created')
    serializer_class = SpecificationSerializer
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT']:
            return SpecificationSerializerPost
        return self.serializer_class

    def get(self, request, *args, **kwargs):
        if 'id' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            dates = utility.ParsedDate(request, months=6)
            if not dates.valid:
                return Response(dates.error, 400)

            department = request.GET.get('department', None)
            machine = request.GET.get('machine', None)
            filename = request.GET.get('filename', None)
            lotnumber = request.GET.get('lotnumber', None)
            active = utility.get_url_boolean(request.GET.get('active', None))

            data = self.queryset.filter(modified__range=(dates.start, dates.end))
            data = data.filter(active=active) if active is not None else data
            data = data.filter(machine__department__id=department) if department else data
            data = data.filter(machine__name__iexact=machine) if machine else data
            data = data.filter(fileName__icontains=filename) if filename else data
            data = data.filter(lotNumber__icontains=lotnumber) if lotnumber else data
            serializer = SpecificationSerializer(data, many=True)
            return Response(serializer.data, 200)

