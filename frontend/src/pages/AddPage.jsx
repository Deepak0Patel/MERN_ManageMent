import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddPage = () => {
  const apiUrl = "https://mern-management-bz0b.onrender.com/";
  const token = useSelector((state) => state.auth.user.token);
  const navigation = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/manager/employeeList`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(response.data.results || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [apiUrl, token]);

  const formik = useFormik({
    initialValues: {
      departmentName: "",
      categoryName: "",
      location: "",
      salary: "",
      employeeIDs: [],
    },
    validationSchema: Yup.object({
      departmentName: Yup.string().required("Required"),
      categoryName: Yup.string().required("Required"),
      location: Yup.string().required("Required"),
      salary: Yup.number()
        .required("Required")
        .positive("Must be positive")
        .integer("Must be an integer"),
      employeeIDs: Yup.array().of(Yup.string()).required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${apiUrl}api/manager/departments`,
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Department created:", response.data);
        toast.success("Department Created successfully");

        navigation("/departmentList");
      } catch (err) {
        console.error("Error submitting form:", err);
      }
    },
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Helper function to get employee names from IDs
  const getEmployeeNames = (ids) => {
    return employees
      .filter((employee) => ids.includes(employee._id))
      .map((employee) => `${employee.firstName} ${employee.lastName}`)
      .join(", ");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add Department
      </Typography>
      <Button
        variant="outlined"
        onClick={() => navigation("/departmentList")}
        sx={{ marginRight: 1 }}
      >
        Back
      </Button>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Department Name"
          variant="outlined"
          margin="normal"
          {...formik.getFieldProps("departmentName")}
          error={
            formik.touched.departmentName &&
            Boolean(formik.errors.departmentName)
          }
          helperText={
            formik.touched.departmentName && formik.errors.departmentName
          }
        />
        <TextField
          fullWidth
          label="Category Name"
          variant="outlined"
          margin="normal"
          {...formik.getFieldProps("categoryName")}
          error={
            formik.touched.categoryName && Boolean(formik.errors.categoryName)
          }
          helperText={formik.touched.categoryName && formik.errors.categoryName}
        />
        <TextField
          fullWidth
          label="Location"
          variant="outlined"
          margin="normal"
          {...formik.getFieldProps("location")}
          error={formik.touched.location && Boolean(formik.errors.location)}
          helperText={formik.touched.location && formik.errors.location}
        />
        <TextField
          fullWidth
          label="Salary"
          variant="outlined"
          margin="normal"
          type="number"
          {...formik.getFieldProps("salary")}
          error={formik.touched.salary && Boolean(formik.errors.salary)}
          helperText={formik.touched.salary && formik.errors.salary}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="employee-ids-label">Employees</InputLabel>
          <Select
            labelId="employee-ids-label"
            multiple
            value={formik.values.employeeIDs}
            onChange={(event) =>
              formik.setFieldValue("employeeIDs", event.target.value)
            }
            renderValue={(selected) => getEmployeeNames(selected)}
            error={
              formik.touched.employeeIDs && Boolean(formik.errors.employeeIDs)
            }
          >
            {employees.map((employee) => (
              <MenuItem key={employee._id} value={employee._id}>
                {employee.firstName} {employee.lastName}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.employeeIDs && formik.errors.employeeIDs && (
            <div>{formik.errors.employeeIDs}</div>
          )}
        </FormControl>
        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default AddPage;
