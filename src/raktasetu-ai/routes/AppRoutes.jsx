import { Routes, Route } from "react-router-dom";

import Welcome from "../pages/public/Welcome";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

import PatientDashboard from "../pages/patient/PatientDashboard";
import DonorDashboard from "../pages/donor/DonorDashboard";
import BloodBankDashboard from "../pages/bloodbank/BloodBankDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/donor" element={<DonorDashboard />} />
      <Route path="/bloodbank" element={<BloodBankDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default AppRoutes;