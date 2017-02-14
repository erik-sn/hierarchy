import * as React from 'react';

export interface ILoaderProps {
  style?: {};
  fill?: string;
  scale?: number;
}

const Loader = ({ style, scale, fill }: ILoaderProps): JSX.Element => {
  return (
    <div className="loading__container" style={style} >
      <svg
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        width="90px"
        height="60px"
        viewBox="0 0 60 60"
        style={{ enableBackground: 'new 0 0 100 100', opacity: 0.8, transform: `scale(${scale || 2})` }}
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
