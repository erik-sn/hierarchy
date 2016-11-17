import React from 'react';
import { expect } from 'chai';

import { mountWithTheme } from '../helper';
import { Modal } from '../../src/components/modal';

describe('modal.test.js |', () => {
  describe('Expected | >>>', () => {
    let component;
    let AppBar;
    let children;
    const props = {
      title: 'test title',
      message: 'test message',
      children: <h1>Child JSX!</h1>,
      modal: false,
    };

    beforeEach(() => {
      component = mountWithTheme(<Modal {...props} />);
      const appBar = component.find('Dialog').props().title;
      const child = component.find('Dialog').props().children;
      children = mountWithTheme(<div>{child}</div>);
      AppBar = mountWithTheme(appBar);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.exist();
      expect(component.find('.modal__container')).to.have.length(1);
    });

    it('2. has the correct title', () => {
      expect(AppBar.find('AppBar').prop('title')).to.equal(props.title);
    });

    it('3. has the correct message', () => {
      expect(children.find('.modal__message-container').text()).to.equal(props.message);
    });

    it('4. has the correct child element', () => {
      expect(children.find('.modal__child-container').contains(props.children)).to.equal(true);
    });

    it('5. has the ok action when modal is false ', () => {
      expect(component.find('Dialog').props().actions).to.have.length(1);
    });
  });


  describe('Modal for errors | >>>', () => {
    let component;
    let AppBar;
    const props = {
      title: 'test title',
      message: 'test message',
      children: <h1>Child JSX!</h1>,
      modal: true,
      error: true,
    };

    beforeEach(() => {
      component = mountWithTheme(<Modal {...props} />);
      const appBar = component.find('Dialog').props().title;
      AppBar = mountWithTheme(appBar);
    });

    it('1. renders something & has correct containers', () => {
      expect(component).to.exist();
      expect(component.find('.modal__container')).to.have.length(1);
    });

    it('2. has the correct title and an error icon when error is true', () => {
      expect(AppBar.find('AlertError')).to.have.length(1);
      expect(AppBar.find('AppBar').prop('title')).to.equal(props.title);
    });

    it('3. has no actions when modal is true ', () => {
      expect(component.find('Dialog').props().actions).to.equal(undefined);
    });
  });
});
