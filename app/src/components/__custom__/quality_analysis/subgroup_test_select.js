import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { INFINITY_TESTS } from './constants';

const TestSelect = ({ test, setActiveTest }) => (
  <div className="quality_analysis__test-select-container">
    <SelectField
      value={test}
      hintText="Test Name"
      onChange={setActiveTest}
      style={{ width: '150px' }}
    >
      <MenuItem value={null} primaryText="" />
      {INFINITY_TESTS.map(testName => <MenuItem value={testName} primaryText={testName} />)}
    </SelectField>
  </div>
);

TestSelect.propTypes = {
  test: PropTypes.string,
  setActiveTest: PropTypes.func.isRequired,
};

export default TestSelect;
