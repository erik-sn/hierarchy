import React, { PropTypes } from 'react';
import { saveSvgAsPng } from 'save-svg-as-png';
import Image from 'material-ui/svg-icons/image/image';

const PngGenerator = (props) => {
  const { fileName, customClass, customStyle, target } = props;
  return (
    <Image
      className={customClass}
      style={customStyle}
      color="#FFFFFF"
      height={40}
      width={40}
      onClick={() => saveSvgAsPng(document.getElementsByClassName(target)[0], fileName)}
    />
  );
};

PngGenerator.propTypes = {
  customClass: PropTypes.string,
  customStyle: PropTypes.object,
  fileName: PropTypes.string,
  target: PropTypes.node,
};

export default PngGenerator;
