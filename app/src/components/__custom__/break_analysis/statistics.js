import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { is, List } from 'immutable';

import Loader from '../../loader';

class Statistics extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showChildren: false,
      uptimeChildren: this.renderChildren(props.uptime),
      startTime: moment().subtract(1, 'days'),
      endTime: moment(),
    };
    this.toggleChildren = this.toggleChildren.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.showChildren !== nextState.showChildren) {
      return true;
    }
    const { breaks, uptime } = this.props;
    return !is(uptime, nextProps.uptime) ||
           !is(breaks, nextProps.breaks);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.uptime) {
      const uptimeChildren = this.renderChildren(nextProps.uptime);
      this.setState({ uptimeChildren });
    }
  }

  toggleChildren() {
    this.setState({ showChildren: !this.state.showChildren });
  }

  filterBreaks(breaks) {
    const { startTime, endTime } = this.state;
    return breaks.filter(brk => brk.get('endtime') >= startTime && brk.get('endtime') <= endTime);
  }

  renderChildren(uptime) {
    if (!uptime) {
      return List([]);
    }
    return uptime.get('children')
    .sort((a, b) => a.get('label') > b.get('label'))
    .map((child, i) => (
      <div key={i} className="ox_overview__uptime-child">
        <div className="ox_overview__uptime-child-label">{child.get('label')}</div>
        <div className="ox_overview__uptime-child-uptime">{`${(Math.round(child.get('uptime') * 100 * 10) / 10)}%`}</div>
      </div>
    ));
  }

  render() {
    const { uptime, breaks } = this.props;
    const { showChildren, uptimeChildren } = this.state;
    if (!uptime || !breaks) {
      return <Loader size={75} thickness={5} />;
    }
    return (
      <div className="ox_overview__uptime-container">
        <div className="ox_overview__uptime-average" onClick={this.toggleChildren} >
          <div>
            up time: {`${Math.round(uptime.get('average') * 100 * 10) / 10}%`}
          </div>
          <div>
            breaks: {this.filterBreaks(breaks).size}
          </div>
        </div>
        <div className="ox_overview__children" style={{ display: showChildren ? 'block' : 'none'}} >
          {uptimeChildren}
        </div>
      </div>
    );
  }
}

Statistics.propTypes = {
  breaks: PropTypes.object.isRequired,
  department: PropTypes.bool.isRequired,
  uptime: PropTypes.object.isRequired,
};

export default Statistics;
