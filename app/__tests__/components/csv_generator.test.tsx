import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import CsvGenerator, { ICsvGeneratorProps } from '../../src/components/csv_generator';
import { IDictionary } from '../../src/constants/interfaces';

describe('csv_generator.test.tsx |', () => {
  describe('Expected | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: ICsvGeneratorProps = {
      customClass: 'test_class',
      customStyle: { height: '200px' },
      data: [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'key3', value: 'value3' },
        { key: 'key4', value: 'value4' },
        { key: 'key5', value: 'value5' },
      ],
      params: [
        { header: 'key', label: 'Key'},
        { header: 'value', label: 'Value' },
      ],
      fileName: 'test_file',
      showTooltip: true,
    };

    beforeEach(() => {
      component = shallow(<CsvGenerator {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.csv__container')).to.have.length(1);
      expect(component.find('.test_class')).to.have.length(1);
    });

    it('returns correct content', () => {
      const instance: any = component.instance();
      const rowData: Array<IDictionary<string>> = [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'key3', value: 'value3' },
      ];
      const header: string[] = ['key', 'value'];
      const param = [
        { header: 'Key', label: 'key'},
        { header: 'Value', label: 'value'},
      ];
      const content: string = instance.generateContent(rowData, header, param);
      expect(content).to.equal(`key,value\r\nkey1,value1,\r\nkey2,value2,\r\nkey3,value3,\r\n`);
    });

    it('returns correct content - no header, undefined values', () => {
      const instance: any = component.instance();
      const rowData: Array<IDictionary<string>> = [
        { key: 'key1', value: undefined },
        { key: 'key2', value: 'value2' },
        { key: 'key3', value: undefined },
      ];
      const header: string[] = undefined;
      const param = [
        { header: 'Key', label: 'key'},
        { header: 'Value', label: 'value'},
      ];
      const content: string = instance.generateContent(rowData, header, param);
      expect(content).to.equal(`key1,,\r\nkey2,value2,\r\nkey3,,\r\n`);
    });
  });


  describe('No custom class or tooltip | >>>', () => {
    let component: ShallowWrapper<{}, {}>;
    const props: ICsvGeneratorProps = {
      customClass: undefined,
      customStyle: { height: '200px' },
      data: [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'key3', value: 'value3' },
        { key: 'key4', value: 'value4' },
        { key: 'key5', value: 'value5' },
      ],
      params: [
        { header: 'key', label: 'Key'},
        { header: 'value', label: 'Value' },
      ],
      fileName: 'test_file',
      showTooltip: false,
    };

    beforeEach(() => {
      component = shallow(<CsvGenerator {...props} />);
    });

    it('renders something & has correct containers', () => {
      expect(component.find('.csv__container')).to.have.length(1);
      expect(component.find('.test_class')).to.have.length(0);
    });
  });

});
