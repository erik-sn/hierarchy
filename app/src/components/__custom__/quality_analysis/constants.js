import { List, Map } from 'immutable';
import types from '../../../actions/types';


export const DATE_FORMAT = 'MM/DD/YY HH:mm';

export const LIMIT_API = `${types.MAP}/infinity/limits`;

export const INFINITY_TESTS = List(['Crimp', 'TR', 'Denier', 'FOY (NMR)', 'Entanglement', 'TiO2']);

export const rowMap = List([
  Map({ label: 'createDate', header: 'Time', width: '15%' }),
  Map({ label: 'lot', header: 'Lot', width: '15%' }),
  Map({ label: 'part', header: 'Yarn ID', width: '14%' }),
  Map({ label: 'subProcess', header: 'Pos.', width: '8%' }),
  Map({ label: 'Crimp', header: 'Crimp', width: '8%' }),
  Map({ label: 'TR', header: 'TR', width: '8%' }),
  Map({ label: 'Denier', header: 'Denier', width: '8%' }),
  Map({ label: 'FOY (NMR)', header: 'FOY', width: '8%' }),
  Map({ label: 'Entanglement', header: 'Tack', width: '8%' }),
  Map({ label: 'TiO2', header: 'TiO2', width: '8%' }),
]);
