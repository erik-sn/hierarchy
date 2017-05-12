import * as fs from 'fs';
import * as moment from 'moment';
import * as username from 'username';


function getComponent(name: string, user: string): string {
  const timestamp: string = moment().format('YYYY-MM-DD HH:mm:ss Z');
  const componentName: string = name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  const content: string =
`/**
 * Module Created: ${timestamp}
 * Author: ${user}
 */
import * as React from 'react';

import { IHierarchyTier, IBaseModule } from '../../../../src/constants/interfaces';

export interface IProps extends IBaseModule {
  departmentDataStore: any;
}

const ${componentName} = ({ parent }: IProps) => (
  <div className="${name}__container" >
    <h3>Hello ${name}</h3>
    <div>Parent: {parent.name}</div>
  </div>
);

export default ${componentName};
`;
  return content;
}

function getTestComponent(name: string): string {
  const componentName: string = name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  const content: string =
`
import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { IHierarchyTier } from '../../../../src/constants/interfaces';
import ${componentName}, { IProps } from './${name}';

describe('${name}.tsx |', () => {
  describe('Default | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: IProps = {
      parent: {
        name: 'parent',
        modules: undefined,
        active: true,
        apiCalls: [],
        machines: [],
        site: undefined,
      },
      module: undefined,
      type: 'department',
      departmentDataStore: undefined,
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
const dir: string = `src/components/__modules__/${moduleName}/`;
try {
  fs.accessSync(dir);
  console.log(`The module '${moduleName}' already exists.`);
} catch (e) {
  fs.mkdir(dir);
  username().then((user: string) => {
    fs.writeFile(`${dir}/${moduleName}.tsx`, getComponent(moduleName, user));
    fs.writeFile(`${dir}/${moduleName}.test.tsx`, getTestComponent(moduleName));
    fs.writeFile(`${dir}/${moduleName}.scss`, getStyle(moduleName));
    console.log(`Successfully created module: '${moduleName}`);
  });
}
