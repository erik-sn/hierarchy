from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns

from hierarchy import views

urlpatterns = [

    url(r'^(?i)auth/$', views.auth_view, name='authview'),

    url(r'^(?i)apicalls/$', views.ApiCallView.as_view(), name='apicallview'),
    url(r'^(?i)apicalls/(?P<id>[0-9]+)/$', views.ApiCallView.as_view(), name='apicallview_id'),

    url(r'^(?i)departments/$', views.DepartmentView.as_view(), name='departmentview'),
    url(r'^(?i)departments/(?P<id>[0-9]+)/$', views.DepartmentView.as_view(), name='departmentview_id'),

    url(r'^(?i)machines/$', views.MachineView.as_view(), name='machineview'),
    url(r'^(?i)machines/(?P<id>[0-9]+)/$', views.MachineView.as_view(), name='machineview_id'),

    url(r'^(?i)modules/$', views.ModuleView.as_view(), name='moduleview'),
    url(r'^(?i)modules/(?P<id>[0-9]+)/$', views.ModuleView.as_view(), name='moduleview_id'),

    url(r'^(?i)positions/$', views.PositionView.as_view(), name='positionview'),
    url(r'^(?i)positions/(?P<id>[0-9]+)/$', views.PositionView.as_view(), name='positionview_id'),

    url(r'^(?i)parts/$', views.PartView.as_view(), name='partview'),
    url(r'^(?i)parts/(?P<id>[0-9]+)/$', views.PartView.as_view(), name='partview_id'),

    url(r'^(?i)processlog/$', views.ProcessLogView.as_view(), name='processlogview'),
    url(r'^(?i)processlog/(?P<id>[0-9]+)/$', views.ProcessLogView.as_view(), name='processlogview_id'),

    url(r'^(?i)reports/department/(?P<department>[0-9]+)/$', views.ReportView.as_view(), name='report_derpartment'),
    url(r'^(?i)reports/(?P<id>[0-9]+)/$', views.ReportView.as_view(), name='report_id'),

    url(r'^(?i)setpoints/$', views.SetpointView.as_view(), name='setpointview'),
    url(r'^(?i)setpoints/(?P<id>[0-9]+)/$', views.SetpointView.as_view(), name='setpointview_id'),

    url(r'^(?i)sites/$', views.SiteView.as_view(), name='siteview'),
    url(r'^(?i)sites/(?P<id>[0-9]+)/$', views.SiteView.as_view(), name='siteview_id'),

    url(r'^(?i)specifications/$', views.SpecificationView.as_view(), name='specificationview'),
    url(r'^(?i)specifications/(?P<id>[0-9]+)/$', views.SpecificationView.as_view(), name='specificationview_id'),
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html', 'xml', 'csv', 'yaml'])