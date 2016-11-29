import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Card, CardTitle, CardHeader, CardText } from 'material-ui/Card';
import GoogleMap from 'google-map-react';
import Place from 'material-ui/svg-icons/maps/place';
import Arrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import { showModal, hideModal } from '../../actions/index';
import { alphaNumSort } from '../../utils/sort';
import NotFound from '../notfound';

export const MachineContainer = props => (
  <CardText className="main__site-machinecount" style={{ padding: '0px' }} >
    <div className="main__machine-container">
      {props.dpt.get('machines').map(mch => mch.get('name')).sort(alphaNumSort).map((mch, j) => (
        <MachineItem key={j} name={mch} url={props.url} />
      ))}
    </div>
  </CardText>
);

MachineContainer.propTypes = {
  dpt: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
};

export const MachineItem = props => (
  <Link className="main__machine-item host__label-small" to={`${props.url}/${props.name}`.toLowerCase()} >
    <div className="main__machine-item-label">{props.name}</div>
  </Link>
);

MachineItem.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export const Site = (props) => {
  const { site, showMap } = props;
  const showPlace = site.get('latitude') && site.get('longitude');
  return (
    <Link
      className="main__site-container host__label-large"
      to={`/${site.get('code').toLowerCase()}`}
    >
      <Card className="main__site-card">
        <CardTitle
          className="main__site-title"
          title={`${site.get('name')} - ${site.get('code')}`}
          subtitle={site.get('location')}
        >
          {showPlace ?
            <Place onClick={e => showMap(site, e)} className="main__site-place" /> :
            undefined
          }
        </CardTitle>
        <CardText className="main__site-departmentcount">
          Departments: {site.get('departments').size}
        </CardText>
      </Card>
    </Link>
  );
};

Site.propTypes = {
  site: PropTypes.object.isRequired,
  showMap: PropTypes.func.isRequired,
};

export const Department = (props) => {
  const { site, dpt } = props;
  const url = `/${site.get('code')}/${dpt.get('name')}`;
  const title = (
    <Link to={url.toLowerCase()} >
      <div className="main__department-title">
        <div className="main__department-title-icon"><Arrow style={{ height: '35px', width: '35px' }} /></div>
        <div className="main__department-title-label">
          {`${dpt.get('name')}`}
        </div>
      </div>
    </Link>
  );
  return (
    <Card className="main__department-container">
      <CardHeader
        className="main__department-title-container"
        title={title}
        actAsExpander
        showExpandableButton
      />
      <CardText
        className="main-department-machine-outer"
        style={{ padding: '0px' }}
        expandable
      >
        <MachineContainer url={url} dpt={dpt} />
      </CardText>
    </Card>
  );
};

Department.propTypes = {
  site: PropTypes.object.isRequired,
  dpt: PropTypes.object.isRequired,
};

export class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMap: false,
      coordinates: { lat: undefined, lng: undefined },
    };
    this.showMap = this.showMap.bind(this);
  }


  showMap(site, e) {
    e.preventDefault(); // stop navigation
    const lat = site.get('latitude');
    const lng = site.get('longitude');

    const map = (
      <div style={{ width: '100%', height: 400 }}>
        <GoogleMap
          height="200"
          width="200"
          center={[parseFloat(lat), parseFloat(lng)]}
          zoom={16}
        />
      </div>
    );
    this.props.showModal(`Address: ${site.get('address')}`, '', map);
  }

  render() {
    const { hierarchy, sites } = this.props;
    if (!hierarchy) {
      return <NotFound />;
    }
    if (sites.size === 0) {
      return (
        <div className="main__message">
          <h3>No Sites Have been configured - contact the administrator</h3>
        </div>
      );
    }

    const site = hierarchy.get('site');
    let display;
    if (!site) {
      display = (
        <div className="main__sites">
          {sites.map((s, i) => <Site showMap={this.showMap} key={i} site={s} />)}
        </div>
      );
    } else {
      display = (
        <div className="main__departments">
          {site.get('departments').map((dpt, i) => <Department key={i} site={site} dpt={dpt} />)}
        </div>
      );
    }
    return (
      <div className="main__container">
        {display}
      </div>
    );
  }
}

Main.propTypes = {
  hierarchy: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired,
  sites: PropTypes.object.isRequired,
};

const MainContainer = connect(null, { showModal, hideModal })(Main);

export default MainContainer;

