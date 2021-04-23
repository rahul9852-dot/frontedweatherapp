import React from "react";
import { Truck as TruckIcon } from "react-feather";

export default function RoadDetails({ roadinfo }) {
  return (
    <div className="info-block">
      <TruckIcon size={24} />
      <div className="values">
        Driving on {roadinfo.drive_on}, speed unit in {roadinfo.speed_in}
      </div>
    </div>
  );
}
