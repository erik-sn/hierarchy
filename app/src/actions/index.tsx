import * as axios from 'axios';
import * as React from 'react';

import Modal from '../components/modal';
import { IAction } from '../constants/interfaces';
import types from './types';


export function showModal(title: string, message: string, child: JSX.Element = undefined): IAction {
  return {
    payload: {
      showModal: true,
      component: <Modal title={title} message={message}>{child}</Modal>,
    },
    type: types.SHOW_MODAL,
  };
}

export function hideModal(): IAction {
  return {
    payload: {
      showModal: false,
    },
    type: types.HIDE_MODAL,
  };
}

export function fetchDepartmentData(departmentId: number, url: string, key: string): IAction {
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

export function setDepartmentData(departmentId: number, key: string, reducerData: any): IAction {
  return {
    payload: {
      department: departmentId,
      key,
      reducerData,
    },
    type: types.SET_DEPARTMENT_DATA,
  };
}
