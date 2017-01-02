/**
 * Module Created: 2016-12-04 10:24:56 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./setpoint_analysis.scss');  // eslint-disable-line global-require
}

import React, { Component, PropTypes } from 'react';
import { fromJS, is, List, Map } from 'immutable';
import axios from 'axios';
import moment from 'moment';
import Snackbar from 'material-ui/Snackbar';

import logError from '../__library__/logger';
import types from '../../../actions/types';
import Loader from '../../loader';
import SetpointChart from '../ox_overview/setpoint_chart';
import TableDisplay from './table_display';
import SpecificationSelect from './spec_selection';
import PiModal from './pi_modal';

const setpointFilter = (input, id) => input.filter(setpoint => setpoint.get('machine') === id);

class SetpointAnalysis extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: 'offspec',
      piData: undefined,
      activeTag: undefined,
      specificationList: List(['Current']),
      historyMode: false,
      historicalSetpoints: undefined,
      activeSpec: 'Current',
      messageShow: false,
      messageText: false,
    };
    this.handleSelection = this.handleSelection.bind(this);
    this.handleSetpointClick = this.handleSetpointClick.bind(this);
    this.handlePiModalClose = this.handlePiModalClose.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.handleSpecificationSelect = this.handleSpecificationSelect.bind(this);
    this.fetchPiData = this.fetchPiData.bind(this);
  }

  componentDidMount() {
    this.fetchSpecifications();
  }


  shouldComponentUpdate(nextProps, nextState) {
    const { data } = this.props;
    const nextData = nextProps.data;
    if (!data && nextData) {
      return true;
    }
    return !is(data.get('ox_setpoints'), nextData.get('ox_setpoints')) ||
           !is(data.get('pw_machines'), nextData.get('pw_machines')) ||
           !is(fromJS(this.state), fromJS(nextState));
  }

  getMachineId() {
    const { data, parent } = this.props;
    return data.get('pw_machines').find(mch => (
      mch.get('name') === parent.get('name').substring(0, 4)
    )).get('id');
  }

  fetchSpecifications() {
    const machine = this.props.parent.get('name');
    axios.get(`${types.MAP}/processworkshop/specifications/files/${machine}/`)
    .then((response) => {
      const specificationList = fromJS(response.data).sort(this.specificationSort).insert(0, 'Current');
      this.setState({ specificationList });
    })
    .catch((error) => {
      this.setState({
        messageText: 'Error retrieving specification list',
        messageShow: true,
      });
      logError(error);
    });
  }

  fetchPiData(tag) {
    const start = moment().subtract(1, 'weeks').format('MMDDYY');
    const url = `${types.MAP}/pi/ox/data/${tag}/?startdate=${start}`;
    axios.get(url, types.API_CONFIG)
    .then(response => this.setState({ piData: fromJS(response.data), activeTag: tag }))
    .catch((error) => {
      this.setState({
        messageText: 'Error retrieving PI data',
        messageShow: true,
      });
      logError(error);
    });
  }

  fetchAnalyzedData(specification) {
    const machine = this.props.parent.get('name');
    axios.get(`${types.MAP}/processworkshop/setpoints/analyze/ox/${machine}/${specification}/`)
    .then((response) => {
      this.setState({
        activeSpec: specification,
        historyMode: true,
        historicalSetpoints: fromJS(response.data),
      });
    })
    .catch((error) => {
      this.setState({
        messageText: 'Error retrieving specification data',
        messageShow: true,
      });
      logError(error);
    });
  }

  specificationSort(a, b) {
    const aDate = moment(a.match(/\d{6}/), 'MMDDYY');
    const bDate = moment(b.match(/\d{6}/), 'MMDDYY');
    return aDate < bDate ? 1 : -1;
  }

  filterCurrentSetpoints(setpoints) {
    const machineId = this.getMachineId();
    const onspec = setpointFilter(setpoints.get('onspec'), machineId);
    const offspec = setpointFilter(setpoints.get('offspec'), machineId);
    const invalid = setpointFilter(setpoints.get('invalid'), machineId);
    return Map({ offspec, onspec, invalid });
  }

  filterHistoricalSetpoints(setpoints) {
    const onspec = setpoints.filter(setpoint => setpoint.get('onSpec') === true);
    const offspec = setpoints.filter(setpoint => setpoint.get('onSpec') === false);
    const invalid = setpoints.filter(setpoint => setpoint.get('onSpec') === null);
    return Map({ offspec, onspec, invalid });
  }

  handleSelection(entry) {
    this.setState({ selected: entry.payload.label });
  }

  handleSetpointClick(setpoint) {
    if (setpoint && setpoint.get('piTagName')) {
      this.fetchPiData(setpoint.get('piTagName'));
    }
  }

  handlePiModalClose() {
    this.setState({ piData: undefined, activeTag: undefined });
  }

  handleMessageClose() {
    this.setState({ messageShow: false });
  }

  handleSpecificationSelect(event, key, specification) {
    if (specification === 'Current') {
      this.setState({
        activeSpec: 'Current',
        historyMode: false,
        historicalSetpoints: undefined,
      });
    } else {
      this.fetchAnalyzedData(specification);
    }
  }

  render() {
    const { data } = this.props;
    const { piData, activeTag, historyMode, historicalSetpoints } = this.state;
    if (!data || !data.get('ox_setpoints') || !data.get('pw_machines')) {
      return <Loader style={{ height: '225px' }} size={75} thickness={5} />;
    }
    let setpointData = this.filterCurrentSetpoints(data.get('ox_setpoints'));
    if (historyMode) {
      setpointData = this.filterHistoricalSetpoints(historicalSetpoints);
    }
    return (
      <div className="spa__container" >
        <PiModal tag={activeTag} piData={piData} handleClose={this.handlePiModalClose} />
        <div className="spa__selection-container">
          Active Selection: <span className="spa__selection">{this.state.selected}</span>
        </div>
        <div className="spa__chart-container">
          <SetpointChart setpoints={setpointData} handleClick={this.handleSelection} />
        </div>
        <div className="spa__table-container">
          <SpecificationSelect
            activeSpec={this.state.activeSpec}
            specifications={this.state.specificationList}
            onChange={this.handleSpecificationSelect}
          />
          <TableDisplay
            setpoints={setpointData}
            selected={this.state.selected}
            handleRowClick={this.handleSetpointClick}
          />
        </div>
        <Snackbar
          className="date_range__snackbar"
          style={{ marginBottom: '15px' }}
          open={this.state.messageShow}
          message={this.state.messageText}
          action="Ok"
          autoHideDuration={10000}
          onActionTouchTap={this.handleMessageClose}
          onRequestClose={this.handleMessageClose}
        />
      </div>
    );
  }
}

SetpointAnalysis.propTypes = {
  data: PropTypes.object,
  parent: PropTypes.object.isRequired,
};

export default SetpointAnalysis;
