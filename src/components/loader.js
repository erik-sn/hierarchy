import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const Loader = props => (
  <div className="loading__container">
    <CircularProgress size={150} thickness={10} />
    <div className="loading__message-container">
      {props.message}
    </div>
  </div>
);

export default Loader;
