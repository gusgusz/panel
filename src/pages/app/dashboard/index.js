import "react-tagsinput/react-tagsinput.css";
import "react-datepicker/dist/react-datepicker.css";
import "rc-switch/assets/index.css";
import "rc-slider/assets/index.css";
import "react-rater/lib/react-rater.css";
import "./styles.css";

import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

import { Row, Card, CardBody } from "reactstrap";

import { Badge, CardTitle } from "reactstrap";
import { CustomInput } from "reactstrap";

import { Colxx } from "components/common/CustomBootstrap";

import moment from "moment";

import api from "services/api";
import { renderButtonsPermission } from "helpers/Utils";
import { maskRealBeautify, maskIntBeautify } from "utils/functions";

import ComponentApplicationMenu from "./applicationMenu";

import { FeedbackContext } from "App";

const MySales = ({}) => {
  const feedbackContext = React.useContext(FeedbackContext);

  const [cards, setCards] = React.useState({});
  const [more, setMore] = React.useState({});
  const [rows, setRows] = React.useState([]);

  const [loading, setLoading] = React.useState(false);

  const loadSales = (showLoad = true) => {
    showLoad ? feedbackContext.useLoading(true, "Por favor aguarde! Carregando relatório...") : null;
    setLoading(true);
    api
      .get("/my-finances", {
        params: {},
      })
      .then(response => {
        setCards(response.data.cards);
        setRows(response.data.rows);
        setMore(response.data.more);
        feedbackContext.useLoading(false);
        setLoading(false);
      })
      .catch(error => {
        feedbackContext.useLoading(false);
        feedbackContext.useError(true, "Oops! Não foi possível consultar dados! Tente novamente");
        console.log(error);
      });
  };

  const getStatus = status => {
    if (status === "PAID") {
      return { label: "PAGO", color: "success" };
    } else if (status === "USED") {
      return { label: "USADO", color: "success" };
    } else if (status === "PENDING") {
      return { label: "AGUARDANDO", color: "warning" };
    } else if (status === "CANCELED") {
      return { label: "CANCELADO", color: "danger" };
    }
  };

  React.useEffect(() => {
    loadSales();
  }, []);

  return (
    <>
      <Row className="">
        <Colxx xxs="12">
          <div className="ml-0 d-flex flex-column mb-4">
            <h1
              className="pb-0 mb-0 font-weight-bold"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}>
              <span> Meu Financeiro</span>
            </h1>
          </div>

          <Row>
            <Colxx xs="12" sm="6" lg="4" md="4" className="icon-row-item mb-4">
              <Card>
                <CardBody className="text-center">
                  <i style={{ fontSize: 35, color: "#97368D" }} className="iconsminds-clock-forward" />
                  <p className="card-text font-weight-semibold mb-4">Pagamentos Pendentes</p>
                  <p style={{ color: "#97368D" }} className="lead text-center">
                    R$ {maskRealBeautify(cards.pay_pending ?? 0, true)}
                  </p>
                </CardBody>
              </Card>
            </Colxx>

            <Colxx xs="12" sm="6" lg="4" md="4" className="icon-row-item mb-4">
              <Card>
                <CardBody className="text-center">
                  <i style={{ fontSize: 35, color: "#97368D" }} className="iconsminds-handshake" />
                  <p className="card-text font-weight-semibold mb-4">Pagamentos Efetivados</p>
                  <p style={{ color: "#97368D" }} className="lead text-center">
                    R$ {maskRealBeautify(cards.pay_paid ?? 0, true)}
                  </p>
                </CardBody>
              </Card>
            </Colxx>

            <Colxx xs="12" sm="6" lg="4" md="4" className="icon-row-item mb-4">
              <Card>
                <CardBody className="text-center">
                  <i style={{ fontSize: 35, color: "#97368D" }} className="iconsminds-coins" />
                  <p className="card-text font-weight-semibold mb-4">Total em pagamentos</p>
                  <p style={{ color: "#97368D" }} className="lead text-center">
                    R$ {maskRealBeautify(cards.pay_amount ?? 0, true)}
                  </p>
                </CardBody>
              </Card>
            </Colxx>

            <Colxx xs="12" sm="6" lg="4" md="4" className="icon-row-item mb-4">
              <Card>
                <CardBody className="text-center">
                  <i style={{ fontSize: 35, color: "orange" }} className="iconsminds-inbox-into" />
                  <p className="card-text font-weight-semibold mb-4">Solicitações</p>
                  <p style={{ color: "orange" }} className="lead text-center">
                    {maskIntBeautify(cards.requests ?? 0)}
                  </p>
                </CardBody>
              </Card>
            </Colxx>

            <Colxx xs="12" sm="6" lg="4" md="4" className="icon-row-item mb-4">
              <Card>
                <CardBody className="text-center">
                  <i style={{ fontSize: 35, color: "#97368D" }} className="iconsminds-financial" />
                  <p className="card-text font-weight-semibold mb-4">Solicitações atendidas</p>
                  <p style={{ color: "#97368D" }} className="lead text-center">
                    {maskIntBeautify(cards.requests_success ?? 0)}
                  </p>
                </CardBody>
              </Card>
            </Colxx>

            <Colxx xs="12" sm="6" lg="4" md="4" className="icon-row-item mb-4">
              <Card>
                <CardBody className="text-center">
                  <i style={{ fontSize: 35, color: "green" }} className="iconsminds-money-bag" />
                  <p className="card-text font-weight-semibold mb-4">Moedas usadas</p>
                  <p style={{ color: "green" }} className="lead text-center">
                    {maskIntBeautify(cards.coins_used ?? 0)}
                  </p>
                </CardBody>
              </Card>
            </Colxx>
          </Row>

          <Row>
            <Colxx xxs="12" xl="12" className="mb-5">
              <Card style={{ width: "100%" }}>
                <CardBody>
                  <CardTitle>Resumo</CardTitle>
                  <Row>
                    <Colxx xxs="12" xl="12">
                      <Table>
                        <Thead>
                          <Tr>
                            <Th>#</Th>
                            <Th>Prestador</Th>
                            <Th>Descricão</Th>
                            <Th>Cliente</Th>
                            <Th className="text-center">Dt. Criação</Th>
                            <Th className="text-center">Moedas</Th>
                            <Th className="text-center">Serviços</Th>
                            <Th className="text-center">Preço</Th>
                            <Th className="text-center">Situção</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {rows.map(item => (
                            <Tr className="mb-1" key={`finance-${item.id}`}>
                              <Td>{item.id}</Td>
                              <Td>
                                <strong>{item?.provider_name ?? "-"}</strong>
                              </Td>
                              <Td style={{ textAlign: "left" }}>
                                <>{item.note}</>
                              </Td>
                              <Td style={{ textAlign: "left" }}>
                                <>{item.customer_name ?? "-"}</>
                              </Td>
                              <Td className="text-center">{moment(item.created_at).utc().subtract(4, "hours").format("DD/MM/YYYY HH:mm")}</Td>

                              <Td className="text-center font-weight-bold">{maskIntBeautify(item.coins)}</Td>
                              <Td className="text-center font-weight-bold">{maskIntBeautify(item.services)}</Td>
                              <Td className="text-center font-weight-bold">{item.price ? <>R$ {maskRealBeautify(item.price, true)}</> : "-"}</Td>
                              <Td className="text-center">
                                <Badge pill color={getStatus(item.status).color}>
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
          </Row>
        </Colxx>
      </Row>
      {/* <ComponentApplicationMenu
        loading={loading}
        term={term}
        setTerm={setTerm}
        status={status}
        setStatus={setStatus}
        onSearch={loadSales}
        date_ini={date_ini}
        setDate_ini={setDate_ini}
        date_end={date_end}
        setDate_end={setDate_end}
        membership={membership}
        setMembership={setMembership}
        itemsToExport={rows}
        seller={seller}
        setSeller={setSeller}
      /> */}
    </>
  );
};
export default React.memo(MySales);

const getIndex = (value, arr, prop) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1;
};
