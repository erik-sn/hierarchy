import * as React from 'react';
import { IndexRoute, Route, Router } from 'react-router';

import About from './components/about';
import Admin from './components/admin/admin';
import Application from './components/application';
import Main from './components/hierarchy/main';
import NotFound from './components/notfound';
import Settings from './components/settings';

import Department from './components/hierarchy/department';

const Routes: JSX.Element = (
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
      <Route path="/:site/:department/m/:module" component={Department} />
      <Route path="/:site/:department/:machine/m/:module" component={Department} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

export default Routes;
