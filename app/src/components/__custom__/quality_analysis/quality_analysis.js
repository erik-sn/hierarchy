/**
 * Module Created: 2016-12-04 10:25:32 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./quality_analysis.scss');  // eslint-disable-line global-require
}

import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import moment from 'moment';

import SubgroupModal from './subgroup_modal';
import TableDisplay from './table_display';

const FORMAT = 'MM/DD/YY HH:mm';

class QualityAnalysis extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      activeSubgroup: undefined,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  getDefaultRow(subgroup) {
    const base = Map({
      createDate: subgroup.get('createDate'),
      lotNumber: subgroup.get('lotNumber'),
      subProcess: subgroup.get('subProcess'),
      partName: subgroup.get('partName'),
      testNumber: subgroup.get('testNumber'),
    });
    return base.set(subgroup.get('testName'), subgroup.get('value'));
  }

  groupData(subgroups) {
    return subgroups.reduce((matrix, sg) => {
      const key = `${sg.get('createDate')}__${sg.get('lotNumber')}__${sg.get('subProcess')}`;
      if (matrix.has(key)) {
        const row = matrix.get(key);
        return matrix.set(key, row.set(sg.get('testName'), sg.get('value')));
      }
      return matrix.set(key, this.getDefaultRow(sg));
    }, Map({}));
  }

  showModal(subgroup) {
    this.setState({
      showModal: true,
      activeSubgroup: subgroup,
    });
  }

  hideModal() {
    this.setState({
      showModal: false,
      activeSubgroup: undefined,
    });
  }

  sortSubgroup(a, b) {
    const aDate = moment(a.get('createDate'), FORMAT);
    const bDate = moment(b.get('createDate'), FORMAT);
    if (aDate > bDate) {
      return -1;
    } else if (aDate < bDate) {
      return 1;
    }
    return Number(a.get('subProcess')) > Number(b.get('subProcess')) ? 1 : -1;
  }

  render() {
    const { data, parent } = this.props;
    const { showModal, activeSubgroup } = this.state;
    if (!data || !data.get('ox_quality')) {
      return <div>Loading</div>;
    }
    const filtered = data.get('ox_quality').filter(subgroup => subgroup.get('processName') === parent.get('name'));
    const groupedData = this.groupData(filtered).toIndexedSeq();
    const formattedData = groupedData.map((subgroup) => {
      const dateMoment = moment(subgroup.get('createDate'), 'YYYY-MM-DDTHH:mm:ss');
      return subgroup.set('createDate', dateMoment.format(FORMAT));
    });
    const sortedData = formattedData.sort(this.sortSubgroup);
    return (
      <div className="quality_analysis__container" >
        <SubgroupModal subgroup={activeSubgroup} handleClose={this.hideModal} showModal={showModal} />
        <TableDisplay data={sortedData} showModal={this.showModal} />
      </div>
    );
  }
}

QualityAnalysis.propTypes = {
  parent: PropTypes.object.isRequired,
  data: PropTypes.object,
};

export default QualityAnalysis;
