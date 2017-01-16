import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import Snackbar from 'material-ui/Snackbar';

class DateRange extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startDate: props.defaultStartDate,
      endDate: props.defaultEndDate,
      messageShow: false,
      messageText: '',
    };
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }

  handleStartDateChange(event, date) {
    const { endDate } = this.state;
    const startDate = moment(date);
    this.checkStartEndDate(startDate, endDate);
  }

  handleEndDateChange(event, date) {
    const { startDate } = this.state;
    const endDate = moment(date);
    this.checkStartEndDate(startDate, endDate);
  }

  checkStartEndDate(startDate, endDate) {
    if (startDate > endDate) {
      this.setState({
        messageShow: true,
        messageText: 'The start date must be before the end date',
      });
    } else {
      this.setState({
        startDate,
        endDate,
        messageShow: false,
        messageText: '',
      }, this.props.updateParent(startDate, endDate));
    }
  }

  handleMessageClose() {
    this.setState({ messageShow: false });
  }

  render() {
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

DateRange.propTypes = {
  defaultStartDate: PropTypes.object.isRequired,
  defaultEndDate: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
  containerClass: PropTypes.string,
  innerContainerClass: PropTypes.string,
  datePickerClass: PropTypes.string,
};

export default DateRange;
