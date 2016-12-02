import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Add from 'material-ui/svg-icons/content/add';

import types from '../../actions/types';
import Modal from '../modal';
import DepartmentForm from './forms/admin_department_form';

class Department extends Component {

  constructor(props) {
    super(props);
    this.state = {
      department: undefined,
      showNewDepartment: false,
    };
    this.createDepartment = this.createDepartment.bind(this);
    this.updateDepartment = this.updateDepartment.bind(this);
    this.toggleShowNewDepartmentForm = this.toggleShowNewDepartmentForm.bind(this);
  }

  getDepartments(site) {
    return site.get('departments').map((department, i) => (
      <MenuItem
        key={i}
        value={department.get('name')}
        primaryText={department.get('name')}
        onTouchTap={() => this.setState({ department })}
      />
    ));
  }

  createDepartment(department) {
    const departmentWithSite = department.set('site', this.props.site.get('id'));
    axios.post(`${types.API}/departments/`, departmentWithSite, types.API_CONFIG)
    .then(() => this.props.message(`Department Successfully Created: ${department.get('name')}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.props.message(`Error Creating Department: ${department.get('name')}`))
    .then(() => this.resetState());
  }

  updateDepartment(department) {
    const departmentWithSite = department.set('site', this.props.site.get('id'));
    axios.put(`${types.API}/departments/${department.get('id')}/`, departmentWithSite, types.API_CONFIG)
    .then(() => this.props.message(`Department Successfully Updated: ${department.get('name')}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.props.message(`Error Updating Department: ${department.get('name')}`))
    .then(() => this.resetState());
  }

  resetState() {
    this.setState({ department: undefined, showNewDepartment: false });
  }

  toggleShowNewDepartmentForm() {
    this.setState({ showNewDepartment: !this.state.showNewDepartment });
  }

  renderNewDepartment() {
    return (
      <Modal
        title="Create New Department"
        onCancel={this.toggleShowNewDepartmentForm}
      >
        <DepartmentForm
          submitForm={this.createDepartment}
          modal
          new
        />
      </Modal>
    );
  }

  render() {
    const { site, modules, apicalls } = this.props;
    const { department, showNewDepartment } = this.state;
    return (
      <div className="admin__department-container">
        {showNewDepartment ? this.renderNewDepartment() : undefined}
        <SelectField
          maxHeight={250}
          className="admin__form-field"
          label="Department"
          name="name"
          value={department ? department.get('name') : ''}
        >
          {this.getDepartments(site)}
        </SelectField>
        {department ?
          <DepartmentForm
            key={department.get('id')}
            submitForm={this.updateDepartment}
            department={department}
            modules={modules}
            apicalls={apicalls}
          />
        :
          <FlatButton
            onClick={this.toggleShowNewDepartmentForm}
            label="Add Department"
            icon={<Add />}
            primary
          />
        }
      </div>
    );
  }
}

Department.propTypes = {
  apicalls: PropTypes.object.isRequired,
  fetchHierarchy: PropTypes.func.isRequired,
  message: PropTypes.func.isRequired,
  modules: PropTypes.object.isRequired,
  site: PropTypes.object.isRequired,
};

export default Department;
