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
import ComponentApplicationMenu from "./applicationMenu";

import api from "services/api";
import { getCurrentUser, renderButtonsPermission } from "helpers/Utils";

import { FeedbackContext } from "App";
import DropzoneExample from "components/Dropzone";
import error_alert from "utils/alerts/error";
import { maskRealBeautify, toFloat } from "utils/functions";
import moment from "moment";

import Pagination from "components/Pagination";

const PER_PAGE = 20;
const Services = () => {
  const feedbackContext = React.useContext(FeedbackContext);

  const [items, setItems] = React.useState([]);
  const [page, setPage] = React.useState(0);

  const loadData = (params = {}) => {
    try {
      feedbackContext.useLoading(true, "Carregando...");
      api.get("/customers", { params }).then(response => {
        setItems(response.data);
        feedbackContext.useLoading(false);
      });
    } catch {
      console.log("erro");
      feedbackContext.useLoading(false);
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
            Clientes
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
                            <Th style={{ textAlign: "center" }}>UID</Th>
                            <Th style={{ textAlign: "center" }}>Último login</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {items?.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)?.map(item => (
                            <Tr className="mb-1" id={`services-${item.id}`}>
                              <Td>{item.id}</Td>
                              <Td style={{ textAlign: "center" }}>
                                <b>{item.franchise?.name ?? "-"}</b>
                              </Td>
                              <Td>{item.name ?? "-"}</Td>

                              <Td className="text-center">{item.phone}</Td>
                              {/* <Td className="text-center">{item.email ?? "-"}</Td> */}
                              <Td className="text-center">{item.uid ?? "-"}</Td>
                              <Td className="text-center">{item.last_refresh ? moment(item.last_refresh).utc(false).format("DD/MM/YYYY HH:mm") : "Nunca"}</Td>
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
    </>
  );
};
export default React.memo(Services);
