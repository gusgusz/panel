import React from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";

import TopNav from "components/navs/Topnav";
import Sidebar from "components/navs/Sidebar";
import Footer from "components/navs/Footer";

import { getCurrentUser } from "helpers/Utils";

const AppLayout = ({ containerClassnames, children, history, showSidebar = true }) => {
  React.useEffect(() => {
    if (!getCurrentUser()?.user) {
      history.push("/usuario/login");
    }
  }, []);

  return (
    <>
      <div id="app-container" className={containerClassnames}>
        <TopNav history={history} />
        <Sidebar />

        <main>
          <div className="container-fluid">{children}</div>
        </main>
        <Footer />
      </div>
    </>
  );
};
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};
const mapActionToProps = {};

export default withRouter(connect(mapStateToProps, mapActionToProps)(AppLayout));
