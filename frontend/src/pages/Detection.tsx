import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Camera, RefreshCw, Sprout, AlertTriangle, CheckCircle2, ChevronRight, Activity, Volume2, Square } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; // 👈 IMPORTED GLOBAL STATE

export default function Detection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ plant_name: string; disease_name: string; advisory: string } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 👈 GRAB GLOBAL LANGUAGE
  const { language } = useLanguage(); 

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop voice if component unmounts
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

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

  const getVoiceLocale = (lang: string) => {
    const map: Record<string, string> = {
      'English': 'en-IN',
      'Hindi': 'hi-IN',
      'Bengali': 'bn-IN',
      'Marathi': 'mr-IN',
      'Punjabi': 'hi-IN', // Fallback
      'Haryanvi': 'hi-IN' // Fallback
    };
    return map[lang] || 'hi-IN';
  };

  const toggleVoice = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getVoiceLocale(language); // 👈 USES GLOBAL LANGUAGE
      utterance.rate = 0.9;
      
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleAnalyze = async () => {
    if (!fileToUpload) return;
    setIsAnalyzing(true);
    setResult(null);

    const processAnalysis = async (lat: string, lng: string) => {
      try {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('latitude', lat);
        formData.append('longitude', lng);
        formData.append('date', new Date().toISOString());
        formData.append('language', language); // 👈 SENDS GLOBAL LANGUAGE TO NODEJS

        const token = localStorage.getItem('af_token') || '';
        const res = await fetch('http://localhost:5000/api/advisory/analyze', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          setResult({ plant_name: data.plant_name, disease_name: data.disease_name, advisory: data.advisory });
        } else {
          alert(data.message || "Failed to analyze crop.");
        }
      } catch (error) {
        alert("Server error. Ensure backend is running.");
      } finally {
        setIsAnalyzing(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => processAnalysis(pos.coords.latitude.toString(), pos.coords.longitude.toString()),
      () => processAnalysis('Unknown', 'Unknown')
    );
  };

  const isHealthy = result?.disease_name.toLowerCase().includes('healthy');

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-12 px-4 sm:px-6">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-5 pt-4">
        <div className="h-14 w-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100 shadow-sm">
          <Activity size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Crop Scan & Advice</h1>
          <p className="text-gray-500 font-medium text-base mt-1">Upload a photo for instant {language} voice advisory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div className={`w-full aspect-square md:aspect-[4/3] rounded-2xl flex flex-col items-center justify-center overflow-hidden mb-6 transition-all ${selectedImage ? 'border-2 border-green-100' : 'border-2 border-dashed border-gray-300 bg-gray-50'}`}>
              {selectedImage ? <img src={selectedImage} alt="Crop" className="w-full h-full object-cover" /> : <UploadCloud size={48} className="text-gray-300" />}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            
            <div className="flex gap-4">
              <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm text-lg transition-colors">
                <Camera size={20} /> Choose Photo
              </button>
            </div>

            <button onClick={handleAnalyze} disabled={!selectedImage || isAnalyzing} className={`w-full mt-4 py-5 rounded-xl flex items-center justify-center gap-3 font-black shadow-lg text-lg transition-all ${!selectedImage ? 'bg-gray-100 text-gray-400' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
              {isAnalyzing ? <><RefreshCw size={24} className="animate-spin" /> Analyzing...</> : <><Activity size={24} /> Get Diagnosis</>}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {result && !isAnalyzing && (
            <div className="bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden h-full flex flex-col">
              <div className="p-8 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Detected Crop</p>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-6">{(result.plant_name || '').replace(/_/g, ' ')}</h2>

                <div className={`p-6 rounded-2xl border-2 flex items-start gap-5 ${isHealthy ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  {isHealthy ? <CheckCircle2 className="text-green-600 mt-1 shrink-0" size={32} /> : <AlertTriangle className="text-red-600 mt-1 shrink-0" size={32} />}
                  <div>
                    <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${isHealthy ? 'text-green-700' : 'text-red-700'}`}>Health Status</p>
                    <p className={`text-2xl font-black ${isHealthy ? 'text-green-900' : 'text-red-900'}`}>{(result.disease_name || '').replace(/_/g, ' ')}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white flex-1 relative">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    Advisory <ChevronRight size={20} className="text-gray-400"/>
                  </h3>
                  
                  <button 
                    onClick={() => toggleVoice(result.advisory)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold shadow-sm transition-all ${isSpeaking ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                  >
                    {isSpeaking ? <Square size={18} fill="currentColor" /> : <Volume2 size={18} />}
                    {isSpeaking ? 'Stop Audio' : `Listen in ${language}`}
                  </button>
                </div>
                
                <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                  {result.advisory}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}