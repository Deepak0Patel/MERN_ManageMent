import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
} from "@mui/material";

const EmployeeList = () => {
  const apiUrl = "https://mern-management-bz0b.onrender.com/";
  const token = useSelector((state) => state.auth.user.token);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(""); // Default search value
  const [location, setLocation] = useState(""); // Default location value
  const [sort, setSort] = useState(""); // Default sorting order

  useEffect(() => {
    fetchEmployeesList(); // Fetch data on component mount
  }, []); // Empty dependency array means this useEffect runs once

  const fetchEmployeesList = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const response = await axios.get(`${apiUrl}api/manager/employeeList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setEmployees(response.data.results); // Set employee data from the response
      } else {
        // setError("Results not found."); // Handle cases where status is not 200
        setEmployees([]); // Clear employee data if status is not 200
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employees."); // Set error message for request failures
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const response = await axios.get(`${apiUrl}api/manager/departmentsFind`, {
        params: {
          departmentName: search,
          locationStartsWith: location,
          sortBy: sort,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setEmployees(response.data.employees); // Set employee data from the response
      } else {
        // setError("Results not found."); // Handle cases where status is not 200
        setEmployees([]); // Clear employee data if status is not 200
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employees."); // Set error message for request failures
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchEmployees(); // Fetch data with current search, location, and sort values
  };

  const handleReset = () => {
    setSearch(""); // Reset search input
    setLocation(""); // Reset location input
    setSort("asc"); // Reset sorting
    fetchEmployeesList(); // Fetch data with default values
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Employee List
      </Typography>

      <Box
        sx={{
          marginBottom: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          label="Search by Department Name"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ marginBottom: 2, width: "100%", maxWidth: 500 }}
        />
        <TextField
          label="Location Starts With"
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          sx={{ marginBottom: 2, width: "100%", maxWidth: 500 }}
        />
        sort
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          variant="outlined"
          sx={{ marginBottom: 2, width: "100%", maxWidth: 500 }}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Employee Name</strong>
              </TableCell>
              <TableCell>
                <strong>Department</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Gender</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.departmentName}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.gender}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EmployeeList;
