import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import Modal from '../../modal';
import AreaChart from '../../charts/area_chart';


class SubgroupModal extends Component {

  render() {
    const { subgroup, config, showModal, handleClose } = this.props;
    if (!showModal) {
      return <div />;
    }

    return (
      <Modal onSubmit={handleClose} title={`${subgroup.get('partName')} - ${subgroup.get('lotNumber')}`} >
        <h3>{config.get('label')}</h3>
      </Modal>
    );
  }
}

SubgroupModal.propTypes = {
  subgroup: PropTypes.object,
  handleClose: PropTypes.func,
  showModal: PropTypes.bool.isRequired,
};

export default SubgroupModal;
