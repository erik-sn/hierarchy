import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

function renderSpecifiactions(specifications) {
  return specifications.map((spec, i) => (
    <MenuItem key={i} value={spec} primaryText={spec} />
  ));
}


const SpecificationSelect = ({ specifications, activeSpec, onChange }) => (
  <div className="spa__specification-select">
    <SelectField
      value={activeSpec}
      onChange={onChange}
      maxHeight={300}
      fullWidth
      labelStyle={{ color: 'whitesmoke '}}
    >
      {renderSpecifiactions(specifications)}
    </SelectField>
  </div>
);

SpecificationSelect.propTypes = {
  specifications: PropTypes.object.isRequired,
  activeSpec: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SpecificationSelect;
