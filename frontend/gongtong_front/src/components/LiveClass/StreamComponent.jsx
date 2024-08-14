import React, { useState, useEffect } from "react";
import OvVideoComponent from "./OVVideoComponent";

const StreamComponent = ({ user }) => {
  return (
    <div className="OT_widget-container">
      {user && user.getStreamManager() ? (
        <div className="streamComponent">
          <OvVideoComponent user={user} />
        </div>
      ) : (
        <h1>뭔가 잘못됏다...</h1>
      )}
    </div>
  );
};

export default StreamComponent;
