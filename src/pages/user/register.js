import React, { useState, useEffect } from "react";
import { Row, Card, CardTitle, Label, FormGroup, Button } from "reactstrap";
import { CustomInput, Input, FormText, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import { Formik, Form, Field, isFunction } from "formik";

import { NotificationManager } from "components/common/react-notifications";

import { Colxx } from "components/common/CustomBootstrap";

import { loginUser } from "redux/actions";

import { maskPhone, maskCpfCnpj } from "utils/functions";

import api, { baseURL } from "services/api";
import { useSettings } from "context/settings";

import logo from "assets/logos/logo.png";
import moment from "moment";
import { validateCpf } from "utils/validators";

const Register = () => {
  const settings = useSettings();

  const [name, setName] = useState("");
  const [type, setType] = useState("PF");
  const [cpf_cnpj, setCpf_cnpj] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAlreadyExists, setIsAlreadyExists] = useState(false);

  const onUserRegister = async values => {
    setLoading(true);

    try {
      const { data } = await api.post("/people", { type, name, cpf_cnpj, email, phone, password });
      if (data.id) {
        setSuccess(true);
      }
    } catch (error) {
      console.log(error);
      if (error?.response) {
        if (error?.response?.data.includes("already exists")) setIsAlreadyExists(true);
      } else {
        NotificationManager.error("Por favor verifique suas informações e tente novamente!", "Não foi possível efetuar o cadastro!", 3000, null, null, "");
      }
    }

    setLoading(false);
  };

  const initialValues = { type, name, cpf_cnpj, email, phone, password, passwordConfirm };

  return (
    <Row className="h-100">
      <Colxx xxs="12" sm="4" xs="8" md="4" lg="4" className="mx-auto my-auto">
        <Card className="auth-card mx-auto my-auto">
          <div className="form-side p-5">
            <NavLink to="/" location={{}} className="white text-center" style={{ display: "block" }}>
              {settings?.LOGO_LOGIN_PAGE ? (
                <img
                  src={`${baseURL}/public?file=${settings.LOGO_LOGIN_PAGE}&has_download=false&d=${moment().format("YYYYMMDDHHmmss")}`}
                  style={{ height: 70 }}
                  className="mb-5"
                />
              ) : (
                <img src={logo} style={{ height: 25 }} className="mb-5" />
              )}
            </NavLink>
            <CardTitle className="mb-4">Registre-se em nossa plataforma.</CardTitle>

            <Formik initialValues={initialValues} onSubmit={onUserRegister}>
              {({ errors, touched }) => (
                <Form className="av-tooltip tooltip-label-bottom">
                  <Row>
                    <Colxx xxs="12" lg="12" md="12" sm="12">
                      <FormGroup className="form-group has-float-label">
                        <Label>* Tipo de pessoa</Label>
                        <Field name={`type`} validate={value => (!value ? "Informe o tipo de pessoa" : "")}>
                          {({ field, form, meta }) => {
                            return (
                              <Input name={`type`} className="form-control" type="select" onChange={e => setType(e.target.value)}>
                                <option value={"PF"}>Pessoa Física</option>
                                <option value={"PJ"}>Pessoa Jurídica</option>
                              </Input>
                            );
                          }}
                        </Field>
                      </FormGroup>
                    </Colxx>

                    <Colxx xxs="12" lg="12" md="12" sm="12">
                      <FormGroup className="form-group has-float-label">
                        <Label>* Nome</Label>
                        <Field className="form-control" name="name" value={name} onChange={e => setName(e.target.value)} validate={() => validateName(name)} />
                        {errors.name && touched.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                      </FormGroup>
                    </Colxx>

                    <Colxx xxs="12" lg="12" md="12" sm="12">
                      <FormGroup className="form-group has-float-label">
                        <Label>* {type === "PF" ? "CPF" : "CNPJ"}</Label>
                        <Field
                          className="form-control"
                          name="cpf_cnpj"
                          value={cpf_cnpj}
                          onChange={e => setCpf_cnpj(maskCpfCnpj(e?.target?.value ?? "", type === "PF" ? "CPF" : "CNPJ"))}
                          validate={() => validateCpf(cpf_cnpj, type === "PF" ? "CPF" : "CNPJ")}
                        />
                        {errors.cpf_cnpj && touched.cpf_cnpj && <div className="invalid-feedback d-block">{errors.cpf_cnpj}</div>}
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx xxs="12" lg="12" md="12" sm="12">
                      <FormGroup className="form-group has-float-label">
                        <Label>* E-mail</Label>
                        <Field
                          className="form-control"
                          name="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          validate={() => validateEmail(email)}
                        />
                        {errors.email && touched.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                      </FormGroup>
                    </Colxx>
                    <Colxx xxs="12" lg="12" md="12" sm="12">
                      <FormGroup className="form-group has-float-label">
                        <Label>Telefone/Celular</Label>
                        <Field className="form-control" type="text" name="phone" value={phone} onChange={e => setPhone(maskPhone(e?.target?.value ?? ""))} />
                        {errors.phone && touched.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
                      </FormGroup>
                    </Colxx>
                  </Row>

                  <Row>
                    <Colxx xxs="12" lg="6" md="6" sm="12">
                      <FormGroup className="form-group has-float-label">
                        <Label>* Senha</Label>
                        <Field
                          className="form-control"
                          type="password"
                          name="password"
                          value={password}
                          autoComplete="new-password"
                          onChange={e => setPassword(e.target.value)}
                          validate={() => validatePassword(password)}
                        />
                        {errors.password && touched.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                      </FormGroup>
                    </Colxx>
                    <Colxx xxs="12" lg="6" md="6" sm="12">
                      <FormGroup className="form-group has-float-label">
                        <Label>* Confirme sua senha</Label>
                        <Field
                          className="form-control"
                          type="password"
                          name="passwordConfirm"
                          autoComplete="new-password"
                          value={passwordConfirm}
                          onChange={e => setPasswordConfirm(e.target.value)}
                          validate={() => validatePasswordConfirm(passwordConfirm, password)}
                        />
                        {errors.passwordConfirm && touched.passwordConfirm && <div className="invalid-feedback d-block">{errors.passwordConfirm}</div>}
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <div className="d-flex justify-content-center align-items-center mt-2">
                    <Button
                      type="submit"
                      color="primary"
                      className={`btn-shadow btn-multiple-state ${loading ? "show-spinner" : ""}`}
                      size="lg"
                      disabled={loading}>
                      <span className="spinner d-inline-block">
                        <span className="bounce1" />
                        <span className="bounce2" />
                        <span className="bounce3" />
                      </span>
                      <span className="label">REGISTRAR</span>
                    </Button>
                  </div>

                  <div className="d-flex justify-center text-center align-items-center mt-2">
                    <NavLink to="/usuario" location={{}} style={{ flex: 1 }}>
                      Já tem uma conta? Faça login!
                    </NavLink>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </Colxx>

      <Modal backdrop="static" size="md" isOpen={success}>
        <ModalHeader>Parabéns! Sua conta foi criada com sucesso</ModalHeader>
        <ModalBody className="text-medium">
          Agora você pode acessar a plataforma.
          <br />
          <br />
          <strong>Clique em FAZER LOGIN e utilize seu e-mail e sua senha para entrar</strong>
        </ModalBody>{" "}
        <ModalFooter>
          <NavLink location={{}} to="/usuario/login">
            <Button color="success" className={`btn-shadow btn-block btn-multiple-state`} size="lg">
              <span className="spinner d-inline-block">
                <span className="bounce1" />
                <span className="bounce2" />
                <span className="bounce3" />
              </span>
              <span className="label">FAZER LOGIN</span>
            </Button>
          </NavLink>
        </ModalFooter>
      </Modal>

      <Modal backdrop="static" size="md" isOpen={isAlreadyExists}>
        <ModalHeader style={{ backgroundColor: "orange" }}>já existe uma conta</ModalHeader>
        <ModalBody className="text-medium">
          Não foi possível criar sua conta! Já existe uma conta com o mesmo CPF/CNPJ ou mesmo E-mail informado
          <br />
          <br />
          <strong>Faça login ou tente novamente</strong>
        </ModalBody>{" "}
        <ModalFooter>
          <Button
            color="light"
            onClick={() => {
              setIsAlreadyExists(false);
            }}>
            Tentar novamente
          </Button>
          <NavLink location={{}} to="/usuario/login">
            <Button color="success">ACESSAR MINHA CONTA</Button>
          </NavLink>
        </ModalFooter>
      </Modal>
    </Row>
  );
};

export default Register;
const validatePassword = value => {
  let error;
  if (!value) {
    error = "Informe sua senha";
  } else if (value.length < 3) {
    error = "Sua senha precisa ter no mínimo 3 caracteres";
  }
  return error;
};

const validatePasswordConfirm = (value, password) => {
  let error;
  if (!value) {
    error = "Informe sua senha";
  } else if (value !== password) {
    error = "Confirmação de senha não confere";
  }
  return error;
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

const validatePhone = value => {
  let error;
  if (!value) {
    error = "Telefone é obrigatório";
  } else if (!/[(]\d{2}[)][ ][\d{1}]?[ ]?\d{4}[-]\d{4}/g.test(value)) {
    error = "Por favor, informe um telefone válido";
  }
  return error;
};

// const validateCpf = value => {
//   let error;
//   if (!value) {
//     error = "CPF é obrigatório";
//   } else if (!/\d{3}[\.]\d{3}[\.]\d{3}[\-]\d{2}/g.test(value)) {
//     error = "Por favor, informe um CPF válido";
//   }
//   return error;
// };

const validateName = value => {
  let error;
  if (!value) {
    error = "Nome é obrigatório";
  } else if (value.length < 3) {
    error = "Seu nome precisa ter no mínimo 3 caracteres";
  }
  return error;
};
