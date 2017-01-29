import CircularProgress from 'material-ui/CircularProgress';
import * as React from 'react';

export interface ILoaderProps {
  message?: string;
  style?: {};
  size?: number;
  thickness?: number;
  color?: string;
}

const Loader = (props: ILoaderProps): JSX.Element => (
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

export default Loader;
