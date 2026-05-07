import { api } from '../lib/api';
import React, { useState, useEffect } from 'react';
import { TrendingUp, Leaf, IndianRupee, Package, ArrowUpRight, ArrowDownRight, Calendar, Loader2, BarChart3 } from 'lucide-react';

export default function BusinessAnalytics() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const token = localStorage.getItem('af_token');
        // Fetch real order history from the database
        const res = await fetch(`${api.baseURL}/api/transactions/buyer/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  // ==========================================
  // REAL-TIME DATA AGGREGATION LOGIC
  // ==========================================

  // 1. Calculate Top Level KPIs
  const totalSpend = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalProcured = orders.reduce((sum, order) => sum + (order.listing?.quantity || 0), 0);
  const avgPrice = totalProcured > 0 ? totalSpend / totalProcured : 0;
  const co2Offset = totalProcured * 1.5;

  const formatCurrency = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString()}`;
  };

  const kpis = [
    { label: "Total Spend (YTD)", value: formatCurrency(totalSpend), trend: "+12.5%", isPositive: true, icon: IndianRupee },
    { label: "Biomass Procured", value: `${totalProcured.toLocaleString()} T`, trend: "+8.2%", isPositive: true, icon: Package },
    { label: "Avg Price per Ton", value: `₹${Math.round(avgPrice).toLocaleString()}`, trend: "-2.4%", isPositive: false, icon: TrendingUp },
    { label: "Estimated CO2 Offset", value: `${Math.round(co2Offset).toLocaleString()} T`, trend: "+15.3%", isPositive: true, icon: Leaf, dark: true },
  ];

  // 2. Calculate Monthly Volume (Last 6 Months)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const monthlyDataMap = new Map<string, number>();

  // Initialize the last 6 months to 0 so the chart always looks complete
  for(let i = 5; i >= 0; i--) {
      let d = new Date();
      d.setMonth(currentMonth - i);
      monthlyDataMap.set(monthNames[d.getMonth()], 0);
  }

  orders.forEach(order => {
      // Use createdAt, or fallback to right now if missing
      const d = new Date(order.createdAt || Date.now()); 
      const m = monthNames[d.getMonth()];
      if(monthlyDataMap.has(m)) {
          monthlyDataMap.set(m, monthlyDataMap.get(m)! + (order.listing?.quantity || 0));
      }
  });

  const maxVolume = Math.max(...Array.from(monthlyDataMap.values()), 1); // Prevent divide by 0
  
  // A beautiful, professional gradient progression for the chart bars
  const barGradients = [
    "from-blue-600 to-cyan-400",
    "from-indigo-500 to-blue-400",
    "from-violet-500 to-indigo-400",
    "from-purple-500 to-violet-400",
    "from-fuchsia-500 to-purple-400",
    "from-rose-500 to-pink-400"
  ];

  const procurementData = Array.from(monthlyDataMap.entries()).map(([month, value], idx) => ({
      month,
      value,
      heightPercentage: Math.max((value / maxVolume) * 100, 2), // Minimum 2% height so empty months still show a tiny tick
      gradient: barGradients[idx % barGradients.length]
  }));

  // 3. Calculate Material Breakdown
  const residueMap = new Map<string, number>();
  orders.forEach(order => {
      const type = order.listing?.residueType || 'Unknown';
      const qty = order.listing?.quantity || 0;
      residueMap.set(type, (residueMap.get(type) || 0) + qty);
  });

  const breakdownColors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];
  const residueBreakdown = Array.from(residueMap.entries()).map(([name, value], idx) => ({
      name,
      value: totalProcured > 0 ? Math.round((value / totalProcured) * 100) : 0,
      color: breakdownColors[idx % breakdownColors.length],
      rawAmount: value
  })).sort((a, b) => b.value - a.value);


  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] w-full bg-[#fcfcfc]">
      <Loader2 className="animate-spin mb-3 text-zinc-400" size={28} />
      <p className="font-medium text-zinc-500 text-xs tracking-wide">Compiling database analytics...</p>
    </div>
  );

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full bg-[#fcfcfc] font-sans pb-12 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Performance Analytics</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Track your procurement volume, spending, and sustainability metrics.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 py-1.5 shadow-sm">
            <Calendar size={14} className="text-zinc-400" />
            <span className="text-xs font-semibold text-zinc-700">Year to Date ({new Date().getFullYear()})</span>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <div key={idx} className={`${kpi.dark ? 'bg-zinc-900 text-white shadow-md' : 'bg-white border border-zinc-200 text-zinc-900 shadow-sm'} rounded-xl p-5 flex flex-col`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${kpi.dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  <kpi.icon size={18} className={kpi.dark ? 'text-green-400' : 'text-zinc-600'} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${kpi.dark ? (kpi.isPositive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10') : (kpi.isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50')}`}>
                  {kpi.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {kpi.trend}
                </div>
              </div>
              <div>
                <h3 className={`text-2xl font-black tracking-tight ${kpi.dark ? 'text-white' : 'text-zinc-900'}`}>{kpi.value}</h3>
                <p className={`text-[11px] font-semibold uppercase tracking-wider mt-1 ${kpi.dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLORFUL BAR CHART SECTION */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 shadow-sm rounded-xl p-6">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-6">Procurement Volume Trends</h3>
            
            {totalProcured === 0 ? (
               <div className="h-64 flex flex-col items-center justify-center text-zinc-400">
                  <BarChart3 size={32} className="mb-2 opacity-50"/>
                  <p className="text-sm font-medium">No order data available yet.</p>
               </div>
            ) : (
              <div className="h-64 flex items-end gap-4 sm:gap-8 pt-4">
                {procurementData.map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center group">
                    <div className="w-full flex flex-col justify-end h-48 relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        {data.value.toLocaleString()} Tons
                      </div>
                      
                      {/* Progressive Gradient Bar */}
                      <div 
                        className={`w-full bg-gradient-to-t ${data.gradient} rounded-t-md shadow-sm opacity-85 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300`}
                        style={{ height: `${data.heightPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-zinc-500 mt-3">{data.month}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MATERIAL BREAKDOWN */}
          <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-6">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-6">Material Breakdown</h3>
            
            {residueBreakdown.length === 0 ? (
               <p className="text-sm text-zinc-500 text-center mt-10">No materials procured.</p>
            ) : (
              <div className="space-y-6">
                {residueBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-zinc-800">{item.name}</span>
                      <span className="text-xs font-bold text-zinc-500">{item.value}% <span className="font-medium ml-1">({item.rawAmount}T)</span></span>
                    </div>
                    <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-zinc-100">
              <button className="w-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm">
                Download Detailed CSV
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}