import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Dashboard } from "./pages/dashboard";
import { Examples } from "pages/examples";
import { Projects } from "pages/projects";

function App() {
  alert(
    `AuthenticationToken: ${localStorage.getItem("jhi-authenticationToken")}`
  );
  console.log(process.env.PUBLIC_URL);
  return (
    <Router>
      <Routes>
        <Route path="/examples/*" element={<Examples />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/vendors" element={<Projects />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
