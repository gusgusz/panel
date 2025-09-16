import React, { useState, useEffect } from "react";
import { Row, Card, CardTitle, Label, FormGroup, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { connect } from "react-redux";
import { Colxx } from "components/common/CustomBootstrap";
import IntlMessages from "helpers/IntlMessages";
import { forgotPassword } from "redux/actions";
import { NotificationManager } from "components/common/react-notifications";

import api, { baseURL } from "services/api";
import { useSettings } from "context/settings";

import logo from "assets/logos/logo.png";
import moment from "moment";

const ForgotPassword = ({ history }) => {
  const settings = useSettings();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const initialValues = { email };

  const onForgotPassword = async values => {
    try {
      setLoading(true);
      await api.post(`/login/recovery?email=${email}`);
      NotificationManager.success("Enviamos um novo e-mail com a o link para redefinição!", "E-mail enviado!", 3000, null, null, "");
    } catch (error) {
      NotificationManager.error("Não foi possível enviar um novo e-mail com a o link para redefinição!", "Tente novamente!", 3000, null, null, "");
    }
    setLoading(false);
  };

  return (
    <Row className="h-100">
      <Colxx xxs="12" sm="4" xs="8" md="4" lg="4" className="mx-auto my-auto">
        <Card className="auth-card mx-auto my-auto">
          <div className="form-side p-5">
            <NavLink to="/" className="white text-center" style={{ display: "block" }}>
              {settings?.LOGO_LOGIN_PAGE ? (
                <img
                  src={`${baseURL}/public?file=${settings.LOGO_LOGIN_PAGE}&has_download=false&d=${moment().format("YYYYMMDDHHmmss")}`}
                  style={{ height: 70 }}
                  className="mb-5"
                />
              ) : (
                <img src={logo} style={{ height: 55 }} className="mb-5" />
              )}
            </NavLink>
            <CardTitle className="mb-4">
              <IntlMessages id="user.forgot-password" />
            </CardTitle>

            <Formik initialValues={initialValues} onSubmit={onForgotPassword}>
              {({ errors, touched }) => (
                <Form className="av-tooltip tooltip-label-bottom">
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="user.email" />
                    </Label>
                    <Field value={email} onChange={e => setEmail(e.target.value)} className="form-control" name="email" validate={() => validateEmail(email)} />
                    {errors.email && touched.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                  </FormGroup>

                  <div className="d-flex justify-content-flex-end align-items-center">
                    <Button color="primary" className={`btn-shadow btn-block btn-multiple-state ${loading ? "show-spinner" : ""}`} size="lg">
                      <span className="spinner d-inline-block">
                        <span className="bounce1" />
                        <span className="bounce2" />
                        <span className="bounce3" />
                      </span>
                      <span className="label">
                        <IntlMessages id="user.reset-password-button" />
                      </span>
                    </Button>
                  </div>

                  <div className="d-flex justify-center text-center align-items-center mt-5">
                    <NavLink to="/usuario/login" style={{ flex: 1 }}>
                      Lembrou a senha? Faça login!
                    </NavLink>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </Colxx>
    </Row>
  );
};

const validateEmail = value => {
  let error;
  if (!value) {
    error = "E-mail é obrigatório";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = "Por favor, informe um e-mail válido";
  }
  return error;
};

export default ForgotPassword;
