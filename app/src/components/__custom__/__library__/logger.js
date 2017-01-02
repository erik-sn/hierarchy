import axios from 'axios';

import types from '../../../actions/types';


export default function logError(error) {
  const data = {
    language: 'javascript',
    application: 'processworkshop',
    type: JSON.stringify(error.name),
    message: JSON.stringify(error.message),
    stacktrace: JSON.stringify(error.stack ? error.stack : ''),
  };
  axios.post(`${types.MAP}/errors/`, data, types.API_CONFIG);
}
