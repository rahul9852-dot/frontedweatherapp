import React from "react";
import { Clock as ClockIcon } from "react-feather";

export default function TimezoneDetails({ timezone }) {
  return (
    <div className="info-block">
      <ClockIcon size={24} />
      <div className="values">
        {timezone.name} - {timezone.short_name} ({timezone.offset_string})
      </div>
    </div>
  );
}
