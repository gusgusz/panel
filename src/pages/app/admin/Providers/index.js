import "react-tagsinput/react-tagsinput.css";
import "react-datepicker/dist/react-datepicker.css";
import "rc-switch/assets/index.css";
import "rc-slider/assets/index.css";
import "react-rater/lib/react-rater.css";
import "./styles.css";

import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

import { Row, Card, CardBody } from "reactstrap";

import { Badge, FormGroup } from "reactstrap";
import { Label, CustomInput, Button, ButtonGroup } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Colxx } from "components/common/CustomBootstrap";

import Select from "react-select";
import Switch from "rc-switch";

import TooltipItem from "components/TooltipItem";

import api from "services/api";
import { getCurrentUser, renderButtonsPermission } from "helpers/Utils";

import { FeedbackContext } from "App";
import DropzoneExample from "components/Dropzone";
import error_alert from "utils/alerts/error";
import { maskIntBeautify, maskRealBeautify, toFloat } from "utils/functions";
import moment from "moment";

const Providers = () => {
  const feedbackContext = React.useContext(FeedbackContext);

  const [items, setItems] = React.useState([]);
  const [currentCoins, setCurrentCoins] = React.useState(0);
  const [descriptionCoins, setDescriptionCoins] = React.useState("");
  const [showModalCoins, setShowModalCoins] = React.useState(false);
  const [provider, setProvider] = React.useState({});

  const loadData = (showLoad = true) => {
    try {
      showLoad ? feedbackContext.useLoading(true, "Carregando...") : null;
      api.get("/providers").then(response => {
        setItems(response.data);
        feedbackContext.useLoading(false);
      });
    } catch {
      console.log("erro");
      feedbackContext.useLoading(false);
    }
  };

  const accept = id => {
    try {
      feedbackContext.useLoading(true, "Aceitando prestador...");
      api.put(`/providers/${id}`, { status: "ACCEPTED" }).then(response => {
        feedbackContext.useLoading(false);
        loadData(false);
      });
    } catch {
      console.log("erro");
      feedbackContext.useLoading(false);
    }
  };

  const handleSaveCoins = event => {
    if (event) event.preventDefault();

    feedbackContext.useLoading(true, "Atualizando saldo em moedas do prestador...");
    api
      .put(`/providers/${provider.id}/coins`, { coins_balance: currentCoins, description: descriptionCoins })
      .then(response => {
        feedbackContext.useSuccess(true, "Saldo atualizado com sucesso!");
        loadData(false);
        setShowModalCoins(false);
      })
      .catch(error => {
        console.log("erro");
        feedbackContext.useError(true, "Oops! Não foi possível atualizar o saldo em moedas.");
      });
  };

  const refuse = id => {
    try {
      feedbackContext.useLoading(true, "Recusando prestador...");
      api.put(`/providers/${id}`, { status: "REFUSED" }).then(response => {
        feedbackContext.useLoading(false);
        loadData(false);
      });
    } catch {
      console.log("erro");
      feedbackContext.useLoading(false);
    }
  };

  const loadCoins = item => {
    setCurrentCoins(item.coins_balance);
    setDescriptionCoins("");
    setShowModalCoins(true);
    setProvider(item);
  };

  const getStatus = status => {
    if (status === "ACCEPTED") return { label: "Aprovado", color: "success" };
    if (status === "PENDING") return { label: "Aguardando", color: "warning" };
    if (status === "REFUSED") return { label: "Recusado", color: "danger" };
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
            Prestadores
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
                            <Th style={{ width: 25 }}>#</Th>
                            <Th style={{ width: 150 }}>Prestador</Th>

                            <Th style={{ textAlign: "center" }}>Telefone</Th>
                            <Th style={{ textAlign: "center" }}>E-mail</Th>
                            <Th style={{ textAlign: "center" }}>CPF</Th>
                            <Th style={{ textAlign: "center" }}>Dt. Nascimento</Th>
                            <Th style={{ textAlign: "center" }}>Saldo</Th>
                            <Th style={{ textAlign: "center" }}>Cidade</Th>
                            <Th style={{ textAlign: "center" }}>Último login</Th>
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
                            <Tr className="mb-1" id={`services-${item.id}`}>
                              <Td>{item.id}</Td>
                              <Td>{item.name}</Td>

                              <Td className="text-center">{item.phone}</Td>
                              <Td className="text-center">{item.email ?? "-"}</Td>
                              <Td className="text-center">{item.cpf ?? "-"}</Td>
                              <Td className="text-center">{moment(item.birth_date).utc(false).format("DD/MM/YYYY")}</Td>
                              <Td className="text-center font-weight-bold">{maskIntBeautify(item.coins_balance)}</Td>
                              <Td className="text-center">{item.city_name}</Td>
                              <Td className="text-center">{moment(item.last_refresh).utc(false).format("DD/MM/YYYY HH:mm")}</Td>
                              <Td style={{ textAlign: "center" }}>
                                <Badge className="highlighter" pill color={getStatus(item.status).color}>
                                  {getStatus(item.status).label}
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
                                    "PROVIDERS",
                                    "COINS_BALANCE",
                                    <>
                                      {item.status === "ACCEPTED" ? (
                                        <Button id={`btn2-coins-${item.id}`} color="dark" onClick={() => loadCoins(item)}>
                                          <div className="iconsminds-coins"> Moedas</div>
                                          <TooltipItem id={`btn2-coins-${item.id}`} text={"Editar Saldo de moedas"} />
                                        </Button>
                                      ) : null}
                                    </>,
                                  )}

                                  {renderButtonsPermission(
                                    "PROVIDERS",
                                    "APPROVAL",
                                    <>
                                      {item.status === "ACCEPTED" ? (
                                        <Button id={`btn2-refuse-${item.id}`} color="danger" onClick={() => refuse(item.id)}>
                                          <div className="iconsminds-unlike"> Recusar</div>
                                          <TooltipItem id={`btn2-refuse-${item.id}`} text={"Recusar"} />
                                        </Button>
                                      ) : null}

                                      {item.status === "REFUSED" ? (
                                        <Button id={`btn2-accept-${item.id}`} color="success" onClick={() => accept(item.id)}>
                                          <div className="iconsminds-like"> Aceitar</div>
                                          <TooltipItem id={`btn2-accept-${item.id}`} text={"Aceitar"} />
                                        </Button>
                                      ) : null}

                                      {item.status === "PENDING" ? (
                                        <>
                                          <Button id={`btn2-accept-${item.id}`} color="success" onClick={() => accept(item.id)}>
                                            <div className="iconsminds-like"> Aceitar</div>
                                            <TooltipItem id={`btn2-accept-${item.id}`} text={"Aceitar"} />
                                          </Button>

                                          <Button id={`btn2-refuse-${item.id}`} color="danger" onClick={() => refuse(item.id)}>
                                            <div className="iconsminds-unlike"> Recusar</div>
                                            <TooltipItem id={`btn2-refuse-${item.id}`} text={"Recusar"} />
                                          </Button>
                                        </>
                                      ) : null}
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
        // wrapClassName="modal-right"
        size="md"
        isOpen={showModalCoins}
        toggle={() => setShowModalCoins(false)}>
        <ModalHeader>
          Saldo em moedas de <b>{provider?.name}</b>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSaveCoins} action="#">
            <Row>
              <Colxx sm="12" lg="12" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="descriptionCoins">
                    * Descrição
                  </Label>
                  <CustomInput
                    required
                    className="form-control"
                    type="text"
                    id="descriptionCoins"
                    value={descriptionCoins}
                    onChange={e => setDescriptionCoins(e.target.value)}
                  />
                </FormGroup>
              </Colxx>

              <Colxx sm="12" lg="12" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="currentCoins">
                    * Saldo
                  </Label>
                  <CustomInput
                    required
                    className="form-control"
                    type="number"
                    id="currentCoins"
                    value={currentCoins}
                    onChange={e => setCurrentCoins(e.target.value)}
                  />
                </FormGroup>
              </Colxx>
            </Row>

            <button type="submit" style={{ display: "none" }} id="btnSubmitCoins" />
          </form>
        </ModalBody>
        <ModalFooter style={{ justifyContent: "end" }}>
          <button type="button" className="btn btn-light" onClick={() => setShowModalCoins(false)}>
            Fechar
          </button>
          <button type="submit" className="btn btn-success btn-shadow btn-lg " onClick={() => document.querySelector("#btnSubmitCoins").click()}>
            Salvar
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default React.memo(Providers);
