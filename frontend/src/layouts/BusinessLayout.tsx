import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BusinessSidebar from '@/components/BusinessSidebar';

export default function BusinessLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BusinessSidebar />
      <div className="flex-1 md:ml-64 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 md:p-10 w-full max-w-[1600px] mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}