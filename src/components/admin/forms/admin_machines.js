import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import { List } from 'material-ui/List';

import NewModule from './admin_module';

import { renderTextField, renderCheckbox } from '../../../utils/form_renderer';

export class Machine extends Component {

  constructor(props) {
    super(props);
    this.state = {
      department: undefined,
      machine: undefined,
      module: undefined,
    };
  }

  getDepartments(site) {
    return site.get('departments').map((department, i) => (
      <MenuItem
        key={i}
        value={department.get('name')}
        primaryText={department.get('name')}
        onClick={() => this.setActiveDepartment(department)}
      />
    ));
  }

  getMachines(department) {
    if (!department) {
      return [];
    }
    return department.get('machines').map((machine, i) => (
      <MenuItem
        key={i}
        value={machine.get('name')}
        primaryText={machine.get('name')}
        onClick={() => this.setActiveMachine(machine)}
      />
    ));
  }

  setActiveDepartment(department) {
    const { change } = this.props;
    change('department', department.get('name'));
    this.setState({ department });
  }

  setActiveMachine(machine) {
    const { change } = this.props;
    change('machine', machine.get('name'));
    change('name', machine.get('name'));
    change('type', machine.get('type'));
    change('active', machine.get('active'));
    this.setState({ machine });
  }

  renderMachine() {
    const { department, machine } = this.state;
    if (!department) {
      return <h3>Select a Department</h3>;
    } else if (!machine) {
      return <h3>Select a Machine</h3>;
    }
    return (
      <div className="admin__machine-container">
        <Field className="admin__form-field" name="name" component={renderTextField} label="Name" />
        <Field className="admin__form-field" name="type" component={renderTextField} label="Type" />
        <div style={{ width: '100%', height: '20px' }} />
        <Field className="admin__form-field" name="active" component={renderCheckbox} label="Active" />
        <div style={{ width: '100%', height: '20px' }} />
        <NewModule type="machine" target={machine} />
      </div>
    );
  }


  render() {
    const { site, handleSubmit } = this.props;
    const { department, machine, showNewModule } = this.state;
    return (
      <form onSubmit={handleSubmit} className="admin__form-container" >
        {showNewModule ? this.renderNewModuleModal() : ''}
        <div className="admin__form-section">
          <div className="mui-form-component">
            <SelectField
              className="admin__form-field admin__department_select"
              hintText="Department"
              label="Department"
              value={department ? department.get('name') : ''}
            >
              {this.getDepartments(site)}
            </SelectField>
            <SelectField
              className="admin__form-field admin__machine_select"
              hintText="Machine"
              label="Machine"
              value={machine ? machine.get('name') : ''}
            >
              {this.getMachines(department)}
            </SelectField>
          </div>
          <List>
            {this.renderMachine()}
          </List>
        </div>
      </form>
    );
  }
}

// Decorate the form component
const MachineForm = reduxForm({
  form: 'machine_form',
})(Machine);

export default MachineForm;
