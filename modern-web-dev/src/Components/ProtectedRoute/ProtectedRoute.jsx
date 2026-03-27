import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, flag, ...rest }) => {

  return (
    <div>
      {flag ? (
        <Component {...rest} />
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
};

export default ProtectedRoute;
