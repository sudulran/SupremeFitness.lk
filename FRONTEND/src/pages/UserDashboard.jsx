import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Dashboard</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/trainers")}
      >
        Browse Trainers
      </Button>
    </div>
  );
}

export default UserDashboard;
