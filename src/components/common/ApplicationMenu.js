import React, { useState, useRef, useEffect } from "react";
import { NavLink, Button } from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";

const ApplicationMenu = ({ children, isOpen, setIsOpen }) => {
  const containerRef = useRef();
  // const [isOpen, setIsOpen] = useState(false);

  const handleDocumentClick = e => {
    if (isOpen) {
      const container = containerRef.current;
      if (container.contains(e.target) || container === e.target) {
        return;
      }
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // ["click", "touchstart"].forEach(event => document.addEventListener(event, handleDocumentClick, false));
    // return () => {
    //   ["click", "touchstart"].forEach(event => document.removeEventListener(event, handleDocumentClick, false));
    // };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`app-menu ${isOpen ? "shown" : ""}`}>
      {children}
      <NavLink className="app-menu-button d-inline-block" onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon icon={isOpen ? faAngleDoubleRight : faAngleDoubleLeft} />
      </NavLink>
    </div>
  );
};

export default React.memo(ApplicationMenu);
