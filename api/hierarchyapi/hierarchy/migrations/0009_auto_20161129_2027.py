# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-30 01:27
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hierarchy', '0008_auto_20161127_1746'),
    ]

    operations = [
        migrations.AddField(
            model_name='department',
            name='defaultModule',
            field=models.ForeignKey(db_column='default_module', default=31, on_delete=django.db.models.deletion.DO_NOTHING, related_name='departments', to='hierarchy.Module'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='machine',
            name='defaultModule',
            field=models.ForeignKey(db_column='default_module', default=31, on_delete=django.db.models.deletion.DO_NOTHING, related_name='machines', to='hierarchy.Module'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='department',
            name='apiCalls',
            field=models.ManyToManyField(blank=True, to='hierarchy.ApiCall'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='department',
            field=models.ForeignKey(db_column='departmentid', default=1, on_delete=django.db.models.deletion.DO_NOTHING, related_name='machines', to='hierarchy.Department'),
            preserve_default=False,
        ),
    ]