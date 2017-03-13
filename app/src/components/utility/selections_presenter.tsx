import DropDownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import * as React from 'react';

import { IDictionary } from '../../constants/interfaces';

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

export interface ISelectionsPresenterProps {
  value: string;
  hintText: string;
}

const displaySelectionsRenderer = (value: any, hintText: string): JSX.Element => {
  return value.length
    ? typeof value === 'string' ? value : value.join(', ')
    : hintText;
};

const SelectionsPresenter = ({ value, hintText }: ISelectionsPresenterProps) => {
  let hintStyle: IDictionary<any> = { flex: 1 };
  if (!value) {
    hintStyle = { flex: 1, color: '#999', fontStyle: 'italic', fontSize: '0.8rem', outline: 'none' };
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

export default SelectionsPresenter;
