import React, { PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const Loader = props => (
  <div className="loading__container" style={props.style} >
    <CircularProgress
      size={props.size || 150}
      thickness={props.thickness || 10}
      color={props.color || '#FFFFFF'}
    />
    <div className="loading__message-container">
      {props.message}
    </div>
  </div>
);

Loader.propTypes = {
  message: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.number,
  thickness: PropTypes.number,
  color: PropTypes.string,
};

export default Loader;