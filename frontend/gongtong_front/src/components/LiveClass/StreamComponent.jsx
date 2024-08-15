import React, { useState, useEffect } from "react";
import OvVideoComponent from "./OVVideoComponent";

const StreamComponent = ({ user }) => {
  return (
    <div className="OT_widget-container">
      {user && user.getStreamManager() ? (
        <div className="streamComponent">
          <OvVideoComponent user={user} />
        </div>
      ) : null}
    </div>
  );
};

export default StreamComponent;
