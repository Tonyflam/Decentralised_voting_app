import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Required for charts
import "../css/RealTimeResults.scss";
import { votingapp_backend } from "../../../declarations/votingapp_backend";

const RealTimeResults = ({ elections }) => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    // Fetch candidates for the first election
    if (elections.length > 0) {
      const fetchCandidates = async () => {
        const fetchedCandidates = await votingapp_backend.getCandidates(elections[0].id);
        setCandidates(fetchedCandidates);
      };
      fetchCandidates();
    }
  }, [elections]);

  const data = {
    labels: candidates.map((c) => c.name),
    datasets: [
      {
        label: "Votes",
        data: candidates.map((c) => c.votes),
        backgroundColor: ["#3498db", "#e74c3c", "#2ecc71"],
      },
    ],
  };

  return (
    <div className="real-time-results">
      <h1>Live Election Results</h1>
      <div className="chart-container">
        <Bar data={data} />
      </div>
      <div className="login-options">
        <Link to="/Login">
          <button className="btn">Login as Admin</button>
        </Link>
        <Link to="/Login">
          <button className="btn">Login as Voter</button>
        </Link>
      </div>
    </div>
  );
};

export default RealTimeResults;