import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import { browserHistory } from 'react-router';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import { List, ListItem } from 'material-ui/List';

import { renderTextField, renderCheckbox } from '../../../utils/form_renderer';

const ROOT = '/admin/hierarchy';

class Machine extends Component {

  constructor(props) {
    super(props);
    this.state = {
      department: undefined,
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

  setActiveDepartment(department) {
    const { change } = this.props;
    change('name', department.get('name'));
    change('active', department.get('active'));
    this.setState({ department });
  }

  renderMachines() {
    if (!this.state.department) {
      return [];
    }
    const { site } = this.props;
    return this.state.department.get('machines').map((machine, i) => (
      <ListItem
        key={i}
        onClick={() => browserHistory.push(`${ROOT}/${site.get('code')}/machines/${machine.get('name')}`.toLowerCase())}
        primaryText={machine.get('name')}
      />
    ));
  }

  render() {
    const { site, handleSubmit } = this.props;
    const { department } = this.state;
    return (
      <form onSubmit={handleSubmit} className="admin__form-container" >
        <div className="admin__form-section">
          <div className="mui-form-component">
            <SelectField
              className="admin__form-field"
              label="Department"
              value={department ? department.get('name') : ''}
            >
              {this.getDepartments(site)}
            </SelectField>
          </div>
          <List>
            {this.renderMachines()}
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
