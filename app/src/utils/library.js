/* eslint-disable  */
import React from 'react';

export default function getComponent(name, props) {
  const Component = require(`../components/custom/${name}.js`).default;
  return <Component {...props} />;
}
