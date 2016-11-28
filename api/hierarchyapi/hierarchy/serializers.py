from rest_framework import serializers
from hierarchy.models import *


class DataSerializer(serializers.ModelSerializer):

    class Meta:
        model = Data
        fields = ('id', 'date', 'machine', 'name', 'value')


class ApiCallSerializer(serializers.ModelSerializer):

    class Meta:
        model = ApiCall
        fields = ('id', 'url', 'key', 'description', 'active')


class ModuleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Module
        fields = ('id', 'name', 'label', 'description', 'created', 'modified', 'active')


class ModuleSerializerPost(serializers.ModelSerializer):

    class Meta:
        model = Module
        fields = ('name', 'label', 'description', 'active')


class MachineSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Machine
        depth = 1
        fields = ('id', 'name', 'type', 'created', 'modified', 'department', 'modules', 'active')


class MachineSerializerPost(serializers.ModelSerializer):

    class Meta:
        model = Machine
        fields = ('name', 'type', 'created', 'modified', 'department', 'modules', 'active')


class DepartmentSerializer(serializers.ModelSerializer):
    machines = MachineSerializer(many=True, read_only=True)

    class Meta:
        model = Department
        depth = 1
        fields = ('id', 'created', 'modified', 'site', 'name', 'apiCalls', 'machines', 'modules', 'active')


class DepartmentSerializerPost(serializers.ModelSerializer):

    class Meta:
        model = Department
        fields = ('name', 'created', 'modified', 'id', 'site', 'modules', 'apiCalls', 'active')


class PositionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Position
        fields = ('id', 'label', 'department', 'created', 'modified')


class PartSerializer(serializers.ModelSerializer):
    machine = serializers.SlugRelatedField(
        many=False,
        read_only=True,
        slug_field='name'
     )
    position = serializers.SlugRelatedField(
        many=False,
        read_only=True,
        slug_field='label'
     )

    class Meta:
        model = Part
        depth = 1
        fields = ('id', 'created', 'modified', 'type', 'input1', 'input2', 'input3', 'input4', 'machine',
                  'position')


class PartSerializerPost(serializers.ModelSerializer):

    class Meta:
        model = Part
        fields = ('type', 'input1', 'input2', 'input3', 'input4', 'machine', 'position')


class SiteSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ('name', 'code', 'location', 'directory', 'created', 'modified',
                  'latitude', 'longitude', 'address', 'active', 'modules')


class SiteSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Site
        depth = 1
        fields = ('id', 'name', 'code', 'location', 'directory', 'latitude', 'longitude', 'modules', 'departments',
                  'address', 'created', 'modified', 'active')


class SetpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setpoint
        depth = 0
        fields = ('specName', 'piTagName', 'lowLimit', 'highLimit', 'percentage', 'itemName', 'contains', 'groupName',
                  'machine', 'created', 'modified', 'specValue', 'piTagValue', 'piTagDate','onSpec', 'id',)


class SetpointBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setpoint
        fields = ('itemName', 'piTagName', 'specValue', 'piTagValue', 'lowLimit', 'highLimit', 'machine')


class SpecificationSerializer(serializers.ModelSerializer):
    machine = serializers.SlugRelatedField(
        many=False,
        read_only=True,
        slug_field='name'
     )

    class Meta:
        depth = 1
        model = Specification
        fields = ('id', 'fileName', 'lotNumber', 'created', 'modified', 'machine')


class ProcessLogSerializer(serializers.ModelSerializer):

    timestamp = serializers.DateTimeField(format='iso-8601')
    class Meta:
        model = ProcessLog
        depth = 1
        fields = ('id', 'timestamp', 'machine', 'userName', 'description', 'oldValue', 'newValue')