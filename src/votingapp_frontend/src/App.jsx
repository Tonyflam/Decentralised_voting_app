import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RealTimeResults from "./pages/RealTimeResults";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import VoterDashboard from "./pages/VoterDashboard";
import { votingapp_backend } from "../../declarations/votingapp_backend"; // Importing the backend interface

const App = () => {
  const [userRole, setUserRole] = useState(""); // admin or voter
  const [elections, setElections] = useState([]);

  useEffect(() => {
    // Fetch elections on app load
    const fetchElections = async () => {
      const fetchedElections = await votingapp_backend.getElections();
      setElections(fetchedElections);
    };
    fetchElections();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RealTimeResults elections={elections} />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        {userRole === "admin" && (
          <Route
            path="/admin-dashboard"
            element={<AdminDashboard elections={elections} />}
          />
        )}
        {userRole === "voter" && (
          <Route
            path="/voter-dashboard"
            element={<VoterDashboard elections={elections} />}
          />
        )}
      </Routes>
    </Router>
  );
};

export default App;
