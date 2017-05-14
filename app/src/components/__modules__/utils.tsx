import { List, Map } from 'immutable';
import * as moment from 'moment';

import { IDepartment, IMachine } from '../../constants/interfaces';
import { average } from './stats';


export function getDateFromCreated(data: List<Map<string, any>>): List<Map<string, any>> {
  return data.map((e) => (
    e.set('date', moment(e.get('created')).format('HH:mm'))
  ))
}

export function parseDateMap(type: string,
                             parent: IMachine | IDepartment,
                             data: List<Map<string, any>>): Map<string, any> {
  return data.reduce((map, cur) => {
    const date = cur.get('date');
    if (map.has(date)) {
      return map.set(date, map.get(date).push(cur.get('value')));
    } else {
      return map.set(date, List([cur.get('value')]));
    }
  }, Map<string, List<any>>());
}

export function sortByDate(a: Map<string, any>, b: Map<string, any>): number {
  const dateA = moment(a.get('date'), 'HH:mm');
  const dateB = moment(b.get('date'), 'HH:mm');
  return dateA > dateB ? 1 : -1;
}


export function parseTimeSeries(type: string,
                                parent: IMachine | IDepartment,
                                data: List<Map<string, any>>): List<Map<string, any>> {
  const dataWithDate = getDateFromCreated(data);
  if (type === 'machine') {
    return dataWithDate.filter((obj) => obj.get('machine') === parent.id);
  } else {
    const dateMap = parseDateMap(type, parent, dataWithDate);
    return dateMap.map((v, k) => Map({ date: k, value: average(v) }))
                  .toList()
                  .sort(sortByDate);
  }
}
