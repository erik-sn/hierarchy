from django.conf.urls import url

from sample import views

urlpatterns = [
    url(r'^(?i)overview/$', views.get_processing_overview, name='overview'),
    url(r'^(?i)data/$', views.SampleView.as_view(), name='sample'),
]
