/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from 'strapi-helper-plugin';
// Utils
import pluginId from '../../pluginId';
import UsersByCity from '../UsersByCity';
// Containers
import UsersByType from '../UsersByType';

const App = () => {
  return (
    <div>
      <Switch>
        <Route path={`/plugins/${pluginId}/usersByType`} component={UsersByType} exact />
        <Route path={`/plugins/${pluginId}/usersByCity`} component={UsersByCity} exact />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default App;
