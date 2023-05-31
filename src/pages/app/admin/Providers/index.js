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
import { maskCep, maskCpfCnpj, maskIntBeautify, maskPhone, maskRealBeautify, toFloat } from "utils/functions";
import moment from "moment";
import Pagination from "components/Pagination";
import ComponentApplicationMenu from "./applicationMenu";
import ReactSelect from "react-select";
import CustomSelectInput from "components/common/CustomSelectInput";

const PER_PAGE = 20;
const Providers = () => {
  const feedbackContext = React.useContext(FeedbackContext);

  const [items, setItems] = React.useState([]);
  const [page, setPage] = React.useState(0);

  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [birth_date, setBirth_date] = React.useState("");
  const [zipcode, setZipcode] = React.useState("");
  const [city_name, setCity_name] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [franchise_id, setFranchise_id] = React.useState("");
  const [skills, setSkills] = React.useState([]);

  const [showModalAddEdt, setShowModalAddEdt] = React.useState(false);

  const [currentCoins, setCurrentCoins] = React.useState(0);
  const [descriptionCoins, setDescriptionCoins] = React.useState("");
  const [showModalCoins, setShowModalCoins] = React.useState(false);
  const [provider, setProvider] = React.useState({});

  const [franchises, setFranchises] = React.useState([]);
  const [categories, setCategories] = React.useState([]);

  const loadFranchises = () => {
    api.get("/franchises").then(response => {
      setFranchises(response.data);
    });
  };

  const loadCategories = () => {
    api.get("/categories").then(response => {
      setCategories(response.data);
    });
  };

  const loadData = (params = {}) => {
    try {
      feedbackContext.useLoading(true, "Carregando...");
      api.get("/providers", { params }).then(response => {
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
        loadData();
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
        loadData();
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
        loadData();
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
      const payload = {
        name,
        cpf,
        birth_date,
        zipcode,
        city_name,
        address,
        email,
        phone,
        franchise_id: franchise_id ? franchise_id.value : undefined,
        status: "ACCEPTED",
        skills: skills.map(i => i.value),
      };

      if (id) await api.put(`/providers/${id}`, payload);
      else await api.post(`/providers`, payload);

      feedbackContext.useSuccess(true, "Registro salvo com sucesso");
      loadData({});
      setShowModalAddEdt(false);
    } catch {
      console.log("erro ao cadastrar");
      feedbackContext.useLoading(false);
    }
  };

  const handleEdit = item => {
    setId(item.id);
    setName(item.name);
    setCpf(item.cpf);
    setBirth_date(item.birth_date);
    setZipcode(item.zipcode);
    setCity_name(item.city_name);
    setAddress(item.address);
    setEmail(item.email);
    setPhone(item.phone);
    setStatus(item.status);
    setFranchise_id(item.franchise_id ? { value: item.franchise.id, label: item.franchise.name } : undefined);

    setShowModalAddEdt(true);
  };

  const handleClear = () => {
    setId("");
    setName("");
    setCpf("");
    setBirth_date("");
    setZipcode("");
    setCity_name("");
    setAddress("");
    setEmail("");
    setPhone("");
    setStatus("");
    setFranchise_id(undefined);
  };

  const handleCreate = () => {
    handleClear();
    setShowModalAddEdt(true);
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
    loadFranchises();
    loadCategories();
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
            {renderButtonsPermission(
              "PROVIDERS",
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
                            <Th style={{ width: 25 }}>#</Th>
                            <Th style={{ textAlign: "center", width: 150 }}>Franquia</Th>
                            <Th style={{ width: 200 }}>Prestador</Th>
                            <Th style={{ textAlign: "center" }}>Telefone</Th>
                            {/* <Th style={{ textAlign: "center" }}>E-mail</Th> */}
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
                          {items?.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)?.map(item => (
                            <Tr className="mb-1" id={`services-${item.id}`}>
                              <Td>{item.id}</Td>
                              <Td style={{ textAlign: "center" }}>
                                <b>{item.franchise?.name ?? "-"}</b>
                              </Td>
                              <Td>{item.name}</Td>

                              <Td className="text-center">{item.phone}</Td>
                              {/* <Td className="text-center">{item.email ?? "-"}</Td> */}
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
            {items.length > PER_PAGE ? (
              <Pagination
                className="mt-3 mb-0"
                size="sm"
                currentPage={page + 1}
                totalPage={Math.ceil(items?.length / PER_PAGE)}
                onChangePage={i => {
                  setPage(i - 1);
                }}
              />
            ) : null}
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

      <ComponentApplicationMenu onSearch={loadData} />

      <Modal
        wrapClassName="modal-right"
        size="sm"
        isOpen={showModalAddEdt}
        scrollable
        style={{ minWidth: "40vw", width: "100%", minHeight: "100vh" }}
        // toggle={() => setShowModalAddEdt(false)}
      >
        <ModalHeader>Prestador</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSave} action="#">
            <Row>
              <Colxx sm="12" lg="12" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="name">
                    Franquia
                  </Label>
                  <ReactSelect
                    placeholder="Selecione"
                    isClearable
                    components={{ Input: CustomSelectInput }}
                    className="react-select"
                    classNamePrefix="react-select"
                    name="franchise"
                    value={franchise_id}
                    defaultValue={franchise_id}
                    onChange={row => setFranchise_id(row)}
                    options={franchises.map(i => ({ value: i.id, label: i.name }))}
                  />
                </FormGroup>
              </Colxx>
              <Colxx sm="12" lg="6" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="name">
                    * Nome
                  </Label>
                  <CustomInput required className="form-control" type="text" id="name" value={name} onChange={e => setName(e.target.value)} />
                </FormGroup>
              </Colxx>
              <Colxx sm="12" lg="6" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="cpf">
                    * CPF
                  </Label>
                  <CustomInput required className="form-control" type="text" id="cpf" value={cpf} onChange={e => setCpf(maskCpfCnpj(e.target.value))} />
                </FormGroup>
              </Colxx>
              <Colxx sm="12" lg="6" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="birth_date">
                    Data de nascimento
                  </Label>
                  <CustomInput className="form-control" type="date" id="birth_date" value={birth_date} onChange={e => setBirth_date(e.target.value)} />
                </FormGroup>
              </Colxx>

              <Colxx sm="12" lg="6" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="phone">
                    * Telefone
                  </Label>
                  <CustomInput required className="form-control" type="text" id="phone" value={phone} onChange={e => setPhone(maskPhone(e.target.value))} />
                </FormGroup>
              </Colxx>
              <Colxx sm="12" lg="12" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="email">
                    E-mail
                  </Label>
                  <CustomInput className="form-control" type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
                </FormGroup>
              </Colxx>
              <Colxx sm="12" lg="4" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="zipcode">
                    CEP
                  </Label>
                  <CustomInput className="form-control" type="text" id="zipcode" value={zipcode} onChange={e => setZipcode(maskCep(e.target.value))} />
                </FormGroup>
              </Colxx>

              <Colxx sm="12" lg="8" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="city_name">
                    * Cidade
                  </Label>
                  <CustomInput required className="form-control" type="text" id="city_name" value={city_name} onChange={e => setCity_name(e.target.value)} />
                </FormGroup>
              </Colxx>

              <Colxx sm="12" lg="12" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="address">
                    Endereço
                  </Label>
                  <CustomInput className="form-control" type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} />
                </FormGroup>
              </Colxx>

              <Colxx sm="12" lg="12" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="skills">
                    Habilidades
                  </Label>
                  <ReactSelect
                    placeholder="Selecione"
                    isClearable
                    isMulti
                    components={{ Input: CustomSelectInput }}
                    className="react-select"
                    classNamePrefix="react-select"
                    name="skills"
                    value={skills}
                    defaultValue={skills}
                    onChange={row => setSkills(row)}
                    options={categories.map(i => ({ value: i.id, label: i.name }))}
                  />
                </FormGroup>
              </Colxx>
            </Row>
            <button type="submit" style={{ display: "none" }} id="btnSubmitProvider" />
          </form>
        </ModalBody>
        <ModalFooter style={{ justifyContent: "end" }}>
          <button type="button" className="btn btn-light" onClick={() => setShowModalAddEdt(false)}>
            Fechar
          </button>
          <button type="submit" className="btn btn-success btn-shadow btn-lg " onClick={() => document.querySelector("#btnSubmitProvider").click()}>
            Salvar
          </button>
        </ModalFooter>
      </Modal>

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
