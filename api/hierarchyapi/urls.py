from django.conf import settings
from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^hierarchy/api/admin/', admin.site.urls),
    url(r'^(?i)hierarchy/api/', include('hierarchy.urls')),
]

# for demo app
if 'sample' in settings.INSTALLED_APPS:
    urlpatterns += url(r'^(?i)hierarchy/api/sample/', include('sample.urls')),
