import { useState, useEffect } from 'react';
import api from '../services/api';
import { BookOpen, Plus, Edit2, Trash2, X } from 'lucide-react';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', code: '', description: '' });

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      setSubjects(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load subjects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ id: null, name: '', code: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (subject) => {
    setIsEditing(true);
    setFormData({ ...subject });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/subjects/${formData.id}`, formData);
      } else {
        await api.post('/subjects', formData);
      }
      setShowModal(false);
      fetchSubjects();
    } catch (err) {
      alert('Failed to save subject');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.delete(`/subjects/${id}`);
        fetchSubjects();
      } catch (err) {
        alert('Failed to delete subject');
      }
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Subjects</h1>
          <p className="text-text-muted">Manage your study subjects</p>
        </div>
        <button onClick={openAddModal} className="flex items-center px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Subject
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchSubjects} className="underline font-medium">Retry</button>
        </div>
      )}

      {!loading && subjects.length === 0 && !error ? (
        <div className="bg-surface rounded-2xl p-12 text-center border border-border shadow-soft">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-text mb-2">No subjects yet</h3>
          <p className="text-text-muted mb-6">Add your subjects to start tracking them.</p>
          <button onClick={openAddModal} className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
            Add Subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <div key={subject.id} className="bg-surface p-6 rounded-2xl border border-border shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-light bg-opacity-20 flex items-center justify-center text-primary">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => openEditModal(subject)} className="p-2 text-text-muted hover:text-primary bg-background rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(subject.id)} className="p-2 text-text-muted hover:text-red-500 bg-background rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-text">{subject.name}</h3>
                {subject.code && <p className="text-sm font-medium text-primary mb-2">{subject.code}</p>}
                <p className="text-sm text-text-muted line-clamp-2">{subject.description || 'No description'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{isEditing ? 'Edit Subject' : 'Add Subject'}</h2>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course Code</label>
                <input 
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary h-24 resize-none"
                ></textarea>
              </div>
              <button type="submit" className="w-full py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
                {isEditing ? 'Save Changes' : 'Create Subject'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
