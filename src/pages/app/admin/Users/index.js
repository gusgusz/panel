import "react-tagsinput/react-tagsinput.css";
import "react-datepicker/dist/react-datepicker.css";
import "rc-switch/assets/index.css";
import "rc-slider/assets/index.css";
import "react-rater/lib/react-rater.css";
import "./styles.css";

import React from "react";
import { useHistory } from "react-router-dom";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

import { Row, Card, CardBody } from "reactstrap";
import { Badge, FormGroup } from "reactstrap";
import { Label, CustomInput, Button, ButtonGroup } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Select from "react-select";
import Switch from "rc-switch";

import api from "services/api";

import { Colxx } from "components/common/CustomBootstrap";
import TooltipItem from "components/TooltipItem";

import { getCurrentUser, renderButtonsPermission } from "helpers/Utils";

import { FeedbackContext } from "App";

const Users = ({ match }) => {
  const feedbackContext = React.useContext(FeedbackContext);
  const history = useHistory();

  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [profile_id, setProfile_id] = React.useState("");
  const [force_password_change, setForce_password_change] = React.useState(true);
  const [is_actived, setIs_actived] = React.useState(false);

  const [showModalAddEdt, setShowModalAddEdt] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [profiles, setProfiles] = React.useState([]);

  const loadData = (showLoad = true) => {
    try {
      showLoad ? feedbackContext.useLoading(true, "Carregando...") : null;
      api.get("/users").then(response => {
        setItems(response.data);
        feedbackContext.useLoading(false);
      });
    } catch {
      console.log("erro");
      feedbackContext.useLoading(false);
    }
  };

  const loadProfiles = () => {
    api.get("/profiles?is_actived=true").then(response => {
      setProfiles(response.data);
    });
  };

  const handleSave = async event => {
    if (event) event.preventDefault();

    if (!email || !name || !profile_id?.value) {
      return feedbackContext.useError(true, "Informe todos os campos obrigatórios!");
    }

    feedbackContext.useLoading(true, "Salvando registro...");

    try {
      const data = {
        name,
        email,
        password,

        profile_id: profile_id?.value ?? "",
        force_password_change,
        is_actived,
      };

      if (id) await api.put(`/users/${id}`, data);
      else await api.post(`/users`, data);

      feedbackContext.useSuccess(true, "Registro salvo com sucesso");
      loadData(false);
      setShowModalAddEdt(false);
    } catch {
      console.log("erro ao cadastrar");
      feedbackContext.useLoading(false);
    }
  };

  const handleEdit = item => {
    setId(item.id);
    setName(item.name);
    setEmail(item.email);
    setPassword("");
    setProfile_id({ value: item.profile.id, label: item.profile.name });

    setForce_password_change(false);
    setIs_actived(item.is_actived);

    setShowModalAddEdt(true);
  };

  const handleClear = () => {
    setId("");
    setName("");
    setEmail("");
    setPassword("");
    setProfile_id();
    setForce_password_change(true);
    setIs_actived(true);
  };

  const handleCreate = () => {
    handleClear();
    setShowModalAddEdt(true);
  };

  const handleDisableEnable = (id, status) => {
    feedbackContext.useConfirmAlert(true, `Tem certeza que deseja ${status ? "desativar" : "ativar"} esse registro?`, async () => {
      feedbackContext.useLoading(true, "Atualizando registro...");
      await api.put(`/users/${id}`, { is_actived: !status });
      feedbackContext.useSuccess(true, "Registro atualizado com sucesso");
      loadData(false);
    });
  };

  const handleRemove = id => {
    feedbackContext.useConfirmAlert(true, `Todos os registros relacionados serão removidos! Tem certeza que deseja continuar?`, async () => {
      feedbackContext.useLoading(true, "Excluindo registro...");
      await api.delete(`/users/${id}`);
      feedbackContext.useSuccess(true, "Registro deletado com sucesso");
      loadData(false);
    });
  };

  React.useEffect(() => {
    loadData();
    loadProfiles();
  }, []);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <div className="ml-0 mr-0 mb-0 d-flex row flex-column">
            <a href="javascript:void()" className="btn-link text-small mb-1" onClick={() => history.goBack()}>
              <span className="glyph-icon iconsminds-left-1" /> Voltar
            </a>
            <h1
              className="font-weight-bold"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}>
              <span>Usuários</span>
              {renderButtonsPermission(
                "USERS",
                "STORE",
                <>
                  <span style={{}} className="d-flex">
                    <Button color="success" onClick={() => handleCreate()}>
                      Adicionar
                    </Button>
                  </span>
                </>,
              )}
            </h1>
          </div>

          <Row>
            <Colxx xxs="12" xl="12" className="mb-5">
              <Card style={{ width: "100%" }}>
                <CardBody>
                  <Row>
                    <Colxx xxs="12" xl="12">
                      <Table>
                        <Thead>
                          <Tr>
                            <Th>Nome</Th>
                            <Th>Usuário</Th>
                            <Th className="text-center">Perfil</Th>

                            <Th className="highlighter" style={{ textAlign: "center" }}>
                              Status
                            </Th>

                            <Th
                              className="d-flex"
                              style={{
                                alignItems: "center",
                                justifyContent: "right",
                              }}></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {items.map(item => (
                            <Tr className="mb-1" id={`users-${item.id}`}>
                              {renderButtonsPermission(
                                "USERS",
                                "UPDATE",
                                <>
                                  <Td onClick={() => handleEdit(item)} className="btn-link">
                                    {item.name}
                                  </Td>
                                </>,
                                <Td>{item.name}</Td>,
                              )}

                              <Td>{item.email}</Td>
                              <Td className="text-center">{item?.profile?.name ?? "-"}</Td>

                              <Td style={{ textAlign: "center" }}>
                                <Badge pill className="highlighter" color={item.is_actived ? "success" : "warning"}>
                                  {item.is_actived ? "Ativo" : "Inativo"}
                                </Badge>
                              </Td>

                              <Td
                                className="d-flex"
                                style={{
                                  alignItems: "center",
                                  justifyContent: "right",
                                }}>
                                <ButtonGroup size="xs">
                                  {renderButtonsPermission(
                                    "USERS",
                                    "DISABLE-ENABLE",
                                    <>
                                      <Button id={`btn2-${item.id}`} color="warning" onClick={() => handleDisableEnable(item.id, item.is_actived)}>
                                        <div className="glyph-icon iconsminds-power"></div>
                                        <TooltipItem id={`btn2-${item.id}`} text={item.is_actived ? "Desativar" : "Ativar"} />
                                      </Button>
                                    </>,
                                  )}

                                  <>
                                    {renderButtonsPermission(
                                      "USERS",
                                      "DESTROY",
                                      <>
                                        <Button id={`btn3-${item.id}`} color="danger" onClick={() => handleRemove(item.id)}>
                                          <div className="glyph-icon simple-icon-trash"></div>
                                          <TooltipItem id={`btn3-${item.id}`} text={"Remover"} />
                                        </Button>
                                      </>,
                                    )}{" "}
                                  </>
                                </ButtonGroup>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Colxx>
                  </Row>
                </CardBody>
              </Card>
            </Colxx>
            <Colxx xss="12" className="text-center  ">
              {items.length === 0 ? (
                <small>
                  <strong>Nenhum registro encontrado</strong>
                </small>
              ) : null}
            </Colxx>
          </Row>
        </Colxx>
      </Row>

      <Modal
        wrapClassName="modal-right"
        size="sm"
        scrollable
        isOpen={showModalAddEdt}
        style={{ minWidth: "10vw", width: "100%", minHeight: "100%" }}
        toggle={() => setShowModalAddEdt(false)}>
        <ModalHeader>Usuário</ModalHeader>

        <ModalBody>
          <form onSubmit={handleSave} action="#">
            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="name" className="font-weight-bold">
                    * Nome
                  </Label>
                  <CustomInput className="form-control" type="text" required placeholder="" id="name" value={name} onChange={e => setName(e.target.value)} />
                </FormGroup>
              </Colxx>
            </Row>

            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="email" className="font-weight-bold">
                    * E-mail
                  </Label>
                  <CustomInput
                    autocomplete="new-password"
                    required
                    className="form-control"
                    type={"email"}
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </FormGroup>
              </Colxx>
            </Row>
            <Row>
              <Colxx sm="12" xs="12">
                <FormGroup>
                  <Label for="password" className="font-weight-bold">
                    {id ? "Senha" : "* Senha"}
                  </Label>
                  <CustomInput
                    autocomplete="new-password"
                    required={id ? false : true}
                    className="form-control"
                    type="password"
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </FormGroup>
              </Colxx>
            </Row>
            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="profile_id" className="font-weight-bold">
                    * Perfil
                  </Label>
                  <Select
                    id="profile_id"
                    type="select"
                    placeholder="Selecione..."
                    options={profiles.map(i => ({ value: i.id, label: i.name }))}
                    defaultValue={profile_id}
                    value={profile_id}
                    onChange={e => setProfile_id(e)}
                  />
                </FormGroup>
              </Colxx>
            </Row>

            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="is_actived" className="font-weight-bold">
                    Inativo/Ativo
                  </Label>
                  <Switch className="custom-switch custom-switch-primary" checked={is_actived} onChange={e => setIs_actived(e)} />
                </FormGroup>
              </Colxx>
            </Row>
            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="force_password_change">Forçar alteração de senha no próximo login</Label>
                  <Switch className="custom-switch custom-switch-primary" checked={force_password_change} onChange={e => setForce_password_change(e)} />
                </FormGroup>
              </Colxx>
            </Row>
            <button type="submit" style={{ display: "none" }} id="btnSubmit" />
          </form>
        </ModalBody>
        <ModalFooter className="justify-content-end">
          <button type="button" className="btn btn-light btn-sm" onClick={() => setShowModalAddEdt(false)}>
            Fechar
          </button>
          <button type="submit" className="btn btn-success btn-shadow btn-lg " onClick={() => document.querySelector("#btnSubmit").click()}>
            Salvar
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default React.memo(Users);
