import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Clock, TrendingUp, Calendar, Zap, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-surface rounded-2xl p-6 shadow-soft border border-border flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-text">{value}</h3>
    </div>
    <div className={`p-4 rounded-xl ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock chart data for initial view
  const weeklyData = [
    { name: 'Mon', minutes: 120 },
    { name: 'Tue', minutes: 180 },
    { name: 'Wed', minutes: 90 },
    { name: 'Thu', minutes: 210 },
    { name: 'Fri', minutes: 150 },
    { name: 'Sat', minutes: 240 },
    { name: 'Sun', minutes: 60 },
  ];

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/dashboard/summary');
        setSummary(data);
      } catch (e) {
        console.error('Failed to fetch summary', e);
        // Fallback for development if backend isn't ready
        setSummary({
          todaysStudyTime: '2h 35m',
          weeklyStudyTime: '14h 20m',
          productivityScore: 82,
          studyStreak: 7
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Good Morning, {user?.fullName?.split(' ')[0] || 'Student'} 👋</h1>
        <p className="text-text-muted mt-1">Let's make today productive.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Study Time" 
          value={summary?.todaysStudyTime || '0m'} 
          icon={Clock} 
          colorClass="bg-pink-100 text-pink-500" 
        />
        <StatCard 
          title="Weekly Study Time" 
          value={summary?.weeklyStudyTime || '0m'} 
          icon={Calendar} 
          colorClass="bg-purple-100 text-purple-500" 
        />
        <StatCard 
          title="Productivity Score" 
          value={`${summary?.productivityScore || 0}%`} 
          icon={TrendingUp} 
          colorClass="bg-blue-100 text-blue-500" 
        />
        <StatCard 
          title="Study Streak" 
          value={`${summary?.studyStreak || 0} days 🔥`} 
          icon={Zap} 
          colorClass="bg-orange-100 text-orange-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-border shadow-soft">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary" />
            Weekly Activity
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#FCE7F3' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                />
                <Bar dataKey="minutes" fill="#EC4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Subject Performance Mock */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
          <h3 className="text-lg font-bold mb-4">Top Subjects</h3>
          <div className="space-y-4">
            {[
              { name: 'Java', progress: 82 },
              { name: 'Database', progress: 70 },
              { name: 'Algorithms', progress: 61 },
              { name: 'Web Dev', progress: 88 },
            ].map(subject => (
              <div key={subject.name}>
                <div className="flex justify-between text-sm mb-1 text-text font-medium">
                  <span>{subject.name}</span>
                  <span>{subject.progress}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${subject.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
