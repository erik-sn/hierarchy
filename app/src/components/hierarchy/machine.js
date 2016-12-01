import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import getComponent from '../../utils/library';
import { renderModules } from './utils';

class Machine extends Component {

  constructor(props) {
    super(props);
    const machine = props.hierarchy.get('machine');
    this.state = {
      activeModule: machine.get('defaultModule'),
      url: `/${window.location.pathname}/${machine.get('name').toLowerCase()}`,
    };
    this.sortModules = this.sortModules.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const site = nextProps.hierarchy.get('site');
    const nextmachine = nextProps.hierarchy.get('machine');
    const url = window.location.pathname;
    if (nextmachine.get('id') !== this.props.hierarchy.get('machine').get('id')) {
      this.setState({ url, activeModule: nextProps.hierarchy.get('machine').get('defaultModule') });
    } else {
      this.setState({ url });
    }
  }

  renderActiveModule() {
    const { data, hierarchy } = this.props;
    const { activeModule } = this.state;
    const dataStore = data ? data.get(activeModule.get('name').toLowerCase()) : {};
    const componentProps = { parent: hierarchy.get('machine'), module: activeModule, data: dataStore };
    return getComponent(activeModule.get('name'), componentProps);
  }

  render() {
    const { activeModule } = this.state;
    const { params, data, hierarchy } = this.props;
    const description = activeModule ? activeModule.get('description') : 'Machine List';
    return (
      <div className="machine__container">
        <div className="machine__module-container">
          {renderModules(activeModule, hierarchy.get('machine'), 'machine')}
        </div>
        <div className="machine__content-container" >
          {description.trim() !== '' ?
            <div className="machine__description-container">
              {description}
            </div> : undefined}
          <div className="machine__component-container">
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
};

function mapStateToProps(state, ownProps) {
  const id = ownProps.hierarchy.get('machine').get('id');
  return { data: state.get('data').get(id) };
}

export default connect(mapStateToProps)(Machine);
