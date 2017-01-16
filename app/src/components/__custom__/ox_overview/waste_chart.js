import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import moment from 'moment';
import { is, fromJS, List } from 'immutable';
import DatePicker from 'material-ui/DatePicker';
import Snackbar from 'material-ui/Snackbar';

import AreaChart from '../../charts/area_chart';
import Loader from '../../loader';
import types from '../../../actions/types';

const cFormat = 'YYYY-MM-DD'; // date comparison format

class WasteChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startDate: moment().subtract(3, 'week'),
      endDate: moment(),
      wasteData: List([]),
      loading: true,
      messageShow: false,
      messageText: '',
      error: '',
    };
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }

  componentDidMount() {
    this.fetchWasteData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.state), fromJS(nextState));
  }

  componentWillUpdate(nextProps, nextState) {
    const { startDate, endDate } = this.state;
    if (startDate.format(cFormat) !== nextState.startDate.format(cFormat) ||
        endDate.format(cFormat) !== nextState.endDate.format(cFormat)) {
      this.setState({ loading: true }, () => this.fetchWasteData());
    }
  }

  fetchWasteData() {
    const { parent, department } = this.props;
    const { startDate, endDate } = this.state;
    const dateParam = `?startdate=${startDate.format('MMDDYY')}&enddate=${endDate.format('MMDDYY')}`;
    const params = department ? dateParam : `${dateParam}&machine=${parent.get('name')}`;
    axios.get(`${types.MAP}/as400/yap100report/ox1/${params}`, types.API_CONFIG)
    .then(response => this.setState({
      wasteData: fromJS(response.data),
      loading: false,
      error: '',
    }))
    .catch((error) => {
      this.setState({
        wasteData: List(),
        loading: false,
        error: 'There was an error loading the waste data',
      });
      throw error;
    });
  }

  generateLabel(shift) {
    const month = shift.get('label').substring(5, 7);
    const day = shift.get('label').substring(8, 10);
    return `${month}/${day}-${shift.get('shift')}`;
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
      });
    }
  }

  handleMessageClose() {
    this.setState({ messageShow: false });
  }

  render() {
    const { wasteData, error, loading, messageShow, messageText } = this.state;
    if (error) {
      return (
        <div className="chart__container ox_overview__waste-chart-error">
          <h4>{error}</h4>
        </div>
      );
    }
    if (loading) {
      return (
        <div className="chart__container ox_overview__waste-chart-loader">
          <Loader style={{ height: '400px' }} size={75} thickness={5} />
        </div>
      );
    }
// 73BBD0
    // ignore entries with no production, this is a clerical error in AS400
    const wasteDataProcessed = wasteData.filter(shift => shift.get('productionPounds') > 0)
    .map(shift => ({
      date: this.generateLabel(shift),
      value: shift.get('wastePercent'),
    }));

    return (
      <div className="ox_overview__waste-chart">
        <AreaChart
          xAxis="date"
          data={wasteDataProcessed.toJS()}
          lines={[{ strokeWidth: 2, type: 'linear', dot: false, dataKey: 'value', fill: '#73BBD0', stroke: 'whitesmoke', isAnimationActive: false }]}
          fill="#59A1B6"
          download
          image
        />
        <div className="ox_overview__waste-date-range">
          <DatePicker
            key={this.props.department ? 12 : 1}
            name="wastestartDate"
            className="ox_overview_waste-date"
            value={this.state.startDate.toDate()}
            onChange={this.handleStartDateChange}
            autoOk
          />
          <DatePicker
            key={this.props.department ? 22 : 2}
            name="wasteEndDate"
            className="ox_overview_waste-date"
            value={this.state.endDate.toDate()}
            onChange={this.handleEndDateChange}
            autoOk
          />
        </div>
        <Snackbar
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

WasteChart.propTypes = {
  department: PropTypes.bool.isRequired,
  parent: PropTypes.object.isRequired,
};

export default WasteChart;
