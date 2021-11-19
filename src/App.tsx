import "./App.css";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Home } from "./pages/Home";
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Box>
            <Home />
          </Box>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
