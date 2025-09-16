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

const Categories = () => {
  const feedbackContext = React.useContext(FeedbackContext);

  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [is_actived, setIs_actived] = React.useState(true);
  const [file, setFile] = React.useState("");

  const [fileUploading, setFileUploading] = React.useState(false);

  const [showModalAddEdt, setShowModalAddEdt] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const loadData = (showLoad = true) => {
    try {
      showLoad ? feedbackContext.useLoading(true, "Carregando...") : null;
      api.get("/categories").then(response => {
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

    if (file.length <= 0 && !id) {
      error_alert("Informe uma imagem", "Campo obrigatório!");
      return;
    }

    feedbackContext.useLoading(true, "Salvando registro...");

    try {
      const payload = {
        name,
        description,
        is_actived,
      };

      if (file.length > 0) {
        let fileParse = JSON.parse(file[0].xhr.response);
        payload.image_path_metadata = { base64: fileParse?.files?.file };
      }

      if (id) await api.put(`/categories/${id}`, payload);
      else await api.post(`/categories`, payload);

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
    setDescription(item.description);

    setIs_actived(item.is_actived);

    setShowModalAddEdt(true);
  };

  const handleClear = () => {
    setFile([]);
    setId("");
    setName("");
    setDescription("");

    setIs_actived(true);
  };

  const handleCreate = () => {
    handleClear();
    setShowModalAddEdt(true);
  };

  const handleDisableEnable = (id, status) => {
    feedbackContext.useConfirmAlert(true, `Tem certeza que deseja ${status ? "desativar" : "ativar"} esse registro?`, async () => {
      feedbackContext.useLoading(true, "Atualizando registro...");
      await api.put(`/categories/${id}`, { is_actived: !status });
      feedbackContext.useSuccess(true, "Registro atualizado com sucesso");
      loadData(false);
    });
  };

  const handleRemove = id => {
    feedbackContext.useConfirmAlert(true, `Todos os registros relacionados serão removidos! Tem certeza que deseja continuar?`, async () => {
      feedbackContext.useLoading(true, "Excluindo registro...");
      await api.delete(`/categories/${id}`);
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
            Categorias
            {renderButtonsPermission(
              "CATEGORIES",
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
                            <Th style={{ textAlign: "center", width: 150 }}>Imagem</Th>
                            <Th style={{ textAlign: "center", width: 150 }}>Franquia</Th>
                            <Th style={{ width: 150 }}>Nome</Th>

                            <Th style={{ textAlign: "left" }}>Descrição</Th>

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
                              <Td className="text-center">
                                <a href={item.image_path} target={"_blank"}>
                                  <img src={item.image_path} style={{ width: 80, borderRadius: "100%" }} />
                                </a>
                              </Td>
                              <Td style={{ textAlign: "center" }}>
                                <b>{item.franchise?.name ?? "-"}</b>
                              </Td>

                              {renderButtonsPermission(
                                "CATEGORIES",
                                "UPDATE",
                                <>
                                  <Td onClick={() => handleEdit(item)} className="btn-link">
                                    {item.name}
                                  </Td>
                                </>,
                                <Td>{item.name}</Td>,
                              )}

                              {renderButtonsPermission(
                                "CATEGORIES",
                                "UPDATE",
                                <>
                                  <Td onClick={() => handleEdit(item)} className="btn-link">
                                    {item.description}
                                  </Td>
                                </>,
                                <Td>{item.description}</Td>,
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
                                  minHeight: "100px",
                                }}>
                                <ButtonGroup size="xs">
                                  {renderButtonsPermission(
                                    "CATEGORIES",
                                    "DISABLE-ENABLE",
                                    <>
                                      <Button id={`btn2-${item.id}`} color="warning" onClick={() => handleDisableEnable(item.id, item.is_actived)}>
                                        <div className="glyph-icon iconsminds-power"></div>
                                        <TooltipItem id={`btn2-${item.id}`} text={item.is_actived ? "Desativar" : "Ativar"} />
                                      </Button>
                                    </>,
                                  )}
                                  {renderButtonsPermission(
                                    "CATEGORIES",
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
        <ModalHeader>Categoria</ModalHeader>
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

              <Colxx sm="12" lg="12" xs="12">
                <FormGroup>
                  <Label className="font-weight-bold" for="locale">
                    * Descrição
                  </Label>
                  <CustomInput
                    required
                    className="form-control"
                    type="text"
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </FormGroup>
              </Colxx>
            </Row>

            <Row>
              <Colxx sm="12">
                <Label for="file" className="font-weight-bold">
                  Imagem/Logo
                </Label>
                <DropzoneExample
                  files={file}
                  setFiles={setFile}
                  setFileUploading={setFileUploading}
                  dropzoneConfig={{ maxFiles: 1, acceptedFiles: "image/*" }}
                />
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
          <button type="button" className="btn btn-light" onClick={() => setShowModalAddEdt(false)} disabled={fileUploading}>
            Fechar
          </button>
          <button
            type="submit"
            className="btn btn-success btn-shadow btn-lg "
            onClick={() => document.querySelector("#btnSubmitCategories").click()}
            disabled={fileUploading}>
            Salvar
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default React.memo(Categories);
