import React, { useState } from 'react';

const CompletionModal = ({ duration, currentStreak, onComplete, onSkipBreak }) => {
  const [rating, setRating] = useState(5);
  
  const handleComplete = (startBreak) => {
    onComplete({ rating, startBreak });
  };

  const ratings = [
    { value: 1, emoji: '😞' },
    { value: 2, emoji: '😐' },
    { value: 3, emoji: '🙂' },
    { value: 4, emoji: '😊' },
    { value: 5, emoji: '🤩' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-surface rounded-3xl p-10 w-full max-w-md text-center shadow-xl border border-border">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-3xl font-bold text-text mb-2">Focus Complete!</h2>
        <p className="text-text-muted mb-8 text-lg">Great job! You stayed focused for {duration} minutes.</p>
        
        <div className="flex justify-center space-x-6 mb-8 bg-background py-4 rounded-2xl border border-border">
          <div className="text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="font-semibold text-text">{duration}m</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🧠</div>
            <div className="font-semibold text-text">Focus</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="font-semibold text-text">Streak: {currentStreak}</div>
          </div>
        </div>

        <div className="mb-8">
          <p className="font-medium text-text mb-4">How productive was this session?</p>
          <div className="flex justify-center space-x-2">
            {ratings.map(r => (
              <button
                key={r.value}
                onClick={() => setRating(r.value)}
                className={`text-3xl p-2 rounded-xl transition-all ${
                  rating === r.value ? 'bg-primary-light/30 scale-110 ring-2 ring-primary' : 'hover:bg-gray-100 opacity-60 hover:opacity-100'
                }`}
              >
                {r.emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => handleComplete(true)}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-all transform hover:scale-[1.02] shadow-md flex items-center justify-center"
          >
            <span className="mr-2">☕</span> Start Break
          </button>
          <button 
            onClick={() => onSkipBreak({ rating })}
            className="w-full py-3 bg-background text-text-muted border border-border rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">⏭</span> Skip Break
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;
