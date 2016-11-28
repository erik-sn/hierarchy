# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-27 04:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hierarchy', '0004_auto_20161119_2239'),
    ]

    operations = [
        migrations.AddField(
            model_name='module',
            name='label',
            field=models.TextField(db_column='label', default='test'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='department',
            name='modules',
            field=models.ManyToManyField(blank=True, to='hierarchy.Module'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='modules',
            field=models.ManyToManyField(blank=True, to='hierarchy.Module'),
        ),
        migrations.AlterField(
            model_name='site',
            name='modules',
            field=models.ManyToManyField(blank=True, to='hierarchy.Module'),
        ),
    ]
