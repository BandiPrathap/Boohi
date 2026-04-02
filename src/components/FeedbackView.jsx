import React from 'react';

export default function FeedbackView({ feedback, setFeedback, sendFeedback, statusMessage, onBack }) {
  const updateField = (field) => (event) => {
    setFeedback((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 className="text-2xl font-bold mb-4">Share feedback or suggestion</h1>
        <p className="mb-6 text-slate-500">
          We appreciate your input! Use this form to send suggestions directly to <strong>bandiprathap53@gmail.com</strong>.
        </p>

        <div className="space-y-4">
          <label className="block">
            <span className="text-slate-700 font-medium">Your Name (optional)</span>
            <input 
              type="text" 
              value={feedback.name} 
              onChange={updateField('name')} 
              className="mt-1 block w-full rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 p-3"
              placeholder="Enter your name"
            />
          </label>

          <label className="block">
            <span className="text-slate-700 font-medium">Your Email (optional)</span>
            <input 
              type="email" 
              value={feedback.email} 
              onChange={updateField('email')} 
              className="mt-1 block w-full rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 p-3"
              placeholder="Enter your email"
            />
          </label>

          <label className="block">
            <span className="text-slate-700 font-medium">Feedback / Suggestion</span>
            <textarea
              value={feedback.message}
              onChange={updateField('message')}
              rows={6}
              className="mt-1 block w-full rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 p-3"
              placeholder="Type your feedback or feature suggestion here..."
            />
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={sendFeedback}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
            >
              Send
            </button>
            <button
              onClick={onBack}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-3 rounded-lg font-semibold transition"
            >
              Back to Dashboard
            </button>
          </div>

          {statusMessage && <div className="mt-3 text-sm text-blue-700">{statusMessage}</div>}
        </div>
      </div>
    </div>
  );
}
