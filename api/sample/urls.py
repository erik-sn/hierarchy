from django.conf.urls import url

from sample import views

urlpatterns = [
    url(r'^(?i)overview/$', views.OverviewView.as_view(), name='overview'),
    url(r'^(?i)data/$', views.SampleView.as_view(), name='sample'),
]
