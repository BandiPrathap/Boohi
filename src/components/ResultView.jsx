import React from 'react';
import { CheckCircle, AlertCircle, Trophy, Download, Trash2, RotateCcw, BarChart3 } from 'lucide-react';

export default function ResultView({ extractedKeys = {}, userAnswers = {}, onRestart, onFeedback }) {
  const stats = Object.keys(extractedKeys).reduce((acc, q) => {
    const correct = extractedKeys[q];
    const user = userAnswers[q];
    if (!user) acc.skipped++;
    else if (user === correct) acc.correct++;
    else acc.wrong++;
    return acc;
  }, { correct: 0, wrong: 0, skipped: 0 });

  const totalDetected = Object.keys(extractedKeys).length;
  const score = (stats.correct * 1) - (stats.wrong * 0.25);
  const accuracy = ((stats.correct / (stats.correct + stats.wrong)) * 100 || 0).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 pb-12 print:bg-white print:p-0">
      {/* Top Navigation / Progress (Mobile Optimization) */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 mb-6 md:hidden">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <span className="font-bold text-slate-800">Exam Results</span>
          <span className="text-blue-600 font-black text-xl">{score.toFixed(2)}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:mt-8">
        
        {/* Main Score Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 flex flex-col md:flex-row transition-all">
          <div className="bg-blue-600 text-white p-8 md:w-1/3 flex flex-col items-center justify-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center animate-pulse-slow">
                <Trophy size={48} className="text-yellow-300" />
              </div>
            </div>
            <h2 className="text-5xl font-black mb-1 leading-none">{score.toFixed(2)}</h2>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.2em]">Aggregate Score</p>
          </div>

          <div className="flex-1 p-6 md:p-10">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center md:text-left">
                <p className="text-slate-400 text-[10px] uppercase font-black mb-1">Correct</p>
                <p className="text-2xl font-bold text-green-600">{stats.correct}</p>
              </div>
              <div className="text-center md:text-left border-x border-slate-100">
                <p className="text-slate-400 text-[10px] uppercase font-black mb-1">Incorrect</p>
                <p className="text-2xl font-bold text-red-500">{stats.wrong}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-slate-400 text-[10px] uppercase font-black mb-1">Skipped</p>
                <p className="text-2xl font-bold text-slate-400">{stats.skipped}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full">
                <BarChart3 size={18} className="text-blue-500" />
                <span className="text-slate-700 font-bold text-sm">Accuracy: {accuracy}%</span>
              </div>
              
              <button 
                onClick={onRestart}
                className="group flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-bold print:hidden"
              >
                <RotateCcw size={16} className="group-hover:-rotate-45 transition-transform" />
                Reset Exam
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-3 bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            <Download size={20} /> Download PDF Scorecard
          </button>
          <button
            onClick={onFeedback}
            className="flex items-center justify-center bg-white text-blue-600 border-2 border-blue-600 py-4 px-6 rounded-2xl font-bold hover:bg-blue-50 transition-all active:scale-95"
          >
            Submit Feedback
          </button>
        </div>

        {/* Detailed Analysis Table */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2 bg-white sticky top-0 md:relative">
            <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
              Detailed Analysis
            </h3>
            <div className="bg-slate-100 text-slate-500 text-[10px] px-3 py-1 rounded-full font-bold">
              {totalDetected} QUESTIONS IDENTIFIED
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black">
                <tr>
                  <th className="px-6 py-4">Question</th>
                  <th className="px-6 py-4">Response</th>
                  <th className="px-6 py-4">Key</th>
                  <th className="px-6 py-4">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {Object.keys(extractedKeys).map((q) => {
                  const user = userAnswers[q];
                  const correct = extractedKeys[q];
                  const isCorrect = user === correct;
                  const isSkipped = !user;

                  return (
                    <tr key={q} className="group hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-5">
                        <span className="font-black text-slate-400 group-hover:text-blue-600 transition-colors">#{q}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-sm
                          ${isSkipped ? 'bg-slate-100 text-slate-400' : 
                            isCorrect ? 'bg-green-500 text-white shadow-green-200' : 'bg-red-500 text-white shadow-red-200'}`}>
                          {user || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg text-sm">
                          {correct}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {isSkipped ? (
                          <span className="text-slate-400 text-[10px] font-black uppercase tracking-tighter bg-slate-50 px-2 py-1 rounded">No Attempt</span>
                        ) : isCorrect ? (
                          <div className="flex items-center gap-1.5 text-green-600 font-black">
                            <CheckCircle size={16} strokeWidth={3} />
                            <span>+1.0</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-red-500 font-black">
                            <AlertCircle size={16} strokeWidth={3} />
                            <span>-0.25</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Footer Branding (Optional) */}
      <div className="mt-12 text-center text-slate-300 text-xs font-medium pb-8 uppercase tracking-widest">
        Official Performance Record
      </div>
    </div>
  );
}