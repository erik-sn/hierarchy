if (process.env.BROWSER) {
  require('./extrusion_waste_analysis.scss');  // eslint-disable-line global-require
}

import React, { Component, PropTypes } from 'react';

import ControlPanel from './control_panel';
import TableDisplay from './table_display';
import { isMomentParameter } from '../../../utils/library';
import { parseAndFormat } from '../../../utils/time';


const DISPLAY = 'MM/DD/YY';  // user facing display format

class ExtrusionWasteAnalysis extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      mode: 'chart',
    };
    this.updateData = this.updateData.bind(this);
  }

  componentDidMount() {
    this.restoreLocalStorage();
  }

  setPercentFixed(data) {
    const formatted = data.map((row) => {
      let updated = row;
      updated = updated.set('wastePercent', row.get('wastePercent').toFixed(1));
      updated = updated.set('transitionPercent', row.get('transitionPercent').toFixed(1));
      return updated;
    });
    return formatted;
  }

  formatMomentColumn(data) {
    return data.map(row => (
      row.set('label', parseAndFormat(row.get('label'), DISPLAY))
    ));
  }

  restoreLocalStorage() {
    const storedMode = JSON.parse(localStorage.getItem('pw__waste_analysis__mode'));
    const storedData = JSON.parse(localStorage.getItem('pw__waste_analysis__data'));
    if (storedMode) {
      this.setState({
        mode: storedMode,
        data: storedData,
      });
    }
  }

  cleanData(data) {
    // sometimes waste is attributed to a shift retroactively - ignore these events
    let cleaned = data.filter(row => row.get('productionPounds') > 2000);
    cleaned = this.setPercentFixed(cleaned);
    if (isMomentParameter(cleaned, 'label')) {
      cleaned = this.formatMomentColumn(cleaned);
    }
    return cleaned;
  }

  updateData(data) {
    const cleanedData = this.cleanData(data);
    this.setState({ data: cleanedData });
  }

  render() {
    // const totalRow = this.getTotals(this.state.data);
    return (
      <div className="ewa__container">
        <TableDisplay data={this.state.data} />
        <ControlPanel updateData={this.updateData} />
      </div>
    );
  }
}

ExtrusionWasteAnalysis.propTypes = {
  parent: PropTypes.object.isRequired,
};

export default ExtrusionWasteAnalysis;
