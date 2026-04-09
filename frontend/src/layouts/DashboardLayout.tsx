import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* The Outlet acts as a placeholder for your nested pages */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto w-full">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}