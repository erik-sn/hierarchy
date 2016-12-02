import React, { Component } from 'react';

export default class CsvGenerator extends Component {

  constructor(props) {
    super(props);
    this.generateCsv = this.generateCsv.bind(this);
    this.generateContent = this.generateContent.bind(this);
  }
  /**
   * Retrieve data, which should be a flat javascript object, and the
   * fileName to be used from component properties and download a .CSV
   * file to the client. Each object represents a row, and each property
   * within the object a column.
   */
  generateCsv() {
    const { data, params = [], fileName } = this.props;
    if (!data || !fileName) {
      return;
    }

    // generate CSV file contents from the object
    const header = params.map(param => param.header);
    const content = this.generateContent(data, header, params);

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, `${fileName}.csv`);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) { // feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
      }
    }
  }

  /**
   * Generate a comma seperated values (CSV) file based on a javascript object. This
   * object needs to be flat - nested objects are not supported.
   * @param  {object} data
   * @param  {array} header array of strings representing table header
   * @param  {object} params table parameters
   * @return  {string} content
   */
  generateContent(data, header, params) {
    let content = '';
    // make a single header row
    if (header && header.length > 0) {
      content += header.reduce((prev, current) => `${prev},${current}`);
      content += '\r\n';
    }

    // iterate over data array - each object is a row, each property
    // is a column
    for (let i = 0; i < data.length; i++) {
      const obj = data[i];
      for (let j = 0; j < params.length; j++) {
        const label = params[j].label;
        content += `${obj[label] !== undefined ? obj[label] : ''},`;
      }
      content += '\r\n';
    }
    return content;
  }

  render() {
    const { label, customClass, customStyle } = this.props;
    return (
      <button
        className={customClass}
        type="button"
        style={customStyle}
        onClick={this.generateCsv}
      >
        {label}
      </button>
    );
  }

}