import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, Droplets, Wind, Leaf, MapPin, CloudLightning, Loader2, Wallet, ShieldCheck, Package, Scan, TrendingUp, ArrowRight, Sprout, ShieldAlert, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';

export default function Dashboard() {
  const { t } = useTranslation();
  
  // Real-time State
  const [weather, setWeather] = useState({ temp: 0, condition: "Loading...", humidity: 0, rain: 0, wind: 0, isLoaded: false });
  const [locationName, setLocationName] = useState("Detecting...");
  const [stats, setStats] = useState({ totalEarnings: 0, escrow: 0, activeListings: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automated Slider Data with High-Quality Images
  const advisorySlides = [
    {
      id: 1,
      tag: "Pest Alert",
      tagColor: "bg-red-500",
      title: "Fall Armyworm Detected in Region",
      desc: "High humidity is accelerating pest breeding. Apply preventive bio-insecticide to corn sectors within 48 hours.",
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      tag: "Weather Advisory",
      tagColor: "bg-blue-500",
      title: "Heavy Rainfall Expected Tomorrow",
      desc: "Halt fertilizer top-dressing. Ensure main field drainage trenches are clear to prevent waterlogging.",
      img: "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      tag: "Market Insight",
      tagColor: "bg-[#16a34a]",
      title: "Biomass Demand Surging",
      desc: "Local refineries are offering a 12% premium on Rice Husk this week. List your inventory now to maximize profits.",
      img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800"
    }
  ];
  const activeCrops = [
    { name: "Winter Wheat", stage: "Vegetative Stage", day: 42, progress: 35 },
    { name: "Sweet Corn", stage: "Silking Phase", day: 65, progress: 60 }
  ];
  useEffect(() => {
    // Auto-slide logic
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % advisorySlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // 1. Weather API
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code`);
        const data = await res.json();
        const getCondition = (code: number) => {
          if (code === 0) return "Clear Sky";
          if (code <= 3) return "Partly Cloudy";
          if (code <= 48) return "Foggy";
          if (code <= 67) return "Drizzle";
          if (code <= 79) return "Rainy";
          return "Heavy Weather";
        };
        setWeather({ temp: data.current.temperature_2m, condition: getCondition(data.current.weather_code), humidity: data.current.relative_humidity_2m, rain: data.current.precipitation, wind: data.current.wind_speed_10m, isLoaded: true });
      } catch (err) { setWeather(w => ({ ...w, condition: "API Error", isLoaded: true })); }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setLocationName("Current Location"); fetchWeather(pos.coords.latitude, pos.coords.longitude); },
        () => { setLocationName("Pune, MH (Default)"); fetchWeather(18.52, 73.85); }
      );
    } else { setLocationName("Pune, MH (Default)"); fetchWeather(18.52, 73.85); }

    // 2. Fetch Backend Analytics
    const fetchFinancials = async () => {
      const token = localStorage.getItem('af_token');
      const userStr = localStorage.getItem('af_user');
      if (!token || !userStr) return;
      const user = JSON.parse(userStr);

      try {
        const [orders, listings] = await Promise.all([
          api.get('/api/transactions/farmer/orders'),
          api.get('/api/listings')
        ]);
        
        setStats({
          totalEarnings: orders.filter((o: any) => o.status === 'completed').reduce((sum: number, o: any) => sum + o.totalAmount, 0),
          escrow: orders.filter((o: any) => o.status === 'funds_in_escrow').reduce((sum: number, o: any) => sum + o.totalAmount, 0),
          activeListings: listings.filter((l: any) => l.farmer?._id === user.id && l.status === 'available').length
        });
      } catch (error) { console.error("Data fetch failed"); }
    };
    fetchFinancials();
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full font-sans antialiased bg-[#F4F7F4] pb-12">
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 space-y-5">
        
        {/* 1. ULTRA-COMPACT HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-black text-[#2B3A28] tracking-tight">{t('dashboard.good_morning', 'Farm Dashboard')}</h1>
            <p className="text-[#5C715A] font-medium text-xs mt-0.5">Real-time agricultural intelligence and market insights.</p>
          </div>
          <Link to="/dashboard/detection" className="group flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-green-600/20 active:scale-95 text-sm">
            <Scan size={16} className="text-white" /> {t('dashboard.run_ai_scan', 'Initialize AI Scan')}
          </Link>
        </div>

        {/* 2. ROW 1: 60/40 SPLIT */}
        <div className="flex flex-col lg:flex-row gap-5 h-auto lg:h-[320px]">
          
          {/* LEFT 60%: Weather & Automated Slider */}
          <div className="w-full lg:w-[60%] flex flex-col gap-5 h-full">
            
            {/* Horizontal Weather Bar */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-5 shadow-sm border border-white flex flex-col sm:flex-row justify-between items-center gap-4">
              
              {!weather.isLoaded ? (
                <div className="w-full flex items-center justify-center h-[60px]"><Loader2 className="animate-spin text-[#A3C49D]" size={24}/></div>
              ) : (
                <>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="bg-[#F0F4EF] p-3 rounded-2xl"><Sun className="text-[#4A5D48]" size={24} /></div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-[#2B3A28] tracking-tighter">{Math.round(weather.temp)}</span>
                        <span className="text-lg font-bold text-[#8A9A86]">°C</span>
                      </div>
                      <p className="text-[10px] font-bold text-[#5C715A] flex items-center gap-1 uppercase tracking-wider">
                        <MapPin size={10} className="text-blue-500"/> {locationName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 bg-[#F4F7F4] px-6 py-3 rounded-2xl border border-white/50 w-full sm:w-auto justify-between sm:justify-start">
                    <div>
                      <p className="text-[9px] font-bold text-[#8A9A86] uppercase tracking-wider mb-0.5 flex items-center gap-1"><CloudRain size={10} className="text-blue-400"/> Status</p>
                      <p className="text-sm font-black text-[#2B3A28]">{weather.condition}</p>
                    </div>
                    <div className="w-[1px] h-8 bg-[#DCE7D5]"></div>
                    <div>
                      <p className="text-[9px] font-bold text-[#8A9A86] uppercase tracking-wider mb-0.5 flex items-center gap-1"><Droplets size={10} className="text-blue-400"/> {t('dashboard.humidity', 'Hum')}</p>
                      <p className="text-sm font-black text-[#2B3A28]">{weather.humidity}%</p>
                    </div>
                    <div className="w-[1px] h-8 bg-[#DCE7D5]"></div>
                    <div>
                      <p className="text-[9px] font-bold text-[#8A9A86] uppercase tracking-wider mb-0.5 flex items-center gap-1"><Wind size={10} className="text-blue-400"/> {t('dashboard.wind', 'Wind')}</p>
                      <p className="text-sm font-black text-[#2B3A28]">{weather.wind} km/h</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Automated Advisory Slider */}
            <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white overflow-hidden relative min-h-[160px]">
              {advisorySlides.map((slide, index) => (
                <div 
                  key={slide.id} 
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  {/* Background Image & Gradient Overlay */}
                  <img src={slide.img} alt="Advisory" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-center max-w-lg">
                    <span className={`text-[9px] font-black text-white px-2.5 py-1 rounded-md uppercase tracking-widest w-max mb-3 ${slide.tagColor} shadow-sm`}>
                      {slide.tag}
                    </span>
                    <h3 className="text-2xl font-black text-white mb-2 leading-tight">{slide.title}</h3>
                    <p className="text-gray-200 text-xs font-medium leading-relaxed max-w-sm">
                      {slide.desc}
                    </p>
                  </div>
                </div>
              ))}

              {/* Slider Dots */}
              <div className="absolute bottom-4 left-6 z-20 flex gap-1.5">
                {advisorySlides.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 40%: Marketplace Hero */}
          <div className="w-full lg:w-[40%] bg-gradient-to-br from-[#DCE7D5] via-[#EAEFE8] to-[#C8D8BE] rounded-[2rem] p-8 relative overflow-hidden shadow-sm border border-white/60 flex flex-col justify-between h-full">
            <div className="absolute -top-16 -right-16 text-white/40 rotate-12 pointer-events-none"><Leaf size={300} strokeWidth={0.5} /></div>
            
            <div className="relative z-10">
              <span className="bg-white/60 text-[#2B3A28] px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 inline-block shadow-sm">
                Govt Subsidy Active
              </span>
              <h2 className="text-4xl font-black text-[#2B3A28] mb-3 leading-tight tracking-tight">Monetize Your Crop Residue.</h2>
              <p className="text-[#4A5D48] font-medium text-xs mb-8 max-w-xs leading-relaxed">
                Convert agricultural waste into direct revenue. Sell directly to biofuel refineries with zero middlemen.
              </p>
            </div>

            <div className="relative z-10 mt-auto">
              <Link to="/dashboard/marketplace" className="inline-flex justify-between items-center w-full bg-white hover:bg-gray-50 text-[#16a34a] font-black px-6 py-4 rounded-xl transition-colors shadow-sm text-sm">
                Open Marketplace <ArrowRight size={18} />
              </Link>
            </div>
          </div>

        </div>

        {/* 3. ROW 2: 3 KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-5 border border-white shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="h-12 w-12 bg-[#F0F4EF] rounded-xl flex items-center justify-center"><Wallet className="text-[#16a34a]" size={20}/></div>
            <div>
              <p className="text-[10px] font-bold text-[#5C715A] uppercase tracking-widest mb-0.5">Total Earnings</p>
              <p className="text-2xl font-black text-[#2B3A28] tracking-tight">₹{stats.totalEarnings.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-5 border border-white shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center"><ShieldCheck className="text-orange-600" size={20}/></div>
            <div>
              <p className="text-[10px] font-bold text-[#5C715A] uppercase tracking-widest mb-0.5">Funds In Escrow</p>
              <p className="text-2xl font-black text-orange-600 tracking-tight">₹{stats.escrow.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-[#2B3A28] rounded-[2rem] p-5 border border-[#1E2A1B] shadow-md flex items-center gap-4 hover:-translate-y-1 transition-transform text-white">
            <div className="h-12 w-12 bg-[#3A4D36] rounded-xl flex items-center justify-center"><Package className="text-[#A3C49D]" size={20}/></div>
            <div>
              <p className="text-[10px] font-bold text-[#A3C49D] uppercase tracking-widest mb-0.5">Active Listings</p>
              <p className="text-2xl font-black">{stats.activeListings} <span className="text-xs font-medium text-[#A3C49D]">Batches</span></p>
            </div>
          </div>
        </div>

        {/* 4. ROW 3: BENTO GRID (Chart & Advisory Mix) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Market Trend Chart (7 Cols) */}
          <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-black text-[#2B3A28]">Market Value Trend</h3>
                <p className="text-[10px] text-[#5C715A] font-bold uppercase tracking-wider mt-1">₹/Ton avg value (6 Months)</p>
              </div>
              <TrendingUp size={16} className="text-[#16a34a]"/>
            </div>
            
            {/* Smooth SVG Curve Chart */}
            <div className="flex-1 w-full relative min-h-[140px]">
              <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,40 L0,28 C15,28 25,12 45,18 C65,24 80,8 100,5 L100,40 Z" fill="url(#sageGradient)" />
                <path d="M0,28 C15,28 25,12 45,18 C65,24 80,8 100,5" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="100" cy="5" r="1.5" fill="white" stroke="#16a34a" strokeWidth="1" />
              </svg>
              <div className="absolute top-[8%] right-0 bg-[#2B3A28] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm transform translate-x-2 -translate-y-2">₹4k+</div>
            </div>
            
            <div className="flex justify-between mt-2 text-[8px] font-black text-[#8A9A86] uppercase tracking-widest">
              <span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span>
            </div>
          </div>

          {/* Crop Health & Tasks (5 Cols) */}
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-black text-[#2B3A28] flex items-center gap-2">
                  <Sprout size={20} className="text-[#16a34a]" /> Active Crop Status
                </h3>
              </div>
            </div>
            
            <div className="space-y-3 mb-5">
              {activeCrops.map((crop, idx) => (
                <div key={idx} className="bg-[#F4F7F4] border border-white p-4 rounded-2xl">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-[#2B3A28] text-sm">{crop.name}</h4>
                      <p className="text-[10px] text-[#5C715A] mt-0.5 font-bold uppercase tracking-wider">{crop.stage}</p>
                    </div>
                    <span className="bg-white text-[#2B3A28] text-[10px] font-black px-2 py-1 rounded shadow-sm border border-gray-100">Day {crop.day}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-[9px] font-bold text-[#8A9A86] mb-1.5 uppercase tracking-wider">
                      <span>Planted</span><span>Harvest</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#16a34a] h-2 rounded-full relative" style={{ width: `${crop.progress}%` }}>
                        <div className="absolute -right-1.5 -top-1 h-4 w-4 bg-white border-2 border-[#16a34a] rounded-full shadow"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 bg-[#F0F4EF] p-4 rounded-2xl border border-white">
              <div className="bg-white p-1.5 rounded-lg shrink-0 shadow-sm"><CheckCircle2 className="text-[#16a34a]" size={16} /></div>
              <div>
                <p className="text-[10px] font-bold text-[#8A9A86] uppercase tracking-wider mb-0.5">Task Due Tomorrow</p>
                <p className="text-xs font-bold text-[#2B3A28] leading-tight">Apply Potassium Top-Dress to Sweet Corn sector.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}