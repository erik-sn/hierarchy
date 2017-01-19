import React, { PropTypes } from 'react';
import DropDownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down'

const hrBorderColor = 'rgb(244, 244, 244)';

const hrBorder = {
  bottom: '8px',
  borderStyle: 'none none solid',
  borderTopColor: hrBorderColor,
  borderRightColor: hrBorderColor,
  borderBottomWidth: '1px',
  borderBottomColor: hrBorderColor,
  boxSizing: 'content-box',
  margin: '0px',
  width: '100%',
};



const SelectionsPresenter = ({ value, hintText, displaySelectionsRenderer }) => {
  let hintStyle = { flex: 1 };
  if (!value) {
    hintStyle = { flex: 1, color: '#999', fontStyle: 'italic', fontSize: '0.8rem' };
  }
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div style={hintStyle}>{displaySelectionsRenderer(value, hintText)}</div>
        <DropDownArrow style={{ color: 'white' }} />
      </div>
      <hr style={hrBorder} />
    </div>
  );
};

SelectionsPresenter.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  displaySelectionsRenderer: PropTypes.func,
  hintText: PropTypes.string,
}

SelectionsPresenter.defaultProps = {
  hintText: 'Click me',
  // eslint-disable-next-line no-unused-vars
  displaySelectionsRenderer: (value, hintText) => {
    return value.length
      ? typeof value === 'string' ? value : value.join(', ')
      : hintText
  }
}

export default SelectionsPresenter;