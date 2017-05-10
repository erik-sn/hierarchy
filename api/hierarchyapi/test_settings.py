"""
import all default settings and then over write any settings
that are specific to testing
"""
import sys

from hierarchyapi.settings import  *


if 'test' in sys.argv or 'test_coverage' in sys.argv:
    print('=============================================')
    print('In TEST Mode - Disabling Unnecessary Settings')
    print('=============================================')
    print('')
    print('')

    # use an in memory sqlite3 backend for performance
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'default',
        },
    }

    PASSWORD_HASHERS = (
        'django.contrib.auth.hashers.MD5PasswordHasher',
    )

    MIDDLEWARE = [
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.gzip.GZipMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.auth.middleware.RemoteUserMiddleware',
        'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
    ]