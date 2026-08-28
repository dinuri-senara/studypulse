import React from 'react';

const TimerCircle = ({ timeLeft, totalTime, mode }) => {
  const percentage = Math.min(100, Math.max(0, (timeLeft / totalTime) * 100));
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');

    return `${h} : ${m} : ${s}`;
  };

  const getModeColor = () => {
    if (mode === 'FOCUS') return 'text-primary stroke-primary';
    if (mode === 'SHORT_BREAK') return 'text-blue-500 stroke-blue-500';
    return 'text-indigo-500 stroke-indigo-500';
  };

  const getModeBgColor = () => {
    if (mode === 'FOCUS') return 'stroke-primary-light/30';
    if (mode === 'SHORT_BREAK') return 'stroke-blue-100';
    return 'stroke-indigo-100';
  };

  const circumference = 2 * Math.PI * 140; // r = 140
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex justify-center items-center my-8">
      <svg className="w-80 h-80 transform -rotate-90">
        <circle
          cx="160"
          cy="160"
          r="140"
          strokeWidth="12"
          fill="transparent"
          className={getModeBgColor()}
        />
        <circle
          cx="160"
          cy="160"
          r="140"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${getModeColor()} transition-all duration-500 ease-in-out`}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-6xl font-bold text-text tabular-nums tracking-tight">
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
};

export default TimerCircle;
