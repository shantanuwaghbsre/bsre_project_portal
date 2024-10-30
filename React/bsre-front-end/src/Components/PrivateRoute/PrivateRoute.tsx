import React from "react";
import { Navigate } from "react-router-dom";
import { useRole } from "../../Contexts/RoleContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { role, isLoggedIn } = useRole();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default PrivateRoute;
