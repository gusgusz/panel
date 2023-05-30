import "./../../assets/css/table.css";

import React, { Suspense } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import AppLayout from "pages/layout/AppLayout";
import { getCurrentUser, permissionByModule } from "helpers/Utils";

const AdmModules = React.lazy(() => import("./admin/Modules"));
const Operations = React.lazy(() => import("./admin/Operations"));
const Parameters = React.lazy(() => import("./admin/Parameters"));
const Categories = React.lazy(() => import("./admin/Categories"));
const Profiles = React.lazy(() => import("./admin/Profiles"));
const Users = React.lazy(() => import("./admin/Users"));
const Plans = React.lazy(() => import("./admin/Plans"));
const Services = React.lazy(() => import("./admin/Services"));
const Customers = React.lazy(() => import("./admin/Customers"));
const Providers = React.lazy(() => import("./admin/Providers"));
const Franchises = React.lazy(() => import("./admin/Franchises"));
const Jobs = React.lazy(() => import("./admin/Jobs"));
const Dashboard = React.lazy(() => import("./dashboard"));

const App = ({ match }) => {
  return (
    <AppLayout>
      <div className="dashboard-wrapper">
        <Suspense fallback={<div />}>
          <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />

            {permissionByModule("MODULES") ? <Route path={`${match.url}/a/modulos`} render={props => <AdmModules {...props} />} /> : null}
            {permissionByModule("OPERATIONS") ? <Route path={`${match.url}/a/operacoes`} render={props => <Operations {...props} />} /> : null}
            {permissionByModule("PARAMETERS") ? <Route path={`${match.url}/a/parametros`} render={props => <Parameters {...props} />} /> : null}
            {permissionByModule("PROFILES") ? <Route path={`${match.url}/a/perfils-de-acesso`} render={props => <Profiles {...props} />} /> : null}
            {permissionByModule("USERS") ? <Route path={`${match.url}/usuarios`} render={props => <Users {...props} />} /> : null}
            {permissionByModule("CATEGORIES") ? <Route path={`${match.url}/categorias`} render={props => <Categories {...props} />} /> : null}
            {permissionByModule("PLANS") ? <Route path={`${match.url}/planos`} render={props => <Plans {...props} />} /> : null}
            {permissionByModule("SERVICES") ? <Route path={`${match.url}/servicos`} render={props => <Services {...props} />} /> : null}
            {permissionByModule("CUSTOMERS") ? <Route path={`${match.url}/clientes`} render={props => <Customers {...props} />} /> : null}
            {permissionByModule("PROVIDERS") ? <Route path={`${match.url}/prestadores`} render={props => <Providers {...props} />} /> : null}
            {permissionByModule("JOBS") ? <Route path={`${match.url}/vagas`} render={props => <Jobs {...props} />} /> : null}
            {permissionByModule("DASHBOARD") ? <Route path={`${match.url}/dashboard`} render={props => <Dashboard {...props} />} /> : null}
            {permissionByModule("JOBS") ? <Route path={`${match.url}/dashboard`} render={props => <Jobs {...props} />} /> : null}
            {permissionByModule("FRANCHISES") ? <Route path={`${match.url}/a/franquias`} render={props => <Franchises {...props} />} /> : null}

            <Redirect to="/unauthorized" />
          </Switch>
        </Suspense>
      </div>
    </AppLayout>
  );
};

const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, {})(App));
