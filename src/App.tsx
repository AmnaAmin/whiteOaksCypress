import "./App.css";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
<<<<<<< HEAD
import { Home } from "./components/layout/home/Home";
import { Box } from "@chakra-ui/react";
=======
import { Home } from "./pages/Home";
>>>>>>> master
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
