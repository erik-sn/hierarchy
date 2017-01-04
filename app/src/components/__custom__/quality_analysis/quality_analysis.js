/**
 * Module Created: 2016-12-04 10:25:32 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./quality_analysis.scss');  // eslint-disable-line global-require
}

import React, { Component, PropTypes } from 'react';
import { List, Map } from 'immutable';
import moment from 'moment';

import Loader from '../../loader';
import SubgroupModal from './subgroup_modal';
import TableDisplay from './table_display';

const FORMAT = 'MM/DD/YY HH:mm';

const rowMap = List([
  Map({ label: 'createDate', header: 'Time', width: '15%' }),
  Map({ label: 'lot', header: 'Lot', width: '15%' }),
  Map({ label: 'part', header: 'Yarn ID', width: '14%' }),
  Map({ label: 'subProcess', header: 'Pos.', width: '8%' }),
  Map({ label: 'Crimp', header: 'Crimp', width: '8%' }),
  Map({ label: 'TR', header: 'TR', width: '8%' }),
  Map({ label: 'Denier', header: 'Denier', width: '8%' }),
  Map({ label: 'FOY (NMR)', header: 'FOY', width: '8%' }),
  Map({ label: 'Entanglement', header: 'Tack', width: '8%' }),
  Map({ label: 'TiO2', header: 'TiO2', width: '8%' }),
]);

class QualityAnalysis extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      activeConfig: undefined,
      activeSubgroup: undefined,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  fetchLimits() {
    const { data } = this.props;
    const parts = data.get('ox_quality').reduce((list, sg) => {
      if (list.indexOf(sg.get('part')) === -1) {
        return list.push(sg.get('part'));
      }
      return list;
    }, List([]));
    console.log(parts.toJS());
  }

  getDefaultRow(subgroup) {
    const base = Map({
      createDate: subgroup.get('createDate'),
      lot: subgroup.get('lot'),
      subProcess: subgroup.get('subProcess'),
      part: subgroup.get('part'),
      test: subgroup.get('test'),
    });
    return base.set(subgroup.get('test'), subgroup.get('value'));
  }

  groupData(subgroups) {
    return subgroups.reduce((matrix, sg) => {
      const key = `${sg.get('createDate')}__${sg.get('lot')}__${sg.get('subProcess')}`;
      if (matrix.has(key)) {
        const row = matrix.get(key);
        return matrix.set(key, row.set(sg.get('test'), sg.get('value')));
      }
      return matrix.set(key, this.getDefaultRow(sg));
    }, Map({}));
  }

  showModal(subgroup, column) {
    this.setState({
      showModal: true,
      activeConfig: rowMap.get(column),
      activeSubgroup: subgroup,

    });
  }

  hideModal() {
    this.setState({
      showModal: false,
      activeConfig: undefined,
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
    const { showModal, activeConfig, activeSubgroup } = this.state;
    if (!data || !data.get('ox_quality')) {
      return <Loader />;
    }
    const filtered = data.get('ox_quality').filter(subgroup => subgroup.get('process') === parent.get('name'));
    const groupedData = this.groupData(filtered).toIndexedSeq();
    const formattedData = groupedData.map((subgroup) => {
      const dateMoment = moment(subgroup.get('createDate'), 'YYYY-MM-DDTHH:mm:ss');
      return subgroup.set('createDate', dateMoment.format(FORMAT));
    });
    const sortedData = formattedData.sort(this.sortSubgroup);
    const limits = this.fetchLimits(sortedData);
    return (
      <div className="quality_analysis__container" >
        <SubgroupModal
          subgroup={activeSubgroup}
          config={activeConfig}
          handleClose={this.hideModal}
          showModal={showModal}
        />
        <TableDisplay data={sortedData} rowMap={rowMap} showModal={this.showModal} />
      </div>
    );
  }
}

QualityAnalysis.propTypes = {
  parent: PropTypes.object.isRequired,
  data: PropTypes.object,
};

export default QualityAnalysis;
