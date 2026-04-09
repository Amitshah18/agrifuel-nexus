import React, { useState, useRef } from 'react';
import { UploadCloud, FileImage, Loader2, AlertTriangle, ShieldAlert, HeartHandshake, FlaskConical, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';

// 1. Updated Interface to match the Gen-AI structured output
interface DiagnosticResult {
  disease: string;
  severity: "High" | "Medium" | "Low";
  confidence: number;
  advisory: {
    precautions: string[];
    care: string[];
    fertilizers: string[];
  };
}

export default function Detection() {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
      setResult(null); 
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleScan = () => {
    if (!image) return;
    setIsScanning(true);
    
    // 2. Mocking the CNN -> Gen-AI Pipeline
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        disease: "Northern Corn Leaf Blight",
        severity: "High",
        confidence: 94.5,
        advisory: {
          precautions: [
            "Avoid overhead irrigation to keep foliage dry.",
            "Rotate crops with non-host plants for the next 1-2 seasons."
          ],
          care: [
            "Remove and destroy heavily infected lower leaves.",
            "Improve field drainage to reduce local humidity levels."
          ],
          fertilizers: [
            "Apply a fungicide containing Mancozeb or Chlorothalonil within 48 hours.",
            "Supplement with Potassium (K) to boost overall plant immunity."
          ]
        }
      });
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Crop Diagnostics</h1>
        <p className="text-gray-600 mt-1">Upload an image for instant CNN disease detection and Gen-AI treatment plans.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Scanner (Takes up 5 columns) */}
        <div className="lg:col-span-5">
          <Card className="shadow-md sticky top-6">
            <CardHeader>
              <CardTitle>Image Scanner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {!image ? (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                    isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <UploadCloud className={`h-12 w-12 mb-4 ${isDragging ? 'text-green-500' : 'text-gray-400'}`} />
                  <p className="font-semibold text-gray-700 text-center">Click or drag image to upload</p>
                  <p className="text-xs text-gray-500 mt-2">Supports JPG, PNG</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-black group">
                  <img src={image} alt="Crop preview" className={`w-full h-64 object-cover transition-opacity ${isScanning ? 'opacity-50' : 'opacity-100'}`} />
                  
                  {isScanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      <div className="w-full h-1 bg-green-500 absolute top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_#22c55e]"></div>
                      <Loader2 className="h-10 w-10 text-white animate-spin mb-2" />
                      <p className="text-white font-medium text-sm">CNN identifying pathogens...</p>
                    </div>
                  )}
                  
                  {!isScanning && (
                    <button 
                      onClick={() => { setImage(null); setResult(null); }}
                      className="absolute top-3 right-3 bg-white/90 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-white transition"
                    >
                      Change Image
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={handleScan}
                disabled={!image || isScanning}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  !image ? 'bg-gray-300 cursor-not-allowed' : 
                  isScanning ? 'bg-green-500 cursor-wait' : 'bg-green-600 hover:bg-green-700 shadow-md'
                }`}
              >
                <FileImage className="h-5 w-5" />
                {isScanning ? 'Processing...' : 'Run Diagnostics'}
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Gen-AI Advisory Report (Takes up 7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !isScanning && (
             <div className="h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-white/50">
               <Info className="h-10 w-10 mb-3 text-gray-300" />
               <p>Upload a leaf image to generate an AI-powered treatment and advisory report.</p>
             </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              
              {/* CNN Identification Result */}
              <Card className="border-l-4 border-l-red-500 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-red-500 uppercase tracking-wider mb-1">Pathogen Identified</p>
                      <CardTitle className="text-3xl text-gray-900">{result.disease}</CardTitle>
                    </div>
                    <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {result.severity} Severity
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">CNN Confidence Score</span>
                      <span className="font-bold text-green-600">{result.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gen-AI Detailed Advisory */}
              <div className="grid grid-cols-1 gap-4">
                
                {/* Immediate Care */}
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-lg mt-1">
                        <HeartHandshake className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-blue-900 text-lg mb-2">Immediate Care</h3>
                        <ul className="space-y-2">
                          {result.advisory.care.map((item, idx) => (
                            <li key={idx} className="text-blue-800 text-sm flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Fertilizers & Treatment */}
                <Card className="bg-emerald-50 border-emerald-100">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                        <FlaskConical className="h-5 w-5 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-emerald-900 text-lg mb-2">Fertilizer & Treatment</h3>
                        <ul className="space-y-2">
                          {result.advisory.fertilizers.map((item, idx) => (
                            <li key={idx} className="text-emerald-800 text-sm flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Precautions */}
                <Card className="bg-amber-50 border-amber-100">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-amber-100 p-2 rounded-lg mt-1">
                        <ShieldAlert className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-900 text-lg mb-2">Future Precautions</h3>
                        <ul className="space-y-2">
                          {result.advisory.precautions.map((item, idx) => (
                            <li key={idx} className="text-amber-800 text-sm flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}} />
    </div>
  );
}