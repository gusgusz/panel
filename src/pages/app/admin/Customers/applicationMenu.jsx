import React from "react";
import { Button } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";

import ApplicationMenu from "components/common/ApplicationMenu";

import moment from "moment";
import api from "services/api";
import ReactSelect from "react-select";
import CustomSelectInput from "components/common/CustomSelectInput";

const ComponentApplicationMenu = ({ onSearch, loading }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [franchises, setFranchises] = React.useState([]);
  const [franchise, setFranchise] = React.useState(undefined);
  const [term, setTerm] = React.useState("");

  const loadFranchises = () => {
    api.get("/franchises").then(response => {
      setFranchises(response.data);
    });
  };

  const handleSearch = () => {
    onSearch({ franchise_id: franchise ? franchise?.value : undefined, term });
  };

  React.useEffect(() => {
    loadFranchises();
  }, []);

  return (
    <ApplicationMenu isOpen={isOpen} setIsOpen={setIsOpen}>
      <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch();
          }}
          target="#">
          <div className="p-4">
            {" "}
            <p className="text-muted text-small mb-2">Buscar</p>
            <div className="list-unstyled mb-5">
              <input type="text" placeholder="" value={term} onChange={e => setTerm(e.target.value)} class="form-control mb-2" />
            </div>
            <p className="text-muted text-small mb-2">Franquia</p>
            <div className="list-unstyled mb-5">
              <ReactSelect
                placeholder="Selecione"
                isClearable
                components={{ Input: CustomSelectInput }}
                className="react-select"
                classNamePrefix="react-select"
                name="franchise"
                value={franchise}
                defaultValue={franchise}
                onChange={row => setFranchise(row)}
                options={franchises.map(i => ({ value: i.id, label: i.name }))}
              />
            </div>
            <ul className="list-unstyled mb-2">
              <Button
                onClick={handleSearch}
                type="submit"
                color="success"
                disabled={loading}
                className={` btn-block btn-multiple-state ${loading ? "show-spinner" : ""}`}
                size="lg">
                <span className="spinner d-inline-block">
                  <span className="bounce1" />
                  <span className="bounce2" />
                  <span className="bounce3" />
                </span>
                <span className="label">BUSCAR</span>
              </Button>
            </ul>
          </div>
        </form>
      </PerfectScrollbar>
    </ApplicationMenu>
  );
};

export default React.memo(ComponentApplicationMenu);
