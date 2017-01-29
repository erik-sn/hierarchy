import * as moment from 'moment';
import * as React from 'react';

import { IDictionary } from '../constants/interfaces';

/**
 * Given a component's name, require it and pass it the specified props
 * within a React component. This method is critical to the functionality
 * of the application. Because modules are specified in the database,
 * not the HierarchyTier component's themselves, dynamic requires are
 * essential to the flexibility of the application.
 * 
 * By convention these dynamic components are stored in the __custom__
 * directory, then given a directory with their name. The index of the
 * component must also be given the same name.
 * 
 * @export
 * @param {string} name - React component to import
 * @param {*} props - properties to pass to the component
 * @returns {JSX.Element}
 */
export default function getComponent(name: string, props: any): JSX.Element {
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
 * @param {IDictionary[]} list - list of objects to analyze
 * @param {string} parameter - the field of a map object for which each map is checked
 * @returns {boolean}
 *
 */
export function isMomentParameter(list: IDictionary[], parameter: string) {
  return !list.some((listItem) => !moment(listItem[parameter]).isValid());
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
export function isNumberParameter(list: IDictionary[], parameter: string) {
  return !list.some((listItem) => isNaN(Number(listItem[parameter])));
}


/**
 * Given a string add commas every 3 digits to add readability. Only add
 * commas if the length (left of the decimal point) is at least the minLength
 * parameter, which defaults to 4.
 * 
 * @export
 * @param {string} inputValue - string to be commafied
 * @param {number} [minLength=4] - minimum length of the integer values before any
 * commas are added
 * @returns {string}
 */
export function commafy(inputValue: string, minLength: number = 4): string {
    const str: string[] = inputValue.split('.');
    if (str[0].length >= minLength) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 4) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}
