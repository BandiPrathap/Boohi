import React from 'react';

export default function ProgressBar({ userAnswers = {}, numQuestions = 100 }) {
  const attempted = Object.keys(userAnswers).length;
  const percentage = (attempted / numQuestions) * 100;
  return (
    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
      <div
        className="bg-blue-600 h-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
