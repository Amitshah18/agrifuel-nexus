import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Leaf, IndianRupee, Package, ArrowUpRight, ArrowDownRight, BarChart3, Calendar } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../src/services/api';

export default function BusinessAnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const res = await api.get('/transactions/buyer/orders');
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  const totalSpend = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalProcured = orders.reduce((sum, order) => sum + (order.listing?.quantity || 0), 0);
  const avgPrice = totalProcured > 0 ? totalSpend / totalProcured : 0;
  const co2Offset = totalProcured * 1.5;

  const formatCurrency = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString()}`;
  };

  const kpis = [
    { label: t('analytics.total_spend', "Total Spend (YTD)"), value: formatCurrency(totalSpend), trend: "+12.5%", isPositive: true, icon: IndianRupee, dark: false },
    { label: t('analytics.biomass_procured', "Biomass Procured"), value: `${totalProcured.toLocaleString()} T`, trend: "+8.2%", isPositive: true, icon: Package, dark: false },
    { label: t('analytics.avg_price', "Avg Price per Ton"), value: `₹${Math.round(avgPrice).toLocaleString()}`, trend: "-2.4%", isPositive: false, icon: TrendingUp, dark: false },
    { label: t('analytics.co2_offset', "Estimated CO2 Offset"), value: `${Math.round(co2Offset).toLocaleString()} T`, trend: "+15.3%", isPositive: true, icon: Leaf, dark: true },
  ];

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const monthlyDataMap = new Map<string, number>();

  for(let i = 5; i >= 0; i--) {
      let d = new Date();
      d.setMonth(currentMonth - i);
      monthlyDataMap.set(monthNames[d.getMonth()], 0);
  }

  orders.forEach(order => {
      const d = new Date(order.createdAt || Date.now()); 
      const m = monthNames[d.getMonth()];
      if(monthlyDataMap.has(m)) {
          monthlyDataMap.set(m, monthlyDataMap.get(m)! + (order.listing?.quantity || 0));
      }
  });

  const maxVolume = Math.max(...Array.from(monthlyDataMap.values()), 1);

  const barColors = ["#2563eb", "#4f46e5", "#8b5cf6", "#d946ef", "#f43f5e", "#f97316"];
  const procurementData = Array.from(monthlyDataMap.entries()).map(([month, value], idx) => ({
      month, value,
      heightPercentage: Math.max((value / maxVolume) * 100, 2),
      color: barColors[idx % barColors.length]
  }));

  const residueMap = new Map<string, number>();
  orders.forEach(order => {
      const type = order.listing?.residueType || 'Unknown';
      const qty = order.listing?.quantity || 0;
      residueMap.set(type, (residueMap.get(type) || 0) + qty);
  });

  const breakdownColors = ["#3b82f6", "#10b981", "#a855f7", "#f59e0b", "#f43f5e", "#06b6d4"];
  const residueBreakdown = Array.from(residueMap.entries()).map(([name, value], idx) => ({
      name,
      value: totalProcured > 0 ? Math.round((value / totalProcured) * 100) : 0,
      color: breakdownColors[idx % breakdownColors.length],
      rawAmount: value
  })).sort((a, b) => b.value - a.value);

  if (loading) return <View style={{ flex: 1, backgroundColor: '#FAFCFF', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#059669" /></View>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFCFF' }} edges={['top']}>
      
      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 26, fontWeight: '900', color: '#022c22', letterSpacing: -1 }}>{t('tabs.analytics', 'Performance Analytics')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
            <Calendar size={12} color="#64748b" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 10, fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>YTD</Text>
          </View>
        </View>
        <Text style={{ fontSize: 13, color: '#64748b', fontWeight: '600' }}>Track your procurement volume and sustainability metrics.</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        {/* KPI Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 }}>
          {kpis.map((kpi, idx) => (
            <View key={idx} style={{ width: '48%', backgroundColor: kpi.dark ? '#022c22' : '#ffffff', borderRadius: 24, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: kpi.dark ? '#064e3b' : '#f1f5f9', elevation: kpi.dark ? 5 : 2, shadowColor: kpi.dark ? '#064e3b' : '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <View style={{ backgroundColor: kpi.dark ? '#064e3b' : '#f8fafc', padding: 8, borderRadius: 12 }}>
                  <kpi.icon size={16} color={kpi.dark ? '#a7f3d0' : '#475569'} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: kpi.dark ? (kpi.isPositive ? 'rgba(52, 211, 153, 0.2)' : 'rgba(248, 113, 113, 0.2)') : (kpi.isPositive ? '#ecfdf5' : '#fef2f2'), paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                  {kpi.isPositive ? <ArrowUpRight size={10} color={kpi.dark ? '#34d399' : '#059669'} /> : <ArrowDownRight size={10} color={kpi.dark ? '#f87171' : '#dc2626'} />}
                  <Text style={{ fontSize: 10, fontWeight: '900', color: kpi.dark ? (kpi.isPositive ? '#34d399' : '#f87171') : (kpi.isPositive ? '#059669' : '#dc2626') }}>{kpi.trend}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 22, fontWeight: '900', color: kpi.dark ? '#ffffff' : '#0f172a', letterSpacing: -0.5, marginBottom: 4 }}>{kpi.value}</Text>
              <Text style={{ fontSize: 9, fontWeight: '800', color: kpi.dark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{kpi.label}</Text>
            </View>
          ))}
        </View>

        {/* Volume Chart */}
        <View style={{ backgroundColor: '#ffffff', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: '#f1f5f9', elevation: 3, marginBottom: 24 }}>
          <Text style={{ fontSize: 12, fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24 }}>Procurement Volume Trends</Text>
          
          {totalProcured === 0 ? (
            <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={32} color="#cbd5e1" style={{ marginBottom: 12 }} />
              <Text style={{ color: '#94a3b8', fontWeight: '600' }}>No order data available yet.</Text>
            </View>
          ) : (
            <View style={{ height: 220, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 16 }}>
              {procurementData.map((data, idx) => (
                <View key={idx} style={{ flex: 1, alignItems: 'center' }}>
                  <View style={{ width: '100%', height: 180, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <View style={{ width: '60%', height: `${data.heightPercentage}%`, backgroundColor: data.color, borderTopLeftRadius: 8, borderTopRightRadius: 8, opacity: 0.9 }} />
                  </View>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', marginTop: 12, textTransform: 'uppercase' }}>{data.month}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Material Breakdown */}
        <View style={{ backgroundColor: '#ffffff', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: '#f1f5f9', elevation: 3 }}>
          <Text style={{ fontSize: 12, fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24 }}>Material Breakdown</Text>
          
          {residueBreakdown.length === 0 ? (
            <Text style={{ color: '#94a3b8', fontWeight: '600', textAlign: 'center', marginVertical: 24 }}>No materials procured.</Text>
          ) : (
            <View style={{ gap: 20 }}>
              {residueBreakdown.map((item, idx) => (
                <View key={idx}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>{item.name}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '900', color: '#64748b' }}>{item.value}% <Text style={{ fontWeight: '600' }}>({item.rawAmount}T)</Text></Text>
                  </View>
                  <View style={{ width: '100%', height: 8, backgroundColor: '#f1f5f9', borderRadius: 4 }}>
                    <View style={{ height: 8, backgroundColor: item.color, borderRadius: 4, width: `${item.value}%` }} />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}