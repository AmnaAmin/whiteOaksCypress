import "./App.css";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { Home } from "./components/layout/home/Home";
import { Box } from "@chakra-ui/react";
// import { Charts } from "./Chakra ui/Charts";
// import { ButtonType } from "./Chakra ui/ButtonType";
// import { Alerts } from "./Chakra ui/Alerts";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          {/* <Box m="100px"> */}
          {/* <Charts /> */}
          {/* <ButtonType /> */}
          {/* <Alerts />
          </Box> */}
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
