import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignUp from "./authpages/SignUp";
import Login from "./authpages/Login";
import ForgotPassword from "./authpages/ForgotPassword";
import Verification from "./authpages/Verification";
import ResetPassword from "./authpages/ResetPassword";

{
  /*Vendor Pages*/
}
import VendorLandingpage from "./vendorpages/VendorLandingpage";
import VendorProducts from "./vendorpages/VendorProducts";
import VendorProfile from "./vendorpages/VendorProfile";
import VendorDashboard from "./vendorpages/VendorDashboard";
import MessagingSystem from "./vendorpages/MessagingSystem";
import VendorMaintenanceManagement from "./vendorpages/VendorMaintenanceManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*Auth Route*/}
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/resetpassword" element={<ResetPassword />} />

        {/*Vendor Route*/}
        <Route path="/vendorlandingpage" element={<VendorLandingpage />} />
        <Route path="/vendorproducts" element={<VendorProducts />} />
        <Route path="/vendorprofile" element={<VendorProfile />} />
        <Route path="/vendordashboard" element={<VendorDashboard />} />
        <Route path="/messaging" element={<MessagingSystem />} />
        <Route
          path="/vendormaintenance"
          element={<VendorMaintenanceManagement />}
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
