import * as React from 'react';

import { IHierarchyTier, IModule } from '../../constants/interfaces';
import { alphaNumSort } from '../../utils/sort';
import Module from './module';

/**
 * Generate a sorting function unique to a specific hierarchy
 * object. This function will compare all modules to the default
 * and set the default module as first in the list.
 *
 * @param {IHierarchyTier} hierarchyObject
 * @returns
 */
function generateSortModules(hierarchyObject: IHierarchyTier): (a: IModule, b: IModule) => number {
  // case where no default module was set in the admin page
  const defaultModule = hierarchyObject.defaultModule;
  const defaultId = defaultModule ? defaultModule.id : -1;
  return (a: IModule, b: IModule): number => {
    if (a.id === defaultId) {
      return -1;
    } else if (b.id === defaultId) {
      return 1;
    }
    return 0;
  };
}

/**
 * Search a hierarchy object (machine/department) for a specific
 * module by label (case insensitive);
 *
 * @export
 * @param {IHierarchyTier} hierarchyObject
 * @param {string} moduleLabel
 * @returns
 */
export function retrieveModule(hierarchyObject: IHierarchyTier, moduleLabel: string) {
  return hierarchyObject.modules.find((mdl) => (
    moduleLabel ? mdl.label.toLowerCase() === moduleLabel.toLowerCase() : false
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
export default function renderModules(activeModule: IModule,
                                      hierarchyObject: IHierarchyTier,
                                      setActive: (module: IModule) => void): JSX.Element[] {
  const moduleProps = { activeModule, setActive, hierarchyObject };
  return hierarchyObject.modules
                        .sort((a: IModule, b: IModule) => alphaNumSort(a.name, b.name))
                        .sort(generateSortModules(hierarchyObject))
                        .map((module, i) => <Module key={i} module={module} {...moduleProps} />);
}
