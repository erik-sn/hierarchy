import { browserHistory } from 'react-router';

import { IDepartment, IMachine, ISite } from '../constants/interfaces';

const appConfig = require('../../appconfig.json');


interface IHierarchy {
  site: ISite;
  department: IDepartment;
  machine: IMachine;
}

export function parseSite(hierarchy: ISite[], siteCode: string): ISite {
  return hierarchy.find((site) => (
    site.code.toLowerCase() === siteCode.toLowerCase()
  ));
}

export function getDepartments(hierarchy: ISite[], siteCode: string): IDepartment[] {
  return parseSite(hierarchy, siteCode).departments;
}

export function parseDepartment(hierarchy: ISite[],
                                siteCode: string,
                                departmentName: string): IDepartment {
  return getDepartments(hierarchy, siteCode).find((dpt) => (
    dpt.name.toLowerCase() === departmentName.toLowerCase()
  ));
}

export function getMachines(hierarchy: ISite[],
                            siteCode: string,
                            departmentName: string): IMachine[] {
  return parseDepartment(hierarchy, siteCode, departmentName).machines;
}

export function parseMachine(hierarchy: ISite[],
                             siteCode: string,
                             departmentName: string,
                             machineName: string): IMachine {
  return getMachines(hierarchy, siteCode, departmentName).find((mch) => (
    mch.name.toLowerCase() === machineName.toLowerCase()
  ));
}

function parsePath(pathName: string): string[] {
  const route = decodeURIComponent(pathName).replace(appConfig.baseUrl, '');
  // strip modules from route
  const moduleIndex = route.indexOf('/m/');
  const path = moduleIndex > 0 ? route.substring(0, moduleIndex) : route;
  return path.split('/').filter((param) => param.trim() !== '');
}

export function resolvePath(hierarchy: ISite[], pathName: string): IHierarchy {
  const path = parsePath(pathName);
  const site: ISite = path[0] ? parseSite(hierarchy, path[0]) : undefined;
  const department: IDepartment = path[1] ? parseDepartment(hierarchy, path[0], path[1]) : undefined;
  const machine: IMachine = path[2] ? parseMachine(hierarchy, path[0], path[1], path[2]) : undefined;
  return { site, department, machine };
}

/**
 * Generate a function that pushes to react-router history based on
 * a specified base string
 * @param  {string} base - the base url of the string
 */
export function buildNavigate(base: string): (target: string) => void {
  if (!base) {
    throw Error('A base string is required');
  }
  return (target) => browserHistory.push(`${base.toLowerCase()}/${target.toLowerCase()}/`);
}
