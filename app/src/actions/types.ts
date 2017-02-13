import { getCookie } from '../utils/dom';

const config = require('../../appconfig.json');

export default {
  API: config.hierarchyapi,
  MAP: 'http://10.137.19.200/v1',
  API_CONFIG: {
    timeout: 30000,
    withCredentials: true,
    responseType: 'json',
    header: {
      'X-CSRFToken': getCookie('csrftoken'),
    },
  },

  SET_DEPARTMENT_DATA: 'SET_DEPARTMENT_DATA',

  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',

  FETCH_AUTH: 'FETCH_AUTH',
  FETCH_HIERARCHY: 'FETCH_HIERARCHY',

  CREATE_SITE: 'CREATE_SITE',
  UPDATE_SITE: 'UPDATE_SITE',
  DELETE_SITE: 'DELETE_SITE',

  CREATE_DEPARTMENT: 'CREATE_DEPARTMENT',
  UPDATE_DEPARTMENT: 'UPDATE_DEPARTMENT',
  DELETE_DEPARTMENT: 'DELETE_DEPARTMENT',
};
