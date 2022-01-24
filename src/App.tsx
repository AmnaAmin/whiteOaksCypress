import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { Dashboard } from "./pages/dashboard";
import { Examples } from "pages/examples";
import { Projects } from "pages/projects";

function App() {
  alert(
    `AuthenticationToken: ${localStorage.getItem("jhi-authenticationToken")}`
  );
  return (
    <Router>
      <Routes>
        <Route path="/vendorportal" element={<Dashboard />} />
        <Route path="/vendorportal/examples/*" element={<Examples />} />
        <Route path="/vendorportal/dashboard" element={<Dashboard />} />
        <Route path="/vendorportal/projects" element={<Projects />} />
        <Route path="/vendorportal/vendors" element={<Projects />} />
        <Route path="*" element={<Navigate to="/vendorportal" />} />
      </Routes>
    </Router>
  );
}

export default App;
