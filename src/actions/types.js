import config from '../../appconfig.json';

const types = {
  API: config.hierarchyapi,
  API_CONFIG: {
    timeout: 30000,
    withCredentials: true,
  },

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

export default types;
