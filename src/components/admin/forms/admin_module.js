import React, { Component } from 'react';
import { cloneDeep } from 'lodash';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Add from 'material-ui/svg-icons/content/add';

import Modal from '../../modal';

class NewModule extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showNewModule: false,
      newModuleText: '',
      module: undefined,
    };
    this.addNewModule = this.addNewModule.bind(this);
    this.updateModuleField = this.updateModuleField.bind(this);
    this.hideNewModule = this.hideNewModule.bind(this);
  }

  getModules(item) {
    if (!item) {
      return [];
    }
    return item.get('modules').map((module, i) => (
      <MenuItem
        key={i}
        value={module.get('name')}
        primaryText={module.get('name')}
        onClick={() => this.setActive('module', module)}
      />
    ));
  }

  setActive(type, object) {
    const { change } = this.props;
    change(type, object.get('name'));
    const newState = cloneDeep(this.state);
    newState[type] = object;
    this.setState(newState);
  }

  addNewModule() {
    const { type, target } = this.props;
    const name = this.state.newModuleText;
    console.log('adding module: ', target, this.state.newModuleText);
    this.hideNewModule();
  }

  hideNewModule() {
    this.setState({ newModuleText: '', showNewModule: false });
  }

  updateModuleField({ target }) {
    this.setState({ newModuleText: target.value });
  }

  renderNewModuleModal() {
    return (
      <Modal
        title="Add a Module"
        message="Enter the name of the new module"
        modal={false}
        onSubmit={this.addNewModule}
        onCancel={this.hideNewModule}
      >
        <div className="mui-form-component">
          <TextField
            hintText="New Module Name"
            floatingLabelText="Module Name"
            value={this.state.newModuleText}
            onChange={this.updateModuleField}
          />
        </div>
      </Modal>
    );
  }

  render() {
    const { module } = this.state;
    return (
      <div className="admin__new-module-container">
        {this.state.showNewModule ? this.renderNewModuleModal() : undefined}
        <SelectField
          className="admin__form-field"
          hintText="Modules"
          label="modules"
          value={module ? module.get('name') : ''}
        >
          {this.getModules(this.props.target)}
        </SelectField>
        <FlatButton
          label="Add Module"
          onClick={() => this.setState({ showNewModule: true })}
          icon={<Add />}
          primary
        />
      </div>
    );
  }
}

export default NewModule;
