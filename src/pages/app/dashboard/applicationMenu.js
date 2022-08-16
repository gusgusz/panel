import React, { useState } from "react";
import { NavItem, Badge, Button, Input } from "reactstrap";
import { NavLink } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import moment from "moment";
import classnames from "classnames";
import Select from "react-select";

import ApplicationMenu from "components/common/ApplicationMenu";
import CustomSelectInput from "components/common/CustomSelectInput";
import { getSocialName, renderButtonsPermission } from "helpers/Utils";

import { maskCpfCnpj, maskPhoneOrEmail, maskRealBeautify } from "utils/functions";
import api from "services/api";

const ComponentApplicationMenu = ({
  loading,
  term,
  setTerm,
  status,
  setStatus,
  membership,
  setMembership,
  onSearch,
  date_ini,
  setDate_ini,
  date_end,
  setDate_end,
  itemsToExport,
  seller,
  setSeller,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [sellers, setSellers] = React.useState([]);
  const [users, setUsers] = React.useState([]);

  const loadSellers = () => {
    api.get("/sellers?is_atived=true&state=ACTIVE").then(response => {
      setSellers(response.data.map(i => ({ label: `${i.name} (Vendedor)`, value: i.id, is_seller: true })));
    });
  };
  const loadUsers = () => {
    api.get("/modules/users?has_commission=true&is_atived=true").then(response => {
      setUsers(response.data.map(i => ({ label: i.name, value: i.id, is_seller: false })));
    });
  };

  React.useEffect(() => {
    setSellers([]);
    loadSellers();
    loadUsers();
  }, []);

  return (
    <ApplicationMenu isOpen={isOpen} setIsOpen={setIsOpen}>
      <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSearch(true);
          }}
          target="#">
          <div className="p-4">
            {renderButtonsPermission(
              "MY-SALES",
              "FILTER-BY-SELLERS",
              <>
                <p className="text-muted text-small">Vendedor</p>
                <ul className="list-unstyled mb-5">
                  <Select
                    isClearable
                    placeholder="Digite para pesquisar"
                    components={{ Input: CustomSelectInput }}
                    className="react-select"
                    classNamePrefix="react-select"
                    name="status"
                    options={[...sellers, ...users]}
                    defaultValue={seller}
                    value={seller}
                    onChange={row => setSeller(row)}
                  />
                </ul>
              </>,
            )}

            <p className="text-muted text-small">Status</p>
            <ul className="list-unstyled mb-5">
              <Select
                isClearable
                placeholder="Digite para pesquisar"
                components={{ Input: CustomSelectInput }}
                className="react-select"
                classNamePrefix="react-select"
                name="status"
                options={[
                  { value: true, label: "Pagos" },
                  { value: false, label: "Aguardando pagamento" },
                ]}
                defaultValue={status}
                value={status}
                onChange={row => setStatus(row)}
              />
            </ul>

            <ul className="list-unstyled mb-5">
              <Button color="primary" disabled={loading} className={` btn-block btn-multiple-state ${loading ? "show-spinner" : ""}`} size="lg">
                <span className="spinner d-inline-block">
                  <span className="bounce1" />
                  <span className="bounce2" />
                  <span className="bounce3" />
                </span>
                <span className="label">Pesquisar</span>
              </Button>
            </ul>
          </div>
        </form>
      </PerfectScrollbar>
    </ApplicationMenu>
  );
};

export default React.memo(ComponentApplicationMenu);
