import React, { Component } from 'react';
import { toJS } from 'immutable';
import { Field, reduxForm } from 'redux-form/immutable';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import { renderTextField, renderCheckbox } from '../../../utils/form_renderer';

class Department extends Component {

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
          <Field className="admin__form-field" name="name" component={renderTextField} label="Name" />
          <div style={{ width: '100%', height: '20px' }} />
          <Field className="admin__form-field" name="active" component={renderCheckbox} label="Active" />
        </div>
      </form>
    );
  }
}

// Decorate the form component
const DepartmentForm = reduxForm({
  form: 'department_form',
})(Department);

export default DepartmentForm;
