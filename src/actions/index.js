import React from 'react';
import axios from 'axios';

import Modal from '../components/modal';
import types from './types';

const config = {
  timeout: 15000,
  withCredentials: true,
};

export function fetchAuth() {
  const request = axios.get(`${types.API}/userinfo/`, config);
  // const request = axios.get('/__test__/user.json');
  return {
    payload: request,
    type: types.FETCH_AUTH,
  };
}

export function fetchHierarchy() {
  const request = axios.get(`${types.API}/processworkshop/sites/`, config);
  // const request = axios.get('/__test__/sites.json');
  return {
    payload: request,
    type: types.FETCH_HIERARCHY,
  };
}

export function showModal(title, message, child = undefined) {
  return {
    payload: {
      showModal: true,
      component: <Modal title={title} message={message}>{child}</Modal>,
    },
    type: types.SHOW_MODAL,
  };
}

export function hideModal() {
  return {
    payload: {
      showModal: false,
    },
    type: types.HIDE_MODAL,
  };
}
