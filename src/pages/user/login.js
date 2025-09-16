import React, { useState } from "react";
import { Row, Card, Label, FormGroup, Button, Modal, ModalHeader, ModalBody, CustomInput, ModalFooter } from "reactstrap";

import { NavLink, useHistory } from "react-router-dom";
import { Formik, Form, Field } from "formik";

import { NotificationManager } from "components/common/react-notifications";
import { Colxx } from "components/common/CustomBootstrap";

import { validateEmail, validatePassword } from "utils/validators";
import { loginUserSuccess } from "redux/actions";

import { setCurrentUser } from "helpers/Utils";

import api, { baseURL } from "services/api";
import { useSettings } from "context/settings";

import moment from "moment";
import error_alert from "utils/alerts/error";

import logo from "assets/logos/logo.png";

const Login = () => {
  const settings = useSettings();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirNewPassword, setConfirNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showModalPassword, setShowModalPassword] = useState(false);
  const [sendingNewPassword, setSendingNewPassword] = useState(false);

  const initialValues = { email, password };

  const onUserLogin = async (pass = null) => {
    try {
      let data = {};
      setLoading(true);

      data = await api.post(`/login`, { email, password: pass ?? password }).then(response => response.data);
      setCurrentUser(data);
      loginUserSuccess(data);

      const permissions = await api.get(`/login/acl`);

      setCurrentUser({ ...data, permissions: btoa(JSON.stringify(permissions.data)) });
      loginUserSuccess({ ...data, permissions: btoa(JSON.stringify(permissions.data)) });

      history.push("/app");
      document.location.href = "/app";
    } catch (error) {
      if (error?.response?.data?.errors && error?.response?.data?.errors.length > 0) {
        if (error?.response?.data?.errors[0].field === "FORCE_PASSWORD_CHANGE") {
          setShowModalPassword(true);
        } else if (error?.response?.data?.errors[0].message.includes("E_INVALID_AUTH_UID")) {
          error_alert("Usuário não localizado", "Não foi possível realizar login");
        } else if (error?.response?.data?.errors[0].message.includes("E_INVALID_AUTH_PASSWORD")) {
          error_alert("Senha inválida", "Não foi possível realizar login");
        }
      }
    }
    setLoading(false);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirNewPassword) {
      return error_alert("Confirme corretamente a sua nova senha!", "Oops!");
    }

    setSendingNewPassword(true);
    api
      .put(`/login/recovery/save`, {
        email,
        password,
        newPassword: newPassword,
      })
      .then(response => {
        setSendingNewPassword(false);
        setShowModalPassword(false);
        setPassword(newPassword);
        NotificationManager.success("Sua nova senha foi definida com sucesso!", "Senha definida com sucesso!", 3000, null, null, "");
        onUserLogin(newPassword);
      })
      .catch(error => {
        console.log(error);
        setSendingNewPassword(false);
        return error_alert("Oops! Não foi possível salvar sua nova senha!", "Tente novamente");
      });
  };

  return (
    <Row className="h-100">
      <Colxx xxs="12" md="4" className="mx-auto my-auto">
        <Card className="auth-card">
          <div className="form-side p-5">
            <NavLink to="/" className="white text-center" style={{ display: "block" }}>
              {settings?.LOGO_LOGIN_PAGE ? (
                <img
                  src={`${baseURL}/public?file=${settings.LOGO_LOGIN_PAGE}&has_download=false&d=${moment().format("YYYYMMDDHHmmss")}`}
                  style={{ height: 55 }}
                  className="mb-5"
                />
              ) : (
                <img src={logo} style={{ height: 55 }} className="mb-5" />
              )}
            </NavLink>

            <Formik initialValues={initialValues} onSubmit={() => onUserLogin()}>
              {({ errors, touched }) => (
                <Form className="av-tooltip tooltip-label-bottom">
                  <FormGroup className="form-group has-float-label">
                    <Label>E-mail</Label>
                    <Field className="form-control" name="email" value={email} onChange={e => setEmail(e.target.value)} validate={() => validateEmail(email)} />
                    {errors.email && touched.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                  </FormGroup>

                  <FormGroup className="form-group has-float-label mb-0 ">
                    <Label>Senha</Label>
                    <Field
                      className="form-control"
                      type="password"
                      name="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      validate={() => validatePassword(password)}
                    />

                    {errors.password && touched.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                  </FormGroup>

                  <div className="d-flex justify-center text-left align-items-center mb-0 mt-1 pt-0">
                    <NavLink to="/usuario/recuperar-senha" style={{ flex: 1 }}>
                      Esqueceu sua senha?
                    </NavLink>
                  </div>

                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      color="ligth"
                      className={`mt-4 ml-5 mr-5 mb-3 p-3 btn-shadow btn-multiple-state btn-block btn btn-lg ${
                        loading ? "show-spinner btn-primary" : "btn-outline-primary"
                      }`}
                      size="lg">
                      <span className="spinner d-inline-block">
                        <span className="bounce1" />
                        <span className="bounce2" />
                        <span className="bounce3" />
                      </span>
                      <span className="label">ENTRAR</span>
                    </Button>
                  </div>

                  {/* <div className="d-flex justify-center text-center align-items-center mb-0 mt-1 pt-0">
                    <NavLink to="/usuario/registrar" style={{ flex: 1 }}>
                      Não tem cadastro? Cadastre-se
                    </NavLink>
                  </div> */}
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </Colxx>

      <Modal backdrop size="md" isOpen={showModalPassword} toggle={() => (sendingNewPassword ? null : setShowModalPassword(false))}>
        <ModalHeader style={{ backgroundColor: "orange" }}>Atualize sua senha</ModalHeader>
        <form
          action="#"
          onSubmit={e => {
            e.preventDefault();
            handleChangePassword();
          }}>
          <ModalBody>
            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="newPassword">
                    <strong>Nova senha</strong>
                  </Label>
                  <CustomInput
                    required
                    value={newPassword}
                    onChange={e => {
                      setNewPassword(e.target.value);
                    }}
                    className="form-control"
                    type="password"
                    id="newPassword"
                  />
                </FormGroup>
              </Colxx>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="confirNewPassword">
                    <strong>Confirme sua nova senha</strong>
                  </Label>
                  <CustomInput
                    required
                    value={confirNewPassword}
                    onChange={e => {
                      setConfirNewPassword(e.target.value);
                    }}
                    className="form-control"
                    type="password"
                    id="confirNewPassword"
                  />
                </FormGroup>
              </Colxx>
            </Row>
          </ModalBody>
          <ModalFooter>
            <button disabled={sendingNewPassword} type="button" class="btn btn-light btn-sm" onClick={() => setShowModalPassword(false)}>
              Cancelar
            </button>
            <button disabled={sendingNewPassword} type="submit" class="btn btn-success btn-shadow btn-block">
              {sendingNewPassword ? "Atualizando..." : "Atualizar"}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </Row>
  );
};

export default Login;
