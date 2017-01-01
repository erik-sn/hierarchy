
import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { fromJS, is } from 'immutable';
import moment from 'moment';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/FlatButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import StopIcon from 'material-ui/svg-icons/av/stop';

import types from '../../../actions/types';
import DateRange from '../../utility/date_range';
import Loader from '../../loader';
import { getApiConfig } from '../../../utils/network';


const autoCompleteSearch = (searchText, key) => (
  key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
);

const DFMT = 'MMDDYY'; // API date format

class ControlPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      warehouseList: undefined,
      options: {
        machine: [null],
        yarnid: [null],
        shift: [null],
      },
      optionsFetched: false,
      fetchingData: false,
      axiosSource: undefined,
      warehouse: undefined,
      group: '',
      machine: undefined,
      shift: undefined,
      yarnid: undefined,
      startDate: moment().subtract(4, 'week'),
      endDate: moment(),
      messageShow: false,
    };
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.updateDates = this.updateDates.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.cancelFetchData = this.cancelFetchData.bind(this);
    this.clearOptionFields = this.clearOptionFields.bind(this);

    // define default properties for date range component
    this.dateRangeProps = {
      defaultStartDate: this.state.startDate,
      defaultEndDate: this.state.endDate,
      updateParent: this.updateDates,
      containerClass: 'ewa__control-panel-date_range',
      innerContainerClass: 'ewa__control-panel-date_range-picker-container',
      datePickerClass: 'ewa__control-panel-date_range-picker',
    };
  }

  componentDidMount() {
    this.restoreStoredWarehouse();
    this.fetchWarehouses();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.state), fromJS(nextState));
  }

  getUserPrompt() {
    const { warehouse, optionsFetched } = this.state;
    if (!warehouse) {
      return <h5>Select Warehouse</h5>;
    }
    if (!optionsFetched) {
      return <div><Loader style={{ alignContent: 'center', height: '225px' }} size={75} thickness={5} /></div>;
    }
    return undefined;
  }

  restoreStoredWarehouse() {
    const storedWarehouse = JSON.parse(localStorage.getItem('pw__ewa__control-panel-waste_analysis__warehouse'));
    if (storedWarehouse) {
      const warehouseList = [storedWarehouse];
      this.setState({
        warehouse: storedWarehouse,
        warehouseList,
      }, () => this.fetchOptions());
    }
  }

  fetchWarehouses() {
    axios.get(`${types.MAP}/as400/yap100/warehouses`)
    .then(response => this.setState({
      warehouseList: response.data,
      messageShow: false,
    }))
    .catch((error) => {
      this.setState({
        messageText: 'Error retrieving warehouse list',
        messageShow: true,
      });
      console.error(error);
    });
  }

  fetchOptions() {
    axios.get(`${types.MAP}/as400/yap100report/${this.state.warehouse}/?params=true`)
    .then(response => this.setState({
      options: response.data,
      optionsFetched: true,
      messageShow: false,
    }))
    .then(() => this.clearOptionFields())
    .catch((error) => {
      this.setState({
        optionsFetched: false,
        messageText: 'Error retrieving report options',
        messageShow: true,
      });
      console.error(error);
    });
  }

  fetchData() {
    const { warehouse, startDate, endDate } = this.state;
    const base = `${types.MAP}/as400/yap100report/${warehouse}/`;
    const dateParams = `?startdate=${startDate.format(DFMT)}&enddate=${endDate.format(DFMT)}`;
    const params = dateParams + this.buildUrlParameters();
    const { config, axiosSource } = getApiConfig();

    this.setState({ fetchingData: true, axiosSource }, () => {
      axios.get(base + params, config)
      .then((response) => {
        this.setState({ fetchingData: false }, () => this.props.updateData(fromJS(response.data)));
      })
      .catch((error) => {
        let messageText = 'Error retrieving report data';
        if (axios.isCancel(error)) {
          messageText = 'Query canceled by user';
        }
        this.setState({ messageText, fetchingData: false, fetchingmessageShow: true });
        console.error(error);
      });
    });
  }

  cancelFetchData() {
    this.state.axiosSource.cancel('canceled by user');
  }

  buildUrlParameters() {
    return ['group', 'machine', 'shift', 'yarnid'].reduce((string, param) => (
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
      machine: '',
      shift: '',
      yarnid: '',
    });
  }

  handleGroupChange(event, index, group) {
    this.setState({ group });
  }

  handleUpdateInput(key, text) {
    const updatedState = fromJS(this.state).toJS();
    updatedState[key] = text;
    this.setState(updatedState);
  }

  updateDates(startDate, endDate) {
    this.setState({ startDate, endDate });
  }

  handleMessageClose() {
    this.setState({ messageShow: false });
  }

  render() {
    const { warehouse, warehouseList, options, optionsFetched } = this.state;
    const { machine, shift, yarnid } = options;
    if (!warehouseList) {
      return <Loader style={{ height: '400px' }} size={75} thickness={5} />;
    }

    if (!warehouse || !optionsFetched) {
      return (
        <div className="ewa__control-panel-container">
          <AutoComplete
            className="ewa__control-panel-autocomplete"
            hintText="Warehouse"
            searchText={this.state.warehouse}
            onUpdateInput={text => this.handleUpdateInput('warehouse', text)}
            onNewRequest={text => this.handleUpdateInput('warehouse', text)}
            dataSource={warehouseList}
            filter={autoCompleteSearch}
            openOnFocus
          />
          {this.getUserPrompt()}
        </div>
      );
    }

    return (
      <div className="ewa__control-panel-container">
        <AutoComplete
          className="ewa__control-panel-autocomplete"
          hintText="Warehouse"
          searchText={this.state.warehouse}
          onUpdateInput={text => this.handleUpdateInput('warehouse', text)}
          onNewRequest={text => this.handleUpdateInput('warehouse', text)}
          dataSource={warehouseList}
          filter={autoCompleteSearch}
          openOnFocus
        />
        <SelectField
          className="ewa__control-panel_groups"
          value={this.state.group}
          onChange={this.handleGroupChange}
          underlineStyle={{ bottom: '4px' }}
          labelStyle={{ color: '#FFF' }}
        >
          <MenuItem value={''} label="Group: Date & Shift" primaryText="Date & Shift" />
          <MenuItem value={'day'} label="Group: Date" primaryText="Date" />
          <MenuItem value={'machine'} label="Group: Machine" primaryText="Machine" />
          <MenuItem value={'yarnid'} label="Group: Yarn ID" primaryText="Yarn ID" />
          <MenuItem value={'shift'} label="Group: Shift" primaryText="Shift" />
        </SelectField>
        <div className="ewa__control-panel-options-container">
          <AutoComplete
            className="ewa__control-panel-autocomplete"
            hintText="Machine"
            searchText={this.state.machine}
            onUpdateInput={text => this.handleUpdateInput('machine', text)}
            onNewRequest={text => this.handleUpdateInput('machine', text)}
            dataSource={machine}
            filter={autoCompleteSearch}
            openOnFocus
          />
          <AutoComplete
            className="ewa__control-panel-autocomplete"
            hintText="Shift"
            searchText={this.state.shift}
            onUpdateInput={text => this.handleUpdateInput('shift', text)}
            onNewRequest={text => this.handleUpdateInput('shift', text)}
            dataSource={shift}
            filter={autoCompleteSearch}
            openOnFocus
          />
          <AutoComplete
            className="ewa__control-panel-autocomplete"
            hintText="Yarn ID"
            searchText={this.state.yarnid}
            onUpdateInput={text => this.handleUpdateInput('yarnid', text)}
            onNewRequest={text => this.handleUpdateInput('yarnid', text)}
            dataSource={yarnid}
            filter={autoCompleteSearch}
            openOnFocus
          />
        </div>
        <DateRange {...this.dateRangeProps} />
        <div className="ewa__control_panel-actions">
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

ControlPanel.propTypes = {
  updateData: PropTypes.func.isRequired,
};

export default ControlPanel;
