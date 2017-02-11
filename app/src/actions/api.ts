import * as axios from 'axios';

import { IAction } from '../constants/interfaces';
import types from './types';

const appConfig = require('../../appconfig.json');

export function fetchAuth(): IAction {
  const request = axios.get(appConfig.authUrl, types.API_CONFIG);
  return {
    payload: request,
    type: types.FETCH_AUTH,
  };
}

export function fetchHierarchy(params?: string): IAction {
  const request = axios.get(`${types.API}/sites/${params || ''}`, types.API_CONFIG);
  return {
    payload: request,
    type: types.FETCH_HIERARCHY,
  };
}
