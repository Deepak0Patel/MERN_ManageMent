import React from "react";
import { useSelector } from "react-redux";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Chip,
} from "@mui/material";
import DepartmentLIst from "./DepartmentLIst";

const Dashboard = () => {
  // Retrieve user profile from Redux store
  const userData = useSelector((state) => state.user.profile);

  // Destructure necessary user data
  const {
    role,
    email,
    hobbies = [],
    firstName,
    departmentName,
  } = userData || {};

  console.log("departement name", departmentName);

  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={8} md={6}>
          <Card sx={{ elevation: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                User Data
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body1">
                  <strong>Role:</strong> {role}
                </Typography>
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body1">
                  <strong>Email:</strong> {email}
                </Typography>
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body1">
                  <strong>First Name:</strong> {firstName}
                </Typography>
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body1">
                  <strong>Hobbies:</strong>{" "}
                  {hobbies.length > 0
                    ? hobbies.map((hobby, index) => (
                        <Chip key={index} label={hobby} sx={{ margin: 0.5 }} />
                      ))
                    : "No hobbies listed"}
                </Typography>
              </Box>
              {role !== "manager" && (
                <Box sx={{ marginTop: 2 }}>
                  <Typography variant="body1">
                    <strong>Department:</strong>{" "}
                    {departmentName ? departmentName : "No department assigned"}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
