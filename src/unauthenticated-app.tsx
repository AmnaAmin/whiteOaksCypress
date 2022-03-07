import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";

import { Login } from "pages/login";

export default function UnAuthenticatedApp() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
