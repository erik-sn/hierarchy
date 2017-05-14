"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var moment = require("moment");
var username = require("username");
function getComponent(name, user) {
    var timestamp = moment().format('YYYY-MM-DD HH:mm:ss Z');
    var componentName = name.split('_').map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1); }).join('');
    var content = "/**\n * Module Created: " + timestamp + "\n * Author: " + user + "\n */\nimport * as React from 'react';\n\nimport { IHierarchyTier, IBaseModule } from '../../../../src/constants/interfaces';\n\nexport interface IProps extends IBaseModule {\n  departmentDataStore: any;\n}\n\nconst " + componentName + " = ({ parent }: IProps) => (\n  <div className=\"" + name + "__container\" >\n    <h3>Hello " + name + "</h3>\n    <div>Parent: {parent.name}</div>\n  </div>\n);\n\nexport default " + componentName + ";\n";
    return content;
}
function getTestComponent(name) {
    var componentName = name.split('_').map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1); }).join('');
    var content = "\nimport { expect } from 'chai';\nimport { shallow, ShallowWrapper } from 'enzyme';\nimport * as React from 'react';\n\nimport { IHierarchyTier } from '../../../../src/constants/interfaces';\nimport " + componentName + ", { IProps } from './" + name + "';\n\ndescribe('" + name + ".tsx |', () => {\n  describe('Default | >>>', () => {\n    let component: ShallowWrapper<{}, {}>;\n    const props: IProps = {\n      parent: {\n        name: 'parent',\n        modules: undefined,\n        active: true,\n        apiCalls: [],\n        machines: [],\n        site: undefined,\n      },\n      module: undefined,\n      type: 'department',\n      departmentDataStore: undefined,\n    };\n\n    beforeEach(() => {\n      component = shallow(<" + componentName + " {...props} />);\n    });\n\n    it('renders something & has correct containers', () => {\n      expect(component.find('." + name + "__container')).to.have.length(1);\n    });\n  });\n});\n";
    return content;
}
function getStyle(name) {
    var content = "@import \"../../../../static/sass/style\";\n\n." + name + "__container {\n  color: skyblue;\n}\n";
    return content;
}
// parsing and validation
var args = process.argv.slice(2);
if (args.length > 1) {
    throw Error("Expected single argument representing module name. Instead got: " + args);
}
var moduleName = args[0].trim().toLowerCase();
if (!/^[\w]+$/.test(moduleName)) {
    throw Error('Module name can only be letters, numbers or underscores');
}
// create module if it does not exist
var dir = "src/components/__modules__/" + moduleName + "/";
try {
    fs.accessSync(dir);
    console.log("The module '" + moduleName + "' already exists.");
}
catch (e) {
    fs.mkdir(dir);
    username().then(function (user) {
        fs.writeFile(dir + "/" + moduleName + ".tsx", getComponent(moduleName, user));
        fs.writeFile(dir + "/" + moduleName + ".test.tsx", getTestComponent(moduleName));
        fs.writeFile(dir + "/" + moduleName + ".scss", getStyle(moduleName));
        console.log("Successfully created module: '" + moduleName);
    });
}
