import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Component/Layout";
import ProtectedRoute from "./Component/ProtectedRoute";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Crimes from "./Pages/Crimes";
import Officers from "./Pages/Officers";
import Suspects from "./Pages/Suspects";
import Cases from "./Pages/Cases";
import Firs from "./Pages/Firs";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes inside Layout */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crimes"
            element={
              <ProtectedRoute allowedRoles={["admin", "officer"]}>
                <Crimes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Officers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suspects"
            element={
              <ProtectedRoute allowedRoles={["admin", "officer"]}>
                <Suspects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cases"
            element={
              <ProtectedRoute allowedRoles={["admin", "officer"]}>
                <Cases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/firs"
            element={
              <ProtectedRoute allowedRoles={["admin", "officer"]}>
                <Firs />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}
