/**
 * Module Created: 2016-12-04 10:25:32 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./quality_analysis.scss');  // eslint-disable-line global-require
}

import React, { Component, PropTypes } from 'react';
import { fromJS, Map } from 'immutable';
import moment from 'moment';

import TableDisplay from './table_display';

class QualityAnalysis extends Component {

  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
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
      const key = `${sg.get('createDate')}__${sg.get('lotNumber')}__${sg.get('testNumber')}`;
      if (matrix.has(key)) {
        const row = matrix.get(key);
        return matrix.set(key, row.set(sg.get('testName'), sg.get('value')));
      }
      return matrix.set(key, this.getDefaultRow(sg));
    }, Map({}));
  }

  showModal(subgroup) {
    console.log(subgroup);
  }

  cdSort(a, b) {
    const aDate = moment(a.get('createDate'));
    const bDate = moment(b.get('createDate'));
    if (aDate > bDate) {
      return -1;
    } else if (aDate < bDate) {
      return 1;
    }
    if (a.get('testNumber') < b.get('testNumber')) {
      return -1;
    } else if (a.get('testNumber') > b.get('testNumber')) {
      return 1;
    }
  }


  render() {
    const { data, parent } = this.props;
    if (!data || !data.get('ox_quality')) {
      return <div>Loading</div>;
    }
    console.log(data.get('ox_quality').size);
    const filtered = data.get('ox_quality').filter(subgroup => subgroup.get('processName') === parent.get('name')).reverse();
    console.log(filtered.size);
    const groupedData = this.groupData(filtered);
    // const groupedData = fromJS(this.processGrouped(filtered.toJS()));
    console.log(groupedData.toJS());
    return (
      <div className="quality_analysis__container" >
        <TableDisplay data={groupedData.toIndexedSeq().sort(this.cdSort)} showModal={this.showModal} />
      </div>
    );
  }
}

QualityAnalysis.propTypes = {
  parent: PropTypes.object.isRequired,
  data: PropTypes.object,
};

export default QualityAnalysis;
