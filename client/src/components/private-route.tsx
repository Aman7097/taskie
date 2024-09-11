import { useMemo } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const id = useMemo(() => sessionStorage.getItem("userId"), []);
  return id ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
