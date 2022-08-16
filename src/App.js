/**
 * external imports
 */
import React, { Suspense } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { IntlProvider } from "react-intl";

import CheckIcon from "@material-ui/icons/Check";
import ErrorIcon from "@material-ui/icons/Error";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Dialog, DialogContent, DialogContentText, DialogActions, Button as MaterialButton } from "@material-ui/core";
/**
 * lang imports
 */
import AppLocale from "./lang";

/**
 * common imports
 */
import ColorSwitcher from "./components/common/ColorSwitcher";
import { NotificationContainer } from "./components/common/react-notifications";
import { isMultiColorActive } from "./constants/defaultValues";

/**
 * utils
 */

/** landing page */

/**
 * logged
 */
const ViewApp = React.lazy(() => import("./pages/app"));

/**
 * not logged
 */
const ViewUser = React.lazy(() => import("./pages/user"));

/**
 * error
 */
const ViewError = React.lazy(() => import("./pages/error"));
const ViewUnauthorized = React.lazy(() => import("./pages/unauthorized"));

import { SettingsProvider } from "context/settings";

export const FeedbackContext = React.createContext({
  useLoading: (loading, text = "") => {},
  useSuccess: (show, text = "") => {},
  useConfirmAlert: (show, text = "", callback = () => {}) => {},
  useError: (show, text = "") => {},
});

const App = ({ locale }) => {
  const currentAppLocale = AppLocale[locale];

  const [loading, setLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState("Processando...");

  const [success, setSuccess] = React.useState(false);
  const [successText, setSuccessText] = React.useState("Executado com sucesso");

  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("Erro ao realizar <b>operação</b>");

  const [confirmAlert, setConfirmAlert] = React.useState(false);
  const [confirmAlertText, setConfirmAlertText] = React.useState("Confirma?");

  const [callback, setCallback] = React.useState(() => {});

  const useLoading = (loading, text = "") => {
    setSuccess(false);
    setConfirmAlert(false);
    setError(false);
    setLoading(loading);
    setLoadingText(text);
  };

  const useSuccess = (show, text = "") => {
    setLoading(false);
    setConfirmAlert(false);
    setError(false);
    setSuccess(show);
    setSuccessText(text);
  };

  const useConfirmAlert = (show, text = "", callback = () => {}) => {
    setConfirmAlert(show);
    setConfirmAlertText(text);
    setError(false);
    setCallback(() => callback);
  };

  const useError = (show, text = "") => {
    setLoading(false);
    setConfirmAlert(false);
    setSuccess(false);
    setError(show);
    setErrorText(text);
  };

  React.useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 1000);
    }
  }, [success]);

  return (
    <div className="h-100">
      <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
        <FeedbackContext.Provider
          value={{
            useLoading,
            useSuccess,
            useConfirmAlert,
            useError,
          }}>
          <SettingsProvider>
            <NotificationContainer />
            {isMultiColorActive && <ColorSwitcher />}
            <Suspense fallback={<></>}>
              <Router basename="">
                <Switch>
                  <Route path="/app" component={ViewApp} />
                  <Route path="/usuario" render={props => <ViewUser {...props} />} />

                  <Route path="/error" exact render={props => <ViewError {...props} />} />
                  <Route path="/unauthorized" exact render={props => <ViewUnauthorized {...props} />} />

                  <Redirect exact from={`/`} to={`/app`} />
                  <Redirect exact from={``} to={`/app`} />

                  <Redirect to="/error" />
                </Switch>
              </Router>
            </Suspense>
          </SettingsProvider>
        </FeedbackContext.Provider>
      </IntlProvider>

      <Dialog maxWidth="xs" fullWidth open={loading} aria-labelledby="max-width-dialog-title">
        <DialogContent style={{ textAlign: "center" }}>
          <CircularProgress style={{ color: "#17a2b8" }} />
          <DialogContentText style={{ textAlign: "center" }}>
            <div dangerouslySetInnerHTML={{ __html: loadingText }} />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog open={success} maxWidth="xs" fullWidth aria-labelledby="max-width-dialog-title" onClose={() => useSuccess(false)}>
        <DialogContent style={{ textAlign: "center" }}>
          <CheckIcon style={{ fontSize: 55, color: "#28a745" }} />
          <DialogContentText style={{ textAlign: "center" }} className="mt-2">
            <div dangerouslySetInnerHTML={{ __html: successText }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MaterialButton style={{ fontSize: 10 }} onClick={() => useSuccess(false)} color="default">
            Fechar
          </MaterialButton>
        </DialogActions>
      </Dialog>

      <Dialog open={error} maxWidth="xs" fullWidth aria-labelledby="max-width-dialog-title" onClose={() => useError(false)}>
        <DialogContent style={{ textAlign: "center" }}>
          <ErrorIcon style={{ fontSize: 55, color: "#dc3545" }} />
          <DialogContentText style={{ textAlign: "center" }} className="mt-2">
            <div dangerouslySetInnerHTML={{ __html: errorText }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MaterialButton style={{ fontSize: 10 }} onClick={() => useError(false)} color="default">
            Fechar
          </MaterialButton>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmAlert} maxWidth="xs" fullWidth aria-labelledby="max-width-dialog-title">
        <DialogContent style={{ textAlign: "center" }}>
          <InfoOutlinedIcon color="secondary" style={{ fontSize: 35 }} />
          <br />
          <br />
          <DialogContentText style={{ textAlign: "center" }}>
            <div dangerouslySetInnerHTML={{ __html: confirmAlertText }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MaterialButton style={{ width: "50%" }} onClick={() => setConfirmAlert(false)} color="secondary">
            NÃO
          </MaterialButton>
          <MaterialButton
            style={{ width: "50%" }}
            onClick={() => {
              callback ? callback() : null;
            }}
            color="primary">
            SIM
          </MaterialButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = ({ authUser, settings }) => {
  const { currentUser } = authUser;
  const { locale } = settings;
  return { currentUser, locale };
};

const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(App);
