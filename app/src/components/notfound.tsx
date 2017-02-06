import * as React from 'react';
import { Link } from 'react-router';

export const NotFound = (): JSX.Element => (
  <div className="notfound__container">
    <h2>URL Not Found</h2>
    <h4><Link to="/">Click Here to Return to Site Page</Link></h4>
  </div>
);

export default NotFound;
