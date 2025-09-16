import "react-tagsinput/react-tagsinput.css";
import "react-datepicker/dist/react-datepicker.css";
import "rc-switch/assets/index.css";
import "rc-slider/assets/index.css";
import "react-rater/lib/react-rater.css";
import "./styles.css";

import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

import { Row, Card, CardBody } from "reactstrap";
import AsyncSelect from "react-select/async";

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
import { maskPhone } from "utils/functions";

const Franchises = () => {
  const feedbackContext = React.useContext(FeedbackContext);

  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const [responsible, setResponsible] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState();

  const [is_actived, setIs_actived] = React.useState(true);

  const [showModalAddEdt, setShowModalAddEdt] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const loadData = (showLoad = true) => {
    try {
      showLoad ? feedbackContext.useLoading(true, "Carregando...") : null;
      api.get("/franchises").then(response => {
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
      const payload = {
        name,
        responsible,
        phone,
        email,
        address,
        city_name: city.label,
        city_id: city.value,
        state_name: city.more.state.initial,
        state_id: city.more.state.id,

        is_actived,
      };

      if (id) await api.put(`/franchises/${id}`, payload);
      else await api.post(`/franchises`, payload);

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
    setResponsible(item.responsible);
    setPhone(item.phone);
    setEmail(item.email);
    setAddress(item.address);
    setCity({ value: item.city_id, label: item.city_name, more: { state: { id: item.state_id, initial: item.state_name } } });

    setIs_actived(item.is_actived);

    setShowModalAddEdt(true);
  };

  const handleClear = () => {
    setId("");
    setName("");
    setResponsible("");
    setPhone("");
    setEmail("");
    setAddress("");
    setCity();

    setIs_actived(true);
  };

  const handleCreate = () => {
    handleClear();
    setShowModalAddEdt(true);
  };

  const handleDisableEnable = (id, status) => {
    feedbackContext.useConfirmAlert(true, `Tem certeza que deseja ${status ? "desativar" : "ativar"} esse registro?`, async () => {
      feedbackContext.useLoading(true, "Atualizando registro...");
      await api.put(`/franchises/${id}`, { is_actived: !status });
      feedbackContext.useSuccess(true, "Registro atualizado com sucesso");
      loadData(false);
    });
  };

  const handleRemove = id => {
    feedbackContext.useConfirmAlert(true, `Todos os registros relacionados serão removidos! Tem certeza que deseja continuar?`, async () => {
      feedbackContext.useLoading(true, "Excluindo registro...");
      await api.delete(`/franchises/${id}`);
      feedbackContext.useSuccess(true, "Registro deletado com sucesso");
      loadData(false);
    });
  };

  const filterCity = async (inputValue: string) => {
    if (inputValue != "") {
      if (inputValue.length >= 2) {
        return await api
          .get(`/cities?terms=${inputValue}`)
          .then(response => {
            return response.data.map(i => ({ value: i.id, label: `${i.name} (${i.state.initial})`, more: i }));
          })
          .catch(error => []);
      } else return [];
    }
  };

  const loadOptionsCity = async (inputValue: string, callback: (options: any) => void) => {
    callback(await filterCity(inputValue));
  };

  const handleInputChange = value => {
    return value;
  };

  const loadCity = async (city, uf) => {
    if (city && uf) {
      try {
        const { data } = await api.get(`/city?name=${city}&uf=${uf}`);

        return data;
      } catch (error) {
        console.log(error);

        return {};
      }
    } else {
      return {};
    }
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
            Franquias
            {renderButtonsPermission(
              "FRANCHISES",
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
                            <Th style={{ width: 150 }}>Nome</Th>
                            <Th>Responsável</Th>
                            <Th>Cidade</Th>
                            <Th>Telefone</Th>
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
                            <Tr className="mb-1" id={`categories-${item.id}`}>
                              {renderButtonsPermission(
                                "FRANCHISES",
                                "UPDATE",
                                <>
                                  <Td onClick={() => handleEdit(item)} className="btn-link">
                                    {item.name}
                                  </Td>
                                </>,
                                <Td>{item.name}</Td>,
                              )}

                              {renderButtonsPermission(
                                "FRANCHISES",
                                "UPDATE",
                                <>
                                  <Td onClick={() => handleEdit(item)} className="btn-link">
                                    {item.responsible}
                                  </Td>
                                </>,
                                <Td>{item.responsible}</Td>,
                              )}

                              {renderButtonsPermission(
                                "FRANCHISES",
                                "UPDATE",
                                <>
                                  <Td onClick={() => handleEdit(item)} className="btn-link">
                                    {item.city_name}
                                  </Td>
                                </>,
                                <Td>{item.city_name}</Td>,
                              )}

                              {renderButtonsPermission(
                                "FRANCHISES",
                                "UPDATE",
                                <>
                                  <Td onClick={() => handleEdit(item)} className="btn-link">
                                    {item.phone}
                                  </Td>
                                </>,
                                <Td>{item.phone}</Td>,
                              )}

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
                                    "FRANCHISES",
                                    "DISABLE-ENABLE",
                                    <>
                                      <Button id={`btn2-${item.id}`} color="warning" onClick={() => handleDisableEnable(item.id, item.is_actived)}>
                                        <div className="glyph-icon iconsminds-power"></div>
                                        <TooltipItem id={`btn2-${item.id}`} text={item.is_actived ? "Desativar" : "Ativar"} />
                                      </Button>
                                    </>,
                                  )}
                                  {renderButtonsPermission(
                                    "FRANCHISES",
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
        style={{ minWidth: "30vw", width: "100%", minHeight: "100vh" }}
        // toggle={() => setShowModalAddEdt(false)}
      >
        <ModalHeader>Franquia</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSave} action="#">
            <Row>
              <Colxx sm="12" lg="12" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="name">
                    * Nome
                  </Label>
                  <CustomInput required className="form-control" type="text" id="name" value={name} onChange={e => setName(e.target.value)} />
                </FormGroup>
              </Colxx>
            </Row>
            <Row>
              <Colxx sm="12" lg="12" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="responsible">
                    * Responsável
                  </Label>
                  <CustomInput
                    required
                    className="form-control"
                    type="text"
                    id="responsible"
                    value={responsible}
                    onChange={e => setResponsible(e.target.value)}
                  />
                </FormGroup>
              </Colxx>
            </Row>

            <Row>
              <Colxx sm="12" lg="12" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="phone">
                    * Telefone
                  </Label>
                  <CustomInput required className="form-control" type="text" id="phone" value={phone} onChange={e => setPhone(maskPhone(e.target.value))} />
                </FormGroup>
              </Colxx>
            </Row>

            <Row>
              <Colxx sm="12" lg="12" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="email">
                    * E-mail
                  </Label>
                  <CustomInput required className="form-control" type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
                </FormGroup>
              </Colxx>
            </Row>

            <Row>
              <Colxx sm="12" lg="12" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="address">
                    * Endereço
                  </Label>
                  <CustomInput required className="form-control" type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} />
                </FormGroup>
              </Colxx>
            </Row>
            <Row>
              <Colxx sm="12" lg="12" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="city">
                    * Cidade
                  </Label>
                  <AsyncSelect
                    cacheOptions={true}
                    loadOptions={loadOptionsCity}
                    defaultOptions
                    onInputChange={handleInputChange}
                    name={"city_id"}
                    type="select"
                    isClearable
                    className="react-select"
                    classNamePrefix="react-select"
                    noOptionsMessage={() => "Nenhum registro encontrado"}
                    loadingMessage={() => "Pesquisando..."}
                    defaultValue={city}
                    value={city}
                    placeholder="Digite para pesquisar..."
                    onChange={e => {
                      setCity(e);
                    }}
                  />{" "}
                </FormGroup>
              </Colxx>
            </Row>
            <Row>
              <Colxx sm="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="is_actived">
                    Ativo/Inativo
                  </Label>
                  <Switch className="custom-switch custom-switch-primary" checked={is_actived} onChange={e => setIs_actived(e)} />
                </FormGroup>
              </Colxx>
            </Row>
            <button type="submit" style={{ display: "none" }} id="btnSubmitCategories" />
          </form>
        </ModalBody>
        <ModalFooter style={{ justifyContent: "end" }}>
          <button type="button" className="btn btn-light" onClick={() => setShowModalAddEdt(false)}>
            Fechar
          </button>
          <button type="submit" className="btn btn-success btn-shadow btn-lg " onClick={() => document.querySelector("#btnSubmitCategories").click()}>
            Salvar
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default React.memo(Franchises);
