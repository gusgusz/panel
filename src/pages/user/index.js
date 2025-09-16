import React, { Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import UserLayout from "pages/layout/UserLayout";

const Login = React.lazy(() => import("./login"));
const Register = React.lazy(() => import("./register"));
const ForgotPassword = React.lazy(() => import("./forgot-password"));
// const ResetPassword = React.lazy(() => import("./reset-password"));

//const ExternalForm = React.lazy(() => import("../landing/external-form"));

const User = ({ match }) => {
  return (
    <UserLayout>
      <Suspense fallback={<div className="loading" />}>
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`${match.url}/login`} />

          <Route path={`${match.url}/login`} render={props => <Login {...props} />} />
          <Route path={`${match.url}/registrar`} render={props => <Register {...props} />} />
          <Route path={`${match.url}/recuperar-senha`} render={props => <ForgotPassword {...props} />} />
          {/* <Route path={`${match.url}/recuperar-conta`} render={props => <ResetPassword {...props} />} /> */}

          {/* <Route path={`${match.url}/ativacao`} render={props => <Activate {...props} />} /> */}

          {/*<Route path={`${match.url}/f/:key`} render={props => <ExternalForm {...props} />} />
          <Route path={`${match.url}/completarcadastro`} render={props => <ExternalForm {...props} />} />*/}

          <Redirect to="/error" />
        </Switch>
      </Suspense>
    </UserLayout>
  );
};

export default User;
