import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { INFINITY_TESTS } from './constants';

const TestSelect = ({ test, setActiveTest }) => {
  return (
    <SelectField
      floatingLabelText="Select a Test"
      value={test}
      onChange={setActiveTest}
    >
      <MenuItem value={null} primaryText="" />
      {INFINITY_TESTS.map(testName => <MenuItem value={testName} primaryText={testName} />)}
    </SelectField>
  );
};

TestSelect.propTypes = {
  test: PropTypes.string,
  setActiveTest: PropTypes.func.isRequired,
};

export default TestSelect;
