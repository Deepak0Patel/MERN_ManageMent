import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./Components/auth/ProtectRoute";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = lazy(() => import("./pages/Home"));
const DepartmentLIstPage = lazy(() => import("./pages/DepartmentLIstPage"));
const EmployeeListPage = lazy(() => import("./pages/EmployeeListPage"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AddPage = lazy(() => import("./pages/AddPage"));
const UpdatePage = lazy(() => import("./pages/UpdatePage"));

let user = false;

const App = () => {
  const user = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Suspense fallback={<>loading</>}>
          <Routes>
            <Route element={<ProtectRoute user={user} />}>
              <Route path="/" element={<Home />} />
              <Route path="/departmentList" element={<DepartmentLIstPage />} />
              <Route path="/employeeList" element={<EmployeeListPage />} />
              <Route path="/add" element={<AddPage />} />
              <Route path="/departments/update" element={<UpdatePage />} />
            </Route>
            <Route
              path="/login"
              element={
                <ProtectRoute user={!user} redirect="/">
                  <Login />
                </ProtectRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectRoute user={!user} redirect="/">
                  <Signup />
                </ProtectRoute>
              }
            />

            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default App;
