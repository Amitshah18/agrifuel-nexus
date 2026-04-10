import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ProtectedRoute from '@/components/ProtectedRoute'; // <-- Import the Gatekeeper

// Farmer Imports
import DashboardLayout from '@/layouts/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import Detection from '@/pages/Detection';
import Advisory from '@/pages/Advisory';
import Marketplace from '@/pages/Marketplace';

// Business Imports
import BusinessLayout from '@/layouts/BusinessLayout';
import BusinessDashboard from '@/pages/BusinessDashboard';
import BusinessOrders from '@/pages/BusinessOrders';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* ==========================================
            ZONE 1: FARMER / SELLER ROUTES
            ========================================== */}
        <Route element={<ProtectedRoute allowedRole="farmer" />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="detection" element={<Detection />} />
            <Route path="advisory" element={<Advisory />} />
            <Route path="marketplace" element={<Marketplace />} />
          </Route>
        </Route>

        {/* ==========================================
            ZONE 2: BUSINESS / BUYER ROUTES
            ========================================== */}
        <Route element={<ProtectedRoute allowedRole="buyer" />}>
          <Route path="/business" element={<BusinessLayout />}>
            <Route index element={<BusinessDashboard />} />
            <Route path="orders" element={<BusinessOrders />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;