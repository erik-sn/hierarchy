const moment = require('moment');
const username = require('username');
const fs = require('fs');

function getComponent(name: string, user: string): string {
  const timestamp: string = moment().format('YYYY-MM-DD HH:mm:ss Z');
  const componentName: string = name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  const content: string =
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
    <div>Parent: {props.parent.get('name')}</div>
  </div>
);

${componentName}.propTypes = {
  parent: PropTypes.object.isRequired,
};

export default ${componentName};
`
  return content;
}

function getTestComponent(name: string): string {
  const componentName: string = name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  const content: string =
`import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import ${componentName} from './${name}';

describe('${name}.js |', () => {
  describe('Default | >>>', () => {
    let component;
    const props = {
      parent: Map({ name: 'test_parent' }),
    };

    beforeEach(() => {
      component = shallow(<${componentName} {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.${name}__container')).to.have.length(1);
    });
  });
});
`;
  return content;
}

function getStyle(name: string): string {
  const content =
`@import "../../../../static/sass/style";

.${name}__container {
  color: skyblue;
}
`;
  return content;
}

// parsing and validation
const args: string[] = process.argv.slice(2);
if (args.length > 1) {
  throw Error(`Expected single argument representing module name. Instead got: ${args}`);
}
const moduleName: string = args[0].trim().toLowerCase();
if (!/^[\w]+$/.test(moduleName)) {
  throw Error('Module name can only be letters, numbers or underscores');
}

// create module if it does not exist
const dir: string = `src/components/__custom__/${moduleName}/`;
try {
  fs.accessSync(dir, fs.F_OK);
  console.log(`The module '${moduleName} already exists.`);
} catch (e) {
  fs.mkdir(dir);
  username().then((user: string) => {
    fs.writeFile(`${dir}/${moduleName}.js`, getComponent(moduleName, user));
    fs.writeFile(`${dir}/${moduleName}.test.js`, getTestComponent(moduleName));
    fs.writeFile(`${dir}/${moduleName}.scss`, getStyle(moduleName));
    console.log(`Successfully created module: '${moduleName}`);
  });
}
