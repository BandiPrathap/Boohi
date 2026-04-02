import React from 'react';
import { Upload, AlertCircle, ChevronLeft } from 'lucide-react';

export default function AnswerKeyPrompt({
  extractFromFile,
  loading,
  existingFileName,
  onBackToExam,
}) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    extractFromFile(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
        <h2 className="text-2xl font-bold mb-2">Time's up — upload the Answer Key</h2>
        <p className="text-slate-500 mb-6">Your exam time has expired. Please upload the Answer Key PDF to calculate results.</p>

        {existingFileName && (
          <div className="mb-4 text-sm text-slate-600">Detected uploaded file: <strong>{existingFileName}</strong></div>
        )}

        <div className="mb-6">
          <label className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors hover:border-blue-400`}>
            <input type="file" accept=".pdf" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <Upload className={`mx-auto mb-2 text-slate-400`} size={32} />
            <p className="text-xs font-medium text-slate-600 truncate">Click or drag Answer Key PDF here</p>
          </label>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={() => {}} className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 opacity-0 pointer-events-none">Back to Exam</button>
          <button onClick={() => extractFromFile(null)} disabled className="px-4 py-2 rounded bg-blue-600 text-white opacity-50" title="Upload a PDF to enable">Process Key</button>
        </div>

        <div className="mt-6 text-sm text-slate-500 flex items-center justify-center gap-2">
          <AlertCircle size={16} />
          <span>{loading ? 'Processing PDF...' : 'Make sure the PDF contains selectable text (not a scanned image).'}</span>
        </div>
      </div>
    </div>
  );
}
