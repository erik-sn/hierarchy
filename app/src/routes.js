import React from 'react';
import { Route, Router, IndexRoute } from 'react-router';

import Application from './components/application';
import Admin from './components/admin/admin';
import Settings from './components/settings';
import NotFound from './components/notfound';
import About from './components/about';
import Main from './components/hierarchy/main';

import Department from './components/hierarchy/department';

const Routes = (
  <Router>
    <Route path="/" component={Application} >
      <IndexRoute component={Main} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/:menu*" component={Admin} />
      <Route path="/settings" component={Settings} />
      <Route path="/about" component={About} />
      <Route path="/:site" component={Main} />
      <Route path="/:site/:department" component={Department} />
      <Route path="/:site/:department/:machine" component={Department} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

export default Routes;
