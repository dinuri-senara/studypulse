import { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Timer, 
  Target, 
  Calendar, 
  BarChart, 
  BrainCircuit, 
  Settings, 
  LogOut,
  Bell,
  Search
} from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Study Sessions', path: '/study-sessions', icon: BookOpen },
    { name: 'Pomodoro', path: '/pomodoro', icon: Timer },
    { name: 'Subjects', path: '/subjects', icon: BookOpen },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Study Plans', path: '/study-plans', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart },
    { name: 'AI Advisor', path: '/ai-advisor', icon: BrainCircuit },
  ];

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col shadow-soft">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="text-2xl font-bold text-primary">StudyPulse</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4 flex flex-col justify-between">
          <nav className="space-y-1 px-3 mb-6">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-xl transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-soft'
                      : 'text-text-muted hover:bg-background hover:text-primary'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
          
          <nav className="space-y-1 px-3 border-t border-border pt-4">
             <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-xl transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-soft'
                      : 'text-text-muted hover:bg-background hover:text-primary'
                  }`
                }
              >
                <div className="w-5 h-5 mr-3 rounded-full bg-primary-light flex items-center justify-center text-white text-xs font-bold">
                    {user?.fullName?.charAt(0) || 'U'}
                </div>
                <span className="font-medium">Profile</span>
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-xl transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-soft'
                      : 'text-text-muted hover:bg-background hover:text-primary'
                  }`
                }
              >
                <Settings className="w-5 h-5 mr-3" />
                <span className="font-medium">Settings</span>
              </NavLink>
          </nav>
        </div>
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 rounded-xl text-text-muted hover:bg-background hover:text-primary transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center bg-background rounded-full px-4 py-2 w-96 border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <Search className="w-5 h-5 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none focus:outline-none ml-2 w-full text-sm"
            />
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-text-muted hover:text-primary relative transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-white font-bold">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="font-medium text-sm">{user?.fullName || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-background">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
