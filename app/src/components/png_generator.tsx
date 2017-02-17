import Image from 'material-ui/svg-icons/image/image';
import * as React from 'react';

const saveSvgAsPng = require('save-svg-as-png').saveSvgAsPng;

export interface IPngGeneratorProps {
  customClass?: string;
  customStyle?: {};
  fileName: string;
  target: string;
  showTooltip?: boolean;
}

function generateClickHandler(fileName: string, target: string): any {
  return () => {
    const svg = document.getElementsByClassName(target)[0].getElementsByTagName('svg')[0];
    if (!svg) {
      console.warn(`Could not locate svg to download for target: ${target}`);
    }
    saveSvgAsPng(svg, fileName);
  };
}

const PngGenerator = (props: IPngGeneratorProps): JSX.Element => {
  const { fileName, customClass, customStyle, showTooltip, target } = props;
  const handleClick = generateClickHandler(fileName, target);
  return (
    <div className="image__container">
      {showTooltip ? <div className="image__container-tooltip tooltip">
        Download Image
      </div>
      : undefined}
      <Image
        className={`png__container${customClass ? ` ${customClass}` : ''}`}
        style={customStyle}
        color="#FFFFFF"
        height={40}
        width={40}
        onClick={handleClick}
      />
    </div>
  );
};


export default PngGenerator;
