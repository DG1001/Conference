import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Talk from './talk';
import TalkDetail from './talk-detail';
import TalkUpdate from './talk-update';
import TalkDeleteDialog from './talk-delete-dialog';

const TalkRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Talk />} />
    <Route path="new" element={<TalkUpdate />} />
    <Route path=":id">
      <Route index element={<TalkDetail />} />
      <Route path="edit" element={<TalkUpdate />} />
      <Route path="delete" element={<TalkDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default TalkRoutes;
