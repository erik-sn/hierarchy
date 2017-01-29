import * as axios from 'axios';

import types from '../actions/types';


export function getApiConfig() {
  const CancelToken: any = axios.CancelToken;
  const axiosSource = CancelToken.source();
  const config = {...types.API_CONFIG, cancelToken: axiosSource.token};
  return { config, axiosSource };
}
