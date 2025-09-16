import React, { useEffect } from "react";
import { Row, Card, CardTitle } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Colxx } from "components/common/CustomBootstrap";
import IntlMessages from "helpers/IntlMessages";
import { adminRoot } from "constants/defaultValues";
import { setCurrentUser } from "helpers/Utils";
import { logoutUser } from "redux/actions";

const Unauthorized = () => {
  useEffect(() => {
    document.body.classList.add("background");
    document.body.classList.add("no-footer");

    return () => {
      document.body.classList.remove("background");
      document.body.classList.remove("no-footer");
    };
  }, []);

  const logout = () => {
    logoutUser();
    setCurrentUser(null);
    window.location.href = "/usuario";
  };

  return (
    <>
      {/* <div className="fixed-background" /> */}
      <main>
        <div className="container">
          <Row className="h-100">
            <Colxx xxs="12" md="5" className="mx-auto my-auto">
              <Card className="auth-card">
                <div className="form-side">
                  <CardTitle className="mb-4">Tentativa de acesso não autorizado</CardTitle>
                  <p className="mb-0 text-muted text-small mb-0">Você não está autorizado a visualizar a página que está tentando acessar</p>
                  <p className="display-1 font-weight-bold mb-5">403</p>
                  <button onClick={logout} className="btn btn-primary btn-shadow btn-lg">
                    Sair
                  </button>
                </div>
              </Card>
            </Colxx>
          </Row>
        </div>
      </main>
    </>
  );
};

export default Unauthorized;
