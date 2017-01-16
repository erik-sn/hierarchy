/**
 * Module Created: 2016-11-30 20:40:11 -05:00
 * Author: Erik
 */
if (process.env.BROWSER) {
  require('./extrusion_pack_analysis.scss');  // eslint-disable-line global-require
}

import React, { Component } from 'react';
import moment from 'moment';
import { Map } from 'immutable';

import { getDateSort, getNumberSort } from '../../../utils/sort';
import ControlPanel from './control_panel';
import PlotDisplay from './plot_display';

const formatDate = date => moment(date, 'YYY-MM-DD').format('MM/DD/YY');

const defaultTransform = ([key, count]) => Map({ key, count });

class ExtrusionPackAnalysis extends Component {

  constructor(props) {
    super(props);
    this.state = {
      packs: undefined,
      messageShow: false,
      messageText: '',
    };
    this.handleUpdatePacks = this.handleUpdatePacks.bind(this);
  }

  getPlotData(plot, packs) {
    switch (plot) {
      case 2:
        return this.groupMachine(packs);
      case 3:
        return this.groupSpinnerette(packs);
      default:
        return this.groupDateSortDate(packs);
    }
  }

  groupDateSortDate(packs) {
    const transform = ([key, count]) => Map({ key: formatDate(key), count });
    return this.groupData(packs, 'removedate')
               .map(transform)
               .sort(getDateSort('key'));
  }

  groupMachine(packs) {
    return this.groupData(packs, 'line')
           .map(defaultTransform)
           .sort(getNumberSort('count'))
           .reverse();
  }

  groupSpinnerette(packs) {
    return this.groupData(packs, 'spinnerettetype')
           .map(defaultTransform)
           .sort(getNumberSort('count'))
           .filter(data => data.get('count') > 3)
           .reverse();
  }

  groupData(packs, param) {
    return packs.reduce((matrix, pack) => {
      const key = pack.get(param);
      if (matrix.has(key)) {
        return matrix.set(key, matrix.get(key) + 1);
      }
      return matrix.set(key, 1);
    }, Map({})).entrySeq();
  }

  /**
     value={1} label="Changes Over Time" primaryText="Changes Over Time" />
     value={2} label="Pareto By Machine" primaryText="Pareto By machine" />
     value={3} label="Pareto By Spinnerette" primaryText="Pareto By Spinnerette" />
     value={4} label="Pack Life By Machine" primaryText="Pack Life By Machine" />
     value={5} label="Pack Life By Spinnerette" primaryText="Pack Life By Machine" />
     value={6} label="Worst Packs" primaryText="Worst Packs" />
     value={7} label="Best Packs" primaryText="Best Packs" />
   */
  handleUpdatePacks(plot, packs, minCount = -1) {
    this.setState({ packs: this.getPlotData(plot, packs, minCount) });
  }

  render() {
    return (
      <div className="pack_analysis__container">
        <PlotDisplay data={this.state.packs} />
        <ControlPanel updateData={this.handleUpdatePacks} />
      </div>
    );
  }
}

export default ExtrusionPackAnalysis;
