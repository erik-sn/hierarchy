import DatePicker from 'material-ui/DatePicker';
import Snackbar from 'material-ui/Snackbar';
import * as moment from 'moment';
import * as React from 'react';

export interface IDateRangeProps {
  defaultStartDate: moment.Moment;
  defaultEndDate: moment.Moment;
  containerClass?: string;
  innerContainerClass?: string;
  datePickerClass?: string;
  updateParent: (startDate: moment.Moment, endDate: moment.Moment) => any;
}

export interface IDateRangeState {
  startDate: moment.Moment;
  endDate: moment.Moment;
  messageText: string;
  messageShow: boolean;
}

class DateRange extends React.Component<IDateRangeProps, IDateRangeState> {

  constructor(props: IDateRangeProps) {
    super(props);
    this.state = {
      startDate: props.defaultStartDate,
      endDate: props.defaultEndDate,
      messageText: '',
      messageShow: false,
    };
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }

  public handleStartDateChange(event: any, date: Date): void {
    const { endDate } = this.state;
    const startDate = moment(date);
    this.setState({
      startDate,
      endDate,
      messageShow: false,
      messageText: '',
    }, this.props.updateParent(startDate, endDate));
  }

  public handleEndDateChange(event: any, date: Date): void {
    const { startDate } = this.state;
    const endDate = moment(date);
    this.setState({
      startDate,
      endDate,
      messageShow: false,
      messageText: '',
    }, this.props.updateParent(startDate, endDate));
  }

  public handleMessageClose(): void {
    this.setState({ messageShow: false });
  }

  public render() {
    const { containerClass, innerContainerClass, datePickerClass } = this.props;
    const { startDate, endDate, messageShow, messageText } = this.state;
    return (
      <div className={`date_range__container ${containerClass || ''}`.trim()} >
        <div className={`date_range__date-pickers ${innerContainerClass || ''}`.trim()}>
          <DatePicker
            key={1}
            name="date_range__start-date"
            className={`date_range__date-picker ${datePickerClass || ''}`.trim()}
            value={startDate.toDate()}
            onChange={this.handleStartDateChange}
            firstDayOfWeek={0}
            autoOk
          />
          <DatePicker
            key={2}
            name="date_range__end-date"
            className={`date_range__date-picker ${datePickerClass || ''}`.trim()}
            value={endDate.toDate()}
            onChange={this.handleEndDateChange}
            firstDayOfWeek={0}
            autoOk
          />
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
