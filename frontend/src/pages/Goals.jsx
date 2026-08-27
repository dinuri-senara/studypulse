import { useState, useEffect } from 'react';
import api from '../services/api';
import { Target, Plus, CheckCircle2, Circle, Clock, Edit2, Trash2, X } from 'lucide-react';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', description: '', targetMinutes: 60, deadline: '', subjectId: '' });

  const fetchGoals = async () => {
    try {
      const [goalsRes, subjectsRes] = await Promise.all([
        api.get('/goals'),
        api.get('/subjects')
      ]);
      setGoals(goalsRes.data);
      setSubjects(subjectsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load goals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ id: null, title: '', description: '', targetMinutes: 60, deadline: new Date().toISOString().split('T')[0], subjectId: '' });
    setShowModal(true);
  };

  const openEditModal = (goal) => {
    setIsEditing(true);
    setFormData({ 
      ...goal, 
      deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
      subjectId: goal.subjectId || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
      };
      if (isEditing) {
        await api.put(`/goals/${formData.id}`, payload);
      } else {
        await api.post('/goals', payload);
      }
      setShowModal(false);
      fetchGoals();
    } catch (err) {
      alert('Failed to save goal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this goal?')) {
      try {
        await api.delete(`/goals/${id}`);
        fetchGoals();
      } catch (err) {
        alert('Failed to delete goal');
      }
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.put(`/goals/${id}/complete`);
      fetchGoals();
    } catch (err) {
      alert('Failed to complete goal');
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Study Goals</h1>
          <p className="text-text-muted">Set and track your academic targets</p>
        </div>
        <button onClick={openAddModal} className="flex items-center px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4 mr-2" /> New Goal
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchGoals} className="underline font-medium">Retry</button>
        </div>
      )}

      {!loading && goals.length === 0 && !error ? (
        <div className="bg-surface rounded-2xl p-12 text-center border border-border shadow-soft">
          <Target className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-text mb-2">No goals set</h3>
          <p className="text-text-muted mb-6">Set a goal to keep your study sessions focused.</p>
          <button onClick={openAddModal} className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
            Create Goal
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {goals.map(goal => {
            const isCompleted = goal.status === 'COMPLETED';
            const progress = goal.targetMinutes > 0 ? Math.min(100, Math.round((goal.completedMinutes / goal.targetMinutes) * 100)) : 0;
            return (
              <div key={goal.id} className={`bg-surface p-6 rounded-2xl border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${isCompleted ? 'opacity-70' : ''}`}>
                <div className="flex items-start gap-4 flex-1">
                  <button onClick={() => !isCompleted && handleComplete(goal.id)} className={`mt-1 ${isCompleted ? 'text-green-500 cursor-default' : 'text-text-muted hover:text-green-500 transition-colors'}`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold text-lg ${isCompleted ? 'line-through text-text-muted' : 'text-text'}`}>{goal.title}</h3>
                      {goal.status === 'OVERDUE' && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">OVERDUE</span>}
                      {goal.status === 'IN_PROGRESS' && <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">IN PROGRESS</span>}
                    </div>
                    {goal.subjectName && <p className="text-sm font-medium text-primary mb-2">{goal.subjectName}</p>}
                    <p className="text-sm text-text-muted mb-3">{goal.description}</p>
                    
                    <div className="w-full max-w-md">
                      <div className="flex justify-between text-xs font-medium text-text-muted mb-1">
                        <span>{goal.completedMinutes} min</span>
                        <span>{goal.targetMinutes} min</span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div className={`h-full ${isCompleted ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:flex-col md:items-end justify-between">
                  {goal.deadline && (
                    <div className="flex items-center text-sm text-text-muted font-medium">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <button onClick={() => openEditModal(goal)} className="p-2 text-text-muted hover:text-primary bg-background rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(goal.id)} className="p-2 text-text-muted hover:text-red-500 bg-background rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{isEditing ? 'Edit Goal' : 'New Goal'}</h2>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text" required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject (Optional)</label>
                <select 
                  value={formData.subjectId}
                  onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
                >
                  <option value="">No specific subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Target (Minutes)</label>
                  <input 
                    type="number" required min="1"
                    value={formData.targetMinutes}
                    onChange={(e) => setFormData({...formData, targetMinutes: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deadline (Optional)</label>
                  <input 
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary h-20 resize-none"
                ></textarea>
              </div>
              <button type="submit" className="w-full py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
                {isEditing ? 'Save Changes' : 'Create Goal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
