import React from "react";
import { Phone as PhoneIcon } from "react-feather";

export default function CallDetails({ callingcode }) {
  return (
    <div className="info-block">
      <PhoneIcon size={24} />
      <div className="values">Calling code: +{callingcode}</div>
    </div>
  );
}
