import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Flag, 
  Maximize, 
  Minimize, 
  RotateCcw,
  Move,
  Maximize2,
  Upload,
  Trophy,
  Sun,
  Moon
} from 'lucide-react';

/**
 * Progress Bar Component
 */
const ProgressBar = ({ userAnswers, numQuestions, isDarkMode }) => {
  const answeredCount = Object.keys(userAnswers).length;
  const percentage = (answeredCount / numQuestions) * 100;
  return (
    <div className={`w-full h-2 rounded-full overflow-hidden shadow-inner ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
      <div 
        className="bg-indigo-500 h-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default function ExamViewOMR({
  pdfDoc,
  currentPage,
  setCurrentPage,
  renderPage,
  canvasRef,
  userAnswers,
  setUserAnswers,
  markedForReview,
  setMarkedForReview,
  numQuestions = 100,
  formatTime,
  timeLeft,
  setIsTimerRunning,
  openAnswerKeyUpload,
  pdfScale,
  setPdfScale,
}) {
  const [showControls, setShowControls] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const scrollRef = useRef(null);
  const omrScrollRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  useEffect(() => {
    if (timeLeft <= 0 && !isTestSubmitted) {
      handleFinalSubmit();
    }
  }, [timeLeft, isTestSubmitted]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let timeout;
    const onScroll = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (el.scrollTop > 100) setShowControls(false);
      }, 3000);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const stats = useMemo(() => {
    const answered = Object.keys(userAnswers).length;
    const marked = Object.values(markedForReview).filter(Boolean).length;
    return { answered, marked, remaining: numQuestions - answered };
  }, [userAnswers, markedForReview, numQuestions]);

  const handleFinalSubmit = () => {
    setIsTimerRunning(false);
    setIsTestSubmitted(true);
  };

  const handlePageChange = (direction) => {
    if (!pdfDoc) return;
    const newPage = direction === 'next' 
      ? Math.min(pdfDoc.numPages, currentPage + 1)
      : Math.max(1, currentPage - 1);
    
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      renderPage(newPage, pdfDoc, pdfScale);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  };

  const fitToWidth = () => {
    if (!pdfDoc || !scrollRef.current || !canvasRef.current) return;
    const containerWidth = scrollRef.current.clientWidth - 40;
    const canvasOriginalWidth = canvasRef.current.width / pdfScale; 
    const newScale = containerWidth / canvasOriginalWidth;
    setPdfScale(newScale);
  };

  const handleMouseDown = (e) => {
    if (pdfScale <= 1 || e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.pageX,
      y: e.pageY,
      scrollLeft: scrollRef.current.scrollLeft,
      scrollTop: scrollRef.current.scrollTop
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const y = e.pageY;
    const walkX = (x - dragStart.current.x) * 1.2;
    const walkY = (y - dragStart.current.y) * 1.2;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - walkX;
    scrollRef.current.scrollTop = dragStart.current.scrollTop - walkY;
  };

  const handleMouseUp = () => setIsDragging(false);

  const scrollToQuestion = (qNum) => {
    const element = document.getElementById(`question-${qNum}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const sidebarWidth = useMemo(() => {
    if (sidebarCollapsed) return '0px';
    if (!pdfDoc) return '100%'; 
    return '400px';
  }, [sidebarCollapsed, pdfDoc]);

  return (
    <div className={`h-screen flex flex-col overflow-hidden font-sans select-none relative transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
      
      {/* TEST COMPLETED OVERLAY */}
      {isTestSubmitted && (
        <div className="absolute inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border w-full max-w-lg rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300`}>
            <div className="p-8 text-center flex flex-col items-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border shadow-sm ${isDarkMode ? 'bg-indigo-900/30 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'}`}>
                <Trophy className="text-indigo-500" size={40} />
              </div>
              
              <h2 className="text-3xl font-black mb-2 tracking-tight">Test Completed!</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">Your responses have been locked. You can now upload the key to see your score.</p>

              <div className="grid grid-cols-3 gap-3 w-full mb-8">
                <div className={`${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'} p-4 rounded-2xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Answered</div>
                  <div className="text-xl font-black text-indigo-500">{stats.answered}</div>
                </div>
                <div className={`${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'} p-4 rounded-2xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Time</div>
                  <div className="text-xl font-black text-slate-400">Done</div>
                </div>
                <div className={`${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'} p-4 rounded-2xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Accuracy</div>
                  <div className="text-xl font-black text-slate-600">--</div>
                </div>
              </div>

              <button 
                onClick={openAnswerKeyUpload}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-indigo-500/20"
              >
                <Upload size={22} /> Upload Answer Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`h-16 border-b flex items-center justify-between px-6 shrink-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-[0_1px_10px_rgba(0,0,0,0.3)]' : 'bg-white border-slate-200 shadow-[0_1px_10px_rgba(0,0,0,0.05)]'}`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-500/20">E</div>
            <h2 className="font-black text-lg hidden lg:block tracking-tight uppercase">ExamConsole</h2>
          </div>
          
          <div className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full border shadow-sm transition-all ${timeLeft < 300 ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 animate-pulse' : isDarkMode ? 'bg-slate-800 border-slate-700 text-indigo-400 font-bold' : 'bg-slate-50 border-slate-200 text-indigo-600 font-bold'}`}>
            <Clock size={16} />
            <span className="font-mono text-md tabular-nums">{formatTime ? formatTime(timeLeft) : timeLeft}</span>
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-8 hidden md:block">
          <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1.5 font-black text-slate-500">
            <span>Progress</span>
            <span className="text-indigo-500">{stats.answered} / {numQuestions}</span>
          </div>
          <ProgressBar userAnswers={userAnswers} numQuestions={numQuestions} isDarkMode={isDarkMode} />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'}`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            onClick={() => { if (window.confirm("Submit answers?")) handleFinalSubmit(); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-black transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            Submit Exam
          </button>
        </div>
      </header>

      <main className={`flex-1 flex overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'} relative`}>
        {/* PDF Section */}
        {pdfDoc && (
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {/* Floating Controls */}
            <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-1.5 border rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
              <div className={`flex items-center gap-0.5 border-r pr-1 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <button onClick={() => handlePageChange('prev')} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`} disabled={currentPage === 1}>
                  <ChevronLeft size={20} />
                </button>
                <span className="px-3 text-xs font-black min-w-[80px] text-center">
                  {currentPage} / {pdfDoc?.numPages || 1}
                </span>
                <button onClick={() => handlePageChange('next')} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`} disabled={!pdfDoc || currentPage === pdfDoc.numPages}>
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <div className="flex items-center gap-1 pl-1">
                <button onClick={() => setPdfScale(s => Math.max(0.5, s - 0.1))} className="p-2 hover:bg-indigo-500/10 rounded-xl text-slate-400"><Minimize size={18}/></button>
                <span className="text-[11px] font-black w-12 text-center text-indigo-500">{(pdfScale * 100).toFixed(0)}%</span>
                <button onClick={() => setPdfScale(s => Math.min(4, s + 0.1))} className="p-2 hover:bg-indigo-500/10 rounded-xl text-slate-400"><Maximize size={18}/></button>
                <div className={`w-px h-5 mx-1 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`} />
                <button onClick={fitToWidth} className="p-2 hover:bg-indigo-500/10 rounded-xl text-indigo-500" title="Fit to Width"><Maximize2 size={18}/></button>
                <button onClick={() => setPdfScale(1.0)} className="p-2 hover:bg-indigo-500/10 rounded-xl text-slate-500"><RotateCcw size={16}/></button>
              </div>
            </div>

            <div 
              ref={scrollRef} 
              className={`flex-1 overflow-auto p-12 flex flex-col items-center custom-scrollbar ${pdfScale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <div className={`inline-block relative shadow-[0_20px_60px_rgba(0,0,0,0.4)] border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <canvas ref={canvasRef} className="block pointer-events-none" />
                {pdfScale > 1.2 && (
                  <div className={`fixed bottom-8 left-8 z-30 shadow-xl px-4 py-2 rounded-2xl flex items-center gap-2 text-[11px] font-bold border ring-4 ring-black/5 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-600'}`}>
                    <Move size={14} className="text-indigo-500"/> DRAG TO PAN
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* OMR Panel */}
        <aside 
          style={{ width: sidebarWidth }}
          className={`h-full border-l flex flex-col shrink-0 z-50 transition-all duration-500 ease-in-out shadow-[-15px_0_35px_-10px_rgba(0,0,0,0.2)] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
        >
          {!sidebarCollapsed && (
            <div className={`flex flex-col h-full mx-auto ${!pdfDoc ? 'max-w-5xl w-full' : 'w-full'}`}>
              <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.2)]' : 'bg-white border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl shadow-sm ${isDarkMode ? 'bg-indigo-950 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                    <FileText size={20} />
                  </div>
                  <h3 className="font-black text-sm uppercase tracking-tight">Answer Sheet</h3>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`flex rounded-xl p-1 border shadow-inner ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                    <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${viewMode === 'list' ? (isDarkMode ? 'bg-slate-700 text-indigo-400 shadow-lg' : 'bg-white text-indigo-600 shadow-md') : 'text-slate-500'}`}>LIST</button>
                    <button onClick={() => setViewMode('grid')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${viewMode === 'grid' ? (isDarkMode ? 'bg-slate-700 text-indigo-400 shadow-lg' : 'bg-white text-indigo-600 shadow-md') : 'text-slate-500'}`}>GRID</button>
                  </div>
                  <button onClick={() => setSidebarCollapsed(true)} className="p-2.5 rounded-xl hover:bg-slate-50/10 text-slate-500 transition-colors"><Minimize size={18} /></button>
                </div>
              </div>

              <div ref={omrScrollRef} className={`flex-1 overflow-y-auto p-5 custom-scrollbar ${isDarkMode ? 'bg-slate-950/20' : 'bg-slate-50/30'}`}>
                {viewMode === 'list' ? (
                  <div className={`grid gap-3 ${!pdfDoc ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {Array.from({ length: numQuestions }, (_, i) => i + 1).map((q) => (
                      <div key={q} id={`question-${q}`} className={`p-4 rounded-2xl border transition-all flex items-center gap-4 group ${userAnswers[q] ? (isDarkMode ? 'bg-indigo-500/10 border-indigo-500/30 shadow-sm' : 'bg-indigo-50/50 border-indigo-200 shadow-sm') : (isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md')}`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black transition-all shadow-sm ${userAnswers[q] ? 'bg-indigo-600 text-white shadow-indigo-500/20' : (isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400')}`}>
                          {q}
                        </div>
                        <div className="flex flex-1 justify-between gap-2">
                          {['A', 'B', 'C', 'D'].map((opt) => (
                            <button
                              key={opt}
                              onClick={() => setUserAnswers(prev => ({...prev, [q]: opt}))}
                              className={`flex-1 h-10 rounded-xl border flex items-center justify-center font-black text-sm transition-all ${userAnswers[q] === opt ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.05]' : (isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:shadow-sm active:scale-95')}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        <button 
                          onClick={() => setMarkedForReview(prev => ({...prev, [q]: !prev[q]}))} 
                          className={`p-2.5 rounded-xl transition-all ${markedForReview[q] ? 'text-amber-500 bg-amber-500/10 shadow-sm' : 'text-slate-600 hover:text-slate-400'}`}
                        >
                          <Flag size={16} fill={markedForReview[q] ? "currentColor" : "none"} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`grid gap-2.5 ${!pdfDoc ? 'grid-cols-6 md:grid-cols-10 lg:grid-cols-15' : 'grid-cols-5'}`}>
                    {Array.from({ length: numQuestions }, (_, i) => i + 1).map((q) => (
                      <button
                        key={q}
                        onClick={() => { setViewMode('list'); setTimeout(() => scrollToQuestion(q), 50); }}
                        className={`h-14 rounded-2xl border text-[11px] font-black flex flex-col items-center justify-center relative transition-all active:scale-90 shadow-sm ${userAnswers[q] ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30' : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200')}`}
                      >
                        <span className="opacity-50 text-[9px] mb-0.5">{q}</span>
                        <span className="text-sm">{userAnswers[q] || '-'}</span>
                        {markedForReview[q] && <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white shadow-sm" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats Footer */}
              <div className={`p-8 border-t shadow-[0_-4px_15px_rgba(0,0,0,0.05)] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className={`grid gap-4 ${!pdfDoc ? 'grid-cols-3 max-w-3xl mx-auto' : 'grid-cols-3'}`}>
                  {[{l: 'Answered', v: stats.answered, c: 'indigo'}, {l: 'Marked', v: stats.marked, c: 'amber'}, {l: 'Left', v: stats.remaining, c: 'slate'}].map((s, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl text-center border shadow-sm transition-shadow ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 hover:shadow-md'}`}>
                      <div className={`text-[10px] text-${s.c}-500 uppercase font-black tracking-widest mb-1.5`}>{s.l}</div>
                      <div className="text-2xl font-black">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Collapsed Sidebar Trigger */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-indigo-600 text-white px-2.5 py-12 rounded-l-3xl shadow-[-5px_0_25px_rgba(0,0,0,0.3)] hover:bg-indigo-700 transition-all group flex flex-col items-center gap-4 active:scale-95"
          >
            <span className="[writing-mode:vertical-lr] font-black text-[12px] tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">SHOW SHEET</span>
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: ${isDarkMode ? '#334155' : '#e2e8f0'}; 
          border-radius: 20px; 
          border: 2px solid transparent; 
          background-clip: content-box; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${isDarkMode ? '#475569' : '#cbd5e1'}; background-clip: content-box; }
      `}</style>
    </div>
  );
}