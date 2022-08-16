import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";

import { getCurrentUser } from "helpers/Utils";

const UserLayout = ({ children }) => {
  const history = useHistory();

  useEffect(() => {
    if (getCurrentUser()?.user) {
      history.push("/app");
    }

    document.body.classList.add("background");
    document.body.classList.add("no-footer");

    return () => {
      document.body.classList.remove("background");
      document.body.classList.remove("no-footer");
    };
  }, []);

  return (
    <>
      <main style={{ padding: 15 }}>
        <div className="container">{children}</div>
      </main>
    </>
  );
};

export default UserLayout;
