from dateutil.relativedelta import relativedelta
from datetime import datetime
import pytz

from django.http import HttpResponse
from rest_framework.renderers import JSONRenderer
from rest_framework_csv.renderers import CSVRenderer
from rest_framework_yaml.renderers import YAMLRenderer

import logging

error_log = logging.getLogger('error_log')


def get_start_date(request):
    startdate = request.GET.get('startdate', None)
    if startdate is None:
        return datetime.now() - relativedelta(years=2)
    else:
        return datetime.strptime(startdate, '%m%d%y')


def get_start_timestamp(request, **kwargs):
    starttime = request.GET.get('starttime', '000000')
    startdate = request.GET.get('startdate', None)
    try:
        if startdate is None:
            return datetime.now() - relativedelta(**kwargs)
        else:
            return datetime.strptime(startdate + '-' + starttime, '%m%d%y-%H%M%S')
    except Exception as e:
        error_log.debug('message')
        return None


def get_start_date_hours(request, time):
    starttime = request.GET.get('starttime', '000000')
    startdate = request.GET.get('startdate', None)
    if startdate is None:
        return datetime.now() - relativedelta(hours=time)
    else:
        return datetime.strptime(startdate + '-' + starttime, '%m%d%y-%H%M%S')


def get_start_date_days(request, time):
    starttime = request.GET.get('starttime', '000000')
    startdate = request.GET.get('startdate', None)
    if startdate is None:
        return datetime.now() - relativedelta(days=time)
    else:
        return datetime.strptime(startdate + '-' + starttime, '%m%d%y-%H%M%S')


def get_start_date_weeks(request, time):
    starttime = request.GET.get('starttime', '000000')
    startdate = request.GET.get('startdate', None)
    if startdate is None:
        return datetime.now() - relativedelta(weeks=time)
    else:
        return datetime.strptime(startdate + '-' + starttime, '%m%d%y-%H%M%S')


def get_start_date_months(request, time):
    starttime = request.GET.get('starttime', '000000')
    startdate = request.GET.get('startdate', None)
    if startdate is None:
        return datetime.now() - relativedelta(months=time)
    else:
        return datetime.strptime(startdate + '-' + starttime, '%m%d%y-%H%M%S')


def get_start_date_years(request, time):
    starttime = request.GET.get('starttime', '000000')
    startdate = request.GET.get('startdate', None)
    if startdate is None:
        return datetime.now() - relativedelta(years=time)
    else:
        return datetime.strptime(startdate + '-' + starttime, '%m%d%y-%H%M%S')


def get_end_date(request):
    endtime = request.GET.get('endtime', '000000')
    enddate = request.GET.get('enddate', None)
    if enddate is None:
        return datetime.now()
    else:
        return datetime.strptime(enddate + '-' + endtime, '%m%d%y-%H%M%S')


def get_time(request, parameter):
    endtime = request.GET.get(parameter, '000000')
    if endtime is None:
        return '000000'
    else:
        return datetime.strptime(parameter, '%H%M%S')


def render_data(data, format, status):
    if format == 'csv':
        content = CSVRenderer().render(data)
        response = HttpResponse(content, content_type='text/csv')
        response.status_code = status
        response['content-disposition'] = 'attachment;filename=response-{}.csv' \
            .format(datetime.now().strftime('%m.%d_%H.%M'))
        return response
    elif format == 'yaml':
        return YAMLResponse(data, status=status)
    else:
        return JSONResponse(data, status=status)


class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """

    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


class YAMLResponse(HttpResponse):
    """
    An HttpResponse that renders its content into YAML.
    """

    def __init__(self, data, **kwargs):
        content = YAMLRenderer().render(data)
        kwargs['content_type'] = 'application/yaml'
        super(YAMLResponse, self).__init__(content, **kwargs)


class CSVResponse(HttpResponse):
    """
    An HttpResponse that renders its content into a CSV file.
    """

    def __init__(self, data, **kwargs):
        super(CSVResponse, self).__init__(content, **kwargs)


class HttpErrors:
    START_DATE = {'error': 'Either the start date or start time is configured incorrectly - start date must be in the'
                         ' format mmddyy, and start time HHMMSS or HHMM'}
    END_DATE = {'error': 'Either the end date or end time is configured incorrectly - end date must be in the'
                         ' format mmddyy, and end time HHMMSS or HHMM'}
    DATE_ORDER = {'error': 'The start date must be before than the end date'}
    HTTP_VERB = {'error': 'This HTTP verb is not supported'}
    DATABASE = {'error': 'There was an error retrieving data from the database'}
    UNKNOWN = {'error': 'There was an error processing the request - please contact the administrator'}


class ParsedDate:
    start = None
    end = None
    diff = None
    valid = False
    start_valid = False
    end_valid = False
    error = ''
    error_codes = HttpErrors()

    def to_utc(self, date):
        """
        Convert the timezone aware EST datetime object into its
        equivalent utc string
        """
        fmt = '%Y-%m-%dT%H:%M:%S'
        start = datetime.strptime(date.strftime(fmt), fmt)
        eastern = pytz.timezone('America/New_York')
        utc = pytz.utc
        return eastern.localize(start).astimezone(utc).strftime(fmt)

    def start_utc(self):
        """
        Convert objects start time to a utc string
        """
        return self.to_utc(self.start)

    def end_utc(self):
        """
        Convert objects end time to a utc string
        """
        return self.to_utc(self.end)

    @staticmethod
    def check_time(time):
        if len(time) == 4:
            time += '00'
        if len(time) != 6:
            raise ValueError('Start and Stop times must be 6 digits (HHMMSS)')
        return time

    def __init__(self, request, tz=None, **kwargs):
        time = request.GET.get('starttime', '000000')
        date = request.GET.get('startdate', None)
        time_end = request.GET.get('endtime', '000000')
        date_end = request.GET.get('enddate', None)
        local = pytz.timezone('America/New_York')

        try:
            time = self.check_time(time)
            if date is None:
                self.start = local.localize(datetime.now() - relativedelta(**kwargs), is_dst=None)
            else:
                self.start = local.localize(datetime.strptime(date + '-' + time, '%m%d%y-%H%M%S'), is_dst=None)
            self.start_valid = True
        except:
            self.error = self.error_codes.START_DATE

        try:
            time_end = self.check_time(time_end)
            if date_end is None:
                self.end = local.localize(datetime.now(), is_dst=None)
            else:
                self.end = local.localize(datetime.strptime(date_end + '-' + time_end, '%m%d%y-%H%M%S'), is_dst=None)
            self.end_valid = True
        except:
            self.error = self.error_codes.END_DATE

        self.valid = True if self.start_valid and self.end_valid else False
        if self.valid:
            if self.start > self.end:
                self.error = self.error_codes.DATE_ORDER
                self.valid = False
            else:
                self.diff = self.end - self.start
    def __str__(self):
        return 'start: {}, end: {}, valid: {}, diff: {}, error: {}' \
            .format(self.start, self.end, self.valid, self.diff, self.error)


def get_url_boolean(param):
    """
    Parse an input parameter to see if it is "truthy" - return an
    explicit boolean to represent this value
    :param param: input to check if it is truthy
    :return:
    """
    true_values = ['true', '1']
    false_values = ['false', '0']
    if param is not None and str(param).lower() in true_values:
        active = True
    elif param is not None and str(param).lower() in false_values:
        active = False
    else:
        active = None
    return active