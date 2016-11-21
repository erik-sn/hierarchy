import axios from 'axios';
import types from './types';

export function fetchAuth() {
  const request = axios.get(`${types.API}/auth/`, types.API_CONFIG);
  return {
    payload: request,
    type: types.FETCH_AUTH,
  };
}

export function fetchHierarchy(params) {
  const request = axios.get(`${types.API}/sites/${params || ''}`, types.API_CONFIG);
  return {
    payload: request,
    type: types.FETCH_HIERARCHY,
  };
}
