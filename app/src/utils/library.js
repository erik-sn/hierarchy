/* eslint-disable  */
import React from 'react';

export default function getComponent(name, props) {
    try {
      const Component = require(`../components/__custom__/${name}/${name}.js`).default;
      if (!Component || typeof Component !== 'function') {
        throw Error('Component import was not a valid react component');
      }
      return <Component {...props} />;
    } catch (err) {
      console.error(err);
      return <h3 style={{ textAlign: 'center' }} >There was an error loading this module</h3>;
    }
}
