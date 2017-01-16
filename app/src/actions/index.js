import React from 'react';
import axios from 'axios';

import Modal from '../components/modal';
import types from './types';


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

export function fetchDepartmentData(departmentId, url, key) {
  const request = axios.get(url, types.API_CONFIG);
  return {
    payload: request,
    type: types.FETCH_DEPARTMENT_DATA,
    meta: {
      department: departmentId,
      key,
    },
  };
}

export function setDepartmentData(departmentId, key, reducerData) {
  return {
    payload: {
      department: departmentId,
      key,
      reducerData,
    },
    type: types.SET_DEPARTMENT_DATA,
  };
}
