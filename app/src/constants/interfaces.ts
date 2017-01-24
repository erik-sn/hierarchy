
/**
 * Redux Interfaces
 */
export interface Iuser {
  admin: boolean;
}

export interface IAuth {
  user: Object;
}

export interface IHierarchy {
  sites: Object;
}

export interface IReduxState {
  auth: IAuth;
  hierarchy: ISite[];
  toJS: Function;
}

/**
 * Hierarchy interfaces
 */
export interface ISite {
  id: number;
  name: string;
  code: string;
  location: string;
  directory: string;
  latitude: string;
  longitude: string;
  modules: number[];
  departments: IDepartment[];
  address: string;
  created: string;
  modified: string;
  active: boolean;
}

export interface IDepartment {
  id: number;
  created: string;
  modified: string;
  name: string;
  apiCalls: IApiCall[];
  machines: IMachine[];
  defaultModule: number;
  modules: number[];
  active: boolean;
}

export interface IMachine {
  id: number;
  name: string;
  type: string;
  created: string;
  modified: string;
  department: IDepartment;
  defaultModule: number;
  modules: number[];
  active: boolean;
}

export interface IApiCall {
  id: number;
  key: string;
  url: string;
  description: string;
  active: boolean;
}


