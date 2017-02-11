import { List, Map, is, fromJS } from 'immutable';

interface IObject {
  key: number;
  value: string;
}

const testData: IObject[] = [
  { key: 1, value: 'one' },
  { key: 2, value: 'two' },
  { key: 3, value: 'three' },
  { key: 4, value: 'four' },
];

const toList: List<IObject> = fromJS(testData);

const isImmutable = fromJS([
  { key: 1, value: 'one' },
  { key: 2, value: 'two' },
  { key: 3, value: 'three' },
  { key: 4, value: 'four' },
]);

console.log(is(isImmutable, toList))