import React from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, flag, ...rest }) => {
  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate(-1);
  };

  return (
    <div>
      {flag ? (
        <Component {...rest} />
      ) : (
        <div>
          <p>Unauthorized!</p>
          <button onClick={goBackHandler}>Go Back.</button>
        </div>
      )}
    </div>
  );
};

export default ProtectedRoute;
