import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import ModalConnected, { IModalProps, Modal} from '../../src/components/modal';
import { mountWithTheme } from '../helper';

describe('modal.test.tsx |', () => {
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IModalProps = {
      title: 'test title',
      message: 'test message',
      children: [<h1>Child JSX!</h1>],
      modal: false,
      onSubmit: () => undefined,
    };

    beforeEach(() => {
      component = shallow(<Modal {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.modal__container')).to.have.length(1);
    });

    it('has the correct title', () => {
      const appBar: any = component.find('Dialog').props().title;
      const AppBar: ReactWrapper<{}, {}> = mountWithTheme(appBar);
      expect(AppBar.find('AppBar').prop('title')).to.equal(props.title);
    });

    it('has the correct message', () => {
      expect(component.find('.modal__message-container').text()).to.equal(props.message);
    });

    it('has the correct child element', () => {
      expect(component.find('.modal__child-container').contains(props.children[0])).to.equal(true);
    });

    it('has the ok action when modal is false ', () => {
      const dialogProps: any = component.find('Dialog').props();
      expect(dialogProps.actions).to.have.length(1);
    });

    it('has the ok action when modal is false ', () => {
      const updateProps: IModalProps = {
        title: 'test title',
        message: 'test message',
        children: [<h1>Child JSX!</h1>],
        modal: false,
        onSubmit: () => undefined,
        onCancel: () => 'hi!',
      };
      component = shallow(<Modal {...updateProps} />);
      const dialogProps: any = component.find('Dialog').props();
      expect(dialogProps.actions).to.have.length(2);
    });
  });


  describe('Modal for errors | >>>', () => {
    let component: ReactWrapper<{}, {}>;
    const props: IModalProps = {
      title: 'test title',
      message: 'test message',
      children: [<h1>Child JSX!</h1>],
      modal: true,
      error: true,
    };

    beforeEach(() => {
      component = mountWithTheme(<Modal {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.modal__container')).to.have.length(1);
    });

    it('has the correct title and an error icon when error is true', () => {
      const appBar: any = component.find('Dialog').props().title;
      const AppBar: ReactWrapper<{}, {}> = mountWithTheme(appBar);
      expect(AppBar.find('AlertError')).to.have.length(1);
      const appBarProps: any = AppBar.find('AppBar').props();
      expect(appBarProps.title).to.equal(props.title);
    });

    it('has no actions when modal is true ', () => {
      const dialogProps: any = component.find('Dialog').props();
      expect(dialogProps.actions).to.equal(undefined);
    });
  });
});
