import React, { useState } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Container,
  MenuItem,
  InputAdornment,
  IconButton,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const apiUrl = "https://mern-management-bz0b.onrender.com";
  const [showPassword, setShowPassword] = useState(false); // Add state for password visibility
  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Required"),
    gender: Yup.string().required("Required"),
    hobbies: Yup.array()
      .of(Yup.string().required("Hobby is required"))
      .min(1, "At least one hobby is required"),
  });

  const handleSubmit = async (values) => {
    console.log("data to send", values);
    try {
      await axios.post(`${apiUrl}api/auth/signup`, values);
      navigate("/login");
      toast.success("user register successfully");
    } catch (error) {
      console.error("Error registering:", error);
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
      <Container maxWidth="sm">
        <Card sx={{ mt: 8 }}>
          <CardContent>
            <Typography variant="h5" component="div" align="center">
              Register
            </Typography>
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                role: "employee",
                gender: "",
                hobbies: [""],
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values }) => (
                <Form>
                  <Field
                    as={TextField}
                    name="firstName"
                    label="First Name"
                    fullWidth
                    margin="normal"
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                  <Field
                    as={TextField}
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    margin="normal"
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <Field
                    as={TextField}
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Field
                    as={TextField}
                    name="gender"
                    label="Gender"
                    select
                    fullWidth
                    margin="normal"
                    error={touched.gender && Boolean(errors.gender)}
                    helperText={touched.gender && errors.gender}
                  >
                    <MenuItem value="">Select Gender</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Field>
                  <FieldArray
                    name="hobbies"
                    render={({ push, remove }) => (
                      <>
                        {values.hobbies.map((hobby, index) => (
                          <div key={index}>
                            <Field
                              as={TextField}
                              name={`hobbies[${index}]`}
                              label={`Hobby ${index + 1}`}
                              fullWidth
                              margin="normal"
                              error={
                                touched.hobbies &&
                                touched.hobbies[index] &&
                                Boolean(errors.hobbies && errors.hobbies[index])
                              }
                              helperText={
                                touched.hobbies &&
                                touched.hobbies[index] &&
                                errors.hobbies &&
                                errors.hobbies[index]
                              }
                            />
                            <Button
                              type="button"
                              variant="outlined"
                              size="small"
                              onClick={() => remove(index)}
                            >
                              Remove Hobby
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              type="button"
                              onClick={() => push("")}
                            >
                              Add more Hobby
                            </Button>
                          </div>
                        ))}
                      </>
                    )}
                  />
                  <Button
                    type="submit"
                    sx={{ marginTop: "2rem" }}
                    variant="contained"
                    color="primary"
                  >
                    Register
                  </Button>
                </Form>
              )}
            </Formik>

            <Button
              variant="text"
              color="primary"
              fullWidth
              onClick={() => navigate("/login")}
            >
              Already User? Login
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
