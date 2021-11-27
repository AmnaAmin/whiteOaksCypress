import "./App.css";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Now from "./pages/Home";
import { Home } from "./components/home/Home";
import { Box } from "@chakra-ui/react";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
