
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ErrorIcon from 'material-ui/svg-icons/alert/error';
import * as React from 'react';
import { connect } from 'react-redux';


import { hideModal } from '../actions/index';

export interface IModalProps {
  message?: string;
  children?: JSX.Element[];
  error?: boolean;
  modal?: boolean;
  title?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  hideModal?: (hide: boolean) => void;
  className?: string;
  childClass?: string;
  contentClass?: string;
}

export const Modal = (props: IModalProps) => {
  const { message, children, error, modal, title, onSubmit, onCancel, className, childClass, contentClass } = props;
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
    <div className={`modal__container${className ? ` ${className}` : ''}`} >
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
        <div className={`modal__message-container${contentClass ? ` ${contentClass}` : ''}`}>
          {message}
        </div>
        <div className={`modal__child-container ${childClass || ''}`.trim()}>
          {children}
        </div>
      </Dialog>
    </div>
  );
};

const ModalContainer = connect<{}, {}, IModalProps>(null, { hideModal })(Modal);

export default ModalContainer;
