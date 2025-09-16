import React, { useState } from "react";
import { injectIntl } from "react-intl";

import { UncontrolledDropdown, DropdownItem, DropdownToggle, DropdownMenu, Input, Button } from "reactstrap";

import { NavLink, useHistory } from "react-router-dom";
import { connect } from "react-redux";

import IntlMessages from "helpers/IntlMessages";
import { menuHiddenBreakpoint, localeOptions, adminRoot } from "constants/defaultValues";
import { MobileMenuIcon, MenuIcon } from "components/svg";
import { getDirection, setDirection, getInitialsName } from "helpers/Utils";
import { getCurrentUser, setCurrentUser } from "helpers/Utils";
import { setContainerClassnames, clickOnMobileMenu, logoutUser, changeLocale } from "redux/actions";

import TooltipItem from "components/TooltipItem";

/** CONTEXT */
import { FeedbackContext } from "App";
import { useSettings } from "context/settings";

import api, { baseURL } from "services/api";
import logo from "assets/logos/logo.png";
import logoIcon from "assets/logos/icon.svg";
import moment from "moment";

const TopNav = ({
  intl,
  containerClassnames,
  menuClickCount,
  selectedMenuHasSubItems,
  locale,
  setContainerClassnamesAction,
  clickOnMobileMenuAction,
  logoutUserAction,
  changeLocaleAction,
}) => {
  const feedbackContext = React.useContext(FeedbackContext);
  const history = useHistory();
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
        <NavLink to="#" location={{}} className="menu-button d-none d-md-block" onClick={e => menuButtonClick(e, menuClickCount, containerClassnames)}>
          <MenuIcon />
        </NavLink>
        <NavLink
          to="#"
          location={{}}
          className="menu-button-mobile d-xs-block d-sm-block d-md-none"
          onClick={e => mobileMenuButtonClick(e, containerClassnames)}>
          <MobileMenuIcon />
        </NavLink>

        <div className="d-inline-block">
          <UncontrolledDropdown className="ml-2">
            <DropdownToggle caret color="light" size="sm" className="language-button">
              <span className="name">{locale.toUpperCase()}</span>
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
        {settings?.LOGO_TOP_SYSTEM ? (
          <img
            src={`${baseURL}/public?file=${settings.LOGO_TOP_SYSTEM}&has_download=false&d=${moment().format("YYYYMMDDHHmmss")}`}
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
          <UncontrolledDropdown className="dropdown-menu-right">
            <DropdownToggle className="p-0" color="empty" style={{ display: "flex", alignItems: "center" }}>
              <span className="name mr-2" style={{ lineHeight: "11px", textAlign: "right" }}>
                {getCurrentUser()?.user?.name}
                <br />
                <small style={{ lineHeight: "11px", fontWeight: "bold" }}>
                  {getCurrentUser()?.user?.is_root ? (
                    "Super administrador"
                  ) : (
                    <>
                      {getCurrentUser()?.is_user ? (
                        <>
                          #{getCurrentUser()?.user?.id} / ({getCurrentUser()?.user?.profile?.name})
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </small>
              </span>

              <div
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: "100%",
                }}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEbfchCnD_FoU0227npi-uSzDYstPvvcPbTg&usqp=CAU"
                  style={{ width: 35, height: 35 }}
                />
              </div>
            </DropdownToggle>
            <DropdownMenu className="mt-3" right>
              <DropdownItem style={{ color: "#f90000  " }} onClick={() => handleLogout()}>
                Sair
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
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
