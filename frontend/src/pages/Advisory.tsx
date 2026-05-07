import React, { useState, useRef, useEffect } from 'react';
import { Sprout, CheckCircle2, ArrowRight, Sparkles, Activity, Loader2, AlertTriangle, Circle, UploadCloud, Camera, RefreshCw, Volume2, Square, ShieldAlert, Leaf, Droplets, Lightbulb, X, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';

export default function Advisory() {
  const { t, i18n } = useTranslation();
  
  // --- DETECTION & AI STATE ---
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ plant_name: string; disease_name: string; advisory: string } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ADVISORY STATE ---
  const [tasks, setTasks] = useState([
    { id: 1, text: "Calibrate soil moisture sensors in Sector 4", done: true },
    { id: 2, text: "Prepare drainage systems for Winter Wheat", done: false }
  ]);

  const activeCrops = [
    { name: "Winter Wheat", stage: "Vegetative", daysPlanted: 42, progress: 35, health: "Excellent" },
    { name: "Sweet Corn", stage: "Silking", daysPlanted: 65, progress: 60, health: "Monitoring" }
  ];

  // --- LOGIC: SPEECH SYNTHESIS ---
  useEffect(() => { return () => window.speechSynthesis.cancel(); }, []);

  const getVoiceLocale = (lang: string) => {
    const map: Record<string, string> = { 'English': 'en-IN', 'Hindi': 'hi-IN', 'Bengali': 'bn-IN', 'Marathi': 'mr-IN', 'Punjabi': 'hi-IN', 'Haryanvi': 'hi-IN' };
    return map[lang] || 'hi-IN';
  };

  const toggleVoice = () => {
    if (!result) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToSpeak = `${result.plant_name.replace(/_/g, ' ')}. ${result.disease_name.replace(/_/g, ' ')}. ${result.advisory}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = getVoiceLocale(i18n.language);
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // --- LOGIC: IMAGE UPLOAD & API CALL ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFileToUpload(file);
      setResult(null);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const resetScan = () => {
    setResult(null);
    setSelectedImage(null);
    setFileToUpload(null);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleAnalyze = async () => {
    if (!fileToUpload) return;
    setIsAnalyzing(true);
    setResult(null);

    const processAnalysis = async (lat: string, lng: string) => {
      try {
        const formData = new FormData();
        formData.append('language', i18n.language || 'English'); 
        formData.append('latitude', lat);
        formData.append('longitude', lng);
        formData.append('date', new Date().toISOString());
        
        // Append the file LAST
        formData.append('file', fileToUpload);

        const token = localStorage.getItem('af_token') || '';
        
        // FIX: Using backticks ` ` here instead of single quotes ' ' for template literals!
        const res = await fetch(`${api.baseURL}/api/advisory/analyze`, {
          method: 'POST', 
          headers: { 'Authorization': `Bearer ${token}` }, 
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          setResult({ plant_name: data.plant_name, disease_name: data.disease_name, advisory: data.advisory });
          setTasks(prev => [{ id: Date.now(), text: `Inspect ${data.plant_name.replace(/_/g, ' ')} for ${data.disease_name.replace(/_/g, ' ')}`, done: false }, ...prev]);
        } else alert(data.message || "Failed to analyze crop.");
      } catch (error) { alert("Server error. Ensure backend is running."); } 
      finally { setIsAnalyzing(false); }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => processAnalysis(pos.coords.latitude.toString(), pos.coords.longitude.toString()),
        () => processAnalysis('Unknown', 'Unknown')
      );
    } else {
      processAnalysis('Unknown', 'Unknown');
    }
  };

  const toggleTask = (id: number) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const isHealthy = result?.disease_name.toLowerCase().includes('healthy');

  // --- UI PARSER & THEMES ---
  const parsedAdvisoryPoints = result ? result.advisory.split(/(?<=\.)\s+/).filter(p => p.trim().length > 10) : [];
  
  const boxThemes = [
    { bg: "bg-[#FFF4E5]", border: "border-[#FFB020]", text: "text-[#8C5000]", icon: <Lightbulb size={18} /> },
    { bg: "bg-[#E6F3FF]", border: "border-[#0081FF]", text: "text-[#003B73]", icon: <Droplets size={18} /> },
    { bg: "bg-[#F3E8FF]", border: "border-[#8A2BE2]", text: "text-[#3D0075]", icon: <Sparkles size={18} /> },
    { bg: "bg-[#E5F0E1]", border: "border-[#16A34A]", text: "text-[#1A2E19]", icon: <Leaf size={18} /> },
    { bg: "bg-[#FEF2F2]", border: "border-[#EF4444]", text: "text-[#991B1B]", icon: <Activity size={18} /> }
  ];

  // Dynamic Step Tracker Logic
  const currentStep = result ? 3 : isAnalyzing ? 2 : selectedImage ? 2 : 1;

  return (
    <div className="min-h-[calc(100vh-64px)] w-full font-sans antialiased bg-[#F4F7F4] p-1 md:p-2">
      <div className="max-w-[1400px] mx-auto space-y-4">
        
        {/* HEADER & DYNAMIC STEPS */}
        <div className="px-2 pt-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-black text-[#1A2E19] tracking-tight">Farming Advisory</h1>
            <p className="text-[#5C715A] font-medium text-xs mt-0.5">Visual diagnostics & field intelligence.</p>
          </div>

          {/* Dynamic 3-Step Flow */}
          <div className="hidden sm:flex items-center gap-3">
            <div className={`flex items-center gap-1.5 transition-opacity ${currentStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${currentStep >= 1 ? 'bg-[#16a34a] text-white' : 'bg-[#DCE7D5] text-[#1A2E19]'}`}>1</span>
              <span className="text-[10px] font-black text-[#1A2E19] uppercase tracking-widest">Scan</span>
            </div>
            <div className={`w-6 h-[2px] transition-colors ${currentStep >= 2 ? 'bg-[#16a34a]' : 'bg-[#DCE7D5]'}`}></div>
            <div className={`flex items-center gap-1.5 transition-opacity ${currentStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${currentStep >= 2 ? 'bg-[#16a34a] text-white' : 'bg-[#DCE7D5] text-[#1A2E19]'}`}>2</span>
              <span className="text-[10px] font-black text-[#1A2E19] uppercase tracking-widest">AI Analysis</span>
            </div>
            <div className={`w-6 h-[2px] transition-colors ${currentStep >= 3 ? 'bg-[#16a34a]' : 'bg-[#DCE7D5]'}`}></div>
            <div className={`flex items-center gap-1.5 transition-opacity ${currentStep >= 3 ? 'opacity-100' : 'opacity-40'}`}>
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${currentStep >= 3 ? 'bg-[#16a34a] text-white' : 'bg-[#DCE7D5] text-[#1A2E19]'}`}>3</span>
              <span className="text-[10px] font-black text-[#1A2E19] uppercase tracking-widest">Action</span>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          
          {/* ==================================================== */}
          {/* LEFT COLUMN: DETECTION & AI REPORT (7 Cols)         */}
          {/* ==================================================== */}
          <div className="xl:col-span-7 flex flex-col gap-5 h-full">
            
            {!result ? (
              // STATE 1: UPLOAD UI
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E9DF] flex-1 flex flex-col">
                
                {/* Header & Instructions */}
                <div className="mb-4">
                  <h2 className="text-lg font-black text-[#1A2E19] flex items-center gap-2 mb-1.5">
                    <ImageIcon size={18} className="text-[#16a34a]"/> Field Vision Scanner
                  </h2>
                  <p className="text-xs text-[#5C715A] font-medium leading-relaxed max-w-md">
                    Upload or capture a clear photo of the affected crop leaf to instantly identify diseases and receive an AI-driven treatment plan.
                  </p>
                </div>

                {/* Buttons Moved to Top */}
                <div className="flex gap-3 mb-5">
                  <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-[#F8FAF8] border border-[#E5E9DF] hover:border-[#A3C49D] text-[#1A2E19] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
                    <Camera size={18} /> {selectedImage ? 'Change' : 'Camera'}
                  </button>
                  <button onClick={handleAnalyze} disabled={!selectedImage || isAnalyzing} className={`flex-[2] py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-all text-sm ${!selectedImage ? 'bg-[#E5E9DF] text-[#8A9A86]' : 'bg-[#1A2E19] hover:bg-[#2B3A28] text-white active:scale-95'}`}>
                    {isAnalyzing ? <><RefreshCw size={18} className="animate-spin text-[#A3C49D]" /> Processing Matrix...</> : <><Sparkles size={18} className="text-[#A3C49D]" /> Analyze Crop</>}
                  </button>
                </div>

                {/* Upload Image Area */}
                <div 
                  onClick={() => !selectedImage && fileInputRef.current?.click()}
                  className={`w-full flex-1 min-h-[220px] rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all ${selectedImage ? 'border border-[#E5E9DF]' : 'border-2 border-dashed border-[#A3C49D] bg-[#F8FAF8] hover:bg-[#F0F4EF] cursor-pointer'}`}
                >
                  {selectedImage ? <img src={selectedImage} alt="Crop" className="w-full h-full object-cover" /> : 
                    <div className="text-center">
                      <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-[#E5E9DF]">
                        <UploadCloud size={28} className="text-[#A3C49D]" />
                      </div>
                      <span className="text-sm font-bold text-[#5C715A]">Tap to upload leaf image</span>
                    </div>
                  }
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                
              </div>
            ) : (
              // STATE 2: DIAGNOSTIC REPORT (Replaces Upload UI)
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E9DF] flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-500 max-h-full">
                
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#F4F7F4]">
                  <button onClick={resetScan} className="flex items-center gap-1.5 text-xs font-bold text-[#5C715A] hover:text-[#1A2E19] bg-[#F8FAF8] px-3 py-1.5 rounded-lg border border-[#E5E9DF] transition-colors">
                    <X size={14} /> Close Report
                  </button>
                  <button onClick={toggleVoice} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all border ${isSpeaking ? 'bg-red-50 text-red-700 border-red-200' : 'bg-[#F0FDF4] text-[#16a34a] border-[#DCFCE7]'}`}>
                    {isSpeaking ? <Square size={12} fill="currentColor" /> : <Volume2 size={14} />} {isSpeaking ? 'Stop Audio' : `Read in ${i18n.language}`}
                  </button>
                </div>

                {/* Identity Card */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-[#E5E9DF]">
                    <img src={selectedImage || ''} alt="Scanned Crop" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#8A9A86]">Detected Crop</span>
                    <h2 className="text-xl font-black text-[#1A2E19] leading-tight mb-1">{(result.plant_name || '').replace(/_/g, ' ')}</h2>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded shadow-sm border ${isHealthy ? 'bg-[#F0FDF4] border-[#DCFCE7] text-[#15803d]' : 'bg-[#FEF2F2] border-[#FEE2E2] text-red-800'}`}>
                      {isHealthy ? <CheckCircle2 size={12} /> : <ShieldAlert size={12} />}
                      <span className="text-[10px] font-bold uppercase tracking-wider">{(result.disease_name || '').replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Point-Wise Section (WITH SCROLLING) */}
                <div className="flex-1 flex flex-col justify-start">
                  <h3 className="text-sm font-black text-[#1A2E19] mb-3 flex items-center gap-2"><Sparkles size={16} className="text-[#16a34a]"/> Recommendations</h3>
                  
                  <div className="space-y-3 overflow-y-auto max-h-[300px] hide-scrollbar pr-1 pb-2">
                    {parsedAdvisoryPoints.map((point, idx) => {
                      const theme = boxThemes[idx % boxThemes.length];
                      return (
                        <div key={idx} className={`${theme.bg} ${theme.border} border-l-[3px] p-3.5 rounded-xl flex items-start gap-3 shadow-sm`}>
                          <div className={`mt-[2px] shrink-0 ${theme.text}`}>{theme.icon}</div>
                          <p className={`text-xs font-bold leading-relaxed ${theme.text}`}>
                            {point}.
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ==================================================== */}
          {/* RIGHT COLUMN: CROP MATRIX & TASKS (5 Cols)          */}
          {/* ==================================================== */}
          <div className="xl:col-span-5 flex flex-col gap-4 h-full">
            
            {/* Active Crop Matrix */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E9DF]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-black text-[#1A2E19] flex items-center gap-2">
                  <Activity size={18} className="text-[#16a34a]" /> Crop Matrix
                </h3>
                <span className="text-[9px] font-bold text-[#16a34a] uppercase tracking-widest bg-[#F0FDF4] px-2 py-1 rounded border border-[#DCFCE7]">Live</span>
              </div>
              
              <div className="space-y-3">
                {activeCrops.map((crop, idx) => (
                  <div key={idx} className="bg-[#F8FAF8] border border-[#E5E9DF] p-4 rounded-2xl transition-colors hover:border-[#DCE7D5]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${crop.health === 'Excellent' ? 'bg-[#E5F0E1] text-[#16a34a]' : 'bg-orange-50 text-orange-600'}`}>
                          <Sprout size={16} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1A2E19] text-sm leading-tight">{crop.name}</h4>
                          <p className="text-[9px] text-[#5C715A] mt-0.5 font-bold uppercase tracking-widest">{crop.stage}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-[#2B3A28] bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">Day {crop.daysPlanted}</span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[8px] font-bold text-[#8A9A86] uppercase tracking-wider">Progress</span>
                        <span className="text-[9px] font-black text-[#16a34a]">{crop.progress}%</span>
                      </div>
                      <div className="w-full bg-[#E5E9DF] rounded-full h-1.5">
                        <div className="bg-[#16a34a] h-1.5 rounded-full relative" style={{ width: `${crop.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Manager */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E9DF] flex-1 flex flex-col min-h-[250px]">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-black text-[#1A2E19]">Action Plan</h3>
                <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider border border-orange-100 flex items-center gap-1">
                  <AlertTriangle size={10}/> {tasks.filter(t => !t.done).length}
                </span>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto max-h-[220px] hide-scrollbar">
                {tasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-50">
                    <CheckCircle2 size={32} className="text-[#8A9A86] mb-2" />
                    <p className="text-sm font-bold text-[#1A2E19]">All caught up!</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div 
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-3.5 rounded-2xl transition-all cursor-pointer flex gap-3 items-start group ${task.done ? 'bg-[#F8FAF8] border border-transparent opacity-60' : 'bg-white border border-[#E5E9DF] hover:border-[#A3C49D] shadow-sm'}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {task.done ? <CheckCircle2 className="text-[#16a34a]" size={16} /> : <Circle className="text-[#DCE7D5] group-hover:text-[#A3C49D] transition-colors" size={16} />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold leading-relaxed ${task.done ? 'text-[#8A9A86] line-through' : 'text-[#1A2E19]'}`}>{task.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}