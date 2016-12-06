import React, { Component, PropTypes } from 'react';
import { is } from 'immutable';

import MachineListItem from './machine_list_item';
import Loader from '../../loader';

class MachineList extends Component {

  shouldComponentUpdate(nextProps) {
    return !is(nextProps.specifications, this.props.specifications);
  }

  render() {
    if (!this.props || !this.props.specifications) {
      return <Loader style={{ height: '270px', width: '100%' }} size={75} thickness={5} />;
    }

    return (
      <div className="ox_overview__machine-list">
        <div className="ox_overview__machine-container">
          {this.props.specifications.map((spc, i) => (
            <MachineListItem key={i} specification={spc} />
          ))}
        </div>
      </div>
    );
  }

}

MachineList.propTypes = {
  specifications: PropTypes.object.isRequired,
};

export default MachineList;
