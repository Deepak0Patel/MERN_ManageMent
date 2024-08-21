import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  Pagination,
  Button,
  TableFooter,
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Delete, Search } from "@mui/icons-material";
import { toast } from "react-toastify";

const DepartmentList = () => {
  const apiUrl = "https://mern-management-bz0b.onrender.com";
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering
  const [locationTerm, setLocationTerm] = useState(""); // Location term for filtering
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order

  // Get the token from the Redux store
  const token = useSelector((state) => state.auth.user.token);
  const navigate = useNavigate(); // For navigation

  // Fetch departments based on pagination
  const fetchDepartmentsByPage = async () => {
    try {
      const response = await axios.get(`${apiUrl}api/manager/departments`, {
        params: { page: currentPage },
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      setDepartments(response?.data?.results); // Adjust according to actual response structure
      setTotalPages(response?.data?.totalPages); // Total number of pages
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  // Determine which fetch function to use
  useEffect(() => {
    setLoading(true);

    fetchDepartmentsByPage(); // Fetch with pagination
  }, [apiUrl, token, currentPage]);

  // Handle delete department
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}api/manager/departments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });

      toast.success("Department deleted successfully");

      // Refresh the department list
      setDepartments((prevDepartments) =>
        prevDepartments.filter((dept) => dept._id !== id)
      );
    } catch (err) {
      console.error("Error deleting department:", err);
      setError("Failed to delete department.");
    }
  };

  // Handle update department
  const handleUpdate = (department) => {
    navigate(`/departments/update`, {
      state: { department }, // Pass the department data to the update page
    });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const handleAdd = () => {
    navigate("/add");
  };

  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Department List
      </Typography>
      <Button variant="outlined" onClick={handleAdd}>
        Add DepartMent
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Department Name</strong>
              </TableCell>
              <TableCell>
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                <strong>Location</strong>
              </TableCell>
              <TableCell>
                <strong>Salary</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments?.length > 0 ? (
              departments.map((department) => (
                <TableRow key={department?._id}>
                  <TableCell>{department?.departmentName}</TableCell>
                  <TableCell>{department?.categoryName}</TableCell>
                  <TableCell>{department?.location}</TableCell>
                  <TableCell>${department?.salary.toLocaleString()}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdate(department)}
                        sx={{ marginRight: 1 }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(department?._id)}
                      >
                        <Delete />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No departments available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, page) => setCurrentPage(page)} // Update page state on change
                  color="primary"
                  sx={{ display: "flex", justifyContent: "center", padding: 2 }}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DepartmentList;
