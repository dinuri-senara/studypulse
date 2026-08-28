import React from 'react';

const SessionHistory = ({ sessions }) => {
  if (!sessions || sessions.length === 0) return null;

  const formatTimeRange = (startTime, durationMinutes) => {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    return `${start.toLocaleTimeString([], timeOptions)} - ${end.toLocaleTimeString([], timeOptions)}`;
  };

  return (
    <div className="bg-surface rounded-3xl p-8 shadow-soft border border-border mt-8">
      <h3 className="text-xl font-bold text-text mb-6">Today's Sessions</h3>
      <div className="space-y-4">
        {sessions.map((session, index) => (
          <div key={session.id || index} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-border">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-light/20 flex items-center justify-center text-primary mr-4">
                ✓
              </div>
              <div>
                <div className="font-medium text-text">
                  {session.subjectName || session.subject?.name || 'Self Study'}
                </div>
                <div className="text-sm text-text-muted mt-0.5">
                  {formatTimeRange(session.startTime, session.durationMinutes)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-text">{session.durationMinutes} min</div>
              <div className="text-xs text-primary bg-primary-light/20 px-2 py-1 rounded-full mt-1 inline-block">
                {session.sessionType || 'POMODORO'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionHistory;
