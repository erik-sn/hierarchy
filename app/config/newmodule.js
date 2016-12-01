/* eslint-disable  */
const moment = require('moment');
const username = require('username');
const fs = require('fs');

function getComponent(name, user) {
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss Z');
  const componentName = name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  const content = 
`/**
 * Module Created: ${timestamp}
 * Author: ${user}
 */
if (process.env.BROWSER) {
  require('./${name}.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';

const ${componentName} = props => (
  <div className="${name}__container" >
    <h3>Hello ${name}</h3>
    <div>Parent: {props.item.get('name')}</div>
  </div>
);

${componentName}.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ${componentName};
`
  return content;
}

function getTestComponent(name) {
  const componentName = name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  const content = 
`import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import ${componentName} from './${name}';

describe('${name}.js |', () => {
  describe('Default | >>>', () => {
    let component;
    const props = {
      item: Map({ name: 'test_parent' }),
    };

    beforeEach(() => {
      component = shallow(<${componentName} {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.${name}__container')).to.have.length(1);
    });
  });
});
`
  return content;
}

function getStyle(name) {
  const content = 
`@import "../../../../static/sass/style";

.${name}__container {
  color: skyblue;
}
`
  return content;
}

// parsing and validation
const args = process.argv.slice(2);
if (args.length > 1) {
  throw Error(`Expected single argument representing module name. Instead got: ${args}`);
}
const name = args[0].trim().toLowerCase();
if (!/^[\w]+$/.test(name)) {
  throw Error('Module name can only be letters, numbers or underscores');
}

// create module if it does not exist
const dir = `src/components/__custom__/${name}/`;
try {
  fs.accessSync(dir, fs.F_OK);
  console.log(`The module '${name} already exists.`);
} catch (e) {
  fs.mkdir(dir);
  username().then(user => {
    fs.writeFile(`${dir}/${name}.js`, getComponent(name, user));
    fs.writeFile(`${dir}/${name}.test.js`, getTestComponent(name));
    fs.writeFile(`${dir}/${name}.scss`, getStyle(name));
    console.log(`Successfully created module: '${name}`);
  });
}
