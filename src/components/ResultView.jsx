import React from 'react';
import { CheckCircle, AlertCircle, Trophy, Download, Trash2 } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
          <div className="bg-blue-600 text-white p-8 md:w-1/3 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Trophy size={40} className="text-yellow-300" />
            </div>
            <h2 className="text-4xl font-black mb-1">{score.toFixed(2)}</h2>
            <p className="text-blue-100 text-sm font-medium uppercase tracking-widest">Final Score</p>
          </div>
          <div className="flex-1 p-8 grid grid-cols-2 md:grid-cols-3 gap-6 items-center">
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Correct</div>
              <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Incorrect</div>
              <div className="text-2xl font-bold text-red-500">{stats.wrong}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Unattempted</div>
              <div className="text-2xl font-bold text-slate-400">{stats.skipped}</div>
            </div>
            <div className="col-span-2 md:col-span-3 pt-4 border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <CheckCircle size={16} className="text-blue-500" />
                <span>Accuracy: {((stats.correct / (stats.correct + stats.wrong)) * 100 || 0).toFixed(1)}%</span>
              </div>
              <button 
                onClick={onRestart}
                className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1"
              >
                <Trash2 size={16} /> New Exam
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => window.print()}
            className="flex-1 bg-slate-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 shadow-lg"
          >
            <Download size={20} /> Download Scorecard
          </button>
          <button
            onClick={onFeedback}
            className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg"
          >
            Send Feedback / Suggestion
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Question Wise Analysis</h3>
            <span className="text-xs text-slate-400 italic">Extracted {totalDetected} keys from PDF</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Q.No</th>
                  <th className="px-6 py-4">Your Ans</th>
                  <th className="px-6 py-4">Correct Ans</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {Object.keys(extractedKeys).map((q) => {
                  const user = userAnswers[q];
                  const correct = extractedKeys[q];
                  const isCorrect = user === correct;
                  const isSkipped = !user;

                  return (
                    <tr key={q} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">{q}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isSkipped ? 'bg-slate-100 text-slate-400' : isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-600">{correct}</td>
                      <td className="px-6 py-4">
                        {isSkipped ? (
                          <span className="text-slate-400 text-xs font-medium bg-slate-100 px-2 py-1 rounded">Skipped</span>
                        ) : isCorrect ? (
                          <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                            <CheckCircle size={14} /> +1.00
                          </span>
                        ) : (
                          <span className="text-red-500 text-xs font-bold flex items-center gap-1">
                            <AlertCircle size={14} /> -0.25
                          </span>
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
    </div>
  );
}
