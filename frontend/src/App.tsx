import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';

// Note: Removed the .jsx extension from Home
import Home from '@/pages/Home';
import Navbar from '@/components/Navbar';
import Dashboard from '@/pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;