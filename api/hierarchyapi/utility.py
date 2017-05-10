from dateutil.relativedelta import relativedelta
from datetime import datetime
import pytz

from django.http import HttpResponse


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
        if not request:
            return
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


def convert_to_list(data):
    if data is None:
        raise TypeError('The input to this method is expecting a non None value')
    elif not isinstance(data, list):
        data = [data]
    return data