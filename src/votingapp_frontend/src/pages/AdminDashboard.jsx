import React, { useState } from "react";
import { votingapp_backend } from "../../../declarations/votingapp_backend";
import "../css/AdminDashboard.scss";

const AdminDashboard = ({ elections }) => {
  const [title, setTitle] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [selectedElectionId, setSelectedElectionId] = useState("");

  const createElection = async () => {
    if (title) {
      const response = await votingapp_backend.CreateElection(title);
      alert(response);
      setTitle("");
    }
  };

  const addCandidate = async () => {
    if (selectedElectionId && candidateName) {
      const response = await votingapp_backend.addCandidate(
        parseInt(selectedElectionId),
        candidateName
      );
      alert(response);
      setCandidateName("");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="create-election">
        <h2>Create New Election</h2>
        <input
          type="text"
          placeholder="Election Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={createElection}>Create</button>
      </div>

      <div className="add-candidate">
        <h2>Add Candidate</h2>
        <select
          value={selectedElectionId}
          onChange={(e) => setSelectedElectionId(e.target.value)}
        >
          <option value="">Select Election</option>
          {elections.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />
        <button onClick={addCandidate}>Add</button>
      </div>
    </div>
  );
};

export default AdminDashboard;