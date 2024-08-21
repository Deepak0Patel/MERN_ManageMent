import React from "react";
import { Button, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DepartmentList from "../Components/DepartmentLIst";
import EmployeeList from "../Components/EmployeeList";

const EmployeeListPage = () => {
  const navigate = useNavigate(); // For navigation

  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: 2,
          backgroundColor: "#f0f0f0",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ marginRight: 1 }}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{ marginLeft: 1 }}
        >
          Home
        </Button>
      </Box>
      <EmployeeList />
    </Container>
  );
};

export default EmployeeListPage;
