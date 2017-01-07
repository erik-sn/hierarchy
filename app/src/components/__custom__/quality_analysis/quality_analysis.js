/**
 * Module Created: 2016-12-04 10:25:32 -05:00
 * Author: erik
 */
if (process.env.BROWSER) {
  require('./quality_analysis.scss');  // eslint-disable-line global-require
}

import React, { Component, PropTypes } from 'react';
import { is, fromJS, List, Map } from 'immutable';
import moment from 'moment';
import axios from 'axios';

import Loader from '../../loader';
import SubgroupModal from './subgroup_modal';
import TableDisplay from './table_display';
import { LIMIT_API, rowMap, DATE_FORMAT } from './constants';

import test_data from './test_data.json';


class QualityAnalysis extends Component {

  constructor(props) {
    super(props);
    const { data, parent } = props;
    let subgroups;
    if (data && data.get('ox_quality')) {
      subgroups = this.processSubgroups(data, parent);
    }
    this.state = {
      showModal: false,
      activeConfig: undefined,
      activeSubgroup: undefined,
      limitsFetched: false,
      limits: undefined,
      subgroups: this.processSubgroups(undefined, Map({ name: 'OX11' })),
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   const { data, parent } = nextProps;
  //   if (!is(data, this.props.data) && data && data.get('ox_quality')) {
  //     this.setState({
  //       subgroups: this.processSubgroups(data, parent),
  //       limits: undefined,  // this will trigger a fetchLimits call in next render
  //     });
  //   }
  // }

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

  getParts() {
    const { subgroups } = this.state;
    return subgroups.reduce((parts, subgroup) => {
      const part = subgroup.get('part');
      const index = parts.indexOf(part);
      return index === -1 ? parts.push(part) : parts;
    }, List([]));
  }

  fetchLimits() {
    const parts = this.getParts();
    const axiosRequests = parts.map(part => axios.get(`${LIMIT_API}/${part}/`));
    axios.all(axiosRequests).then((limitResponses) => {
      let limits = Map({});
      parts.forEach((part, i) => {
        limits = limits.set(part, fromJS(limitResponses[i].data));
        this.setState({ limits });
      });
    });
  }

  filterSubgroups(data, parent) {
    return fromJS(test_data).filter(subgroup => (
      subgroup.get('process') === parent.get('name')
    ));
  }

  groupSubgroups(subgroups) {
    return subgroups.reduce((matrix, sg) => {
      const key = `${sg.get('createDate')}__${sg.get('lot')}__${sg.get('subProcess')}`;
      if (matrix.has(key)) {
        const row = matrix.get(key);
        return matrix.set(key, row.set(sg.get('test'), sg.get('value')));
      }
      return matrix.set(key, this.getDefaultRow(sg));
    }, Map({}));
  }

  processSubgroups(data, parent) {
    const filteredSubgroups = this.filterSubgroups(data, parent);
    const groupedData = this.groupSubgroups(filteredSubgroups).toIndexedSeq();
    return groupedData.map((subgroup) => {
      const dateMoment = moment(subgroup.get('createDate'), 'YYYY-MM-DDTHH:mm:ss');
      return subgroup.set('createDate', dateMoment.format(DATE_FORMAT));
    })
    .sort(this.sortSubgroup);
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
    const aDate = moment(a.get('createDate'), DATE_FORMAT);
    const bDate = moment(b.get('createDate'), DATE_FORMAT);
    if (aDate > bDate) {
      return -1;
    } else if (aDate < bDate) {
      return 1;
    }
    return Number(a.get('subProcess')) > Number(b.get('subProcess')) ? 1 : -1;
  }

  render() {
    const { data, parent } = this.props;
    const { showModal, activeConfig, activeSubgroup, subgroups, limits } = this.state;
    // if (!data || !data.get('ox_quality')) {
    //   return <Loader />;
    // }
    if (!limits) {
      this.fetchLimits();
      return <Loader />;
    }
    const tableDisplayProps = { limits, subgroups: List(subgroups), rowMap };
    return (
      <div className="quality_analysis__container" >
        <SubgroupModal
          machine={parent.get('name')}
          subgroup={activeSubgroup}
          config={activeConfig}
          handleClose={this.hideModal}
          showModal={showModal}
        />
        <TableDisplay showModal={this.showModal} {...tableDisplayProps} />
      </div>
    );
  }
}

QualityAnalysis.propTypes = {
  parent: PropTypes.object.isRequired,
  data: PropTypes.object,
};

export default QualityAnalysis;
