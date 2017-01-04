import React, { PropTypes } from 'react';
import moment from 'moment';

import Modal from '../../modal';
import AreaChart from '../../charts/area_chart';


const SubgroupModal = ({ subgroup, showModal, handleClose }) => {
  if (!showModal) {
    return <div />;
  }

  return (
    <Modal onSubmit={handleClose} title={`${subgroup.get('partName')} - ${subgroup.get('lotNumber')}`} >
      <h3>hello</h3>
    </Modal>
  );
};

SubgroupModal.propTypes = {
  subgroup: PropTypes.object,
  handleClose: PropTypes.func,
  showModal: PropTypes.bool.isRequired,
};

export default SubgroupModal;
