import React from 'react';

const TimerStats = ({ focusTimeMinutes, sessionsCompleted, currentStreak }) => {
  const formatFocusTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="mt-8 border-t border-border pt-8">
      <h3 className="text-center font-medium text-text-muted mb-6 uppercase tracking-wider text-sm">Today's Progress</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-border text-center flex flex-col justify-center">
          <div className="text-xl font-bold text-text mb-1 flex items-center justify-center">
            ⏱️ <span className="ml-2">{formatFocusTime(focusTimeMinutes)}</span>
          </div>
          <div className="text-xs text-text-muted">Focus Time</div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-border text-center flex flex-col justify-center">
          <div className="text-xl font-bold text-text mb-1 flex items-center justify-center">
            🍅 <span className="ml-2">{sessionsCompleted}</span>
          </div>
          <div className="text-xs text-text-muted">Sessions</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-border text-center flex flex-col justify-center">
          <div className="text-xl font-bold text-text mb-1 flex items-center justify-center">
            🔥 <span className="ml-2">{currentStreak}</span>
          </div>
          <div className="text-xs text-text-muted">Streak</div>
        </div>
      </div>
    </div>
  );
};

export default TimerStats;
