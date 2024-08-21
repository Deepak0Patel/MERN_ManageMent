import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Dashboard from "../Components/Dashboard";
import { setProfile } from "../store/features/userSlice";
import { Box, Button, Typography } from "@mui/material";
import { logout } from "../store/features/authSlice";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Home = () => {
  const apiUrl = "https://mern-management-bz0b.onrender.com";
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to handle errors
  const token = useSelector((state) => state.auth.user.token); // Get token from Redux state
  const userData = useSelector((state) => state.user.profile);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/employee/me`, {
          headers: {
            Authorization: `Bearer ${token}`, // Set the token in headers
          },
        });
        dispatch(setProfile(response.data)); // Set data from API response
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // Set loading to false once data fetching is done
      }
    };

    fetchData();
  }, [token]); // Dependency array includes token

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: 2,
          backgroundColor: "#f0f0f0",
        }}
      >
        <Typography variant="h6">LOGO</Typography>
        {userData?.role === "manager" && (
          <Box>
            <Link
              to="/departmentList"
              style={{ textDecoration: "none", marginRight: 15 }}
            >
              <Button variant="outlined">Department List</Button>
            </Link>
            <Link to="/employeeList" style={{ textDecoration: "none" }}>
              <Button variant="outlined">Employee List</Button>
            </Link>
          </Box>
        )}

        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Dashboard />
    </>
  );
};

export default Home;
