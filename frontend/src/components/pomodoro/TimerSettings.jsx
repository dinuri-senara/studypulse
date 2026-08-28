import React, { useState } from 'react';
import { X } from 'lucide-react';

const TimerSettings = ({ settings, onSave, onClose }) => {
  const [formData, setFormData] = useState({ ...settings });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let parsedValue = value;
    if (type === 'number') {
      parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue) || parsedValue <= 0) return; // Basic validation
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parsedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ask for notification permission if they just enabled it
    if (formData.notifications && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-surface rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text">Customize Timer</h2>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-text border-b border-border pb-2">Durations (minutes)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-text-muted">Focus Duration</label>
                <input 
                  type="number" 
                  name="focus" 
                  min="1" max="180" 
                  value={formData.focus} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-text-muted">Short Break</label>
                <input 
                  type="number" 
                  name="shortBreak" 
                  min="1" max="60" 
                  value={formData.shortBreak} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-text-muted">Long Break</label>
                <input 
                  type="number" 
                  name="longBreak" 
                  min="1" max="120" 
                  value={formData.longBreak} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-text-muted">Long Break After</label>
                <input 
                  type="number" 
                  name="longBreakInterval" 
                  min="1" max="10" 
                  value={formData.longBreakInterval} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-text border-b border-border pb-2">Behavior</h3>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-text-muted">Auto-start Break</span>
              <input type="checkbox" name="autoStartBreak" checked={formData.autoStartBreak} onChange={handleChange} className="w-5 h-5 text-primary rounded focus:ring-primary accent-primary" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-text-muted">Auto-start Focus</span>
              <input type="checkbox" name="autoStartFocus" checked={formData.autoStartFocus} onChange={handleChange} className="w-5 h-5 text-primary rounded focus:ring-primary accent-primary" />
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-text border-b border-border pb-2">Notifications</h3>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-text-muted">Sound Notifications 🔔</span>
              <input type="checkbox" name="sound" checked={formData.sound} onChange={handleChange} className="w-5 h-5 text-primary rounded focus:ring-primary accent-primary" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-text-muted">Browser Notifications 💬</span>
              <input type="checkbox" name="notifications" checked={formData.notifications} onChange={handleChange} className="w-5 h-5 text-primary rounded focus:ring-primary accent-primary" />
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-text-muted hover:bg-gray-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-sm">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimerSettings;
