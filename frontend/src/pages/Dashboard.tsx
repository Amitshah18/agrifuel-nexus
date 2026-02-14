import { useState, FC, ChangeEvent } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import { Upload } from 'lucide-react';
import "./Dashboard.css";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: FC<DashboardProps> = ({ onLogout }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} onLogout={onLogout} />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition col-span-1 md:col-span-2">
              <label className="cursor-pointer flex flex-col items-center">
                {image ? (
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-40 h-40 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center border rounded-lg bg-gray-100">
                    <Upload className="w-10 h-10 text-gray-500" />
                  </div>
                )}
                <span className="mt-2 text-sm font-medium text-gray-700">
                  {image ? "Change Image" : "Upload Image"}
                </span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center">
                <h2 className="text-lg font-semibold">Active Projects</h2>
                <p className="text-3xl font-bold text-green-600 mt-2">12</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center">
                <h2 className="text-lg font-semibold">Total Crops</h2>
                <p className="text-3xl font-bold text-blue-600 mt-2">8</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard;
