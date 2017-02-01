# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-01-31 22:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ApiCall',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('key', models.TextField(db_column='key')),
                ('url', models.TextField(db_column='url')),
                ('description', models.TextField(db_column='description')),
                ('active', models.BooleanField(db_column='active', default=True)),
            ],
            options={
                'db_table': 'hierarchy_apicalls',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Data',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('date', models.DateTimeField(db_column='date')),
                ('machine', models.TextField(db_column='machine', null=True)),
                ('name', models.TextField(db_column='name', null=True)),
                ('value', models.FloatField(db_column='value')),
                ('active', models.BooleanField(db_column='active', default=True)),
            ],
            options={
                'db_table': 'hierarchy_datapoints',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('name', models.TextField(db_column='name')),
                ('created', models.DateTimeField(db_column='createdate', default=django.utils.timezone.now)),
                ('modified', models.DateTimeField(db_column='modifydate', default=django.utils.timezone.now)),
                ('active', models.NullBooleanField(db_column='active', default=True)),
                ('apiCalls', models.ManyToManyField(blank=True, to='hierarchy.ApiCall')),
            ],
            options={
                'db_table': 'hierarchy_departments',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Machine',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('name', models.TextField(db_column='name')),
                ('type', models.TextField(blank=True, db_column='type', null=True)),
                ('created', models.DateTimeField(db_column='createdate', default=django.utils.timezone.now)),
                ('modified', models.DateTimeField(db_column='modifydate', default=django.utils.timezone.now)),
                ('active', models.NullBooleanField(default=True)),
            ],
            options={
                'db_table': 'hierarchy_machines',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('name', models.TextField(db_column='name')),
                ('label', models.TextField(db_column='label')),
                ('description', models.TextField(blank=True, db_column='description', null=True)),
                ('created', models.DateTimeField(db_column='createdate', default=django.utils.timezone.now)),
                ('modified', models.DateTimeField(db_column='modifydate', default=django.utils.timezone.now)),
                ('active', models.NullBooleanField(db_column='active', default=True)),
            ],
            options={
                'db_table': 'hierarchy_modules',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Part',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('type', models.TextField(db_column='type')),
                ('input1', models.TextField(db_column='input1')),
                ('input2', models.TextField(blank=True, db_column='input2', null=True)),
                ('input3', models.TextField(blank=True, db_column='input3', null=True)),
                ('input4', models.TextField(blank=True, db_column='input4', null=True)),
                ('created', models.DateTimeField(db_column='createdate', default=django.utils.timezone.now)),
                ('modified', models.DateTimeField(db_column='modifydate', default=django.utils.timezone.now)),
                ('active', models.NullBooleanField(db_column='active', default=True)),
                ('machine', models.ForeignKey(db_column='machineid', on_delete=django.db.models.deletion.CASCADE, to='hierarchy.Machine')),
            ],
            options={
                'db_table': 'hierarchy_parts',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Position',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('label', models.TextField(db_column='label')),
                ('created', models.DateTimeField(db_column='createdate', default=django.utils.timezone.now)),
                ('modified', models.DateTimeField(db_column='modifydate', default=django.utils.timezone.now)),
                ('active', models.NullBooleanField(db_column='active', default=True)),
                ('department', models.ForeignKey(blank=True, db_column='departmentid', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='positions', to='hierarchy.Department')),
            ],
            options={
                'db_table': 'hierarchy_positions',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='ProcessLog',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('timestamp', models.DateTimeField(db_column='timestamp')),
                ('userName', models.TextField(blank=True, db_column='username')),
                ('description', models.TextField(blank=True, db_column='description')),
                ('oldValue', models.TextField(db_column='oldvalue')),
                ('newValue', models.TextField(db_column='newvalue')),
                ('machine', models.ForeignKey(db_column='machineid', on_delete=django.db.models.deletion.DO_NOTHING, to='hierarchy.Machine')),
            ],
            options={
                'db_table': 'hierarchy_processlog',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Setpoint',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('specName', models.TextField(blank=True, db_column='specname', null=True)),
                ('piTagName', models.TextField(db_column='pitagname')),
                ('lowLimit', models.TextField(blank=True, db_column='lowlimit', null=True)),
                ('highLimit', models.TextField(blank=True, db_column='highlimit', null=True)),
                ('percentage', models.NullBooleanField(db_column='percentage')),
                ('itemName', models.TextField(db_column='itemname')),
                ('groupName', models.TextField(blank=True, db_column='groupname', null=True)),
                ('created', models.DateTimeField(db_column='createdate', default=django.utils.timezone.now)),
                ('modified', models.DateTimeField(db_column='modifydate', default=django.utils.timezone.now)),
                ('specValue', models.TextField(blank=True, db_column='specvalue', null=True)),
                ('piTagValue', models.TextField(blank=True, db_column='pitagvalue', null=True)),
                ('piTagDate', models.DateTimeField(blank=True, db_column='pitagdate', null=True)),
                ('contains', models.NullBooleanField(db_column='contains')),
                ('active', models.NullBooleanField(db_column='active', default=True)),
                ('onSpec', models.NullBooleanField(db_column='onspec')),
                ('machine', models.ForeignKey(blank=True, db_column='machineid', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='hierarchy.Machine')),
            ],
            options={
                'db_table': 'hierarchy_setpoints',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Site',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('name', models.TextField(db_column='name')),
                ('code', models.TextField(db_column='code')),
                ('location', models.TextField(blank=True, db_column='location', default='', null=True)),
                ('created', models.DateTimeField(db_column='createdate', default=django.utils.timezone.now)),
                ('modified', models.DateTimeField(db_column='modifydate', default=django.utils.timezone.now)),
                ('active', models.BooleanField(db_column='active')),
                ('directory', models.TextField(blank=True, db_column='directory', default='')),
                ('latitude', models.TextField(blank=True, db_column='latitude', default='')),
                ('longitude', models.TextField(blank=True, db_column='longitude', default='')),
                ('address', models.TextField(blank=True, db_column='address', default='')),
                ('modules', models.ManyToManyField(blank=True, to='hierarchy.Module')),
            ],
            options={
                'db_table': 'hierarchy_sites',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Specification',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('fileName', models.TextField(db_column='filename')),
                ('lotNumber', models.TextField(db_column='lot')),
                ('created', models.DateTimeField(db_column='startdate', default=django.utils.timezone.now)),
                ('modified', models.DateTimeField(db_column='modifydate', default=django.utils.timezone.now)),
                ('active', models.NullBooleanField(db_column='active', default=True)),
                ('machine', models.ForeignKey(db_column='machineid', on_delete=django.db.models.deletion.DO_NOTHING, to='hierarchy.Machine')),
            ],
            options={
                'db_table': 'hierarchy_specifications',
                'managed': True,
            },
        ),
        migrations.AddField(
            model_name='part',
            name='position',
            field=models.ForeignKey(blank=True, db_column='positionid', null=True, on_delete=django.db.models.deletion.CASCADE, to='hierarchy.Position'),
        ),
        migrations.AddField(
            model_name='machine',
            name='defaultModule',
            field=models.ForeignKey(db_column='default_module', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='machines', to='hierarchy.Module'),
        ),
        migrations.AddField(
            model_name='machine',
            name='department',
            field=models.ForeignKey(db_column='departmentid', on_delete=django.db.models.deletion.DO_NOTHING, related_name='machines', to='hierarchy.Department'),
        ),
        migrations.AddField(
            model_name='machine',
            name='modules',
            field=models.ManyToManyField(blank=True, to='hierarchy.Module'),
        ),
        migrations.AddField(
            model_name='department',
            name='defaultModule',
            field=models.ForeignKey(db_column='default_module', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='departments', to='hierarchy.Module'),
        ),
        migrations.AddField(
            model_name='department',
            name='modules',
            field=models.ManyToManyField(blank=True, to='hierarchy.Module'),
        ),
        migrations.AddField(
            model_name='department',
            name='site',
            field=models.ForeignKey(db_column='siteid', on_delete=django.db.models.deletion.DO_NOTHING, related_name='departments', to='hierarchy.Site'),
        ),
    ]
