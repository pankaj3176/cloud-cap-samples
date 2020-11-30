import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { isEmpty } from 'lodash';
import TracksContainer from './TracksPage';
import Header from './Header';
import PersonPage from './PersonPage';
import ErrorPage from './ErrorPage';
import InvoicePage from './InvoicePage';
import ManageStore from './ManageStore';
import MyInvoicesPage from './MyInvoicesPage';
import Login from './Login';
import { withRestrictions } from '../hocs/withRestrictions';
import { requireEmployee } from '../util/constants';

// const TracksContainer = React.lazy(() => import('./TracksPage'));
// const Header = React.lazy(() => import('./Header'));
// const PersonPage = React.lazy(() => import('./PersonPage'));
// const ErrorPage = React.lazy(() => import('./ErrorPage'));
// const InvoicePage = React.lazy(() => import('./InvoicePage'));
// const ManageStore = React.lazy(() => import('./ManageStore'));
// const MyInvoicesPage = React.lazy(() => import('./MyInvoicesPage'));
// const Login = React.lazy(() => import('./Login'));

const RestrictedLogin = withRestrictions(Login, ({ user }) => !user);
const RestrictedInvoicePage = withRestrictions(
  InvoicePage,
  ({ user, invoicedItems }) => !requireEmployee(user) && !isEmpty(invoicedItems)
);
const RestrictedPersonPage = withRestrictions(PersonPage, ({ user }) => !!user);
const RestrictedManageStore = withRestrictions(ManageStore, ({ user }) => requireEmployee(user));

const MyRouter = () => {
  return (
    <Router>
      <Header />
      <div style={{ padding: '2em 20vh' }}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path={['/', '/tracks']}>
              <TracksContainer />
            </Route>
            <Route exact path="/person">
              <RestrictedPersonPage />
            </Route>
            <Route exact path="/login">
              <RestrictedLogin />
            </Route>
            <Route exact path="/invoice">
              <RestrictedInvoicePage />
            </Route>
            <Route exact path="/invoices">
              <MyInvoicesPage />
            </Route>
            <Route exact path="/manage">
              <RestrictedManageStore />
            </Route>
            <Route path="/">
              <ErrorPage />
            </Route>
          </Switch>
        </React.Suspense>
      </div>
    </Router>
  );
};

export { MyRouter };