# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-27 17:22
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hierarchy', '0006_auto_20161127_1721'),
    ]

    operations = [
        migrations.RenameField(
            model_name='department',
            old_name='api_calls',
            new_name='apiCalls',
        ),
    ]