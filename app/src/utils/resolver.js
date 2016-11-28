import { Map } from 'immutable';
import { browserHistory } from 'react-router';

const defaultKeys = Map({
  site: 'id',
  department: 'id',
  machine: 'id',
});

function mergeKeys(keys) {
  return defaultKeys.merge(Map(keys)).map(val => val.trim().toLowerCase());
}

export function lowIfStr(input) {
  if (typeof input === 'string') {
    return input.toLowerCase();
  }
  return input;
}

export function getSite(hierarchy, siteValue, inputKeys = defaultKeys) {
  if (hierarchy.size === 0) {
    throw Error('The hierarchy data is empty');
  }
  const keys = mergeKeys(inputKeys);
  const site = hierarchy.find(st => (
    lowIfStr(st.get(keys.get('site'))) === lowIfStr(siteValue)
  ));
  if (!site) {
    throw Error(`Site ${keys.get('site')}: ${siteValue} does not exist`);
  }
  return site;
}

export function getDepartments(hierarchy, siteValue, inputKeys = defaultKeys) {
  const keys = mergeKeys(inputKeys);
  try {
    return getSite(hierarchy, siteValue, keys).get('departments');
  } catch (e) {
    throw Error(`Site ${keys.get('site')}: ${siteValue} does not exist`);
  }
}

export function getDepartment(hierarchy, siteValue, departmentValue, inputKeys = defaultKeys) {
  const keys = mergeKeys(inputKeys);
  const department = getDepartments(hierarchy, siteValue, keys).find(dpt => (
    lowIfStr(dpt.get(keys.get('department'))) === lowIfStr(departmentValue)
  ));
  if (!department) {
    throw Error(`Department ${keys.get('department')}: ${departmentValue} does not exist`);
  }
  return department;
}

export function getMachines(hierarchy, siteValue, departmentValue, inputKeys = defaultKeys) {
  const keys = mergeKeys(inputKeys);
  // department id is checked in getDepartment
  return getDepartment(hierarchy, siteValue, departmentValue, keys).get('machines');
}

export function getMachine(hierarchy,
                           siteValue,
                           departmentValue,
                           machineValue,
                           inputKeys = defaultKeys) {
  const keys = mergeKeys(inputKeys);
  const machine = getMachines(hierarchy, siteValue, departmentValue, inputKeys).find(mch => (
    lowIfStr(mch.get(keys.get('machine'))) === lowIfStr(machineValue)
  ));
  if (!machine) {
    throw Error(`Machine ${keys.get('machine')}: ${machineValue} does not exist`);
  }
  return machine;
}


export function resolvePath(hierarchy, route) {
  const path = route.split('/').filter(param => param.trim() !== '');
  const keys = { site: 'code', department: 'name', machine: 'name' };
  const site = path[0] ? getSite(hierarchy, path[0], keys) : undefined;
  const department = path[1] ? getDepartment(hierarchy, path[0], path[1], keys) : undefined;
  const machine = path[2] ? getMachine(hierarchy, path[0], path[1], path[2], keys) : undefined;
  return Map({ site, department, machine });
}

/**
 * Generate a function that pushes to react-router history based on
 * a specified base string
 * @param  {string} base - the base url of the string
 */
export function buildNavigate(base) {
  if (!base) {
    throw Error('A base string is required');
  }
  return target => browserHistory.push(`${base.toLowerCase()}/${target.toLowerCase()}/`);
}
