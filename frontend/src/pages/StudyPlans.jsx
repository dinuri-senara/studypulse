import { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, Plus, CheckSquare, Square, Trash2, Edit2, X, PlusCircle } from 'lucide-react';

const StudyPlans = () => {
  const [plans, setPlans] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [activePlanId, setActivePlanId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [planData, setPlanData] = useState({ id: null, title: '', description: '', startDate: '', endDate: '' });
  const [itemData, setItemData] = useState({ subjectId: '', taskTitle: '', plannedMinutes: 60, scheduledDate: '' });

  const fetchPlans = async () => {
    try {
      const [plansRes, subjectsRes] = await Promise.all([
        api.get('/study-plans'),
        api.get('/subjects')
      ]);
      setPlans(plansRes.data);
      setSubjects(subjectsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load study plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openPlanModal = (plan = null) => {
    if (plan) {
      setIsEditing(true);
      setPlanData({
        ...plan,
        startDate: plan.startDate || '',
        endDate: plan.endDate || ''
      });
    } else {
      setIsEditing(false);
      const today = new Date().toISOString().split('T')[0];
      setPlanData({ id: null, title: '', description: '', startDate: today, endDate: today });
    }
    setShowPlanModal(true);
  };

  const openItemModal = (planId) => {
    setActivePlanId(planId);
    setItemData({ subjectId: '', taskTitle: '', plannedMinutes: 60, scheduledDate: new Date().toISOString().slice(0, 16) });
    setShowItemModal(true);
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/study-plans/${planData.id}`, planData);
      } else {
        await api.post('/study-plans', planData);
      }
      setShowPlanModal(false);
      fetchPlans();
    } catch (err) {
      alert('Failed to save plan');
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...itemData,
        scheduledDate: new Date(itemData.scheduledDate).toISOString()
      };
      await api.post(`/study-plans/${activePlanId}/items`, payload);
      setShowItemModal(false);
      fetchPlans();
    } catch (err) {
      alert('Failed to add task');
    }
  };

  const handleCompleteItem = async (planId, itemId) => {
    try {
      await api.put(`/study-plans/${planId}/items/${itemId}/complete`);
      fetchPlans();
    } catch (err) {
      alert('Failed to complete task');
    }
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm('Delete this study plan?')) {
      try {
        await api.delete(`/study-plans/${id}`);
        fetchPlans();
      } catch (err) {
        alert('Failed to delete plan');
      }
    }
  };

  const handleDeleteItem = async (planId, itemId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/study-plans/${planId}/items/${itemId}`);
        fetchPlans();
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Study Plans</h1>
          <p className="text-text-muted">Organize your upcoming tasks and schedules</p>
        </div>
        <button onClick={() => openPlanModal()} className="flex items-center px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Create Plan
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchPlans} className="underline font-medium">Retry</button>
        </div>
      )}

      {!loading && plans.length === 0 && !error ? (
        <div className="bg-surface rounded-2xl p-12 text-center border border-border shadow-soft">
          <Calendar className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-text mb-2">No study plans created</h3>
          <p className="text-text-muted mb-6">Create a structured plan to organize your study sessions.</p>
          <button onClick={() => openPlanModal()} className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
            Create First Plan
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {plans.map(plan => (
            <div key={plan.id} className="bg-surface rounded-2xl border border-border shadow-soft overflow-hidden">
              <div className="p-6 border-b border-border bg-gray-50 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-text">{plan.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-text-muted font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>{plan.startDate} to {plan.endDate}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">{plan.status}</span>
                  </div>
                  {plan.description && <p className="text-sm text-text-muted mt-2">{plan.description}</p>}
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => openPlanModal(plan)} className="p-2 text-text-muted hover:text-primary bg-white rounded-lg border border-border transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeletePlan(plan.id)} className="p-2 text-text-muted hover:text-red-500 bg-white rounded-lg border border-border transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-text">Scheduled Tasks</h4>
                  <button onClick={() => openItemModal(plan.id)} className="text-sm flex items-center text-primary font-medium hover:text-primary-dark">
                    <PlusCircle className="w-4 h-4 mr-1" /> Add Task
                  </button>
                </div>

                {plan.items && plan.items.length > 0 ? (
                  <div className="space-y-3">
                    {plan.items.map(item => (
                      <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border border-border ${item.status === 'COMPLETED' ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
                        <div className="flex items-center gap-4">
                          <button onClick={() => item.status !== 'COMPLETED' && handleCompleteItem(plan.id, item.id)} className={`${item.status === 'COMPLETED' ? 'text-green-500 cursor-default' : 'text-text-muted hover:text-primary'}`}>
                            {item.status === 'COMPLETED' ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                          </button>
                          <div>
                            <div className="font-medium text-text flex items-center gap-2">
                              <span className={item.status === 'COMPLETED' ? 'line-through' : ''}>{item.taskTitle}</span>
                              {item.subjectName && <span className="text-xs font-bold bg-primary-light bg-opacity-20 text-primary px-2 py-0.5 rounded-full">{item.subjectName}</span>}
                            </div>
                            <div className="text-xs text-text-muted mt-1 flex gap-4">
                              <span>Scheduled: {new Date(item.scheduledDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                              <span>Plan: {item.plannedMinutes}m</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteItem(plan.id, item.id)} className="p-2 text-text-muted hover:text-red-500 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-text-muted text-sm">No tasks added to this plan yet.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals... */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{isEditing ? 'Edit Plan' : 'Create Plan'}</h2>
              <button onClick={() => setShowPlanModal(false)} className="text-text-muted hover:text-text"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handlePlanSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Plan Title</label>
                <input type="text" required value={planData.title} onChange={(e) => setPlanData({...planData, title: e.target.value})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input type="date" required value={planData.startDate} onChange={(e) => setPlanData({...planData, startDate: e.target.value})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input type="date" required value={planData.endDate} onChange={(e) => setPlanData({...planData, endDate: e.target.value})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                <textarea value={planData.description} onChange={(e) => setPlanData({...planData, description: e.target.value})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:border-primary h-20 resize-none"></textarea>
              </div>
              <button type="submit" className="w-full py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark">Save Plan</button>
            </form>
          </div>
        </div>
      )}

      {showItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add Task</h2>
              <button onClick={() => setShowItemModal(false)} className="text-text-muted hover:text-text"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleItemSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Task Title</label>
                <input type="text" required value={itemData.taskTitle} onChange={(e) => setItemData({...itemData, taskTitle: e.target.value})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject (Optional)</label>
                <select value={itemData.subjectId} onChange={(e) => setItemData({...itemData, subjectId: e.target.value})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:border-primary">
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Planned Min</label>
                  <input type="number" required min="1" value={itemData.plannedMinutes} onChange={(e) => setItemData({...itemData, plannedMinutes: Number(e.target.value)})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Scheduled For</label>
                  <input type="datetime-local" required value={itemData.scheduledDate} onChange={(e) => setItemData({...itemData, scheduledDate: e.target.value})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:border-primary text-sm" />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark">Add Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlans;
