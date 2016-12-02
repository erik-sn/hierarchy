import React, { Component, PropTypes } from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import { List } from 'material-ui/List';
import Close from 'material-ui/svg-icons/navigation/close';

class ApiEdit extends Component {

  constructor(props) {
    super(props);
    const apiCallIds = props.item.get('apiCalls').map(api => api.get('id'));
    this.state = {
      apicalls: props.item.get('apiCalls'),
    };
    props.change('apiCalls', apiCallIds);
  }

  handleAddApiCall(apicall) {
    if (!apicall) {
      return;
    }
    const apicalls = this.state.apicalls.filter(api => api.get('id') !== apicall.get('id')).push(apicall);
    this.updateForm(apicalls);
  }

  handleDeleteApiCall(apicall) {
    if (!apicall) {
      return;
    }
    const apicalls = this.state.apicalls.filter(api => api.get('id') !== apicall.get('id'));
    this.updateForm(apicalls);
  }

  updateForm(apicalls) {
    const apiCallIds = apicalls.map(api => api.get('id'));
    this.setState({ apicalls }, () => this.props.change('apiCalls', apiCallIds));
  }

  render() {
    const { apicalls } = this.state;
    return (
      <div className="admin__apicall-edit">
        <h3>API Calls</h3>
        <List>
          {apicalls && apicalls.size === 0 ? <div className="admin__message" >No API Calls</div> : ''}
          {apicalls.map((apicall, i) => (
            <MenuItem
              key={i}
              value={apicall.get('url')}
              primaryText={apicall.get('url')}
              rightIcon={<Close onClick={() => this.handleDeleteApiCall(apicall)} />}
            />
          ))}
        </List>
        <SelectField
          style={{ width: '100%' }}
          hintText="Add Api Call"
          maxHeight={300}
        >
          {this.props.apicalls ? this.props.apicalls.map((apicall, i) => (
            <MenuItem
              key={i}
              value={apicall.get('url')}
              primaryText={apicall.get('url')}
              onClick={() => this.handleAddApiCall(apicall)}
            />
          )) : ''}
        </SelectField>
      </div>
    );
  }
}

ApiEdit.propTypes = {
  item: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
  apicalls: PropTypes.object.isRequired,
};

export default ApiEdit;
