import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import getComponent from '../../utils/library';
import renderModules, { retrieveModule } from './renderModules';

class Machine extends Component {

  constructor(props) {
    super(props);
    const machine = props.hierarchy.get('machine');
    this.state = {
      activeModule: props.activeModuleLabel ? retrieveModule(machine, props.activeModuleLabel) : machine.get('defaultModule'),
      url: `/${window.location.pathname}/${machine.get('name').toLowerCase()}`,
    };
    this.setActiveModule = this.setActiveModule.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const nextMachine = nextProps.hierarchy.get('machine');
    const url = window.location.pathname;
    if (nextMachine.get('id') !== this.props.hierarchy.get('machine').get('id')) {
      let activeModule = nextMachine.get('defaultModule');
      if (nextProps.activeModuleLabel) {
        activeModule = retrieveModule(nextMachine, nextProps.activeModuleLabel);
      }
      this.setState({ url, activeModule });
    } else {
      this.setState({ url });
    }
  }

  setActiveModule(activeModule) {
    this.setState({ activeModule });
  }

  renderActiveModule() {
    const { data, hierarchy } = this.props;
    const { activeModule } = this.state;
    const componentProps = {
      key: hierarchy.get('machine').get('id'),
      departmentId: hierarchy.get('department').get('id'),
      type: 'machine',
      parent: hierarchy.get('machine'),
      module: activeModule,
      data,
    };
    return getComponent(activeModule.get('name'), componentProps);
  }

  render() {
    const { activeModule } = this.state;
    const { hierarchy } = this.props;
    const description = activeModule ? activeModule.get('description') : 'Machine List';
    return (
      <div className="display__container">
        <div className="display__module-container">
          {renderModules(activeModule, hierarchy.get('machine'), this.setActiveModule)}
        </div>
        <div className="display__content-container" >
          {description.trim() !== '' ?
            <div className="display__description-container">
              {description}
            </div> : undefined}
          <div className="display__component-container">
            {activeModule === null ? <h3 style={{ textAlign: 'center' }}>No Modules Available</h3> : this.renderActiveModule()}
          </div>
        </div>
      </div>
    );
  }
}

Machine.propTypes = {
  data: PropTypes.object,
  hierarchy: PropTypes.object,
  activeModuleLabel: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  const id = ownProps.hierarchy.get('department').get('id');
  return { data: state.get('data').get(id) };
}

export default connect(mapStateToProps)(Machine);