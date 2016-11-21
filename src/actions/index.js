import React from 'react';

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
