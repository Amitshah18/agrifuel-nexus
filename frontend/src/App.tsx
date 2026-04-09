import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages & Layouts
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import DashboardLayout from '@/layouts/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import Detection from '@/pages/Detection';
import Advisory from '@/pages/Advisory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* All routes inside here will share the Navbar and Sidebar */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Index route: Matches /dashboard directly */}
          <Route index element={<Dashboard />} />
          {/* Nested routes */}
          <Route path="detection" element={<Detection />} />
          <Route path="advisory" element={<Advisory />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;