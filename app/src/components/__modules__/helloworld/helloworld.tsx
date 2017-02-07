/**
 * Module Created: 2017-02-04 23:36:54 -05:00
 * Author: erik
 */
import * as React from 'react';

import { IHierarchyTier } from '../../../../src/constants/interfaces';

export interface IHelloworldProps {
  parent: IHierarchyTier;
}

const Helloworld = ({ parent }: IHelloworldProps) => (
  <div className="helloworld__container" >
    <h3>Hello helloworld</h3>
    <div className="helloworld__parent" >
      Parent: {parent.name}
    </div>
  </div>
);

export default Helloworld;
