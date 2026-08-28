import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

const TimerControls = ({ isActive, onStart, onPause, onReset, onSkip, mode }) => {
  const getMainColor = () => {
    if (mode === 'FOCUS') return 'bg-primary hover:bg-primary-dark';
    if (mode === 'SHORT_BREAK') return 'bg-blue-500 hover:bg-blue-600';
    return 'bg-indigo-500 hover:bg-indigo-600';
  };

  return (
    <div className="flex justify-center items-center space-x-6 mt-8">
      <button 
        onClick={onReset} 
        title="Reset Timer"
        className="p-4 rounded-full bg-surface text-text-muted hover:text-text hover:bg-gray-100 transition-colors shadow-sm border border-border"
      >
        <RotateCcw className="w-6 h-6" />
      </button>
      
      {isActive ? (
        <button 
          onClick={onPause}
          className="px-10 py-4 rounded-full text-white bg-red-500 hover:bg-red-600 transition-all transform hover:scale-105 shadow-md flex items-center text-lg font-bold"
        >
          <Pause className="w-6 h-6 mr-2" />
          Pause
        </button>
      ) : (
        <button 
          onClick={onStart}
          className={`px-10 py-4 rounded-full text-white transition-all transform hover:scale-105 shadow-md flex items-center text-lg font-bold ${getMainColor()}`}
        >
          <Play className="w-6 h-6 mr-2 fill-current" />
          Start
        </button>
      )}

      <button 
        onClick={onSkip} 
        title="Skip Session"
        className="p-4 rounded-full bg-surface text-text-muted hover:text-text hover:bg-gray-100 transition-colors shadow-sm border border-border"
      >
        <SkipForward className="w-6 h-6" />
      </button>
    </div>
  );
};

export default TimerControls;
