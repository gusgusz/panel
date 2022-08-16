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
import { Colxx } from "components/common/CustomBootstrap";

import TooltipItem from "components/TooltipItem";
import { getCurrentUser, renderButtonsPermission } from "helpers/Utils";

import Switch from "rc-switch";

import api from "services/api";

import { FeedbackContext } from "App";

const Profiles = ({ match }) => {
  const feedbackContext = React.useContext(FeedbackContext);
  const history = useHistory();

  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const [is_actived, setIs_actived] = React.useState(true);
  const [show_all_user, setShow_all_user] = React.useState(false);

  const [showModalAddEdt, setShowModalAddEdt] = React.useState(false);
  const [showModalPermission, setShowModalPermission] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const [profile, setProfile] = React.useState({});
  const [permissions, setPermissions] = React.useState({ change: false, items: [] });

  const loadData = (showLoad = true) => {
    try {
      showLoad ? feedbackContext.useLoading(true, "Carregando perfis...") : null;
      api.get("/profiles").then(response => {
        setItems(response.data);
        feedbackContext.useLoading(false);
      });
    } catch {
      console.log("erro");
      feedbackContext.useLoading(false);
    }
  };

  const loadPermissions = id => {
    try {
      feedbackContext.useLoading(true, "Carregando permissões do perfil...<br /><b>Pode demorar um pouco</b>");
      api.get(`/profiles/${id}/permissions`).then(response => {
        setPermissions({ change: !permissions.change, items: response.data });
        setShowModalPermission(true);
        feedbackContext.useLoading(false);
      });
    } catch {
      feedbackContext.useError(true, "Oops! Ocorreu um erro ao tentar consultar as permissões do perfil");
    }
  };

  const handleSave = async event => {
    if (event) event.preventDefault();
    feedbackContext.useLoading(true, "Salvando perfil...");

    try {
      if (id) await api.put(`/profiles/${id}`, { name, is_actived, show_all_user });
      else await api.post(`/profiles`, { name, is_actived, show_all_user });

      feedbackContext.useSuccess(true, "Perfil salvo com sucesso");
      loadData(false);
    } catch {
      console.log("erro ao cadastrar perfil");
      feedbackContext.useLoading(false);
    }
  };

  const handleCheckPermission = async (module_id, operation_id, checked) => {
    try {
      api.post(`/profiles/${profile.id}/permissions`, { module_id, operation_id, checked });

      const newPermissions = permissions.items.map(i => {
        if (i.module_id === module_id) {
          i.operations.map(ii => {
            if (ii.operation_id === operation_id) ii.checked = checked;
            return ii;
          });
        }
        return i;
      });

      setPermissions({ change: permissions.change, items: newPermissions });
    } catch (error) {
      console.log("erro ao cadastrar permissão", error);
    }
  };

  const handleEdit = item => {
    setId(item.id);
    setName(item.name);
    setIs_actived(item.is_actived);
    setShow_all_user(item.show_all_user);

    setShowModalAddEdt(true);
  };

  const handleCreate = () => {
    setName("");
    setIs_actived(true);
    setShow_all_user(false);
    setId("");
    setShowModalAddEdt(true);
  };

  const handleDisableEnable = (id, status) => {
    feedbackContext.useConfirmAlert(true, `Tem certeza que deseja ${status ? "desativar" : "ativar"} esse registro?`, async () => {
      feedbackContext.useLoading(true, "Atualizando registro...");
      await api.put(`/profiles/${id}`, { is_actived: !status });
      feedbackContext.useSuccess(true, "Registro atualizado com sucesso");
      loadData(false);
    });
  };

  const handleShowPermission = item => {
    setProfile(item);
    loadPermissions(item.id);
  };

  React.useEffect(() => {
    loadData();
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
              <span>Perfil de acesso</span>
              {!getCurrentUser()?.is_user ? (
                <>
                  {renderButtonsPermission(
                    "PROFILES",
                    "STORE",
                    <>
                      <span style={{}} className="d-flex">
                        <Button size="md" color="success" className="top-right-button btn" onClick={handleCreate}>
                          Adicionar
                        </Button>
                      </span>
                    </>,
                  )}
                </>
              ) : null}
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

                            <Th style={{ textAlign: "center" }}>Situação</Th>

                            <Th
                              className="d-flex"
                              style={{
                                alignItems: "center",
                                justifyContent: "right",
                                marginRight: 70,
                              }}></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {items.map(item => (
                            <Tr className="mb-1" id={`profile-${item.id}`}>
                              {renderButtonsPermission(
                                "PROFILES",
                                "UPDATE",
                                <>
                                  <Td onClick={() => handleEdit(item)} className="btn-link">
                                    {item.name}
                                  </Td>
                                </>,
                                <Td>{item.name}</Td>,
                              )}

                              <>
                                <Td style={{ textAlign: "center" }}>
                                  <Badge pill className="highlighter" color={item.is_actived ? "success" : "warning"}>
                                    {item.is_actived ? "Ativo" : "Inativo"}
                                  </Badge>
                                </Td>
                              </>

                              <Td
                                className="d-flex"
                                style={{
                                  alignItems: "center",
                                  justifyContent: "right",
                                }}>
                                <ButtonGroup size="xs">
                                  {renderButtonsPermission(
                                    "PROFILES",
                                    "DISABLE-ENABLE",
                                    <>
                                      <Button id={`btn2-${item.id}`} color="warning" onClick={() => handleDisableEnable(item.id, item.is_actived)}>
                                        <div className="glyph-icon iconsminds-power"></div>
                                        <TooltipItem id={`btn2-${item.id}`} text={item.is_actived ? "Desativar" : "Ativar"} />
                                      </Button>
                                    </>,
                                  )}

                                  {renderButtonsPermission(
                                    "PROFILES",
                                    "PERMISSIONS",
                                    <>
                                      <Button id={`btn3-${item.id}`} color="primary" onClick={() => handleShowPermission(item)}>
                                        <div className="glyph-icon simple-icon-check"></div>
                                        <TooltipItem id={`btn3-${item.id}`} text={"Permissões"} />
                                      </Button>
                                    </>,
                                  )}
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
        isOpen={showModalAddEdt}
        style={{ minWidth: "10vw", width: "100%" }}
        toggle={() => setShowModalAddEdt(false)}>
        <ModalHeader>Perfil</ModalHeader>

        <ModalBody>
          <form onSubmit={handleSave} action="#">
            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="title">Nome</Label>
                  <CustomInput className="form-control" required type="text" placeholder="" id="name" value={name} onChange={e => setName(e.target.value)} />
                </FormGroup>
              </Colxx>
            </Row>
            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="is_actived">Ativação</Label>
                  <Switch className="custom-switch custom-switch-primary" checked={is_actived} onChange={e => setIs_actived(e)} />
                </FormGroup>
              </Colxx>
            </Row>{" "}
            <button type="submit" style={{ display: "none" }} id="btnSubmitProfile" />
          </form>
        </ModalBody>
        <ModalFooter className="justify-content-end">
          <button type="button" className="btn btn-light btn-sm" onClick={() => setShowModalAddEdt(false)}>
            Fechar
          </button>
          <button type="button" className="btn btn-success btn-shadow btn-lg " onClick={() => document.querySelector("#btnSubmitProfile").click()}>
            Salvar
          </button>
        </ModalFooter>
      </Modal>

      <Modal wrapClassName="modal-right" size="sm" scrollable isOpen={showModalPermission} style={{ minWidth: "95vw", width: "100%", maxHeight: "100vh" }}>
        <ModalHeader>
          Permissões do perfil: <b>{profile?.name}</b>
        </ModalHeader>

        <ModalBody>
          {permissions.items.map((permission, index) => (
            <>
              <Row key={`permission-module-${index}`}>
                <Colxx xs="4" lg="2" md="2" sm="2" style={{ alignItems: "center", justifyContent: "flex-start", display: "flex" }}>
                  <Label className="mb-0">
                    <strong>{permission?.module_name}</strong>
                  </Label>
                </Colxx>
                <Colxx xs="8" lg="10" md="10" sm="10" style={{ display: "flex", gap: "35px", flexWrap: "nowrap" }}>
                  {permission.operations.map(operation => (
                    <div key={`permission-operation-${index}-${operation.operation_id}`} className="permission-box">
                      <Label for="is_actived" className="mb-0">
                        <strong>{operation.operation_name}</strong>
                      </Label>
                      <Switch
                        className="custom-switch custom-switch-primary"
                        checked={operation.checked}
                        onChange={e => handleCheckPermission(permission?.module_id, operation.operation_id, !operation.checked)}
                      />
                    </div>
                  ))}
                </Colxx>
              </Row>
              <hr />
            </>
          ))}
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-light" onClick={() => setShowModalPermission(false)}>
            Fechar
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default React.memo(Profiles);
