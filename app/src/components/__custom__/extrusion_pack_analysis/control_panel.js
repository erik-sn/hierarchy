
import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { fromJS, is } from 'immutable';
import moment from 'moment';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import StopIcon from 'material-ui/svg-icons/av/stop';

import logError from '../__library__/logger';
import types from '../../../actions/types';
import DateRange from '../../utility/date_range';
import Loader from '../../loader';
import { getApiConfig } from '../../../utils/network';


const DFMT = 'MMDDYY'; // API date format

class ControlPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      optionsFetched: false,
      fetchingData: false,
      axiosSource: undefined,
      plot: 1,
      sort: '',
      age_lte: '',
      age_gte: '',
      minCount: 3,
      spinnerettenumber: '',
      spinnerettetype: '',
      machine: '',
      position: '',
      threadline: '',
      startDate: moment().subtract(12, 'week'),
      endDate: moment(),
      messageShow: false,
      messageText: '',
    };
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.updateDates = this.updateDates.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.cancelFetchData = this.cancelFetchData.bind(this);
    this.clearOptionFields = this.clearOptionFields.bind(this);
    this.handleUpdateAge = this.handleUpdateAge.bind(this);

    // define default properties for date range component
    this.dateRangeProps = {
      defaultStartDate: this.state.startDate,
      defaultEndDate: this.state.endDate,
      updateParent: this.updateDates,
      containerClass: 'pack_analysis__control-panel-date_range',
      innerContainerClass: 'pack_analysis__control-panel-date_range-picker-container',
      datePickerClass: 'pack_analysis__control-panel-date_range-picker',
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.state), fromJS(nextState));
  }

  getUserPrompt() {
    const { site, optionsFetched } = this.state;
    if (!site) {
      return <h5>Select Site</h5>;
    }
    if (!optionsFetched) {
      return <div><Loader style={{ alignContent: 'center', height: '225px' }} size={75} thickness={5} /></div>;
    }
    return undefined;
  }

  fetchData() {
    const { startDate, endDate } = this.state;
    const base = `${types.MAP}/packanalysis/packs/`;
    const dateParams = `?startdate=${startDate.format(DFMT)}&enddate=${endDate.format(DFMT)}`;
    const params = dateParams + this.buildUrlParameters();
    const { config, axiosSource } = getApiConfig();

    this.setState({ fetchingData: true, axiosSource }, () => {
      axios.get(base + params, config)
      .then((response) => {
        this.setState({ fetchingData: false }, () => this.updateParent(fromJS(response.data)));
      })
      .catch((error) => {
        let messageText = 'Error retrieving report data';
        if (axios.isCancel(error)) {
          messageText = 'Query canceled by user';
        }
        this.setState({ messageText, fetchingData: false, fetchingmessageShow: true });
        logError(error);
      });
    });
  }

  updateParent(data) {
    const { plot, minCount } = this.state;
    if ([6, 7].indexOf(plot) > -1) {
      this.props.updateData(plot, data, minCount);
    } else {
      this.props.updateData(plot, data, -1);
    }
  }

  cancelFetchData() {
    this.state.axiosSource.cancel('canceled by user');
  }

  buildUrlParameters() {
    const params = ['spinnerettenumber', 'spinnerettetype', 'line', 'position', 'threadline', 'age_lte', 'age_gte'];
    return params.reduce((string, param) => (
      string + this.generateUrlParam(param)
    ), '');
  }

  generateUrlParam(key) {
    const value = this.state[key];
    if (value) {
      return `&${key}=${value}`;
    }
    return '';
  }

  clearOptionFields() {
    this.setState({
      spinnerettenumber: '',
      spinnerettetype: '',
      line: '',
      position: '',
      threadline: '',
      age_gte: '',
      age_lte: '',
    });
  }

  updateDates(startDate, endDate) {
    this.setState({ startDate, endDate });
  }

  handleMessageClose() {
    this.setState({ messageShow: false });
  }

  handleUpdateAge(param, value) {
    if (value === '' || value === 0 || parseInt(value, 10)) {
      const newState = fromJS(this.state);
      newState[param] = value;
      this.setState(newState);
    }
  }

  render() {
    return (
      <div className="pack_analysis__control-panel-container-outer">
        <div className="pack_analysis__control-panel-container">
          <SelectField
            className="pack_analysis__control-panel-select"
            value={this.state.plot}
            onChange={(event, index, plot) => this.setState({ plot })}
            underlineStyle={{ bottom: '4px' }}
            labelStyle={{ color: '#FFF' }}
          >
            <MenuItem value={1} label="Changes Over Time" primaryText="Changes Over Time" />
            <MenuItem value={2} label="Pareto By Machine" primaryText="Pareto By machine" />
            <MenuItem value={3} label="Pareto By Spinnerette" primaryText="Pareto By Spinnerette" />
            <MenuItem value={4} label="Pack Life By Machine" primaryText="Pack Life By Machine" />
            <MenuItem value={5} label="Pack Life By Spinnerette" primaryText="Pack Life By Machine" />
            <MenuItem value={6} label="Worst Packs" primaryText="Worst Packs" />
            <MenuItem value={7} label="Best Packs" primaryText="Best Packs" />
          </SelectField>
          <TextField
            className="pack_analysis__control-panel-textfield"
            hintText="Minimum Age (Days)"
            hintStyle={{ color: '#999', fontStyle: 'italic', fontSize: '0.8rem' }}
            value={this.state.age_gte}
            onChange={(e, age) => this.handleUpdateAge('age_gte', age)}
          />
          <TextField
            className="pack_analysis__control-panel-textfield"
            hintText="Maximum Age (Days)"
            hintStyle={{ color: '#999', fontStyle: 'italic', fontSize: '0.8rem' }}
            value={this.state.age_lte}
            onChange={(e, age) => this.handleUpdateAge('age_lte', age)}
          />
          <TextField
            className="pack_analysis__control-panel-textfield"
            hintText="Spinnerette Number"
            hintStyle={{ color: '#999', fontStyle: 'italic', fontSize: '0.8rem' }}
            value={this.state.spinnerettenumber}
            onChange={(e, spinnerettenumber) => this.setState({ spinnerettenumber })}
          />
          {[6, 7].indexOf(this.state.plot) > -1 ?
            <TextField
              className="pack_analysis__control-panel-textfield"
              hintText="Minimum Count"
              hintStyle={{ color: '#999', fontStyle: 'italic', fontSize: '0.8rem' }}
              value={this.state.minCount}
              onChange={(e, minCount) => this.setState({ minCount })}
            /> : undefined}
          <SelectField
            className="pack_analysis__control-panel-select"
            value={this.state.spinnerettetype}
            hintText="Spinnerette Type"
            hintStyle={{ color: '#999', fontStyle: 'italic', fontSize: '0.8rem' }}
            onChange={(event, index, spinnerettetype) => this.setState({ spinnerettetype })}
            underlineStyle={{ bottom: '4px' }}
            labelStyle={{ color: '#FFF' }}
          >
            <MenuItem value={''} label="" primaryText="" />
            <MenuItem value={'57'} label="57Y" primaryText="57Y" />
            <MenuItem value={'69'} label="69Y" primaryText="69Y" />
            <MenuItem value={'81'} label="81Y" primaryText="81Y" />
            <MenuItem value={'132'} label="132Y" primaryText="132Y" />
            <MenuItem value={'150'} label="150Y" primaryText="150Y" />
            <MenuItem value={'264'} label="264Y" primaryText="264Y" />
            <MenuItem value={'342'} label="342Y" primaryText="342Y" />
            <MenuItem value={'450'} label="450Y" primaryText="450Y" />
          </SelectField>
          <SelectField
            className="pack_analysis__control-panel-select"
            value={this.state.line}
            hintText="Line"
            hintStyle={{ color: '#999', fontStyle: 'italic', fontSize: '0.8rem' }}
            onChange={(event, index, line) => this.setState({ line })}
            underlineStyle={{ bottom: '4px' }}
            labelStyle={{ color: '#FFF' }}
          >
            <MenuItem value={''} label="" primaryText="" />
            <MenuItem value={'11'} label="OX11" primaryText="OX11" />
            <MenuItem value={'12'} label="OX12" primaryText="OX12" />
            <MenuItem value={'13'} label="OX13" primaryText="OX13" />
            <MenuItem value={'14'} label="OX14" primaryText="OX14" />
            <MenuItem value={'15'} label="OX15" primaryText="OX15" />
            <MenuItem value={'16'} label="OX16" primaryText="OX16" />
            <MenuItem value={'17'} label="OX17" primaryText="OX17" />
            <MenuItem value={'18'} label="OX18" primaryText="OX18" />
            <MenuItem value={'19'} label="OX19" primaryText="OX19" />
            <MenuItem value={'20'} label="OX20" primaryText="OX20" />
            <MenuItem value={'21'} label="OX21" primaryText="OX21" />
            <MenuItem value={'22'} label="OX22" primaryText="OX22" />
            <MenuItem value={'23'} label="OX23" primaryText="OX23" />
            <MenuItem value={'24'} label="OX24" primaryText="OX24" />
            <MenuItem value={'25'} label="OX25" primaryText="OX25" />
            <MenuItem value={'26'} label="OX26" primaryText="OX26" />
          </SelectField>
          <SelectField
            className="pack_analysis__control-panel-select"
            value={this.state.position}
            hintText="Position"
            hintStyle={{ color: '#999', fontStyle: 'italic', fontSize: '0.8rem' }}
            onChange={(event, index, position) => this.setState({ position })}
            underlineStyle={{ bottom: '4px' }}
            labelStyle={{ color: '#FFF' }}
          >
            <MenuItem value={''} label="" primaryText="" />
            <MenuItem value={'1'} label="1" primaryText="1" />
            <MenuItem value={'2'} label="2" primaryText="2" />
            <MenuItem value={'3'} label="3" primaryText="3" />
            <MenuItem value={'4'} label="4" primaryText="4" />
            <MenuItem value={'5'} label="5" primaryText="5" />
            <MenuItem value={'6'} label="6" primaryText="6" />
            <MenuItem value={'7'} label="7" primaryText="7" />
            <MenuItem value={'8'} label="8" primaryText="8" />
          </SelectField>
          <SelectField
            className="pack_analysis__control-panel-select"
            value={this.state.threadline}
            hintText="Threadline"
            hintStyle={{ color: '#999', fontStyle: 'italic', fontSize: '0.8rem' }}
            onChange={(event, index, threadline) => this.setState({ threadline })}
            underlineStyle={{ bottom: '4px' }}
            labelStyle={{ color: '#FFF' }}
          >
            <MenuItem value={''} label="" primaryText="" />
            <MenuItem value={'L'} label="L" primaryText="L" />
            <MenuItem value={'M'} label="M" primaryText="M" />
            <MenuItem value={'R'} label="R" primaryText="R" />
          </SelectField>
          <DateRange {...this.dateRangeProps} />
          <div className="pack_analysis__control_panel-actions">
            {!this.state.fetchingData ?
              <FlatButton
                onClick={this.fetchData}
                label="Search"
                labelPosition="before"
                icon={<SearchIcon />}
              /> :
                <FlatButton
                  onClick={this.cancelFetchData}
                  label="Stop"
                  labelPosition="before"
                  icon={<StopIcon />}
                />
            }
            <FlatButton
              onClick={this.clearOptionFields}
              label="Clear"
              labelPosition="before"
              icon={<ClearIcon />}
            />
          </div>
        </div>
      </div>
    );
  }

}

ControlPanel.propTypes = {
  updateData: PropTypes.func.isRequired,
};

export default ControlPanel;
