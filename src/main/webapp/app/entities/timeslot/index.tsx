import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Timeslot from './timeslot';
import TimeslotDetail from './timeslot-detail';
import TimeslotUpdate from './timeslot-update';
import TimeslotDeleteDialog from './timeslot-delete-dialog';

const TimeslotRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Timeslot />} />
    <Route path="new" element={<TimeslotUpdate />} />
    <Route path=":id">
      <Route index element={<TimeslotDetail />} />
      <Route path="edit" element={<TimeslotUpdate />} />
      <Route path="delete" element={<TimeslotDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default TimeslotRoutes;
