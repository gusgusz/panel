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
import { maskRealBeautify, toFloat } from "utils/functions";

const Services = () => {
  const feedbackContext = React.useContext(FeedbackContext);

  const [items, setItems] = React.useState([]);

  const loadData = (showLoad = true) => {
    try {
      showLoad ? feedbackContext.useLoading(true, "Carregando...") : null;
      api.get("/services").then(response => {
        setItems(response.data);
        feedbackContext.useLoading(false);
      });
    } catch {
      console.log("erro");
      feedbackContext.useLoading(false);
    }
  };

  const getStatus = status => {
    if (status === "SENT") return { label: "Aguardando Prestador", color: "warning" };
    if (status === "CANCELED") return { label: "Cancelado", color: "danger" };
    if (status === "ACCEPTED") return { label: "Aceito", color: "success" };
    else return { label: "Aceito e Finalizado", color: "success" };
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
            Serviços solicitados
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
                            <Th style={{ width: 150 }}>Cliente</Th>

                            <Th style={{ textAlign: "center" }}>Telefone</Th>
                            <Th style={{ textAlign: "center" }}>Categoria</Th>
                            <Th style={{ textAlign: "center" }}>Descrição</Th>
                            <Th style={{ textAlign: "center" }}>Situação</Th>
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
                            <Tr className="mb-1" id={`services-${item.id}`}>
                              <Td>{item.id}</Td>
                              <Td>{item.customer_name}</Td>

                              <Td className="text-center">{item.customer_phone}</Td>
                              <Td className="text-center">{item.category_name}</Td>
                              <Td className="text-center">{item.note}</Td>

                              <Td style={{ textAlign: "center" }}>
                                <Badge className="highlighter" pill color={getStatus(item.status).color}>
                                  {getStatus(item.status).label}
                                </Badge>
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
    </>
  );
};
export default React.memo(Services);
