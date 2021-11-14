import "./App.css";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { Home } from "./components/layout/home/Home";
import { Box } from "@chakra-ui/react";
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
