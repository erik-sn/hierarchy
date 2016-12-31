import axios from 'axios';

import types from '../actions/types';

export function getApiConfig() {
  const CancelToken = axios.CancelToken;
  const axiosSource = CancelToken.source();
  const config = Object.assign(types.API_CONFIG, { cancelToken: axiosSource.token });
  return { config, axiosSource };
}
