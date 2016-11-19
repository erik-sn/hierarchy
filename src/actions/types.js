import config from '../../appconfig.json';

const types = {
  API: config.hierarchyapi,
  API_CONFIG: {
    timeout: 15000,
    withCredentials: true,
  },
  FETCH_AUTH: 'FETCH_AUTH',
  FETCH_HIERARCHY: 'FETCH_HIERARCHY',
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
};

export default types;
