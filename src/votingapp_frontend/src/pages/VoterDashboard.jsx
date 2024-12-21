import React, { useState, useEffect } from "react";
import { votingapp_backend } from "../../../declarations/votingapp_backend";
import "../css/AdminDashboard.scss";

const VoterDashboard = ({ elections }) => {
  const [selectedElectionId, setSelectedElectionId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selectedElectionId) {
      fetchCandidates();
      const interval = setInterval(fetchCandidates, 5000); // Poll every 5 seconds
      return () => clearInterval(interval); // Cleanup
    }
  }, [selectedElectionId]);

  const fetchCandidates = async () => {
    const fetchedCandidates = await votingapp_backend.getCandidates(parseInt(selectedElectionId));
    setCandidates(fetchedCandidates);
  };

  const castVote = async (candidateId) => {
    const response = await votingapp_backend.castVote(parseInt(selectedElectionId), candidateId);
    setMessage(response);
    fetchCandidates(); // Refresh candidates after voting
  };

  return (
    <div className="voter-dashboard">
      <h1>Voter Dashboard</h1>

      <div className="select-election">
        <h2>Select Election</h2>
        <select
          value={selectedElectionId}
          onChange={(e) => setSelectedElectionId(e.target.value)}
        >
          <option value="">Choose Election</option>
          {elections.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </div>

      {selectedElectionId && candidates.length > 0 && (
        <div className="candidates-list">
          <h2>Candidates</h2>
          {candidates.map((candidate) => (
            <div className="candidate" key={candidate.id}>
              <span>{candidate.name}</span>
              <span>Votes: {candidate.votes}</span>
              <button onClick={() => castVote(candidate.id)}>Vote</button>
            </div>
          ))}
        </div>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default VoterDashboard;