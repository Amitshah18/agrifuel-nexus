import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // Flex Col layout ensures Navbar is at the top
    <div className="flex flex-col h-screen bg-[#F4F7F4] overflow-hidden font-sans antialiased">
      
      {/* Full width Navbar */}
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      
      {/* Sidebar and Main Content area below Navbar */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* Main content scrolls independently */}
        <main className="flex-1 overflow-y-auto w-full relative">
          <Outlet /> 
        </main>
      </div>
      
    </div>
  );
}