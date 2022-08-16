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

const Operations = ({ match }) => {
  const feedbackContext = React.useContext(FeedbackContext);

  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [key, setKey] = React.useState("");
  const [is_actived, setIs_actived] = React.useState(true);

  const [showModalAddEdt, setShowModalAddEdt] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const loadData = (showLoad = true) => {
    try {
      showLoad ? feedbackContext.useLoading(true, "Carregando...") : null;
      api.get("/operations").then(response => {
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
      if (id) await api.put(`/operations/${id}`, { name, key, is_actived, title });
      else await api.post(`/operations`, { name, key, is_actived, title });

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
    setKey(item.key);
    setTitle(item.title);
    setIs_actived(item.is_actived);

    setShowModalAddEdt(true);
  };

  const handleClear = item => {
    setId("");
    setName("");
    setTitle("");
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
      await api.put(`/operations/${id}`, { is_actived: !status });
      feedbackContext.useSuccess(true, "Registro atualizado com sucesso");
      loadData(false);
    });
  };

  const handleRemove = id => {
    feedbackContext.useConfirmAlert(true, `Todos os registros relacionados serão removidos! Tem certeza que deseja continuar?`, async () => {
      feedbackContext.useLoading(true, "Excluindo registro...");
      await api.delete(`/operations/${id}`);
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
            Operações
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
                            <Th>Key</Th>
                            <Th>Nome</Th>
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
                            <Tr className="mb-1" id={`operations-${item.id}`}>
                              <Td>{item.key}</Td>
                              <Td onClick={() => handleEdit(item)} className="btn-link">
                                {item.title}
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
                                  </Button> */}
                                  {/* <TooltipItem id={`btn1-${item.id}`} text={"Editar"} /> */}

                                  <Button id={`btn2-${item.id}`} color="danger" onClick={() => handleRemove(item.id)}>
                                    <div className="glyph-icon simple-icon-trash"></div>
                                    <TooltipItem id={`btn2-${item.id}`} text={"Remover"} />
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
        size="sm"
        isOpen={showModalAddEdt}
        style={{ minWidth: "10vw", width: "100%" }}
        toggle={() => setShowModalAddEdt(false)}>
        <form onSubmit={handleSave} action="#">
          <ModalHeader>Operações</ModalHeader>

          <ModalBody>
            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="key">Key</Label>
                  <CustomInput required className="form-control" type="text" id="key" value={key} onChange={e => setKey(e.target.value)} />
                </FormGroup>
              </Colxx>
            </Row>
            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="name">Nome</Label>
                  <CustomInput className="form-control" type="text" id="name" required value={name} onChange={e => setName(e.target.value)} />
                </FormGroup>
              </Colxx>
            </Row>
            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label for="title">Título</Label>
                  <CustomInput className="form-control" type="text" id="name" required value={title} onChange={e => setTitle(e.target.value)} />
                </FormGroup>
              </Colxx>
            </Row>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-light" onClick={() => setShowModalAddEdt(false)}>
              Fechar
            </button>
            <button type="submit" className="btn btn-success btn-shadow btn-block">
              Salvar
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};
export default React.memo(Operations);
