import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  Alert,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../store/features/authSlice";
import { toast } from "react-toastify";

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const apiUrl = "https://mern-management-bz0b.onrender.com";

  const handleSubmit = async (values) => {
    console.log("data to send", values);
    try {
      const response = await axios.post(`${apiUrl}api/auth/login`, values);

      if (response.status === 200) {
        dispatch(login(response.data));
        toast.success("User Login successfully");
        navigate("/"); // Adjust the route as necessary
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #27beea, #473868)", // Gradient background
        padding: 2,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Card sx={{ mt: 8 }}>
          <CardContent>
            <Typography variant="h5" component="div" align="center">
              Login
            </Typography>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        name="email"
                        as={TextField}
                        label="Email Address"
                        fullWidth
                        variant="outlined"
                        helperText={touched.email && errors.email}
                        error={touched.email && Boolean(errors.email)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name="password"
                        as={TextField}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        variant="outlined"
                        helperText={touched.password && errors.password}
                        error={touched.password && Boolean(errors.password)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        Login
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="text"
                        color="primary"
                        fullWidth
                        onClick={() => navigate("/signup")}
                      >
                        Don't have an account? Register
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
            {errorMessage && (
              <Alert severity="error" style={{ marginBottom: "16px" }}>
                {errorMessage}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
