import { FormStateMap } from 'redux-form';

/**
 * Redux Interfaces
 */

export interface IAction {
  error?: boolean;
  payload: any;
  type: string;
  meta?: any;
}

// auth reducer
export interface Iuser {
  id: number;
  username: string;
  ip: string;
  admin: boolean;
}

export interface IAuth {
  user: Iuser;
  error: boolean;
}

// display reducer
export interface IModal {
  showModal: boolean;
  component: JSX.Element;
}

export interface IDisplay {
  config: any;
  modal: IModal;
}

// hierarchy reducer
export interface IHierarchy {
  sites: ISite[];
  error: boolean;
}

// root reducer
export interface IReduxState {
  auth: IAuth;
  hierarchy: IHierarchy;
  toJS: Function;
  form: FormStateMap;
}

/**
 * Hierarchy interfaces
 */

export interface IHierarchyTier {
  id?: number;
  name: string;
  modules: IModule[];
  defaultModule?: IModule;
  created?: string;
  modified?: string;
  active: boolean;
}

export interface ISite extends IHierarchyTier {
  code: string;
  location: string;
  directory: string;
  latitude: string;
  longitude: string;
  departments: IDepartment[];
  address: string;
}

export interface IDepartment extends IHierarchyTier {
  apiCalls: IApiCall[];
  machines: IMachine[];
  site: number; // site id
}

export interface IMachine extends IHierarchyTier {
  type: string;
  department?: number;
  site?: number;
  defaultModule?: IModule;
}

export interface IApiCall {
  id: number;
  key: string;
  url: string;
  description: string;
  active: boolean;
}

export interface IModule {
  id: number;
  name: string;
  label: string;
  description: string;
  created: string;
  modified: string;
  active: boolean;
}


// axios
export interface IAxiosResponse {
  data: Object;
}


/**
 * Form interfaces
 */

export interface IFormValues { initialValues: any; }


/**
 * General
 */
export interface IDictionary {
    [key: string]: any;
}
