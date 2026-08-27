import { useState } from 'react';
import { Bell, Moon, Lock, Globe, Shield, Smartphone } from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    studyReminders: true,
    goalAlerts: true,
    weeklyReports: false
  });
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="text-text-muted">Manage your app preferences and configurations</p>
      </div>

      <div className="bg-surface rounded-3xl border border-border shadow-soft overflow-hidden">
        
        {/* Appearance */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center mb-4">
            <Moon className="w-5 h-5 text-primary mr-3" />
            <h2 className="text-lg font-bold text-text">Appearance</h2>
          </div>
          <div className="flex items-center justify-between ml-8">
            <div>
              <p className="font-medium text-text">Dark Mode</p>
              <p className="text-sm text-text-muted">Switch between light and dark themes (Coming soon)</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} disabled />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary opacity-50"></div>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-primary mr-3" />
            <h2 className="text-lg font-bold text-text">Notifications</h2>
          </div>
          <div className="space-y-4 ml-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text">Study Reminders</p>
                <p className="text-sm text-text-muted">Get reminded to start your scheduled sessions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications.studyReminders} onChange={(e) => setNotifications({...notifications, studyReminders: e.target.checked})} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text">Goal Alerts</p>
                <p className="text-sm text-text-muted">Notifications about approaching deadlines</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications.goalAlerts} onChange={(e) => setNotifications({...notifications, goalAlerts: e.target.checked})} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-primary mr-3" />
            <h2 className="text-lg font-bold text-text">Security</h2>
          </div>
          <div className="space-y-4 ml-8">
            <button className="flex items-center text-primary font-medium hover:text-primary-dark transition-colors">
              <Lock className="w-4 h-4 mr-2" /> Change Password
            </button>
            <button className="flex items-center text-primary font-medium hover:text-primary-dark transition-colors">
              <Smartphone className="w-4 h-4 mr-2" /> Two-Factor Authentication
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
