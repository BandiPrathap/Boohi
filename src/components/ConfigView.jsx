import React from 'react';
import { Upload, ChevronRight, AlertCircle, Clock } from 'lucide-react';
import ProgressBar from './ProgressBar';

export default function ConfigView({
  questionPdf,
  setQuestionPdf,
  pdfMode,
  numQuestions,
  setNumQuestions,
  timerDuration,
  setTimerDuration,
  startExam,
  loading,
  errorMessage,
}) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setQuestionPdf(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {pdfMode ? 'Govt Exam Simulator' : 'OMR Practice Mode'}
          </h1>
          <p className="text-slate-500">
            {pdfMode 
              ? 'Transform your Previous Year PDFs into interactive mock tests.' 
              : 'Practice with digital OMR sheet under real exam timing.'
            }
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3">
            <AlertCircle size={20} />
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {pdfMode && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                1. Question Paper (PDF)
              </label>
              <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${questionPdf ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-blue-400'}`}>
                <input type="file" accept=".pdf" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <Upload className={`mx-auto mb-2 ${questionPdf ? 'text-green-600' : 'text-slate-400'}`} size={32} />
                <p className="text-xs font-medium text-slate-600 truncate">
                  {questionPdf ? questionPdf.name : 'Click or drag PDF here'}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
              {pdfMode ? 'Exam Settings' : 'Practice Settings'}
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Total Questions</label>
                <input 
                  type="number" 
                  value={numQuestions} 
                  onChange={(e) => setNumQuestions(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  min="1" 
                  max="500" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Timer (Minutes)</label>
                <input 
                  type="number" 
                  value={timerDuration} 
                  onChange={(e) => setTimerDuration(Math.max(1, Math.min(300, parseInt(e.target.value) || 1)))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  min="1" 
                  max="300" 
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={startExam}
          disabled={loading || (pdfMode && !questionPdf)}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Initializing...' : pdfMode ? 'Launch Test Environment' : 'Start OMR Practice'}
          {!loading && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}
