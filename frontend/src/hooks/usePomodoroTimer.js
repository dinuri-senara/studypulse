import { useState, useEffect, useCallback } from 'react';

const DEFAULT_SETTINGS = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  autoStartBreak: false,
  autoStartFocus: false,
  sound: true,
  notifications: false,
};

const MODES = {
  FOCUS: 'FOCUS',
  SHORT_BREAK: 'SHORT_BREAK',
  LONG_BREAK: 'LONG_BREAK'
};

export const usePomodoroTimer = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pomodoroSettings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  const [mode, setMode] = useState(() => localStorage.getItem('pomodoroMode') || MODES.FOCUS);
  const [isActive, setIsActive] = useState(() => localStorage.getItem('pomodoroIsActive') === 'true');
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('pomodoroTimeLeft');
    return saved ? parseInt(saved, 10) : settings.focus * 60;
  });
  
  // To handle exact timestamp calculation
  const [targetTime, setTargetTime] = useState(() => {
    const saved = localStorage.getItem('pomodoroTargetTime');
    return saved ? parseInt(saved, 10) : null;
  });

  const [cycleCount, setCycleCount] = useState(() => {
    const saved = localStorage.getItem('pomodoroCycleCount');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [lastCompletedSession, setLastCompletedSession] = useState(null); // to pass to modal

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    localStorage.setItem('pomodoroMode', mode);
    localStorage.setItem('pomodoroIsActive', isActive);
    localStorage.setItem('pomodoroTimeLeft', timeLeft);
    if (targetTime) {
      localStorage.setItem('pomodoroTargetTime', targetTime);
    } else {
      localStorage.removeItem('pomodoroTargetTime');
    }
    localStorage.setItem('pomodoroCycleCount', cycleCount);
  }, [settings, mode, isActive, timeLeft, targetTime, cycleCount]);

  // Main timer logic
  useEffect(() => {
    let intervalId;

    if (isActive) {
      if (!targetTime) {
        // Just started or resumed
        const newTarget = Date.now() + timeLeft * 1000;
        setTargetTime(newTarget);
      } else {
        // Calculate remaining time
        intervalId = setInterval(() => {
          const remaining = Math.round((targetTime - Date.now()) / 1000);
          
          if (remaining <= 0) {
            handleSessionComplete();
          } else {
            setTimeLeft(remaining);
          }
        }, 500); // Check twice a second for smoothness
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, targetTime, timeLeft, mode]); // removed dependencies that cause loops, rely on targetTime

  const handleSessionComplete = useCallback(() => {
    setIsActive(false);
    setTimeLeft(0);
    setTargetTime(null);
    playSoundAndNotify();

    if (mode === MODES.FOCUS) {
      setLastCompletedSession({ duration: settings.focus });
      setShowCompletionModal(true);
    } else {
      // Break is complete
      transitionNextState();
      
      if (settings.autoStartFocus) {
         // Auto start next focus
         setTimeout(() => {
           setIsActive(true);
         }, 1000);
      }
    }
  }, [mode, settings]);

  const playSoundAndNotify = () => {
    if (settings.sound) {
      try {
        new Audio('/notification.mp3').play().catch(() => {});
      } catch (e) {}
    }
    
    if (settings.notifications && Notification.permission === 'granted') {
      const title = mode === MODES.FOCUS ? 'Focus Session Complete!' : 'Break Finished!';
      const body = mode === MODES.FOCUS ? 'Great job! Time for a break.' : 'Ready to focus again?';
      new Notification(`StudyPulse \u2014 ${title}`, { body, icon: '/vite.svg' });
    }
  };

  const transitionNextState = () => {
    if (mode === MODES.FOCUS) {
      // Transition to break
      if (cycleCount >= settings.longBreakInterval) {
        setMode(MODES.LONG_BREAK);
        setTimeLeft(settings.longBreak * 60);
      } else {
        setMode(MODES.SHORT_BREAK);
        setTimeLeft(settings.shortBreak * 60);
      }
    } else {
      // Transition back to focus from break
      if (mode === MODES.LONG_BREAK) {
        setCycleCount(1);
      } else {
        setCycleCount(c => c + 1);
      }
      setMode(MODES.FOCUS);
      setTimeLeft(settings.focus * 60);
    }
    setTargetTime(null);
  };

  const completeFocusAndContinue = () => {
    setShowCompletionModal(false);
    transitionNextState();
    if (settings.autoStartBreak) {
      setIsActive(true);
    }
  };

  const startTimer = () => setIsActive(true);
  
  const pauseTimer = () => {
    setIsActive(false);
    setTargetTime(null);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTargetTime(null);
    if (mode === MODES.FOCUS) setTimeLeft(settings.focus * 60);
    else if (mode === MODES.SHORT_BREAK) setTimeLeft(settings.shortBreak * 60);
    else if (mode === MODES.LONG_BREAK) setTimeLeft(settings.longBreak * 60);
  };

  const skipTimer = () => {
    setIsActive(false);
    setTargetTime(null);
    if (mode === MODES.FOCUS) {
      setLastCompletedSession({ duration: settings.focus });
      setShowCompletionModal(true);
    } else {
      transitionNextState();
    }
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    // If timer is not active, immediately apply new durations to timeLeft
    if (!isActive) {
      if (mode === MODES.FOCUS) setTimeLeft(newSettings.focus * 60);
      else if (mode === MODES.SHORT_BREAK) setTimeLeft(newSettings.shortBreak * 60);
      else if (mode === MODES.LONG_BREAK) setTimeLeft(newSettings.longBreak * 60);
    }
  };

  // Helper for preset changes
  const applyPreset = (preset) => {
    updateSettings({ ...settings, focus: preset.focus, shortBreak: preset.shortBreak, longBreak: preset.longBreak });
    setMode(MODES.FOCUS);
    setCycleCount(1);
    setIsActive(false);
    setTargetTime(null);
    setTimeLeft(preset.focus * 60);
  };

  // When returning to focus from the "skip break" button during a break
  const skipBreak = () => {
     setIsActive(false);
     setTargetTime(null);
     transitionNextState();
  };

  return {
    mode,
    MODES,
    isActive,
    timeLeft,
    cycleCount,
    settings,
    showCompletionModal,
    lastCompletedSession,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    skipBreak,
    updateSettings,
    applyPreset,
    completeFocusAndContinue,
    setShowCompletionModal
  };
};
