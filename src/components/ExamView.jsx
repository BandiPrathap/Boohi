import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, FileText, Trash2, Eye } from 'lucide-react';
import ProgressBar from './ProgressBar';

export default function ExamView({
  pdfDoc,
  currentPage,
  setCurrentPage,
  renderPage,
  canvasRef,
  userAnswers,
  setUserAnswers,
  markedForReview,
  setMarkedForReview,
  numQuestions,
  formatTime,
  timeLeft,
  setIsTimerRunning,
  openAnswerKeyUpload,
  loading,
  pdfScale,
  setPdfScale,
}) {
  const [showControls, setShowControls] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const last = { value: 0 };
    const onScroll = () => {
      const st = el.scrollTop;
      // show controls when at very top or when user scrolls up; hide when scrolling down
      if (st <= 50) {
        setShowControls(true);
      } else if (st < last.value) {
        // scrolling up
        setShowControls(true);
      } else {
        // scrolling down
        setShowControls(false);
      }
      last.value = st;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-slate-800 text-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-lg hidden md:block">Exam Console v1.0</h2>
          <div className="bg-slate-700 px-3 py-1 rounded text-sm font-mono flex items-center gap-2">
            <Clock size={16} className="text-yellow-400" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="flex justify-between text-[10px] uppercase mb-1 font-bold text-slate-400">
            <span>Progress</span>
            <span>{Object.keys(userAnswers).length} / {numQuestions} Solved</span>
          </div>
          <ProgressBar userAnswers={userAnswers} numQuestions={numQuestions} />
        </div>

        <button
          onClick={() => {
            if (window.confirm("Finish exam? Ensure you have your Answer Key PDF ready for the next step.")) {
              setIsTimerRunning(false);
              openAnswerKeyUpload();
            }
          }}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold transition-colors"
        >
          Submit Exam
        </button>
      </header>

      {/* Main Interface */}
      <main className="flex-1 flex overflow-hidden">
        {/* PDF Side */}
        <div className="flex-1 bg-slate-500 relative flex flex-col">
          <div className={`absolute top-4 left-4 z-10 flex gap-2 transition-opacity duration-200 ${showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <button
              onClick={() => {
                const newPage = Math.max(1, currentPage - 1);
                setCurrentPage(newPage);
                renderPage(newPage, pdfDoc, pdfScale);
              }}
              className="p-2 bg-white/90 hover:bg-white rounded-full shadow text-slate-800"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="bg-white/90 px-4 py-2 rounded-full font-bold shadow text-slate-800 flex items-center">
              Page {currentPage} / {pdfDoc?.numPages}
            </div>
            <button
              onClick={() => {
                const newPage = Math.min(pdfDoc?.numPages || 1, currentPage + 1);
                setCurrentPage(newPage);
                renderPage(newPage, pdfDoc, pdfScale);
              }}
              className="p-2 bg-white/90 hover:bg-white rounded-full shadow text-slate-800"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className={`absolute top-4 right-4 z-10 flex items-center gap-2 transition-opacity duration-200 ${showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <button
              onClick={() => setPdfScale(prev => Math.max(0.5, +(prev - 0.1).toFixed(2)))}
              className="p-2 bg-white/90 hover:bg-white rounded-full shadow text-slate-800"
              title="Zoom out"
            >
              -
            </button>
            <div className="bg-white/90 px-3 py-2 rounded-full font-bold shadow text-slate-800">
              {(pdfScale * 100).toFixed(0)}%
            </div>
            <button
              onClick={() => setPdfScale(prev => Math.min(3, +(prev + 0.1).toFixed(2)))}
              className="p-2 bg-white/90 hover:bg-white rounded-full shadow text-slate-800"
              title="Zoom in"
            >
              +
            </button>
            <button
              onClick={() => {
                const el = scrollRef.current;
                if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-2 bg-white/90 hover:bg-white rounded-full shadow text-slate-800"
              title="Scroll to top"
            >
              ↑
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-auto p-4 flex justify-center scrollbar-thin scrollbar-thumb-slate-400">
            <canvas ref={canvasRef} className="shadow-2xl bg-white max-w-full h-fit rounded-sm" />
          </div>
        </div>

        {/* OMR Side */}
        <div className="w-[350px] bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-lg">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              OMR Response Sheet
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-200">
            <div className="space-y-3">
              {Array.from({ length: numQuestions }, (_, i) => i + 1).map((q) => (
                <div key={q} className={`p-3 border rounded-xl flex items-center gap-4 transition-all ${userAnswers[q] ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                  <span className="w-8 font-bold text-slate-400 text-sm">{q}.</span>
                  <div className="flex flex-1 justify-between items-center pr-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setUserAnswers(prev => ({...prev, [q]: opt}))}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all
                            ${userAnswers[q] === opt 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-500'}`}
                      >
                        {opt}
                      </button>
                    ))}
                    <button 
                      onClick={() => setUserAnswers(prev => {
                        const newAns = {...prev};
                        delete newAns[q];
                        return newAns;
                      })}
                      className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                      title="Clear"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      onClick={() => setMarkedForReview(prev => ({...prev, [q]: !prev[q]}))}
                      className={`p-2 transition-colors ${markedForReview[q] ? 'text-purple-600' : 'text-slate-300 hover:text-purple-400'}`}
                      title="Mark for Review"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Answered</div>
                <div className="text-lg font-bold text-green-600">{Object.keys(userAnswers).length}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Unanswered</div>
                <div className="text-lg font-bold text-slate-400">{numQuestions - Object.keys(userAnswers).length}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Marked</div>
                <div className="text-lg font-bold text-purple-600">{Object.values(markedForReview).filter(Boolean).length}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total</div>
                <div className="text-lg font-bold text-slate-800">{numQuestions}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
