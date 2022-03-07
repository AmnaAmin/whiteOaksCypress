import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "theme/theme";

import { useAuth } from "utils/auth-context";
import AuthenticatedApp from "authenticated-app";
import UnAuthenticatedApp from "unauthenticated-app";

export default function App() {
  const { data } = useAuth();
  const user = data?.user;

  return (
    <ChakraProvider theme={theme}>
      <Router basename={process.env.PUBLIC_URL}>
        {user ? <AuthenticatedApp /> : <UnAuthenticatedApp />}
      </Router>
    </ChakraProvider>
  );
}
