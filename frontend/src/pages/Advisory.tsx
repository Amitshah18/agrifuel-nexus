import { CalendarDays, TrendingUp, CloudSun, Sprout, ShieldAlert, CheckCircle2, ArrowRight, ThermometerSun, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';

export default function Advisory() {
  
  // Mock Predictive Data
  const cropStages = [
    { name: "Winter Wheat", stage: "Vegetative (Tillering)", daysPlanted: 42, health: "Excellent", progress: 35 },
    { name: "Sweet Corn", stage: "Silking", daysPlanted: 65, health: "Good", progress: 60 }
  ];

  const agronomicForecast = [
    { day: "Tomorrow", weather: "Sunny", temp: 30, action: "Ideal for Spraying", icon: <ThermometerSun className="text-amber-500 h-6 w-6" />, color: "text-green-600", bg: "bg-green-100" },
    { day: "Thursday", weather: "Light Rain", temp: 26, action: "Hold Fertilizers", icon: <CloudSun className="text-blue-500 h-6 w-6" />, color: "text-amber-600", bg: "bg-amber-100" },
    { day: "Friday", weather: "Heavy Rain", temp: 24, action: "High Fungal Risk", icon: <Droplets className="text-blue-600 h-6 w-6" />, color: "text-red-600", bg: "bg-red-100" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Predictive Advisory</h1>
        <p className="text-gray-600 mt-1">AI-driven crop lifecycle tracking and forward-looking action plans.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Crop Lifecycle Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-t-4 border-t-green-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" /> Active Crop Lifecycle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {cropStages.map((crop, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-100 p-5 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{crop.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Sprout className="h-4 w-4" /> Stage: <span className="font-medium text-gray-700">{crop.stage}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        Day {crop.daysPlanted}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                      <span>Planted</span>
                      <span>Harvest</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full relative" style={{ width: `${crop.progress}%` }}>
                        <div className="absolute -right-2 -top-1.5 h-5 w-5 bg-white border-2 border-green-500 rounded-full shadow"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Task Manager */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2 border-b border-gray-100 mb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" /> AI Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="h-4 w-4 rounded-full bg-blue-500 ring-4 ring-blue-100"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900">Apply Potassium Top-Dress</h4>
                    <p className="text-sm text-blue-800 mt-1">Your Sweet Corn is entering the silking phase. A potassium boost in the next 3 days will significantly improve kernel development.</p>
                    <p className="text-xs font-semibold text-blue-600 mt-2 uppercase tracking-wider">Due: Tomorrow, 10:00 AM</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Prepare Drainage Systems</h4>
                    <p className="text-sm text-gray-600 mt-1">Heavy rains predicted for Friday. Clear main field trenches to prevent waterlogging in the Winter Wheat sectors.</p>
                    <p className="text-xs font-semibold text-gray-400 mt-2 uppercase tracking-wider">Due: Thursday Evening</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 3: Agronomic Weather Forecast */}
        <div className="space-y-6">
          <Card className="shadow-sm bg-gradient-to-b from-slate-800 to-slate-900 text-white border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-100">
                <CalendarDays className="h-5 w-5 text-blue-400" /> Agronomic Forecast
              </CardTitle>
              <p className="text-sm text-slate-400 font-medium mt-1">Weather impact on farm operations</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {agronomicForecast.map((day, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      {day.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">{day.day}</h4>
                      <p className="text-xs text-slate-300">{day.temp}°C • {day.weather}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-md text-xs font-bold ${day.bg} ${day.color}`}>
                    {day.action}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pest & Disease Risk Alert */}
          <Card className="shadow-sm border-2 border-red-100 bg-red-50">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <ShieldAlert className="h-12 w-12 text-red-500 mb-3" />
              <h3 className="font-bold text-red-900 text-lg">High Pest Risk Alert</h3>
              <p className="text-sm text-red-700 mt-2 leading-relaxed">
                Rising humidity and Friday's rain creates an optimal breeding ground for <span className="font-bold">Fall Armyworm</span>.
              </p>
              <button className="mt-4 flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-800 transition">
                View Preventive Measures <ArrowRight className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}