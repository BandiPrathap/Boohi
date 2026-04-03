import React, { useState, useEffect } from 'react';
import { Upload, ChevronRight, AlertCircle, Monitor, Smartphone, XCircle, CheckCircle2 } from 'lucide-react';

export default function UploadView({
  questionPdf,
  setQuestionPdf,
  numQuestions,
  setNumQuestions,
  timerDuration,
  setTimerDuration,
  startExam,
  loading,
  errorMessage,
  useOMR,
  setUseOMR,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkRes = () => setIsMobile(window.innerWidth < 768);
    checkRes();
    window.addEventListener('resize', checkRes);
    return () => window.removeEventListener('resize', checkRes);
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUseOMR(false);
    setQuestionPdf(file);
  };

  // Logic: Block the UI only if we are on mobile AND NOT in OMR-only mode
  const isLocked = isMobile && !useOMR;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full grid lg:grid-cols-12 gap-8 items-start">

       

        {/* Left Side: Information & Mobile Warning */}

        <div className="lg:col-span-5 space-y-6">

          <div className="space-y-2">

            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">

              Govt Exam <span className="text-blue-600">Simulator</span>

            </h1>

            <p className="text-slate-500 font-medium">

              Transform your Previous Year PDFs into interactive, timed mock tests with automated OMR evaluation.

            </p>

          </div>



          {isMobile && (

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">

              <div className="bg-amber-100 p-2 rounded-lg text-amber-600">

                <Monitor size={24} />

              </div>

              <div>

                <h4 className="text-amber-800 font-bold text-sm">Desktop Recommended</h4>

                <p className="text-amber-700 text-xs leading-relaxed mt-1">

                  <b>Note:</b> Side-by-side layout (PDF + OMR) is disabled on mobile for accuracy.
                    Please switch to a <b>laptop/tablet</b> or enable <b>OMR-only mode</b> to continue.

                </p>

              </div>

            </div>

          )}



          <div className="hidden lg:block space-y-4">

             <div className="flex items-center gap-3 text-slate-400">

                <div className="h-[1px] flex-1 bg-slate-200"></div>

                <span className="text-[10px] uppercase font-black tracking-widest">Workflow</span>

                <div className="h-[1px] flex-1 bg-slate-200"></div>

             </div>

             <ul className="space-y-3 text-sm text-slate-600 font-medium">

                <li className="flex items-center gap-2">✅ Upload Question Paper</li>

                <li className="flex items-center gap-2">✅ Solve using Digital OMR</li>

                <li className="flex items-center gap-2">✅ Instant Result Analysis</li>

             </ul>

          </div>

        </div>

        {/* Right Side: Main Form */}
        <div className={`lg:col-span-7 w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100 relative overflow-hidden transition-all ${isLocked ? 'opacity-75 grayscale-[0.5]' : ''}`}>
          
          {/* Form Content */}
          <div className="space-y-8">
            {/* Step 1: File Selection (Disabled on mobile) */}
            <div className={`space-y-4 ${isMobile ? 'opacity-40 pointer-events-none' : ''}`}>
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                Question Source
              </label>
              
              <div className={`relative group border-2 border-dashed rounded-2xl p-8 text-center transition-all ${questionPdf ? 'border-green-500 bg-green-50/50' : 'border-slate-200 hover:border-blue-400'}`}>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFile} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  disabled={useOMR || isMobile} 
                />
                <Upload className="mx-auto mb-3 text-slate-400" size={32} />
                <p className="text-sm font-bold text-slate-700">{questionPdf ? questionPdf.name : 'PDF Upload (Desktop Only)'}</p>
              </div>
            </div>

            {/* OMR Toggle - ALWAYS ACTIVE on Mobile */}
            <div className={`p-4 rounded-xl border-2 transition-all ${useOMR ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={useOMR} 
                  onChange={(e) => {
                    setUseOMR(e.target.checked);
                    if (e.target.checked) setQuestionPdf(null);
                  }} 
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                />
                <div>
                  <span className="text-sm font-bold text-slate-700 block">Switch to OMR-Only Mode</span>
                  <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">Use this if you have a physical paper. Works on mobile!</span>
                </div>
              </label>
            </div>

            {/* Step 2: Settings */}
            <div className={`space-y-4 ${isLocked ? 'pointer-events-none' : ''}`}>
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                Configuration
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase ml-1">Questions</label>
                  <input 
                    type="number" 
                    value={numQuestions} 
                    onChange={(e) => setNumQuestions(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase ml-1">Mins</label>
                  <input 
                    type="number" 
                    value={timerDuration} 
                    onChange={(e) => setTimerDuration(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700" 
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={startExam}
              disabled={loading || (!questionPdf && !useOMR) || (isMobile && !useOMR)}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
            >
              {loading ? "Setting up..." : <>Start OMR Exam <ChevronRight size={22} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}