import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Examples } from "pages/examples";
import { Projects } from "pages/projects";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/examples/*" element={<Examples />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/vendors" element={<Projects />} />
      </Routes>
    </Router>
  );
}

export default App;
