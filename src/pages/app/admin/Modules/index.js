import "react-tagsinput/react-tagsinput.css";
import "react-datepicker/dist/react-datepicker.css";
import "rc-switch/assets/index.css";
import "rc-slider/assets/index.css";
import "react-rater/lib/react-rater.css";
import "./styles.css";

import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

import { Row, Card, CardBody, Nav, NavItem, Alert, Jumbotron } from "reactstrap";
import { UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu, TabContent } from "reactstrap";
import { TabPane, Badge, CardTitle, FormGroup, FormText, Form } from "reactstrap";
import { Label, Input, CustomInput, Button, ButtonGroup, CardSubtitle, CardText } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { NotificationManager } from "components/common/react-notifications";
import { NavLink } from "react-router-dom";
import { Colxx } from "components/common/CustomBootstrap";
import Switch from "rc-switch";

import classnames from "classnames";
import Select from "react-select";
import Breadcrumb from "components/navs/Breadcrumb";
import IntlMessages from "helpers/IntlMessages";

import CustomSelectInput from "components/common/CustomSelectInput";
import TooltipItem from "components/TooltipItem";

import api from "services/api";
import { getCurrentUser, getCurrentUserToken } from "helpers/Utils";
import { toFormData, maskRealBeautify, dateToEng, clearMask } from "utils/functions";

import { FeedbackContext } from "App";

const AdmModules = ({ match }) => {
  const feedbackContext = React.useContext(FeedbackContext);

  const [id, setId] = React.useState("");
  const [key, setKey] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [version, setVersion] = React.useState("");
  const [position, setPosition] = React.useState(1);
  const [is_actived, setIs_actived] = React.useState(true);

  const [operation, setOperation] = React.useState([]);

  const [showModalAddEdt, setShowModalAddEdt] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [operations, setOperations] = React.useState([]);

  const loadData = (showLoad = true) => {
    try {
      showLoad ? feedbackContext.useLoading(true, "Carregando...") : null;
      api.get("/modules").then(response => {
        setItems(response.data);
        feedbackContext.useLoading(false);
      });
    } catch {
      console.log("erro");
      feedbackContext.useLoading(false);
    }
  };

  const loadOperations = () => {
    api.get("/operations?is_actived=true").then(response => {
      setOperations(response.data);
    });
  };

  const handleSave = async event => {
    if (event) event.preventDefault();
    feedbackContext.useLoading(true, "Salvando registro...");

    const data = {
      key,
      title,
      version,
      position,
      is_actived,
      operations: operation.map(o => o.value),
    };

    try {
      if (id) await api.put(`/modules/${id}`, data);
      else await api.post(`/modules`, data);

      feedbackContext.useSuccess(true, "Registro salvo com sucesso");
      loadData(false);
    } catch {
      console.log("erro ao cadastrar");
      feedbackContext.useLoading(false);
    }
  };

  const handleEdit = item => {
    setId(item.id);
    setKey(item.key);
    setTitle(item.title);
    setVersion(item.version);
    setPosition(item.order);
    setIs_actived(item.is_actived);
    setOperation(item?.operations?.map(i => ({ value: i.id, label: i.name })) ?? []);

    setShowModalAddEdt(true);
  };

  const handleClear = item => {
    setId("");
    setKey("");
    setTitle("");
    setVersion("1");
    setPosition(1);
    setIs_actived(true);
    setOperation([]);
  };

  const handleCreate = () => {
    handleClear();
    setShowModalAddEdt(true);
  };

  const handleDisableEnable = (id, status) => {
    feedbackContext.useConfirmAlert(true, `Tem certeza que deseja ${status ? "desativar" : "ativar"} esse registro?`, async () => {
      feedbackContext.useLoading(true, "Atualizando registro...");
      await api.put(`/modules/${id}`, { is_actived: !status });
      feedbackContext.useSuccess(true, "Registro atualizado com sucesso");
      loadData(false);
    });
  };

  const handleRemove = id => {
    feedbackContext.useConfirmAlert(true, `Todos os registros relacionados serão removidos! Tem certeza que deseja continuar?`, async () => {
      feedbackContext.useLoading(true, "Excluindo registro...");
      await api.delete(`/modules/${id}`);
      feedbackContext.useSuccess(true, "Registro deletado com sucesso");
      loadData(false);
    });
  };

  React.useEffect(() => {
    loadOperations();
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
            Módulos
            <span style={{}} className="d-flex">
              <Button color="success" onClick={() => handleCreate()}>
                Adicionar
              </Button>
            </span>
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
                            <Th>Título</Th>
                            <Th style={{ textAlign: "center" }}>Status</Th>
                            <Th
                              className="d-flex"
                              style={{
                                alignItems: "center",
                                justifyContent: "right",
                                marginRight: 120,
                              }}></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {items.map(item => (
                            <Tr className="mb-1" id={`modules-${item.id}`}>
                              <Td>{item.key}</Td>
                              <Td onClick={() => handleEdit(item)} className="btn-link">
                                {item.title}
                              </Td>

                              {/* <Td>{item.order}º</Td> */}
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
                                  {/* <Button id={`btn1-${item.id}`} color="info" onClick={() => handleEdit(item)}>
                                    <div className="glyph-icon simple-icon-note"></div>
                                  </Button>
                                  <TooltipItem id={`btn1-${item.id}`} text={"Editar"} /> */}
                                  <Button id={`btn2-${item.id}`} color="warning" onClick={() => handleDisableEnable(item.id, item.is_actived)}>
                                    <div className="glyph-icon iconsminds-power"></div>
                                  </Button>
                                  <TooltipItem id={`btn2-${item.id}`} text={item.is_actived ? "Desativar" : "Ativar"} />

                                  <TooltipItem id={`btn3-${item.id}`} text={"Remover"} />
                                  <Button id={`btn3-${item.id}`} color="danger" onClick={() => handleRemove(item.id)}>
                                    <div className="glyph-icon simple-icon-trash"></div>
                                  </Button>
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
        scrollable
        size="lg"
        isOpen={showModalAddEdt}
        style={{ minWidth: "30vw", width: "100%", minHeight: "100vh" }}
        toggle={() => setShowModalAddEdt(false)}>
        <ModalHeader>Módulos</ModalHeader>

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
                  <Label for="title">Título</Label>
                  <CustomInput required className="form-control" type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} />
                </FormGroup>
              </Colxx>
            </Row>
            <Row>
              <Colxx sm="6" xs="12">
                <FormGroup>
                  <Label for="version">Versão</Label>
                  <CustomInput className="form-control" type="text" id="version" value={version} onChange={e => setVersion(e.target.value)} />
                </FormGroup>
              </Colxx>
              <Colxx sm="6" xs="12">
                <Label for="position">Posição</Label>
                <CustomInput required className="form-control" type="number" id="position" value={position} onChange={e => setPosition(e.target.value)} />
              </Colxx>
            </Row>
            <Row>
              <Colxx sm="12" xs="12">
                <FormGroup>
                  <Label for="operation">Operações</Label>
                  <Select
                    isMulti
                    id="operation"
                    type="select"
                    noOptionsMessage={() => "Nenhum registro encontrado"}
                    options={operations.map(i => ({ value: i.id, label: i.name }))}
                    value={operation}
                    defaultValue={operation}
                    onChange={e => setOperation(e)}
                  />
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
            </Row>
            <button type="submit" style={{ display: "none" }} id="btnSubmit" />
          </form>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-light" onClick={() => setShowModalAddEdt(false)}>
            Fechar
          </button>
          <button type="submit" className="btn btn-success btn-shadow btn-block" onClick={() => document.querySelector("#btnSubmit").click()}>
            Salvar
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default React.memo(AdmModules);
