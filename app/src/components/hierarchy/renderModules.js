import React from 'react';

import Module from './module';
import { alphaNumSort } from '../../utils/sort';

/**
 * Generate a sorting function unique to a specific hierarchy
 * object. This function will compare all modules to the default
 * and set the default module as first in the list.
 *
 * @param {any} hierarchyObject
 * @returns
 */
function generateSortModules(hierarchyObject) {
  // case where no default module was set in the admin page
  const defaultModule = hierarchyObject.get('defaultModule');
  const defaultId = defaultModule ? defaultModule.get('id') : -1;
  return (a, b) => {
    if (a.get('id') === defaultId) {
      return -1;
    } else if (b.get('id') === defaultId) {
      return 1;
    }
    return 0;
  };
}

/**
 * Search a hierarchy object (machine/department) for a specific
 * module by name (case insensitive);
 *
 * @export
 * @param {object} hierarchyObject
 * @param {string} moduleName
 * @returns
 */
export function retrieveModule(hierarchyObject, moduleName) {
  return hierarchyObject.get('modules').find(mdl => (
    mdl.get('label').toLowerCase() === moduleName.toLowerCase()
  ));
}

/**
 * Generate an array of module objects. Modules are containers that hold
 * content - the user can click on tabs to navigate to them.
 *
 * Modules are first sorted alphanumerically, and then sorted again so
 * that the default module is first in the list.
 *
 * @export
 * @param {object} activeModule - module that the user currently has open
 * @param {object} hierarchyObject - the piece of hierarchy the user is navigating in -
 * machines, departments, etc.
 * @param {function} setActive - function passed to a module that is called when its tabs
 * is clicked on.
 * @returns
 */
export default function renderModules(activeModule, hierarchyObject, setActive) {
  const moduleProps = { activeModule, setActive, hierarchyObject };
  return hierarchyObject.get('modules')
  .sort((a, b) => alphaNumSort(a.get('name'), b.get('name')))
  .sort(generateSortModules(hierarchyObject))
  .map((module, i) => <Module key={i} module={module} {...moduleProps} />);
}
