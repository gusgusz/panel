/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import React from "react";
import { WithWizard } from "react-albus";
import { Button } from "reactstrap";

const BottomNavigation = ({ className, onClickPrev, prevLabel, onClickNext, nextLabel, endLabel }) => {
  return (
    <WithWizard
      render={({ next, previous, step, steps }) => (
        <div className={`wizard-buttons ${className}`}>
          <Button
            id="btnWizardBack"
            color="info"
            className={`mr-1 btn-xs ${steps.indexOf(step) <= 0 ? "disabled" : ""}`}
            onClick={() => {
              onClickPrev(previous, steps, step);
            }}>
            {prevLabel}
          </Button>

          {steps.indexOf(step) === steps.length - 1 ? (
            <Button
              color="success"
              className={`btn-lg`}
              onClick={() => {
                onClickNext(next, steps, step);
              }}>
              {endLabel ?? "Enviar Solicitação"}
            </Button>
          ) : (
            <Button
              color="primary"
              className={`btn-lg ${steps.indexOf(step) >= steps.length - 1 ? "disabled" : ""}`}
              onClick={() => {
                onClickNext(next, steps, step);
              }}>
              {nextLabel}
            </Button>
          )}
        </div>
      )}
    />
  );
};
export default BottomNavigation;
