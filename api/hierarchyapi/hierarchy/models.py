from __future__ import unicode_literals

import re

from django.db import models
from django.utils import timezone

"""
All models for hierarchy application

Application Hierarchy:
    Site -> Department -> Machine -> Position/Part
"""


class ApiCall(models.Model):
    id = models.AutoField(primary_key=True, db_column='id')
    key = models.TextField(blank=False, null=False, db_column='key')
    url = models.TextField(blank=False, null=False, db_column='url')
    description = models.TextField(blank=False, null=False, db_column='description')
    active = models.BooleanField(default=True, db_column='active')

    class Meta:
        managed = True
        db_table = 'hierarchy_apicalls'


class Data(models.Model):
    # TODO refactor this and parts to one object
    """
    Generic data entry. Intended for use to hold data produced by mapscripts for later usage
    """
    id = models.AutoField(primary_key=True, db_column='id')
    date = models.DateTimeField(blank=False, null=False, db_column='date')
    machine = models.TextField(blank=False, null=True, db_column='machine')
    name = models.TextField(blank=False, null=True, db_column='name')
    value = models.FloatField(blank=False, null=False, db_column='value')
    active = models.BooleanField(default=True, db_column='active')

    class Meta:
        managed = True
        db_table = 'hierarchy_datapoints'


class Department(models.Model):
    """
    Child of site, second level of application hierarchy
    """
    id = models.AutoField(primary_key=True, db_column='id')
    name = models.TextField(blank=False, null=False, db_column='name')
    site = models.ForeignKey('Site', models.DO_NOTHING, db_column='siteid', related_name='departments',
                             blank=False, null=False)
    defaultModule = models.ForeignKey('Module', models.DO_NOTHING, db_column='default_module',
                                      related_name='departments', null=True)
    created = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='createdate')
    modified = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='modifydate')
    active = models.NullBooleanField(default=True, db_column='active')    
    modules = models.ManyToManyField('Module', blank=True)
    apiCalls = models.ManyToManyField('ApiCall', blank=True)

    class Meta:
        managed = True
        db_table = 'hierarchy_departments'


class Machine(models.Model):
    """
    Third tier of application hierarchy, child of departments
    """
    id = models.AutoField(primary_key=True, db_column='id')
    name = models.TextField(blank=False, null=False, db_column='name')
    department = models.ForeignKey('Department', models.DO_NOTHING, db_column='departmentid',
                                   related_name='machines', blank=False, null=False)
    defaultModule = models.ForeignKey('Module', models.DO_NOTHING, db_column='default_module',
                                      related_name='machines', null=True)
    modules = models.ManyToManyField('Module', blank=True)
    type = models.TextField(blank=True, null=True, db_column='type')
    created = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='createdate')
    modified = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='modifydate')
    active = models.NullBooleanField(default=True)

    class Meta:
        managed = True
        db_table = 'hierarchy_machines'

    def __str__(self):
        return self.name


class Part(models.Model):
    """
    Generic data entry model to hold input from users. Designed to be as implementation agnostic
    as possible.
    """
    id = models.AutoField(primary_key=True, db_column='id')
    type = models.TextField(blank=False, null=False, db_column='type')
    input1 = models.TextField(blank=False, null=False, db_column='input1')
    input2 = models.TextField(blank=True, null=True, db_column='input2')
    input3 = models.TextField(blank=True, null=True, db_column='input3')
    input4 = models.TextField(blank=True, null=True, db_column='input4')
    machine = models.ForeignKey('Machine', db_column="machineid", blank=False, null=False)
    position = models.ForeignKey('Position', db_column="positionid", blank=True, null=True)
    created = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='createdate')
    modified = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='modifydate')
    active = models.NullBooleanField(default=True, db_column='active')

    class Meta:
        managed = True
        db_table = 'hierarchy_parts'

    def __str__(self):
        return self.type, ' ', self.id


class Module(models.Model):
    """
    Used to relate machines to their displays or "modules" in the hierarchy application.
    """
    id = models.AutoField(primary_key=True, db_column='id')
    name = models.TextField(blank=False, null=False, db_column='name')
    label = models.TextField(blank=False, null=False, db_column='label')
    description = models.TextField(blank=True, null=True, db_column='description')
    created = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='createdate')
    modified = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='modifydate')
    active = models.NullBooleanField(default=True, db_column='active')

    class Meta:
        managed = True
        db_table = 'hierarchy_modules'

    def __str__(self):
        return self.name


class Position(models.Model):
    """
    Fourth tier of application hierarchy. Used to describe sub-locations of a Machine
    """
    id = models.AutoField(primary_key=True, db_column='id')
    label = models.TextField(blank=False, null=False, db_column='label')
    department = models.ForeignKey('Department', models.DO_NOTHING, db_column='departmentid', related_name='positions', blank=True, null=True)
    created = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='createdate')
    modified = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='modifydate')
    active = models.NullBooleanField(default=True, db_column='active')

    class Meta:
        managed = True
        db_table = 'hierarchy_positions'


class ProcessLog(models.Model):
    """
    Intended for use to hold Oak River (or other extrusion) PCS logs for setpoint changes. Currently
    a script is set up to run and parse .log files on the PCS to fill the data for this field.
    """
    id = models.AutoField(primary_key=True, db_column='id')
    timestamp = models.DateTimeField(blank=False, null=False, db_column='timestamp')
    machine = models.TextField(blank=False, null=False, db_column='machine')
    userName = models.TextField(blank=False, null=False, db_column='username')
    description = models.TextField(blank=False, null=False, db_column='description')
    oldValue = models.TextField(blank=False, null=False, db_column='oldvalue')
    newValue = models.TextField(blank=False, null=False, db_column='newvalue')

    class Meta:
        managed = True
        db_table = 'hierarchy_processlog'

    def __str__(self):
        return 'machine: {} description: {}'.format(self.machine, self.description)


class Setpoint(models.Model):
    """
    A mapping between excel specification files and PI tags. Intended for use to compare these
    specifications to PI and alert users of anything that may not be correct.

    Note that the limits are relative plus/minus of "specValue" - not absolute limits
    """
    id = models.AutoField(blank=True, primary_key=True, db_column='id')
    specName = models.TextField(blank=True, null=True, db_column='specname')
    piTagName = models.TextField(blank=False, null=False, db_column='pitagname')
    lowLimit = models.TextField(blank=True, null=True, db_column='lowlimit')
    highLimit = models.TextField(blank=True, null=True, db_column='highlimit')
    percentage = models.NullBooleanField(db_column='percentage')
    itemName = models.TextField(blank=False, null=False, db_column='itemname')
    groupName = models.TextField(blank=True, null=True, db_column='groupname')
    machine = models.ForeignKey(Machine, models.DO_NOTHING, db_column='machineid', blank=True, null=True)
    created = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='createdate')
    modified = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='modifydate')
    specValue = models.TextField(blank=True, null=True, db_column='specvalue')
    piTagValue = models.TextField(blank=True, null=True, db_column='pitagvalue')
    piTagDate = models.DateTimeField(blank=True, null=True, db_column='pitagdate')
    contains = models.NullBooleanField(db_column='contains')
    active = models.NullBooleanField(default=True, db_column='active')
    onSpec = models.NullBooleanField(db_column='onspec')

    class Meta:
        managed = True
        db_table = 'hierarchy_setpoints'

    def __str__(self):
        return self.itemName

    def is_on_spec(self):
        """
        Check to see if the Setpoint's PI tag
        :return:
        """
        try:
            if self.specValue is None or self.piTagValue is None:
                self.onSpec = None
            elif float(self.specValue) - float(self.lowLimit) <= float(self.piTagValue) <= float(self.specValue) + float(self.highLimit):
                self.onSpec = True
            else:
                self.onSpec = False
        except (TypeError, ValueError):
            self.onSpec = None
        return self.onSpec

    def clear_spec_value(self):
        self.specValue = None

    def find_matching_spec_value(self, specification_map):
        try:
            for cell in specification_map:
                if self.contains and self.specName.lower() in cell[0].lower():
                    self.specValue = self.clean_spec_value(cell[1])
                elif cell[0].lower() == self.specName.lower():
                    self.specValue = self.clean_spec_value(cell[1])
        except TypeError:
            return None

    def clean_spec_value(self, value):
        """
        pull the first integer group from a string and
        return it.
        :param value:
        :return:
        """
        if type(value) is str:
            r = re.compile(r'[^-\d.]+')
            return float(r.sub(' ', value).split(' ')[0])
        return value


class Site(models.Model):
    id = models.AutoField(primary_key=True, db_column='id')
    name = models.TextField(blank=False, null=False, db_column='name')
    code = models.TextField(blank=False, null=False, db_column='code')
    location = models.TextField(default='', blank=True, null=True, db_column='location')
    created = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='createdate')
    modified = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='modifydate')
    active = models.BooleanField(blank=False, null=False,  db_column='active')
    directory = models.TextField(default='', blank=True, null=False, db_column='directory')
    latitude = models.TextField(default='', blank=True, null=False, db_column='latitude')
    longitude = models.TextField(default='', blank=True, null=False, db_column='longitude')
    address = models.TextField(default='', blank=True, null=False, db_column='address')
    modules = models.ManyToManyField('Module', blank=True)

    class Meta:
        managed = True
        db_table = 'hierarchy_sites'


class Specification(models.Model):
    id = models.AutoField(primary_key=True, db_column='id')
    machine = models.ForeignKey(Machine, models.DO_NOTHING, db_column='machineid')
    fileName = models.TextField(blank=False, null=False, db_column='filename')
    lotNumber = models.TextField(blank=False, null=False, db_column='lot')
    created = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='startdate')
    modified = models.DateTimeField(default=timezone.now, blank=False, null=False, db_column='modifydate')
    active = models.NullBooleanField(default=True, db_column='active')

    class Meta:
        managed = True
        db_table = 'hierarchy_specifications'

