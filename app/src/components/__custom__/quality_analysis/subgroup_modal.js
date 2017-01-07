import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import moment from 'moment';
import { is, fromJS } from 'immutable';

import Modal from '../../modal';
import types from '../../../actions/types';
import TestSelect from './subgroup_test_select';
import { INFINITY_TESTS } from './constants';

class SubgroupModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTest: this.getActiveTest(props.config),
      activeTestData: undefined,
      messageShow: false,
      messageText: '',
    };
    this.handleSetActiveTest = this.handleSetActiveTest.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const activeTest = this.getActiveTest(nextProps.config);
    this.setState({ activeTest });
  }
  
  fetchControlChartData() {
    const { machine, subgroup } = this.props;
    const { activeTest } = this.state;
    const params = `?process=${machine}&part=${subgroup.get('part')}&test=${activeTest}}`;
    const dateParams = `&startdate=${moment().subtract(1, 'months').format('MMDDYY')}`;
    const url = `${types.MAP}/infinity/subgroups${params + dateParams}`;
    console.log(url);
    axios.get(url, types.API_CONFIG)
    .then((response) => {
      console.log(response.data);
      this.setState({ activeTestData: fromJS(response.data) });
    })
    .catch((error) => {
      this.setState({
        messageShow: true,
        messageText: 'There was an error retrieving subroup data from Infinity',
      });
      throw error;
    });
  }

  getActiveTest(config) {
    const activeTest = '';
    if (config) {
      const validTest = INFINITY_TESTS.indexOf(config.get('label')) > -1;
      return validTest ? config.get('label') : activeTest;
    }
    return activeTest;
  }

  handleSetActiveTest(event, indext, testName) {
    this.setState({ activeTest: testName });
  }

  render() {
    const { subgroup, showModal, handleClose } = this.props;
    console.log(subgroup);
    const { activeTest } = this.state;
    if (!showModal) {
      return <div />;
    }

    return (
      <Modal onSubmit={handleClose} title={`${subgroup.get('part')} - ${subgroup.get('lot')}`} >
        <TestSelect test={activeTest} setActiveTest={this.handleSetActiveTest} />
      </Modal>
    );
  }
}

SubgroupModal.propTypes = {
  config: PropTypes.object,
  subgroup: PropTypes.object,
  handleClose: PropTypes.func,
  machine: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
};

export default SubgroupModal;
