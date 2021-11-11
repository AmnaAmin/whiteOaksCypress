import "./App.css";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { Home } from "./components/layout/home/Home";
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
