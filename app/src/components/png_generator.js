import React from 'react';
import { saveSvgAsPng } from 'save-svg-as-png';

const PngGenerator = (props) => {  
  const { label, fileName, customClass, customStyle, target } = props;  
  return (
    <button
      className={customClass}
      type="button"
      style={customStyle}
      onClick={() => saveSvgAsPng(document.getElementsByClassName(target)[0], fileName)}
    >
      {label}
    </button>
  );
};

export default PngGenerator;