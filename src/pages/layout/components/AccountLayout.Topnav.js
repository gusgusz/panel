import React, { useState } from "react";
import { injectIntl } from "react-intl";

import { UncontrolledDropdown, DropdownItem, DropdownToggle, DropdownMenu, Input } from "reactstrap";

import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import IntlMessages from "helpers/IntlMessages";
import { localeOptions, adminRoot } from "constants/defaultValues";

import { getDirection, setDirection, getCurrentUser, getInitialsName } from "helpers/Utils";
import { setContainerClassnames, clickOnMobileMenu, logoutUser, changeLocale } from "redux/actions";

import logo from "assets/logos/logo.png";
import logoIcon from "assets/logos/icon.png";

import { useSettings } from "context/settings";
import { baseURL } from "services/api";
import moment from "moment";

const TopNav = ({
  intl,
  history,
  containerClassnames,
  menuClickCount,
  selectedMenuHasSubItems,
  locale,
  setContainerClassnamesAction,
  clickOnMobileMenuAction,
  logoutUserAction,
  changeLocaleAction,
}) => {
  const settings = useSettings();
  const [isInFullScreen, setIsInFullScreen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleChangeLocale = (_locale, direction) => {
    changeLocaleAction(_locale);

    const currentDirection = getDirection().direction;
    if (direction !== currentDirection) {
      setDirection(direction);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleLogout = () => {
    logoutUserAction(history);
  };

  const menuButtonClick = (e, _clickCount, _conClassnames) => {
    e.preventDefault();

    setTimeout(() => {
      const event = document.createEvent("HTMLEvents");
      event.initEvent("resize", false, false);
      window.dispatchEvent(event);
    }, 350);
    setContainerClassnamesAction(_clickCount + 1, _conClassnames, selectedMenuHasSubItems);
  };

  const mobileMenuButtonClick = (e, _containerClassnames) => {
    e.preventDefault();
    clickOnMobileMenuAction(_containerClassnames);
  };

  const { messages } = intl;
  return (
    <nav className="navbar fixed-top">
      <div className="d-flex align-items-center navbar-left">
        <div className="d-inline-block">
          <UncontrolledDropdown className="ml-2 ">
            <DropdownToggle color="light" size="sm" className="language-button btn-outline-primary">
              <span className="name ">{locale.toUpperCase()}</span>
            </DropdownToggle>
            <DropdownMenu className="mt-3" right>
              {localeOptions.map(l => {
                return (
                  <DropdownItem onClick={() => handleChangeLocale(l.id, l.direction)} key={l.id}>
                    {l.name}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
      <NavLink className="navbar-logo" to="#">
        {settings?.LOGO_NEW_CASE_PAGE ? (
          <img
            src={`${baseURL}/public?file=${settings.LOGO_NEW_CASE_PAGE}&has_download=false&d=${moment().format("YYYYMMDDHHmmss")}`}
            style={{ height: 65 }}
            className="d-block d-xss-none d-xs-none d-sm-none d-md-block d-lg-block"
          />
        ) : (
          <img src={logo} style={{ height: 40 }} className="d-block d-xss-none d-xs-none d-sm-none d-md-block d-lg-block" />
        )}

        <img src={logoIcon} style={{ height: 45 }} className="d-none d-xss-block d-xs-block d-sm-block d-md-none d-lg-none" />
      </NavLink>

      <div className="navbar-right">
        <div className="user d-inline-block">
          {/* <a className="btn btn-outline-primary btn-sm mb-2 mr-3" rel="noopener noreferrer" href="/app">
            <span>Voltar para o painel</span>
          </a> */}
          <NavLink location={{}} className="btn btn-primary btn-sm mb-2 mr-3" rel="noopener noreferrer" to="/app">
            <span>Voltar para o painel</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = ({ menu, settings }) => {
  const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu;
  const { locale } = settings;
  return {
    containerClassnames,
    menuClickCount,
    selectedMenuHasSubItems,
    locale,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    setContainerClassnamesAction: setContainerClassnames,
    clickOnMobileMenuAction: clickOnMobileMenu,
    logoutUserAction: logoutUser,
    changeLocaleAction: changeLocale,
  })(TopNav),
);
