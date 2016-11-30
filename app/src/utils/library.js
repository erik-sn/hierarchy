/* eslint-disable  */
import React from 'react';

export default function getComponent(name, props) {
    const Component = require(`../components/__custom__/${name}/${name}.js`).default;
    if (!Component || typeof Component !== 'function') {
      return <h3 style={{ textAlign: 'center' }} >There was an error loading this module</h3>;
    }
    return <Component {...props} />;
}
