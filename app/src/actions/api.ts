import * as axios from 'axios';

import { IAction } from '../constants/interfaces';
import types from './types';

const appConfig = require('../../appconfig.json');

export function fetchAuth(): IAction {
  if (appConfig.authUrl) {
    const request = axios.get(appConfig.authUrl, types.API_CONFIG);
    return {
      payload: request,
      type: types.FETCH_AUTH,
    };
  } else {
    return {
      payload: {
        id: undefined,
        username: 'guest',
        ip: undefined,
        admin: false,
        email: undefined,
      },
      type: types.FETCH_AUTH_GUEST,
    };
  }
}

export function fetchHierarchy(params?: string): IAction {
  const request = axios.get(`${types.API}/sites/${params || ''}`, types.API_CONFIG);
  return {
    payload: request,
    type: types.FETCH_HIERARCHY,
  };
}
