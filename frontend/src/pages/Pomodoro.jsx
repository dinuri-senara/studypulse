import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Timer as TimerIcon, Save, X } from 'lucide-react';
import api from '../services/api';

const PRESETS = {
  '25': { work: 25, break: 5 },
  '50': { work: 50, break: 10 },
  '90': { work: 90, break: 20 },
};

const Pomodoro = () => {
  const [mode, setMode] = useState('25');
  const [isWork, setIsWork] = useState(true);
  const [timeLeft, setTimeLeft] = useState(PRESETS['25'].work * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({ subjectId: '', sessionType: 'SELF_STUDY', notes: '' });

  useEffect(() => {
    // Load subjects for the save modal
    api.get('/subjects').then(res => setSubjects(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
      
      // Play sound
      try {
        new Audio('/notification.mp3').play().catch(e => console.log('Audio disabled'));
      } catch(e){}

      if (isWork) {
        setSessionCount(c => c + 1);
        setIsWork(false);
        setTimeLeft(PRESETS[mode].break * 60);
        // Auto-start break
        setTimeout(() => setIsActive(true), 1000);
      } else {
        setIsWork(true);
        setTimeLeft(PRESETS[mode].work * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isWork, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsWork(true);
    setTimeLeft(PRESETS[mode].work * 60);
  };

  const skipTimer = () => {
    setIsActive(false);
    if (isWork) {
      setSessionCount(c => c + 1);
      setIsWork(false);
      setTimeLeft(PRESETS[mode].break * 60);
    } else {
      setIsWork(true);
      setTimeLeft(PRESETS[mode].work * 60);
    }
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setIsWork(true);
    setTimeLeft(PRESETS[newMode].work * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSaveSession = async (e) => {
    e.preventDefault();
    try {
      const duration = parseInt(mode) * sessionCount;
      const payload = {
        ...formData,
        durationMinutes: duration,
        productivityRating: 5,
        startTime: new Date(Date.now() - duration * 60000).toISOString(),
        endTime: new Date().toISOString(),
        sessionStatus: 'COMPLETED'
      };
      await api.post('/study-sessions', payload);
      setShowSaveModal(false);
      setSessionCount(0); // Reset after save
      alert('Session saved successfully!');
    } catch (err) {
      alert('Failed to save session');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text">Pomodoro Timer</h1>
        <p className="text-text-muted mt-1">Focus on your studies with timed intervals.</p>
      </div>

      <div className="bg-surface rounded-3xl p-10 shadow-soft border border-border text-center relative overflow-hidden">
        {/* State Indicator */}
        <div className={`absolute top-0 left-0 w-full h-1.5 ${isWork ? 'bg-primary' : 'bg-green-500'}`}></div>

        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-background text-sm font-medium mb-8">
          <span className={`w-2 h-2 rounded-full ${isWork ? 'bg-primary' : 'bg-green-500'} animate-pulse`}></span>
          <span>{isWork ? 'Focus Session' : 'Break Time'}</span>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center space-x-4 mb-10">
          {Object.entries(PRESETS).map(([val, times]) => (
            <button
              key={val}
              onClick={() => changeMode(val)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                mode === val 
                  ? 'bg-primary-light text-white' 
                  : 'bg-background text-text-muted hover:text-text'
              }`}
            >
              {times.work} / {times.break}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="text-8xl font-bold text-text mb-12 tabular-nums tracking-tight">
          {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center space-x-6">
          <button onClick={resetTimer} className="p-4 rounded-full bg-background text-text-muted hover:text-text hover:bg-gray-100 transition-colors">
            <RotateCcw className="w-8 h-8" />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`p-6 rounded-full text-white transition-all transform hover:scale-105 shadow-md ${
              isActive ? 'bg-red-500 hover:bg-red-600' : (isWork ? 'bg-primary hover:bg-primary-dark' : 'bg-green-500 hover:bg-green-600')
            }`}
          >
            {isActive ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
          </button>

          <button onClick={skipTimer} className="p-4 rounded-full bg-background text-text-muted hover:text-text hover:bg-gray-100 transition-colors">
            <SkipForward className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Stats/Save section */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex items-center text-text-muted">
          <TimerIcon className="w-5 h-5 mr-2 text-primary" />
          <span className="font-medium">Completed Pomodoros: {sessionCount}</span>
        </div>
        <button 
          onClick={() => setShowSaveModal(true)}
          className="flex items-center px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
          disabled={sessionCount === 0}
        >
          <Save className="w-4 h-4 mr-2" /> Save Progress
        </button>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Save Study Session</h2>
              <button onClick={() => setShowSaveModal(false)} className="text-text-muted hover:text-text"><X className="w-5 h-5" /></button>
            </div>
            <p className="mb-4 text-text-muted">You completed {sessionCount} session(s) of {mode} minutes ({parseInt(mode) * sessionCount} minutes total).</p>
            <form onSubmit={handleSaveSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <select 
                  required
                  value={formData.subjectId}
                  onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
                >
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary h-24 resize-none"
                  placeholder="What did you work on?"
                ></textarea>
              </div>
              <button type="submit" className="w-full py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
                Save & Reset Timer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pomodoro;
