import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Add from 'material-ui/svg-icons/content/add';
import Remove from 'material-ui/svg-icons/content/remove';
import Edit from 'material-ui/svg-icons/editor/mode-edit';

import Modal from '../../modal';

class NewModule extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showNewModule: false,
      showEditModule: false,
      showDeleteModule: false,
      newModuleText: '',
      module: undefined,
    };
    this.addNewModule = this.addNewModule.bind(this);
    this.updateModuleField = this.updateModuleField.bind(this);
    this.hideNewModule = this.hideNewModule.bind(this);
  }

  getModules(item) {
    if (!item || !item.get('modules')) {
      return [];
    }
    return item.get('modules').map((module, i) => (
      <MenuItem
        key={i}
        value={module.get('name')}
        primaryText={module.get('name')}
        onClick={() => this.setState({ module })}
      />
    ));
  }

  addNewModule() {
    // const { type, target } = this.props;
    // const name = this.state.newModuleText;
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
          className="admin__add-module-button"
          label="Add Module"
          onClick={() => this.setState({ showNewModule: true })}
          icon={<Add />}
          primary
        />
        {module ?
          <FlatButton
            className="admin__edit-module-button"
            label="Edit Module"
            onClick={() => this.setState({ showEditModule: true })}
            icon={<Edit />}
            primary
          /> : undefined
        }
        {module ?
          <FlatButton
            className="admin__delete-module-button"
            label="Delete Module"
            onClick={() => this.setState({ showDeleteModule: true })}
            icon={<Remove />}
            primary
          /> : undefined
        }
      </div>
    );
  }
}

export default NewModule;
