import React, { Component } from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import { List } from 'material-ui/List';
import Close from 'material-ui/svg-icons/navigation/close';

class ModuleEdit extends Component {

  constructor(props) {
    super(props);
    const moduleIds = props.item.get('modules').map(mdl => mdl.get('id'));
    this.state = {
      modules: props.item.get('modules'),
    };
    props.change('modules', moduleIds);
  }

  handleAddModule(module) {
    const modules = this.state.modules.filter(mdl => mdl.get('id') !== module.get('id')).push(module);
    this.updateForm(modules);
  }

  handleDeleteModule(module) {
    const modules = this.state.modules.filter(mdl => mdl.get('id') !== module.get('id'));
    this.updateForm(modules);
  }

  updateForm(modules) {
    const moduleIds = modules.map(mdl => mdl.get('id'));
    this.setState({ modules }, () => this.props.change('modules', moduleIds));
  }

  render() {
    const { modules } = this.state;
    return (
      <div className="admin__module-edit">
        <h3>Modules</h3>
        <List>
          {modules.size === 0 ? <div>No Modules</div> : ''}
          {modules.map((module, i) => (
            <MenuItem
              key={i}
              value={module.get('name')}
              primaryText={module.get('name')}
              rightIcon={<Close onClick={() => this.handleDeleteModule(module)} />}
            />
          ))}
        </List>
        <SelectField
          style={{ width: '100%' }}
          hintText="Add Module"
          maxHeight={300}
        >
          {this.props.modules.map((module, i) => (
            <MenuItem
              key={i}
              value={module.get('name')}
              primaryText={module.get('name')}
              onClick={() => this.handleAddModule(module)}
            />
          ))}
        </SelectField>
      </div>
    );
  }
}

export default ModuleEdit;
