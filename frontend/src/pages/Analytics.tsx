import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, IndianRupee, Package, Calendar, ArrowUpRight, Leaf, Activity, Sparkles } from 'lucide-react';
import { api } from '../lib/api';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalRevenue: 0,
    revenueGrowth: 14.5, // Trend mock
    totalVolume: 0,
    pendingEscrow: 0,
    avgPrice: 0,
    monthlySales: [] as { month: string; revenue: number; volume: number }[],
    residueBreakdown: [] as { name: string; percentage: number; volume: number; color: string }[]
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const orders = await api.get('/api/transactions/farmer/orders');
        
        // 1. Separate by status
        const completedOrders = orders.filter((o: any) => o.status === 'completed');
        const escrowOrders = orders.filter((o: any) => o.status === 'funds_in_escrow');

        // 2. Calculate Top Line KPIs
        const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
        const pendingEscrow = escrowOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
        const totalVolume = completedOrders.reduce((sum: number, o: any) => sum + (o.listing?.quantity || 0), 0);
        const avgPrice = totalVolume > 0 ? Math.round(totalRevenue / totalVolume) : 0;

        // 3. Compute Monthly Data (Last 6 Months)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = new Date().getMonth();
        const monthlyDataMap = new Map();

        // Initialize 6 empty months so chart doesn't break if there are gaps
        for(let i = 5; i >= 0; i--) {
            let d = new Date();
            d.setMonth(currentMonth - i);
            monthlyDataMap.set(monthNames[d.getMonth()], { revenue: 0, volume: 0 });
        }

        completedOrders.forEach((order: any) => {
            const d = new Date(order.createdAt || Date.now());
            const m = monthNames[d.getMonth()];
            if(monthlyDataMap.has(m)) {
                const current = monthlyDataMap.get(m);
                monthlyDataMap.set(m, {
                   revenue: current.revenue + (order.totalAmount || 0),
                   volume: current.volume + (order.listing?.quantity || 0)
                });
            }
        });

        const monthlySales = Array.from(monthlyDataMap.entries()).map(([month, vals]) => ({
            month,
            revenue: vals.revenue,
            volume: vals.volume
        }));

        // 4. Compute Breakdown
        const residueMap = new Map();
        completedOrders.forEach((order: any) => {
            const type = order.listing?.residueType || 'Unknown';
            const qty = order.listing?.quantity || 0;
            residueMap.set(type, (residueMap.get(type) || 0) + qty);
        });

        const breakdownColors = ['bg-[#16a34a]', 'bg-[#eab308]', 'bg-[#3b82f6]', 'bg-[#a855f7]', 'bg-[#f97316]'];
        const residueBreakdown = Array.from(residueMap.entries()).map(([name, volume], idx) => ({
            name,
            volume,
            percentage: totalVolume > 0 ? Math.round((volume / totalVolume) * 100) : 0,
            color: breakdownColors[idx % breakdownColors.length]
        })).sort((a, b) => b.volume - a.volume);

        setData({
           totalRevenue,
           revenueGrowth: 14.5,
           totalVolume,
           pendingEscrow,
           avgPrice,
           monthlySales,
           residueBreakdown
        });

      } catch (error) {
        console.error("Failed to load analytics data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-10 flex justify-center items-center h-[50vh] font-black tracking-widest uppercase text-[#8A9A86] animate-pulse">Loading Analytics...</div>;
  }

  // Find max revenue for scaling the bar chart (prevent division by zero)
  const maxRevenue = Math.max(...data.monthlySales.map(m => m.revenue), 1);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full font-sans antialiased bg-[#F4F7F4] p-2 md:p-4 pb-12">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2 pt-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#1A2E19] tracking-tight">Performance</h1>
            <p className="text-[#5C715A] font-medium text-sm mt-1">Track your revenue, sales volume, and market trends.</p>
          </div>
          <div className="bg-white border border-[#E5E9DF] px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
            <Calendar size={16} className="text-[#8A9A86]" />
            <span className="text-xs font-bold text-[#1A2E19]">Last 6 Months</span>
          </div>
        </div>

        {/* ==================================================== */}
        {/* TOP STATS ROW (4 Cols)                               */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Stat 1: Total Revenue */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5E9DF] shadow-sm relative overflow-hidden group hover:border-[#A3C49D] transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><IndianRupee size={100} className="text-[#16a34a] transform rotate-12 translate-x-4 -translate-y-4"/></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="bg-[#F0FDF4] p-2.5 rounded-xl text-[#16a34a] border border-[#DCFCE7]"><IndianRupee size={20} /></div>
              <span className="flex items-center gap-1 text-[10px] font-black text-[#15803d] bg-[#DCFCE7] px-2 py-1 rounded-md uppercase tracking-widest"><TrendingUp size={12}/> +{data.revenueGrowth}%</span>
            </div>
            <p className="text-[10px] font-black text-[#8A9A86] uppercase tracking-widest mb-1">Total Earnings</p>
            <h3 className="text-3xl font-black text-[#1A2E19] tracking-tighter relative z-10">₹{(data.totalRevenue / 1000).toFixed(1)}k</h3>
          </div>

          {/* Stat 2: Total Volume */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5E9DF] shadow-sm relative overflow-hidden group hover:border-[#DCE7D5] transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="bg-[#F8FAF8] p-2.5 rounded-xl text-[#5C715A] border border-[#E5E9DF]"><Package size={20} /></div>
            </div>
            <p className="text-[10px] font-black text-[#8A9A86] uppercase tracking-widest mb-1">Volume Sold</p>
            <div className="flex items-baseline gap-1 relative z-10">
              <h3 className="text-3xl font-black text-[#1A2E19] tracking-tighter">{data.totalVolume}</h3>
              <span className="text-sm font-bold text-[#8A9A86]">Tons</span>
            </div>
          </div>

          {/* Stat 3: Escrow */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5E9DF] shadow-sm relative overflow-hidden group hover:border-orange-200 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600 border border-orange-100"><Activity size={20} /></div>
            </div>
            <p className="text-[10px] font-black text-[#8A9A86] uppercase tracking-widest mb-1">Pending in Escrow</p>
            <h3 className="text-3xl font-black text-[#1A2E19] tracking-tighter relative z-10">₹{(data.pendingEscrow / 1000).toFixed(1)}k</h3>
          </div>

          {/* Stat 4: Avg Price */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5E9DF] shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 border border-blue-100"><BarChart3 size={20} /></div>
            </div>
            <p className="text-[10px] font-black text-[#8A9A86] uppercase tracking-widest mb-1">Avg Sale Price</p>
            <div className="flex items-baseline gap-1 relative z-10">
              <h3 className="text-3xl font-black text-[#1A2E19] tracking-tighter">₹{(data.avgPrice).toLocaleString()}</h3>
              <span className="text-xs font-bold text-[#8A9A86]">/Ton</span>
            </div>
          </div>

        </div>

        {/* ==================================================== */}
        {/* MAIN CHART AREA (Full Width)                         */}
        {/* ==================================================== */}
        <div className="bg-white border border-[#E5E9DF] rounded-[2rem] p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#1A2E19] p-2 rounded-xl text-[#A3C49D]"><TrendingUp size={20} /></div>
              <h2 className="text-xl font-black text-[#1A2E19]">Revenue History</h2>
            </div>
            <span className="text-[10px] font-black text-[#5C715A] bg-[#F8FAF8] border border-[#E5E9DF] px-3 py-1.5 rounded-md uppercase tracking-widest">
              Monthly Overview
            </span>
          </div>

          {data.totalRevenue === 0 ? (
             <div className="h-[280px] w-full flex flex-col items-center justify-center text-[#8A9A86]">
                <BarChart3 size={32} className="mb-2 opacity-50"/>
                <p className="text-sm font-bold uppercase tracking-widest">No sales data yet</p>
             </div>
          ) : (
            <div className="h-[280px] w-full flex items-end justify-between gap-2 sm:gap-4 relative pt-6">
              
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-full border-t border-dashed border-[#E5E9DF] h-0"></div>
                ))}
              </div>

              {/* Bars */}
              {data.monthlySales.map((item, idx) => {
                const heightPercent = `${Math.max((item.revenue / maxRevenue) * 100, 2)}%`; // Min 2% so empty months still show a notch
                const isCurrent = idx === data.monthlySales.length - 1;
                
                return (
                  <div key={item.month} className="relative flex-1 flex flex-col items-center group h-full justify-end z-10">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-12 bg-[#1A2E19] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xl transition-all duration-200 pointer-events-none flex flex-col items-center whitespace-nowrap">
                      ₹{(item.revenue).toLocaleString()}
                      <span className="text-[9px] text-[#A3C49D]">{item.volume} Tons</span>
                      <div className="absolute -bottom-1 w-2 h-2 bg-[#1A2E19] transform rotate-45"></div>
                    </div>
                    
                    {/* Bar */}
                    <div 
                      className={`w-full max-w-[60px] rounded-t-xl transition-all duration-500 ease-out group-hover:brightness-110 cursor-pointer
                        ${isCurrent ? 'bg-gradient-to-t from-[#16a34a] to-[#4ade80] shadow-[0_0_15px_rgba(22,163,74,0.3)]' : 'bg-gradient-to-t from-[#DCE7D5] to-[#EAEFE8] group-hover:from-[#A3C49D] group-hover:to-[#C8D8BE]'}
                      `}
                      style={{ height: heightPercent }}
                    ></div>
                    
                    {/* X-Axis Label */}
                    <span className={`mt-3 text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-[#16a34a]' : 'text-[#8A9A86]'}`}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ==================================================== */}
        {/* BOTTOM AREA (Bento Split 5/7)                        */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Market Insights / AI Predictions (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1A2E19] to-[#2B3A28] rounded-[2rem] p-6 md:p-8 shadow-sm text-white relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Sparkles size={120} /></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="bg-[#A3C49D]/20 p-2.5 rounded-xl text-[#A3C49D] border border-[#A3C49D]/30"><Sparkles size={20} /></div>
              <h2 className="text-xl font-black">AI Market Insights</h2>
            </div>

            <div className="space-y-4 relative z-10 flex-1">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-[#A3C49D] uppercase tracking-widest">Opportunity</span>
                  <ArrowUpRight size={14} className="text-[#4ade80]"/>
                </div>
                <p className="text-sm font-medium leading-relaxed">Rice Husk demand is peaking. Refineries in your district are projected to increase buying prices by <span className="font-bold text-[#4ade80]">8-10%</span> next week.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-orange-300 uppercase tracking-widest">Advisory</span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-gray-300">Wait to list Wheat Straw. Excess market supply has temporarily driven prices down.</p>
              </div>
            </div>
          </div>

          {/* Right: Residue Breakdown (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E5E9DF] rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#F4F7F4] p-2.5 rounded-xl text-[#5C715A] border border-[#E5E9DF]"><Leaf size={20} /></div>
              <h2 className="text-xl font-black text-[#1A2E19]">Sales by Residue Type</h2>
            </div>

            {data.residueBreakdown.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-[#8A9A86] text-sm font-bold uppercase tracking-widest">
                  No sales yet
                </div>
            ) : (
              <div className="flex-1 space-y-6 flex flex-col justify-center">
                {data.residueBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-black text-[#1A2E19] tracking-tight">{item.name}</span>
                      <div className="text-right">
                        <span className="text-sm font-black text-[#1A2E19]">{item.percentage}%</span>
                        <span className="text-[10px] text-[#8A9A86] font-bold ml-1 uppercase">({item.volume}T)</span>
                      </div>
                    </div>
                    {/* Custom Progress Bar */}
                    <div className="w-full bg-[#F4F7F4] rounded-full h-3 border border-[#E5E9DF] overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.color} relative overflow-hidden transition-all duration-1000`} 
                        style={{ width: `${item.percentage}%` }}
                      >
                        {/* Shine effect inside bar */}
                        <div className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}