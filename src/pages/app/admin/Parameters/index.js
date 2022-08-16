import "react-tagsinput/react-tagsinput.css";
import "react-datepicker/dist/react-datepicker.css";
import "rc-switch/assets/index.css";
import "rc-slider/assets/index.css";
import "react-rater/lib/react-rater.css";
import "./styles.css";

import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

import { scroller } from "react-scroll";

import { Row, Card, CardBody, Nav, NavItem, Alert, Jumbotron } from "reactstrap";
import { UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu, TabContent } from "reactstrap";
import { TabPane, Badge, CardTitle, FormGroup, FormText, Form } from "reactstrap";
import { Label, Input, CustomInput, Button, ButtonGroup, CardSubtitle, CardText } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { NotificationManager } from "components/common/react-notifications";
import { NavLink } from "react-router-dom";
import { Colxx } from "components/common/CustomBootstrap";

import Select from "react-select";
import Switch from "rc-switch";

import classnames from "classnames";
import TooltipItem from "components/TooltipItem";

import api from "services/api";
import { getCurrentUser, renderButtonsPermission } from "helpers/Utils";

import { FeedbackContext } from "App";

const Parameters = ({ match }) => {
  const feedbackContext = React.useContext(FeedbackContext);

  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const [key, setKey] = React.useState("");
  const [value, setValue] = React.useState("");
  const [is_actived, setIs_actived] = React.useState(true);

  const [showModalAddEdt, setShowModalAddEdt] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const loadData = (showLoad = true) => {
    try {
      showLoad ? feedbackContext.useLoading(true, "Carregando...") : null;
      api.get("/parameters").then(response => {
        setItems(response.data);
        feedbackContext.useLoading(false);
      });
    } catch {
      console.log("erro");
      feedbackContext.useLoading(false);
    }
  };

  const handleSave = async event => {
    if (event) event.preventDefault();
    feedbackContext.useLoading(true, "Salvando registro...");

    try {
      if (id) await api.put(`/parameters/${id}`, { name, key, value, is_actived });
      else await api.post(`/parameters`, { name, key, value, is_actived });

      feedbackContext.useSuccess(true, "Registro salvo com sucesso");
      loadData(false);
    } catch {
      console.log("erro ao cadastrar");
      feedbackContext.useLoading(false);
    }
  };

  const handleEdit = item => {
    setId(item.id);
    setName(item.name);
    setValue(item.value);
    setKey(item.key);
    setIs_actived(item.is_actived);

    setShowModalAddEdt(true);
  };

  const handleClear = () => {
    setId("");
    setName("");
    setValue("");
    setKey("");
    setIs_actived(true);
  };

  const handleCreate = () => {
    handleClear();
    setShowModalAddEdt(true);
  };

  const handleDisableEnable = (id, status) => {
    feedbackContext.useConfirmAlert(true, `Tem certeza que deseja ${status ? "desativar" : "ativar"} esse registro?`, async () => {
      feedbackContext.useLoading(true, "Atualizando registro...");
      await api.put(`/parameters/${id}`, { is_actived: !status });
      feedbackContext.useSuccess(true, "Registro atualizado com sucesso");
      loadData(false);
    });
  };

  const handleRemove = id => {
    feedbackContext.useConfirmAlert(true, `Todos os registros relacionados serão removidos! Tem certeza que deseja continuar?`, async () => {
      feedbackContext.useLoading(true, "Excluindo registro...");
      await api.delete(`/parameters/${id}`);
      feedbackContext.useSuccess(true, "Registro deletado com sucesso");
      loadData(false);
    });
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <h1
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}>
            Parâmetros
            {renderButtonsPermission(
              "PARAMETERS",
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

          <Row>
            <Colxx xxs="12" xl="12" className="mb-5">
              <Card style={{ width: "100%" }}>
                <CardBody>
                  <Row>
                    <Colxx xxs="12" xl="12">
                      <Table>
                        <Thead>
                          <Tr>
                            <Th>Chave</Th>
                            <Th>Nome</Th>
                            <Th>Valor</Th>

                            <Th style={{ textAlign: "center" }}>Status</Th>
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
                            <Tr className="mb-1" id={`parameters-${item.id}`}>
                              <Td>{item.key}</Td>

                              {renderButtonsPermission(
                                "PARAMETERS",
                                "UPDATE",
                                <>
                                  <Td onClick={() => handleEdit(item)} className="btn-link">
                                    {item.name}
                                  </Td>
                                </>,
                                <Td>{item.name}</Td>,
                              )}

                              <Td>{item.value}</Td>

                              <Td style={{ textAlign: "center" }}>
                                <Badge className="highlighter" pill color={item.is_actived ? "success" : "warning"}>
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
                                    "PARAMETERS",
                                    "DISABLE-ENABLE",
                                    <>
                                      <Button id={`btn2-${item.id}`} color="warning" onClick={() => handleDisableEnable(item.id, item.is_actived)}>
                                        <div className="glyph-icon iconsminds-power"></div>
                                        <TooltipItem id={`btn2-${item.id}`} text={item.is_actived ? "Desativar" : "Ativar"} />
                                      </Button>
                                    </>,
                                  )}
                                  {renderButtonsPermission(
                                    "PARAMETERS",
                                    "DESTROY",
                                    <>
                                      <Button id={`btn3-${item.id}`} color="danger" onClick={() => handleRemove(item.id)}>
                                        <div className="glyph-icon simple-icon-trash"></div>
                                        <TooltipItem id={`btn3-${item.id}`} text={"Remover"} />
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
        scrollable
        style={{ minWidth: "10vw", width: "100%", minHeight: "100vh" }}
        toggle={() => setShowModalAddEdt(false)}>
        <ModalHeader>Parâmetros</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSave} action="#">
            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="key">Chave</Label>
                  <CustomInput required className="form-control" type="text" id="key" value={key} onChange={e => setKey(e.target.value)} />
                </FormGroup>
              </Colxx>
            </Row>
            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="name">Nome</Label>
                  <CustomInput className="form-control" type="text" required placeholder="" id="name" value={name} onChange={e => setName(e.target.value)} />
                </FormGroup>
              </Colxx>
            </Row>
            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="value">Valor</Label>
                  <CustomInput required className="form-control" type="text" id="value" value={value} onChange={e => setValue(e.target.value)} />
                </FormGroup>
              </Colxx>
            </Row>
            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="is_actived">Ativo/Inativo</Label>
                  <Switch className="custom-switch custom-switch-primary" checked={is_actived} onChange={e => setIs_actived(e)} />
                </FormGroup>
              </Colxx>
            </Row>
            <button type="submit" style={{ display: "none" }} id="btnSubmitParameters" />
          </form>
        </ModalBody>
        <ModalFooter style={{ justifyContent: "end" }}>
          <button type="button" className="btn btn-light" onClick={() => setShowModalAddEdt(false)}>
            Fechar
          </button>
          <button type="submit" className="btn btn-success btn-shadow btn-lg " onClick={() => document.querySelector("#btnSubmitParameters").click()}>
            Salvar
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default React.memo(Parameters);
