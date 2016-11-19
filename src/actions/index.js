import React from 'react';
import axios from 'axios';

import Modal from '../components/modal';
import types from './types';


export function fetchAuth() {
  const request = axios.get(`${types.API}/auth/`, types.API_CONFIG);
  return {
    payload: request,
    type: types.FETCH_AUTH,
  };
}

export function fetchHierarchy() {
  const request = axios.get(`${types.API}/sites/`, types.API_CONFIG);
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
