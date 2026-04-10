import { Sun, CloudRain, Droplets, FlaskConical, Wind, ArrowRight, Leaf} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';

export default function Dashboard() {
  
  // Mock Data for the Dashboard
  const weather = { temp: 28, condition: "Partly Cloudy", humidity: 65, rainChance: 20 };
  const soil = { ph: 6.2, nitrogen: "Low", moisture: 42 };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Promotional Info Slider */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden mb-8">
        <div className="absolute right-0 top-0 opacity-10"><Leaf size={200} /></div>
        <div className="relative z-10 max-w-xl">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 inline-block">Govt Initiative 2026</span>
          <h2 className="text-2xl md:text-3xl font-black mb-2">Stop Stubble Burning. Start Earning.</h2>
          <p className="text-green-50 font-medium leading-relaxed mb-6">
            Subsidies are now available for farmers selling over 10 Tons of crop residue. Secure your deals through AgriFuel Nexus to automatically qualify.
          </p>
          <button className="bg-white text-green-800 font-bold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition">Learn More</button>
        </div>
      </div>

      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Farm Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back. Here is your daily agricultural summary.</p>
        </div>
        <Link to="/dashboard/detection" className="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold transition">
          Run AI Scan <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Row 1: Environmental Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Weather Widget */}
        <Card className="shadow-sm border-t-4 border-t-blue-400 bg-gradient-to-br from-white to-blue-50/50">
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
              <Sun className="h-5 w-5 text-blue-500" /> Current Climate (Pune)
            </CardTitle>
            <span className="text-3xl font-bold text-gray-900">{weather.temp}°C</span>
          </CardHeader>
          <CardContent>
            <p className="text-blue-900 font-medium mb-4">{weather.condition}</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white border border-blue-100 p-3 rounded-xl flex flex-col items-center shadow-sm">
                <Droplets className="h-5 w-5 text-blue-400 mb-1" />
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Humidity</span>
                <span className="font-bold text-gray-900">{weather.humidity}%</span>
              </div>
              <div className="bg-white border border-blue-100 p-3 rounded-xl flex flex-col items-center shadow-sm">
                <CloudRain className="h-5 w-5 text-blue-400 mb-1" />
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Rain</span>
                <span className="font-bold text-gray-900">{weather.rainChance}%</span>
              </div>
              <div className="bg-white border border-blue-100 p-3 rounded-xl flex flex-col items-center shadow-sm">
                <Wind className="h-5 w-5 text-blue-400 mb-1" />
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Wind</span>
                <span className="font-bold text-gray-900">12 km/h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Soil Health Widget */}
        <Card className="shadow-sm border-t-4 border-t-amber-500 bg-gradient-to-br from-white to-amber-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
              <FlaskConical className="h-5 w-5 text-amber-600" /> Soil Health Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-900 font-medium mb-4">Loamy Soil Profile</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white border border-amber-100 p-3 rounded-xl flex flex-col items-center shadow-sm">
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">pH Level</span>
                <span className="font-bold text-green-600 text-xl">{soil.ph}</span>
                <span className="text-xs text-green-700 mt-1 bg-green-100 px-2 py-0.5 rounded-full">Optimal</span>
              </div>
              <div className="bg-white border border-amber-100 p-3 rounded-xl flex flex-col items-center shadow-sm">
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Nitrogen</span>
                <span className="font-bold text-red-500 text-xl">{soil.nitrogen}</span>
                <span className="text-xs text-red-700 mt-1 bg-red-100 px-2 py-0.5 rounded-full">Warning</span>
              </div>
              <div className="bg-white border border-amber-100 p-3 rounded-xl flex flex-col items-center shadow-sm">
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Moisture</span>
                <span className="font-bold text-blue-600 text-xl">{soil.moisture}%</span>
                <span className="text-xs text-blue-700 mt-1 bg-blue-100 px-2 py-0.5 rounded-full">Good</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Crops</h2>
            <p className="text-2xl font-bold text-gray-900 mt-1">Wheat, Corn</p>
          </div>
          <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl">🌱</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending Alerts</h2>
            <p className="text-2xl font-bold text-gray-900 mt-1">2 Action Required</p>
          </div>
          <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl">⚠️</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Biofuel Listed</h2>
            <p className="text-2xl font-bold text-gray-900 mt-1">1.5 Tons</p>
          </div>
          <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl">♻️</div>
        </div>
      </div>

      {/* Row 3: Activity Log */}
      <Card className="shadow-sm border border-gray-100">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
              <span className="bg-green-100 text-green-700 p-2.5 rounded-lg text-lg">✅</span>
              <div>
                <p className="font-semibold text-gray-900">Marketplace Match Found</p>
                <p className="text-sm text-gray-600">The system matched your 1.5 Tons of Rice Husk with EcoFuel Corp. Awaiting your approval.</p>
              </div>
            </li>
            <li className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
              <span className="bg-amber-100 text-amber-700 p-2.5 rounded-lg text-lg">🔔</span>
              <div>
                <p className="font-semibold text-gray-900">New AI Advisory Generated</p>
                <p className="text-sm text-gray-600">Low nitrogen detected in soil analysis. Recommend applying urea-based fertilizer within 48 hours.</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Mobile-only scan button */}
      <Link to="/dashboard/detection" className="md:hidden flex items-center justify-center gap-2 bg-green-600 text-white w-full py-4 rounded-xl font-bold text-lg shadow-lg">
        Run AI Scan Now <ArrowRight className="h-5 w-5" />
      </Link>

    </div>
  );
}