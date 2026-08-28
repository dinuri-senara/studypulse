import React, { useState, useEffect } from 'react';
import { usePomodoroTimer } from '../hooks/usePomodoroTimer';
import { getTodaysSessions, getSubjects, saveStudySession } from '../services/pomodoroService';
import PomodoroTimer from '../components/pomodoro/PomodoroTimer';
import TimerStats from '../components/pomodoro/TimerStats';
import SessionHistory from '../components/pomodoro/SessionHistory';
import CompletionModal from '../components/pomodoro/CompletionModal';

const Pomodoro = () => {
  const timer = usePomodoroTimer();
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    focusTimeMinutes: 0,
    sessionsCompleted: 0,
    currentStreak: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const fetchedSubjects = await getSubjects();
    setSubjects(fetchedSubjects);
    
    const todaysSessions = await getTodaysSessions();
    
    // Sort by most recent
    todaysSessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    setSessions(todaysSessions);
    
    // Calculate stats
    let totalMins = 0;
    let count = 0;
    
    todaysSessions.forEach(s => {
      if (s.sessionType === 'POMODORO') {
        totalMins += s.durationMinutes || 0;
        count++;
      }
    });

    setStats({
      focusTimeMinutes: totalMins,
      sessionsCompleted: count,
      currentStreak: count // Simplify streak for today as total consecutive pomodoros
    });
  };

  const handleSessionComplete = async ({ rating, startBreak }) => {
    try {
      const duration = timer.lastCompletedSession?.duration || timer.settings.focus;
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - duration * 60000);

      const payload = {
        subjectId: selectedSubject || null,
        sessionType: 'POMODORO',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationMinutes: duration,
        productivityRating: rating,
        sessionStatus: 'COMPLETED',
        notes: ''
      };

      await saveStudySession(payload);
      await loadData(); // refresh stats and history

      if (startBreak) {
        timer.completeFocusAndContinue();
      } else {
        timer.setShowCompletionModal(false);
      }
    } catch (err) {
      console.error('Failed to save session', err);
      // Even if it fails to save, we should let them continue
      if (startBreak) {
        timer.completeFocusAndContinue();
      } else {
        timer.setShowCompletionModal(false);
      }
    }
  };

  const handleSkipBreak = ({ rating }) => {
    timer.skipBreak();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-text">Pomodoro Timer</h1>
        <p className="text-text-muted mt-1">Focus on your studies with timed intervals.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border flex items-center justify-between">
        <div>
          <h3 className="font-medium text-text mb-1">What are you focusing on?</h3>
          <p className="text-sm text-text-muted">Select a subject to track your time automatically.</p>
        </div>
        <select 
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary min-w-[200px]"
        >
          <option value="">No Subject</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <PomodoroTimer timer={timer} />

      <TimerStats 
        focusTimeMinutes={stats.focusTimeMinutes}
        sessionsCompleted={stats.sessionsCompleted}
        currentStreak={stats.currentStreak}
      />

      <SessionHistory sessions={sessions} />

      {timer.showCompletionModal && (
        <CompletionModal 
          duration={timer.lastCompletedSession?.duration}
          currentStreak={stats.currentStreak + 1}
          onComplete={handleSessionComplete}
          onSkipBreak={() => {
            handleSessionComplete({ rating: 5, startBreak: false });
          }}
        />
      )}
    </div>
  );
};

export default Pomodoro;
