import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./Pagess/Home";
import DashboardPage from "./Pagess/DashboardPage";
import Flow from "./FlowMain/Flow";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default: go straight to Home */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* No auth check for now */}
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/flow" element={<Flow />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
