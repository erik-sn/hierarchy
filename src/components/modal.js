import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ErrorIcon from 'material-ui/svg-icons/alert/error';
import AppBar from 'material-ui/AppBar';


import { hideModal } from '../actions/index';

export const Modal = (props) => {
  const { message, children, error, modal, title, onSubmit, onCancel } = props;

  const ok = (
    <FlatButton
      label="Ok"
      primary
      keyboardFocused
      onTouchTap={onSubmit}
    />
  );

  const cancel = (
    <FlatButton
      label="Cancel"
      primary
      keyboardFocused
      onTouchTap={onCancel}
    />
  );

  let actions = [
  ];

  if (onSubmit) {
    actions.push(ok);
  }
  if (onCancel) {
    actions.push(cancel);
  }

  const errorIconStyle = { marginLeft: '25px', height: '40px', width: '40px', display: 'none' };
  if (error) {
    errorIconStyle.display = 'block';
    actions = [];
  }

  const titleBar = (
    <AppBar
      style={{ height: '50px', padding: '0px' }}
      iconStyleLeft={{ marginTop: '5px' }}
      titleStyle={{ marginLeft: '25px', height: '50px', lineHeight: '50px' }}
      title={title}
      iconElementLeft={<ErrorIcon style={errorIconStyle} viewBox="0 0 24 24" />}
    />
  );

  return (
    <div className="modal__container" >
      <Dialog
        contentClassName="modal__dialog-container"
        bodyClassName="modal__dialog-body-container"
        titleStyle={{ fontSize: '1.5rem' }}
        title={titleBar}
        modal={modal}
        open
        onRequestClose={props.hideModal}
        actions={!modal ? actions : undefined}
      >
        <div className="modal__message-container">
          {message}
        </div>
        <div className="modal__child-container">
          {children}
        </div>
      </Dialog>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.array.isRequired,
  error: PropTypes.bool,
  hideModal: PropTypes.func.isRequired,
  message: PropTypes.string,
  modal: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  title: PropTypes.string,
};

const ModalContainer = connect(null, { hideModal })(Modal);

export default ModalContainer;
