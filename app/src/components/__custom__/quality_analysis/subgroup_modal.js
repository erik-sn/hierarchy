import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import moment from 'moment';
import { fromJS } from 'immutable';

import Modal from '../../modal';
import types from '../../../actions/types';
import TestSelect from './subgroup_test_select';
import ControlChart from './quality_control_chart';
import DateRange from '../../utility/date_range';
import { getTargetLimit } from './utils';


class SubgroupModal extends Component {

  constructor(props) {
    super(props);
    this.defaultStartDate = moment().subtract(1, 'months');
    this.defaultEndDate = moment();
    this.state = {
      startDate: this.defaultStartDate,
      endDate: this.defaultEndDate,
      activeTest: props.defaultTest,
      activeTestData: undefined,
      fetchingTestData: false,
    };
    this.handleSetActiveTest = this.handleSetActiveTest.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.updateDateRange = this.updateDateRange.bind(this);
  }

  componentDidMount() {
    this.fetchControlChartData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultTest !== this.props.defaultTest) {
      this.setState({ activeTest: nextProps.defaultTest }, () => {
        this.fetchControlChartData();
      });
    }
  }

  getControlChartUrl() {
    const { machine, subgroup } = this.props;
    const { activeTest, startDate, endDate } = this.state;
    const params = `?process=${machine}&part=${subgroup.get('part')}&test=${activeTest}`;
    const dateParams = `&startdate=${startDate.format('MMDDYY')}&enddate=${endDate.format('MMDDYY')}`;
    return `${types.MAP}/infinity/subgroups${params + dateParams}`;
  }

  fetchControlChartData() {
    if (!this.state.activeTest) {
      return;
    }
    this.setState({ fetchingTestData: true });
    axios.get(this.getControlChartUrl(), types.API_CONFIG)
    .then((response) => {
      this.setState({
        activeTestData: fromJS(response.data),
        fetchingTestData: false,
      });
    })
    .catch((error) => {
      this.setState({ fetchingTestData: false }, () => {
        this.props.showError('There was an error retrieving subroup data from Infinity');
      });
      throw error;
    });
  }

  handleSetActiveTest(event, indext, testName) {
    this.setState({ activeTest: testName }, () => this.fetchControlChartData());
  }

  handleModalClose() {
    this.setState({
      activeTest: null,
      activeTestData: undefined,
      fetchControlChartData: false,
      startDate: this.defaultStartDate,
      endDate: this.defaultEndDate,
    }, () => this.props.handleClose());
  }

  updateDateRange(startDate, endDate) {
    this.setState({ startDate, endDate }, () => this.fetchControlChartData());
  }

  render() {
    const { subgroup, showModal, limits, machine } = this.props;
    const { activeTest, activeTestData, fetchingTestData, startDate, endDate } = this.state;
    if (!showModal) {
      return <div />;
    }
    const limit = getTargetLimit(subgroup, activeTest, limits);

    return (
      <Modal
        onSubmit={this.handleModalClose}
        title={`${machine} - ${subgroup.get('part')} - ${subgroup.get('lot')}`}
        contentClass="quality_analysis__modal-content"
        classname="quality_analysis__modal"
      >
        <div className="quality_analysis__modal-container">
          <DateRange
            defaultStartDate={startDate}
            defaultEndDate={endDate}
            updateParent={this.updateDateRange}
          />
          <TestSelect test={activeTest} setActiveTest={this.handleSetActiveTest} />
          <ControlChart limit={limit} fetchingTestData={fetchingTestData} testData={activeTestData} />
        </div>
      </Modal>
    );
  }
}

SubgroupModal.propTypes = {
  subgroup: PropTypes.object,
  handleClose: PropTypes.func,
  defaultTest: PropTypes.string,
  limits: PropTypes.object.isRequired,
  machine: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  showError: PropTypes.func.isRequired,
};

export default SubgroupModal;
