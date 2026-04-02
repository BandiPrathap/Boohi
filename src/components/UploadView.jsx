import React from 'react';
import { Upload, ChevronRight, AlertCircle } from 'lucide-react';
import ProgressBar from './ProgressBar';

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
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setQuestionPdf(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Govt Exam Simulator</h1>
          <p className="text-slate-500">Transform your Previous Year PDFs into interactive mock tests.</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3">
            <AlertCircle size={20} />
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
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

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Exam Settings
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Total Questions</label>
                <input type="number" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Timer (Minutes)</label>
                <input type="number" value={timerDuration} onChange={(e) => setTimerDuration(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={useOMR} onChange={(e) => setUseOMR(e.target.checked)} className="w-4 h-4" />
                  Start OMR-only (no Question PDF)
                </label>
                <p className="text-xs text-slate-400 mt-1">When enabled, you can run the test without uploading a question PDF. After the test, upload the filled OMR sheet for verification.</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={startExam}
          disabled={loading || (!questionPdf && !useOMR)}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Initializing Simulator...' : 'Launch Test Environment'}
          {!loading && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}
