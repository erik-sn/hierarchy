import * as React from 'react';

import { detectIE } from '../utils/dom';

export interface ILoaderProps {
  style?: {};
  fill?: string;
  scale?: number;
}

const Loader = ({ style, scale, fill }: ILoaderProps): JSX.Element => {
  if (detectIE()) {
    return (
      <div className="loading__container" style={style} >
          <img
            src="https://res.cloudinary.com/dvr87tqip/image/upload/v1487098118/loader.gif"
            alt="Loading..."
          />
      </div>
    );
  }
  return (
    <div className="loading__container" style={style} >
      <svg
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        width="60px"
        height="60px"
        viewBox="0 0 24 30"
        style={{ enableBackground: 'new 0 0 24 30',
          opacity: 0.8,
          transform: `scale(${scale || 1})`,
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center',
        }}
      >
        <rect x="0" y="13" width="4" height="5" fill={fill || 'whitesmoke'} >
          <animate
            attributeName="height"
            attributeType="XML"
            values="5;21;5"
            begin="0s"
            dur="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            attributeType="XML"
            values="13; 5; 13"
            begin="0s"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="10" y="13" width="4" height="5" fill={fill || 'whitesmoke'}>
          <animate
            attributeName="height"
            attributeType="XML"
            values="5;21;5"
            begin="0.15s"
            dur="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            attributeType="XML"
            values="13; 5; 13"
            begin="0.15s"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="20" y="13" width="4" height="5" fill={fill || 'whitesmoke'}>
          <animate
            attributeName="height"
            attributeType="XML"
            values="5;21;5"
            begin="0.3s"
            dur="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            attributeType="XML"
            values="13; 5; 13"
            begin="0.3s"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  );
};

export default Loader;
