/* eslint-disable  */
import React from 'react';
import moment from 'moment';

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


/**
 * Iterate over the input list and check whether or not all members
 * of an object are or can be parsed into moment.js objects. If any
 * value cannot be parsed return false, otherwise true.
 *
 * @param {object} list - immutable list of immutable map objects
 * @param {string} parameter - the field of a map object for which each map is checked
 * @returns {boolean}
 *
 */
export function isMomentParameter(list, parameter) {
  return !list.some(data => !moment(data.get(parameter)).isValid());
}

/**
 * Iterate over the input list and check whether or not all members
 * of an object are or can be converted to numbers. If any value cannot
 * be converted return false, otherwise true.
 *
 * @param {object} list - immutable list of immutable map objects
 * @param {string} parameter - the field of a map object for which each map is checked
 * @returns {boolean}
 *
 */
export function isNumberParameter(list, parameter) {
  return !list.some(data => Number.isNaN(Number(data.get(parameter))));
}
