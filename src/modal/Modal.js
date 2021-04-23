import React from "react";
import { XCircle as XCircleIcon } from "react-feather";

import "./Modal.scss";

export default function Modal(props) {
  if (!props.show) {
    return null;
  } else {
    return (
      <div className="modal-backdrop">
        <div className="modal-container">
          <div className="modal-close-button" onClick={props.onClose}>
            <XCircleIcon size={22} color="#656565" />
          </div>
          <div className="modal-content">{props.children}</div>
        </div>
      </div>
    );
  }
}
