import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import TopNav from "./components/AccountLayout.Topnav";
import Sidebar from "components/navs/Sidebar";
import Footer from "components/navs/Footer";

import { getCurrentUser } from "helpers/Utils";

const LandingLayout = ({ containerClassnames, children, history, showSidebar = true }) => {
  return (
    <div id="app-container" className="menu-default main-hidden sub-hidden">
      <TopNav history={history} />
      <main>
        <div className="container-fluid">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};
const mapActionToProps = {};

export default withRouter(connect(mapStateToProps, mapActionToProps)(LandingLayout));
