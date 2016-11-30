import React, { Component, PropTypes } from 'react';
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
      defaultId: props.item.get('defaultModule') ? props.item.get('defaultModule').get('id') : -1,
    };
    props.change('modules', moduleIds);
  }

  handleAddModule(module) {
    if (!module) {
      return;
    }
    const modules = this.state.modules.filter(mdl => mdl.get('id') !== module.get('id')).push(module);
    this.updateForm(modules);
    if (modules.size === 1) {
      this.updateDefaultModule(module.get('id'));
    }
  }

  handleDeleteModule(module) {
    if (!module) {
      return;
    }
    const modules = this.state.modules.filter(mdl => mdl.get('id') !== module.get('id'));
    this.updateForm(modules);
    // if there is only one module set it as the default
    if (modules.size === 0) {
      this.updateDefaultModule(null);
    } else {
      console.log(modules.toJS());
      console.log(modules.get(0).get('id'));
      this.updateDefaultModule(modules.get(0).get('id'));
    }
  }

  updateForm(modules) {
    const moduleIds = modules.map(mdl => mdl.get('id'));
    this.setState({ modules }, () => {
      this.props.change('modules', moduleIds);
    });
  }

  updateDefaultModule(defaultId) {
    this.setState({ defaultId }, () => (
      this.props.change('defaultModule', defaultId)
    ));
  }

  render() {
    const { modules, defaultId } = this.state;
    return (
      <div className="admin__module-edit">
        <h3>Modules</h3>
        <List>
          {modules && modules.size === 0 ? <div className="admin__message" >No Modules</div> : ''}
          {modules.map((module, i) => (
            <MenuItem
              onTouchTap={() => this.updateDefaultModule(module.get('id'))}
              key={i}
              className={defaultId === module.get('id') ? 'admin__modules-default' : undefined}
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
          {this.props.modules ? this.props.modules.map((module, i) => (
            <MenuItem
              key={i}
              value={module.get('name')}
              primaryText={module.get('name')}
              onClick={() => this.handleAddModule(module)}
            />
          )) : ''}
        </SelectField>
      </div>
    );
  }
}

ModuleEdit.propTypes = {
  item: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
  modules: PropTypes.object.isRequired,
};

export default ModuleEdit;
