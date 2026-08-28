import React, { useState, useEffect } from 'react';
import TimerCircle from './TimerCircle';
import TimerControls from './TimerControls';
import TimerSettings from './TimerSettings';
import { Settings, CheckCircle2 } from 'lucide-react';

const PomodoroTimer = ({ timer, onSaveSession }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState('');

  const focusMessages = [
    "🌸 You've got this!",
    "🧠 Deep focus starts now.",
    "💪 Keep going!",
    "✨ One session closer to your goal.",
    "🎯 Stay focused. You've got this!"
  ];

  useEffect(() => {
    if (timer.mode === timer.MODES.FOCUS && timer.isActive) {
      setMessage(focusMessages[Math.floor(Math.random() * focusMessages.length)]);
    } else if (timer.mode === timer.MODES.FOCUS) {
      setMessage("Ready to focus?");
    } else if (timer.mode === timer.MODES.SHORT_BREAK) {
      setMessage("☕ Time for a quick break.");
    } else if (timer.mode === timer.MODES.LONG_BREAK) {
      setMessage("🌙 You earned a long rest.");
    }
  }, [timer.mode, timer.isActive]);

  const getModeLabel = () => {
    if (timer.mode === timer.MODES.FOCUS) return '🌸 Focus Session';
    if (timer.mode === timer.MODES.SHORT_BREAK) return '☕ Short Break';
    return '🌙 Long Break';
  };

  const getPresets = () => [
    { label: 'Classic', times: '25/5', data: { focus: 25, shortBreak: 5, longBreak: 15 } },
    { label: 'Deep Work', times: '50/10', data: { focus: 50, shortBreak: 10, longBreak: 30 } },
    { label: 'Long Focus', times: '90/20', data: { focus: 90, shortBreak: 20, longBreak: 45 } },
  ];

  return (
    <div className="bg-surface rounded-3xl p-10 shadow-soft border border-border text-center relative overflow-hidden transition-all duration-300">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-2">
          {getPresets().map(p => (
            <button 
              key={p.label}
              onClick={() => timer.applyPreset(p.data)}
              className="text-xs px-3 py-1.5 rounded-full bg-background border border-border text-text-muted hover:text-text hover:border-primary transition-colors"
            >
              {p.label} <span className="opacity-50 ml-1">{p.times}</span>
            </button>
          ))}
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 text-text-muted hover:text-text hover:bg-gray-100 rounded-full transition-colors flex items-center"
        >
          <Settings className="w-5 h-5 mr-2" /> Custom
        </button>
      </div>

      {/* Mode Indicator & Message */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-text mb-2 animate-in slide-in-from-bottom-2">{getModeLabel()}</h2>
        <p className="text-text-muted text-lg min-h-[1.75rem] italic">{message}</p>
      </div>

      {/* Timer Circle */}
      <TimerCircle 
        timeLeft={timer.timeLeft} 
        totalTime={
          timer.mode === timer.MODES.FOCUS ? timer.settings.focus * 60 :
          timer.mode === timer.MODES.SHORT_BREAK ? timer.settings.shortBreak * 60 :
          timer.settings.longBreak * 60
        }
        mode={timer.mode}
      />

      {/* Cycle Indicator */}
      <div className="flex justify-center items-center space-x-2 text-text-muted font-medium mb-2">
        <span className="text-lg">🍅</span>
        <span>{timer.cycleCount} / {timer.settings.longBreakInterval}</span>
      </div>

      {/* Controls */}
      <TimerControls 
        isActive={timer.isActive}
        onStart={timer.startTimer}
        onPause={timer.pauseTimer}
        onReset={timer.resetTimer}
        onSkip={timer.skipTimer}
        mode={timer.mode}
      />

      {showSettings && (
        <TimerSettings 
          settings={timer.settings}
          onSave={timer.updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default PomodoroTimer;
