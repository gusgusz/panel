import React from "react";

import { Tooltip } from "reactstrap";

const TooltipItem = ({ id, text, placement = "auto" }) => {
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <span>
      <Tooltip
        placement={placement}
        isOpen={tooltipOpen}
        target={id}
        toggle={toggle}
        style={{ maxWidth: "800px", whiteSpace: "nowrap", wordWrap: "normal" }}
        dangerouslySetInnerHTML={{ __html: text }}></Tooltip>
    </span>
  );
};

export default TooltipItem;
