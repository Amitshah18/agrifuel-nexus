import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import farmImg from '@/assets/homePic.png';
import agrifuelLogo from '@/assets/agrifuel_nexus_logo_no-background.png'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/Card';
import { ArrowRight, Leaf, Brain, TrendingUp, ShieldCheck, Zap, Globe, ChevronRight, CheckCircle2, Package, Star, Quote, HelpCircle, Scan, BellRing, WifiOff, Apple, Play } from "lucide-react";

export default function Home() {
    const [isScrolled, setIsScrolled] = useState(false);

    // Track scroll position to toggle navbar glass effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative w-full font-sans antialiased bg-[#FAFCFF] overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
            
            {/* 1. DYNAMIC GLASSMORPHIC NAVBAR */}
            <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-in-out ${
                isScrolled 
                    ? 'bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-[0_2px_20px_rgb(0,0,0,0.02)]' 
                    : 'bg-transparent border-transparent pt-2'
            }`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div>
                            <img
                                src={agrifuelLogo}
                                alt='logo'
                                className="h-18 w-18" 
                            />
                        </div>
                        <span className="font-extrabold text-3xl tracking-tight text-slate-900">AgriFuel Nexus</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors hidden md:block">
                            Sign In
                        </Link>
                        <Link to="/signup" className="bg-[#0f172a] hover:bg-slate-800 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-95 flex items-center gap-2">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* 2. HERO SECTION (Opaque Image Background + Glassy Overlay) */}
            <section className="relative w-full min-h-[95vh] pt-32 pb-16 lg:pt-32 lg:pb-24 overflow-hidden flex items-center">
                
                {/* Background Image with Opaque Glassy Wash */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={farmImg}
                        alt="Background"
                        className="w-full h-full object-cover opacity-60 scale-105"
                    />
                    <div className="absolute inset-0 backdrop-blur-[8px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 w-full mt-10">
                    
                    {/* Left Text Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left relative z-10">
                        <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-emerald-100">
                            <Zap size={14} className="text-emerald-500" /> The Future of Agri-Tech
                        </span>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-slate-900 leading-[1.1]">
                            Farm Smarter. <br/>
                            <span className="text-emerald-500">Earn More.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                            Stop burning residue. Our SaaS platform empowers farmers with AI crop diagnostics and connects you directly to industrial biofuel buyers.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#059669] text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:bg-[#047857] hover:-translate-y-0.5 transition-all duration-300">
                                Start Your Journey <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Hero Image (Crisp and Framed) */}
                    <div className="w-full lg:w-1/2 relative z-10">
                        <div className="absolute inset-0 bg-emerald-400 opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
                        <div className="relative bg-white/50 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
                            <img 
                                src={farmImg}
                                alt="AgriFuel Nexus Ecosystem"
                                className="w-full h-auto object-cover rounded-4xl shadow-inner"
                            />
                        </div>
                    </div>

                </div>
            </section>

            {/* 3. SOCIAL PROOF & LOGOS */}
            <section className="py-10 border-y border-slate-200/60 bg-white/60 backdrop-blur-md relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Trusted by leading agricultural and biofuel partners</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 font-black text-xl text-slate-800"><Globe size={24}/> BioRefine Inc.</div>
                        <div className="flex items-center gap-2 font-black text-xl text-slate-800"><Leaf size={24}/> EcoEnergy</div>
                        <div className="flex items-center gap-2 font-black text-xl text-slate-800"><TrendingUp size={24}/> AgriTrade</div>
                        <div className="flex items-center gap-2 font-black text-xl text-slate-800"><ShieldCheck size={24}/> GreenTech Escrow</div>
                    </div>
                </div>
            </section>

            {/* 4. CORE FEATURES */}
            <section className="py-24 relative bg-gradient-to-b from-[#FAFCFF] to-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                            Revolutionizing Agriculture
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                            Combining cutting-edge AI technology with sustainable marketplace solutions to maximize your farm's potential.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-300">
                            <CardHeader className="text-center pb-2">
                                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100/50">
                                    <Brain className="h-8 w-8 text-emerald-600" />
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-900">AI Farming Advisor</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center pt-2">
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    Get personalized, real-time recommendations powered by machine learning, weather forecasts, and soil analytics for optimal farming decisions.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-300">
                            <CardHeader className="text-center pb-2">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100/50">
                                    <TrendingUp className="h-8 w-8 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-900">Marketplace Platform</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center pt-2">
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    Connect directly with biofuel producers to sell agricultural waste, bypassing middlemen for fair pricing and sustainable revenue streams.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-300">
                            <CardHeader className="text-center pb-2">
                                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-teal-100/50">
                                    <Leaf className="h-8 w-8 text-teal-600" />
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-900">Sustainability Impact</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center pt-2">
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    Transform agricultural waste into valuable biofuel, reducing pollution while creating new income opportunities for farmers.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* 5. AGRIFUEL NEXUS MOBILE APP */}
            <section className="py-24 bg-white relative overflow-hidden border-b border-slate-100">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
                    
                    <div className="w-full lg:w-1/2 flex justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-transparent blur-3xl opacity-50 rounded-full"></div>
                        <div className="relative w-[300px] h-[600px] bg-slate-50 rounded-[3rem] border-[8px] border-black shadow-[0_30px_60px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden z-10">
                            
                            <div className="absolute inset-0 bg-[#FAFCFF] flex flex-col">
                                <div className="bg-gradient-to-br from-[#10b981] to-[#059669] text-white p-6 pt-10 rounded-b-[2rem] shadow-sm">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-90">AgriFuel Nexus</p>
                                    <h3 className="text-2xl font-black mt-1">Field Scanner</h3>
                                </div>
                                <div className="flex-1 p-5 flex flex-col gap-4">
                                    <div className="bg-white flex-1 rounded-2xl border-2 border-dashed border-emerald-200 flex items-center justify-center text-emerald-600 flex-col shadow-sm cursor-pointer hover:bg-emerald-50 transition-colors">
                                        <Scan size={40} className="mb-2" />
                                        <p className="font-bold text-sm">Tap to Open Camera</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">New Offer</span>
                                        </div>
                                        <p className="font-black text-slate-900 text-lg">BioRefine Inc.</p>
                                        <p className="text-sm font-bold text-slate-500 mt-1">Wants 10 Tons • ₹3,200/t</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute top-0 w-32 h-6 bg-black rounded-b-2xl z-20 shadow-sm border-b border-x border-slate-100"></div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2">
                        <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4 block">The AgriFuel Nexus App</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-slate-900">Your entire farm,<br/> right in your pocket.</h2>
                        <p className="text-slate-600 text-lg mb-10 font-medium leading-relaxed">
                            Take the power of AI diagnostics directly into the field. The AgriFuel Nexus mobile app is designed specifically for farmers, functioning perfectly even in rural areas with spotty connectivity.
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-emerald-600 shrink-0"><Scan size={24}/></div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-1">In-Field AI Scanning</h4>
                                    <p className="text-slate-600 font-medium">Point your camera at a diseased leaf and get a recovery plan instantly.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-600 shrink-0"><BellRing size={24}/></div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-1">Instant Offer Alerts</h4>
                                    <p className="text-slate-600 font-medium">Get push notifications the second a refinery bids on your biomass.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-600 shrink-0"><WifiOff size={24}/></div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-1">Offline Mode Support</h4>
                                    <p className="text-slate-600 font-medium">Capture data in the field and automatically sync when you reconnect to Wi-Fi.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* 6. HOW IT WORKS */}
            <section className="py-24 bg-[#FAFCFF] relative border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-2 block">Simple Workflow</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">From field to funds in three easy steps.</h2>
                            <p className="text-slate-600 text-lg mb-8 font-medium">We've eliminated the friction. Our intuitive interface allows you to manage everything seamlessly.</p>
                            
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-600 shrink-0 shadow-sm">1</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">Scan & Diagnose</h4>
                                        <p className="text-slate-600 font-medium">Use your camera to instantly identify crop diseases using our AI engine.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center font-black text-teal-600 shrink-0 shadow-sm">2</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">List Biomass</h4>
                                        <p className="text-slate-600 font-medium">Upload your harvest residue to the live marketplace with a few taps.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center font-black text-emerald-600 shrink-0 shadow-sm">3</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">Secure Payment</h4>
                                        <p className="text-slate-600 font-medium">Verify the driver's OTP to instantly release funds from the secure Escrow.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="lg:w-1/2 w-full relative">
                            <div className="aspect-square w-full max-w-md mx-auto bg-gradient-to-tr from-emerald-50 to-teal-50 rounded-[3rem] p-8 shadow-2xl border border-white relative">
                                
                                <div className="absolute top-10 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white flex items-center gap-3 animate-[bounce_4s_infinite] z-20">
                                    <CheckCircle2 className="text-emerald-500" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Offer Accepted</p>
                                        <p className="font-black text-slate-900">₹45,000 Locked</p>
                                    </div>
                                </div>
                                
                                <div className="absolute bottom-20 -right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white flex items-center gap-3 animate-[bounce_5s_infinite] z-20">
                                    <ShieldCheck className="text-blue-500" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">OTP Verified</p>
                                        <p className="font-black text-slate-900">Funds Released</p>
                                    </div>
                                </div>
                                
                                <div className="w-full h-full border-2 border-dashed border-emerald-200 rounded-[2rem] flex items-center justify-center bg-white/60 backdrop-blur-sm relative z-10">
                                    <div className="text-center">
                                        <div className="bg-white p-4 rounded-full shadow-md inline-block mb-3">
                                            <Package size={32} className="text-emerald-500"/>
                                        </div>
                                        <p className="font-bold text-slate-700">Digital Escrow Vault</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. TESTIMONIALS */}
            <section className="py-24 bg-white relative border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-2 block">Success Stories</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Trusted by Farmers</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Rajesh Kumar", location: "Punjab", text: "Before Nexus, I used to burn wheat stubble because clearing it was too expensive. Now, factories pay me to collect it. My income increased by 20% this season." },
                            { name: "Amit Sharma", location: "Haryana", text: "The AI disease detection saved my entire corn crop. I uploaded a photo, got the exact pesticide recommendation in Hindi, and fixed the issue in 2 days." },
                            { name: "Suresh Patel", location: "Maharashtra", text: "The Escrow system gives me complete peace of mind. The buyer's money is locked before the truck arrives, and I release it with an OTP. So simple." }
                        ].map((testimonial, idx) => (
                            <div key={idx} className="bg-[#FAFCFF] p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:-translate-y-2 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 relative group">
                                <Quote className="absolute top-6 right-6 text-emerald-50 group-hover:text-emerald-100 transition-colors" size={60} />
                                <div className="flex gap-1 mb-6 relative z-10">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
                                </div>
                                <p className="text-slate-600 font-medium leading-relaxed mb-6 relative z-10">"{testimonial.text}"</p>
                                <div className="relative z-10">
                                    <p className="font-black text-slate-900">{testimonial.name}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{testimonial.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. DOWNLOAD APP CTA BANNER */}
            <section className="py-12 bg-[#FAFCFF] relative border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-gradient-to-r from-[#064e3b] to-[#065f46] rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-emerald-900/20">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-black text-white mb-2">Get AgriFuel Nexus on Mobile</h2>
                            <p className="text-emerald-100 font-medium">Scan, sell, and track revenue directly from your smartphone.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-900 px-6 py-3.5 rounded-xl font-bold transition-colors shadow-sm">
                                <Apple size={24} />
                                <div className="text-left">
                                    <p className="text-[9px] uppercase tracking-widest leading-none text-slate-500">Download on the</p>
                                    <p className="text-lg leading-none mt-1">App Store</p>
                                </div>
                            </button>
                            <button className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-900 px-6 py-3.5 rounded-xl font-bold transition-colors shadow-sm">
                                <Play size={24} className="fill-slate-900" />
                                <div className="text-left">
                                    <p className="text-[9px] uppercase tracking-widest leading-none text-slate-500">GET IT ON</p>
                                    <p className="text-lg leading-none mt-1">Google Play</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. FAQ */}
            <section className="py-24 bg-[#FAFCFF]">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                            <HelpCircle className="text-emerald-600" size={32} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "Is AgriFuel Nexus free for farmers?", a: "Yes! Creating an account, scanning your crops with our AI, and listing your biomass on the marketplace is 100% free for farmers. We only charge a small logistics fee to the industrial buyers." },
                            { q: "How do I get paid?", a: "When a refinery buys your biomass, they deposit the money into a secure Escrow account. Once their truck arrives and you verify the driver's OTP, the funds are instantly released to your linked bank account." },
                            { q: "Do I need to arrange transportation?", a: "No. The buyers (biofuel refineries) arrange the trucks to pick up the biomass directly from your farm gate." },
                            { q: "What if I don't speak English?", a: "Our AI Advisory tool automatically translates disease detection results and treatment plans into multiple regional languages, including Hindi, Punjabi, Marathi, and Bengali." }
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
                                <h4 className="text-lg font-black text-slate-900 mb-2">{faq.q}</h4>
                                <p className="text-slate-600 font-medium leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 10. FINAL GLOSSY CTA */}
            <section className="py-24 px-6 relative bg-[#FAFCFF]">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#059669] via-emerald-500 to-teal-400 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-emerald-500/20 border border-white/20">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 blur-3xl rounded-full pointer-events-none"></div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight relative z-10 leading-tight">Ready to transform your farm?</h2>
                    <p className="text-emerald-50 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
                        Join the modern agricultural ecosystem. Free to sign up, easy to use, and highly profitable.
                    </p>
                    
                    <Link to="/login" className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:text-emerald-800 hover:shadow-xl font-black text-lg px-10 py-5 rounded-full shadow-lg transition-all active:scale-95 relative z-10">
                        Create Your Free Account <ChevronRight size={20} />
                    </Link>
                </div>
            </section>

            {/* 11. MINIMAL FOOTER */}
            <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <img
                            src={agrifuelLogo}
                            alt='logo'
                            className="h-14 w-14" 
                        />
                        <span className="font-extrabold text-xl tracking-tight text-slate-900">AgriFuel Nexus</span>
                    </div>
                    <div className="text-sm font-bold text-slate-500 flex flex-wrap justify-center gap-6">
                        <Link to="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-emerald-600 transition-colors">Terms of Service</Link>
                        <Link to="#" className="hover:text-emerald-600 transition-colors">Support</Link>
                    </div>
                    <p className="text-sm font-medium text-slate-400">© 2026 AgriFuel Nexus. All rights reserved.</p>
                </div>
            </footer>

        </div>
    );
}