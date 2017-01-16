import React from 'react';
import { Link } from 'react-router';

export const NotFound = () => (
  <div className="notfound__container">
    <h2>URL Not Found</h2>
    <h4><Link to="/">Click Here to Return to Site Page</Link></h4>    
  </div>
);

const NotfoundContainer = NotFound;
export default NotfoundContainer;
