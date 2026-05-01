import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar'; // Adjust path if needed
import BusinessSidebar from '@/components/BusinessSidebar'; // Adjust path if needed

export default function BusinessLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // Locked viewport height prevents the entire page from scrolling awkwardly
    <div className="flex flex-col h-screen bg-[#fcfcfc] overflow-hidden">
      
      {/* Top Navbar spans full width */}
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      
      {/* Main content area splits between Sidebar and Outlet */}
      <div className="flex flex-1 overflow-hidden relative">
        <BusinessSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* Only this main section scrolls */}
        <main className="flex-1 w-full overflow-y-auto relative">
          <Outlet />
        </main>
      </div>

    </div>
  );
}