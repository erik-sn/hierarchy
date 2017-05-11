from django.db import models


class SampleData(models.Model):
    id = models.AutoField(primary_key=True, db_column='id')
    machine = models.IntegerField()
    module = models.IntegerField()
    created = models.DateTimeField(auto_now_add=True, editable=False)
    keyword = models.TextField(blank=True, null=True)
    value = models.FloatField()
