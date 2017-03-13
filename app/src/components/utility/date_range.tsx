import DatePicker from 'material-ui/DatePicker';
import Snackbar from 'material-ui/Snackbar';
import TimePicker from 'material-ui/TimePicker';
import * as moment from 'moment';
import * as React from 'react';

export interface IDateRangeProps {
  defaultStartDate: moment.Moment;
  defaultEndDate: moment.Moment;
  containerClass?: string;
  innerContainerClass?: string;
  datePickerClass?: string;
  showTime?: boolean;
  disableStart?: boolean;
  disableEnd?: boolean;
  updateParent: (startDate: moment.Moment, endDate: moment.Moment) => any;
}

export interface IDateRangeState {
  startDate: moment.Moment;
  startTime: moment.Moment;
  endDate: moment.Moment;
  endTime: moment.Moment;
  messageText: string;
  messageShow: boolean;
}

class DateRange extends React.Component<IDateRangeProps, IDateRangeState> {

  constructor(props: IDateRangeProps) {
    super(props);
    this.state = {
      startDate: props.defaultStartDate,
      startTime: undefined,
      endDate: props.defaultEndDate,
      endTime: undefined,
      messageText: '',
      messageShow: false,
    };
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }

  public handleStartDateChange(event: any, date: Date): void {
    const { startTime, endDate, endTime } = this.state;
    const startDate = moment(date);
    this.setState({
      startDate,
      endDate,
      messageShow: false,
      messageText: '',
    }, this.props.updateParent(startDate, endDate));
  }

  public handleStartTimeChange(event: any, date: Date): void {
    const { startDate, endDate, endTime } = this.state;
    const startTimeString = moment(date).format('HH:MM:SS');
    const startDateString = startDate.format('YYYY-MM-DD');
    this.setState({
      startDate: moment(`${startDateString}T${startTimeString}`),
      endDate,
      messageShow: false,
      messageText: '',
    }, this.props.updateParent(startDate, endDate));
  }

  public handleEndDateChange(event: any, date: Date): void {
    const { startDate, startTime, endTime } = this.state;
    const endDate = moment(date);
    this.setState({
      startDate,
      endDate,
      messageShow: false,
      messageText: '',
    }, this.props.updateParent(startDate, endDate));
  }

  public handleEndTimeChange(event: any, date: Date): void {
    const { startDate, startTime, endDate } = this.state;
    const endTimeString = moment(date).format('HH:MM:SS');
    const endDateString = endDate.format('YYYY-MM-DD');
    this.setState({
      startDate,
      endDate: moment(`${endDateString}T${endTimeString}`),
      messageShow: false,
      messageText: '',
    }, this.props.updateParent(startDate, endDate));
  }

  public handleMessageClose(): void {
    this.setState({ messageShow: false });
  }

  public render() {
    const { containerClass, innerContainerClass, datePickerClass,
      showTime, disableStart, disableEnd } = this.props;
    const { startDate, endDate, messageShow, messageText } = this.state;
    return (
      <div className={`date_range__container ${containerClass || ''}`.trim()} >
        <div className={`date_range__date-pickers ${innerContainerClass || ''}`.trim()}>
          {!disableStart ? <DatePicker
            key={1}
            name="date_range__start-date"
            className={`date_range__date-picker ${datePickerClass || ''}`.trim()}
            value={startDate.toDate()}
            onChange={this.handleStartDateChange}
            firstDayOfWeek={0}
            autoOk
          /> : undefined}
          {showTime ?
            <TimePicker
              format="24hr"
              hintText="24hr Format"
              value={startDate.toDate()}
              onChange={this.handleStartTimeChange}
            /> : undefined}
          {!disableEnd ? <DatePicker
            key={2}
            name="date_range__end-date"
            className={`date_range__date-picker ${datePickerClass || ''}`.trim()}
            value={endDate.toDate()}
            onChange={this.handleEndDateChange}
            firstDayOfWeek={0}
            autoOk
          /> : undefined}
          {showTime ?
            <TimePicker
              format="24hr"
              hintText="24hr Format"
              value={endDate.toDate()}
              onChange={this.handleEndTimeChange}
            /> : undefined}
        </div>
        <Snackbar
          className="date_range__snackbar"
          style={{ marginBottom: '15px' }}
          open={messageShow}
          message={messageText}
          action="Ok"
          autoHideDuration={10000}
          onActionTouchTap={this.handleMessageClose}
          onRequestClose={this.handleMessageClose}
        />
      </div>
    );
  }
}

export default DateRange;
