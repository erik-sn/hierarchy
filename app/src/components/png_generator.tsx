import Image from 'material-ui/svg-icons/image/image';
import * as React from 'react';

const saveSvgAsPng = require('save-svg-as-png').saveSvgAsPng;

export interface IPngGeneratorProps {
  customClass?: string;
  customStyle?: {};
  fileName: string;
  target: string;
}

const PngGenerator = (props: IPngGeneratorProps): JSX.Element => {
  const { fileName, customClass, customStyle, target } = props;
  const handleClick = () => saveSvgAsPng(document.getElementsByClassName(target)[0], fileName);
  return (
    <Image
      className={`png__container${customClass ? ` ${customClass}` : ''}`}
      style={customStyle}
      color="#FFFFFF"
      height={40}
      width={40}
      onClick={handleClick}
    />
  );
};


export default PngGenerator;
