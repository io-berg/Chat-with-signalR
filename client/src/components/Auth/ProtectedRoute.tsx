import { Navigate } from "react-router-dom";

interface Props {
  outlet: JSX.Element;
  path?: string;
  authStatus: boolean;
}

export const ProtectedRoute: React.FC<Props> = ({ outlet, authStatus }) => {
  const isAuthenticated: boolean = authStatus;

  if (isAuthenticated) {
    return outlet;
  }

  return <Navigate to="/" />;
};
