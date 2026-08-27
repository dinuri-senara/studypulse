import { useState, useEffect } from 'react';
import api from '../services/api';
import { BookOpen, Clock, Calendar, Plus, Edit2, Trash2, X, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ subjectId: '', sessionType: 'LECTURE', durationMinutes: 60, productivityRating: 5, notes: '' });
  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      const [sessionsRes, subjectsRes] = await Promise.all([
        api.get('/study-sessions'),
        api.get('/subjects')
      ]);
      setSessions(sessionsRes.data);
      setSubjects(subjectsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load study sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + formData.durationMinutes * 60000).toISOString(),
        sessionStatus: 'COMPLETED'
      };
      await api.post('/study-sessions', payload);
      setShowModal(false);
      fetchSessions();
    } catch (err) {
      alert('Failed to save session');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this session?')) {
      try {
        await api.delete(/study-sessions/);
        fetchSessions();
      } catch (err) {
        alert('Failed to delete session');
      }
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Study Sessions</h1>
          <p className="text-text-muted">Track and manage your study history</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/pomodoro')} className="flex items-center px-4 py-2 bg-white text-primary border border-primary rounded-xl font-medium hover:bg-background transition-colors">
            <Play className="w-4 h-4 mr-2" /> Live Session
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Log Session
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchSessions} className="underline font-medium">Retry</button>
        </div>
      )}

      {!loading && sessions.length === 0 && !error ? (
        <div className="bg-surface rounded-2xl p-12 text-center border border-border shadow-soft">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-text mb-2">No study sessions yet</h3>
          <p className="text-text-muted mb-6">Start your first study session to see your productivity analytics.</p>
          <button onClick={() => navigate('/pomodoro')} className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
            Start Studying
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map(session => (
            <div key={session.id} className="bg-surface p-6 rounded-2xl border border-border shadow-soft flex justify-between items-center">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text">{session.subjectName || 'Uncategorized'}</h3>
                  <div className="flex items-center gap-4 text-sm text-text-muted mt-1">
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {session.durationMinutes} min</span>
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(session.startTime).toLocaleDateString()}</span>
                    <span className="bg-background px-2 py-0.5 rounded-full text-xs font-medium text-primary">{session.sessionType}</span>
                  </div>
                  {session.notes && <p className="text-sm text-text mt-2">{session.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right mr-4">
                  <div className="text-sm font-medium text-text">Productivity</div>
                  <div className="flex text-yellow-400">
                    {'?'.repeat(session.productivityRating)}{'?'.repeat(5-session.productivityRating)}
                  </div>
                </div>
                <button onClick={() => handleDelete(session.id)} className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Log Study Session</h2>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select 
                    value={formData.sessionType}
                    onChange={(e) => setFormData({...formData, sessionType: e.target.value})}
                    className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
                  >
                    <option value="LECTURE">Lecture</option>
                    <option value="SELF_STUDY">Self Study</option>
                    <option value="REVISION">Revision</option>
                    <option value="ASSIGNMENT">Assignment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (min)</label>
                  <input 
                    type="number" required min="1"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({...formData, durationMinutes: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Productivity Rating (1-5)</label>
                <input 
                  type="range" min="1" max="5"
                  value={formData.productivityRating}
                  onChange={(e) => setFormData({...formData, productivityRating: Number(e.target.value)})}
                  className="w-full accent-primary"
                />
                <div className="text-center text-primary font-bold">{formData.productivityRating} / 5</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary h-24 resize-none"
                ></textarea>
              </div>
              <button type="submit" className="w-full py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
                Save Session
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySessions;
