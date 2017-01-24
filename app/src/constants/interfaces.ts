

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
  hierarchy: IHierarchy;
  toJS: Function;
}