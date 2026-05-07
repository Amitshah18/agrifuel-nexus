import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sprout, CheckCircle2, Circle, AlertTriangle, Activity } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function AdvisoryScreen() {
  const { t } = useTranslation();

  const [tasks, setTasks] = useState([
    { id: 1, text: "Calibrate soil moisture sensors in Sector 4", done: true },
    { id: 2, text: "Prepare drainage systems for Winter Wheat", done: false },
    { id: 3, text: "Apply Potassium Top-Dress to Sweet Corn", done: false }
  ]);

  const activeCrops = [
    { name: "Winter Wheat", stage: "Vegetative Stage", daysPlanted: 42, progress: 35, health: "Excellent" },
    { name: "Sweet Corn", stage: "Silking Phase", daysPlanted: 65, progress: 60, health: "Monitoring" }
  ];

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const pendingTasks = tasks.filter(t => !t.done).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFCFF' }} edges={['top']}>
      
      <View style={{ paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
        <Text style={{ fontSize: 26, fontWeight: '900', color: '#022c22', letterSpacing: -0.5 }}>
          {t('advisory.title', 'Field Intelligence')}
        </Text>
        <Text style={{ fontSize: 13, color: '#64748b', fontWeight: '600', marginTop: 4 }}>
          {t('advisory.subtitle', 'Track crops and manage daily actions.')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Activity size={20} color="#059669" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#0f172a' }}>
                {t('advisory.crop_matrix', 'Crop Matrix')}
              </Text>
            </View>
            <View style={{ backgroundColor: '#ecfdf5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#d1fae5' }}>
              <Text style={{ fontSize: 10, fontWeight: '900', color: '#059669', textTransform: 'uppercase', letterSpacing: 1 }}>{t('common.live', 'Live')}</Text>
            </View>
          </View>

          {activeCrops.map((crop, idx) => (
            <View key={idx} style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={{ padding: 12, borderRadius: 16, backgroundColor: crop.health === 'Excellent' ? '#ecfdf5' : '#fff7ed', marginRight: 12 }}>
                    <Sprout size={24} color={crop.health === 'Excellent' ? '#059669' : '#ea580c'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: '#0f172a', marginBottom: 4 }}>{crop.name}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{crop.stage}</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: '#f8fafc', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#f1f5f9' }}>
                  <Text style={{ fontSize: 11, fontWeight: '900', color: '#334155' }}>{t('advisory.day', 'Day')} {crop.daysPlanted}</Text>
                </View>
              </View>

              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>{t('advisory.growth_progress', 'Growth Progress')}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '900', color: '#059669' }}>{crop.progress}%</Text>
                </View>
                <View style={{ width: '100%', height: 8, backgroundColor: '#f1f5f9', borderRadius: 4 }}>
                  <View style={{ height: 8, backgroundColor: '#059669', borderRadius: 4, width: `${crop.progress}%` }} />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ backgroundColor: '#ffffff', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.03, shadowRadius: 15, elevation: 3 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#0f172a' }}>{t('advisory.action_plan', 'Action Plan')}</Text>
            {pendingTasks > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff7ed', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#ffedd5' }}>
                <AlertTriangle size={12} color="#ea580c" style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 10, fontWeight: '900', color: '#ea580c', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {pendingTasks} {t('common.due', 'Due')}
                </Text>
              </View>
            )}
          </View>

          {tasks.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40, opacity: 0.5 }}>
              <CheckCircle2 size={48} color="#94a3b8" style={{ marginBottom: 12 }} />
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>{t('advisory.all_caught_up', 'All caught up!')}</Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {tasks.map((task) => (
                <TouchableOpacity 
                  key={task.id}
                  onPress={() => toggleTask(task.id)}
                  activeOpacity={0.7}
                  style={{ 
                    flexDirection: 'row', 
                    alignItems: 'flex-start', 
                    padding: 16, 
                    borderRadius: 20, 
                    backgroundColor: task.done ? '#f8fafc' : '#ffffff',
                    borderWidth: 1,
                    borderColor: task.done ? 'transparent' : '#e2e8f0',
                    elevation: task.done ? 0 : 1,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.02,
                    shadowRadius: 5
                  }}
                >
                  <View style={{ marginTop: 2, marginRight: 12 }}>
                    {task.done ? <CheckCircle2 color="#059669" size={20} /> : <Circle color="#cbd5e1" size={20} />}
                  </View>
                  <Text style={{ 
                    flex: 1, 
                    fontSize: 15, 
                    fontWeight: '700', 
                    color: task.done ? '#94a3b8' : '#334155',
                    textDecorationLine: task.done ? 'line-through' : 'none',
                    lineHeight: 22
                  }}>
                    {task.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}