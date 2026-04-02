import React from 'react';
import { Upload, Clock, FileCheck, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function Home({ onProceed }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Navigation / Header */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">ExamSim <span className="text-blue-600">Pro</span></span>
          </div>
          <button 
            onClick={onProceed}
            className="hidden md:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-all"
          >
            Start Mock Test
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-6 uppercase tracking-wider">
            <Zap className="w-3 h-3 fill-blue-700" /> Professional Grade Simulator
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Master Competitive Exams with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Real-Time</span> Practice.
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Upload your previous-year question PDFs, set your timer, and simulate a real examination environment. Get instant scoring by uploading your answer key.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onProceed}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-10 py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
            >
              Get Started Now <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 text-slate-500 text-sm italic">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Free to use</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> No signup required</span>
            </div>
          </div>
        </div>

        {/* How it Works - Visual Steps */}
        <div className="relative">
          {/* Background Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid md:grid-cols-3 gap-8 relative z-1">
            {/* Step 1 */}
            <div className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">1. Upload PDF</h3>
              <p className="text-slate-500 leading-relaxed">
                Drag and drop your question paper. We support searchable PDFs to ensure high-quality rendering during your test.
              </p>
              {/* Visual Asset Placeholder */}
              <div className="mt-6 h-32 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center">
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="20" y="10" width="80" height="40" rx="4" fill="white" stroke="#E2E8F0" />
                  <rect x="30" y="20" width="30" height="4" rx="2" fill="#E2E8F0" />
                  <rect x="30" y="28" width="60" height="4" rx="2" fill="#E2E8F0" />
                  <circle cx="90" cy="20" r="4" fill="#3B82F6" opacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="text-indigo-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">2. Real Simulation</h3>
              <p className="text-slate-500 leading-relaxed">
                A digital OMR panel syncs with your PDF view. Timed sessions help you build the speed needed for real Govt exams.
              </p>
              {/* Visual Asset Placeholder */}
              <div className="mt-6 h-32 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-2">
                <div className="flex gap-2">
                   {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-indigo-200 flex items-center justify-center text-[10px] text-indigo-300">{i}</div>)}
                </div>
                <div className="w-20 h-4 bg-indigo-100 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileCheck className="text-emerald-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">3. Instant Analysis</h3>
              <p className="text-slate-500 leading-relaxed">
                Upload the answer key in any text format. We instantly calculate your score, negative marking, and accuracy.
              </p>
              {/* Visual Asset Placeholder */}
              <div className="mt-6 h-32 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-black text-emerald-600">84%</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Score Card</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="mt-20 bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-1">Ready to test your limits?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto relative z-1">
            Experience the most realistic govt exam interface available online. No distractions, just focus.
          </p>
          <button 
            onClick={onProceed}
            className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-3 rounded-xl font-bold transition-all relative z-1"
          >
            Start Now — It's Free
          </button>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-10 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} ExamSim Pro Simulator. Built for aspirants by aspirants.</p>
        </div>
      </footer>
    </div>
  );
}