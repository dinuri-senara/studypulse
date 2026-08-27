import { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, Clock, Target, Flame } from 'lucide-react';

const COLORS = ['#FF6B9E', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [productivityData, setProductivityData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [streakData, setStreakData] = useState({ currentStreak: 0, bestStreak: 0 });
  const [hoursData, setHoursData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [weekly, productivity, subjects, streak, hours] = await Promise.all([
          api.get('/dashboard/weekly'),
          api.get('/dashboard/productivity'),
          api.get('/dashboard/subjects'),
          api.get('/dashboard/streak'),
          api.get('/dashboard/productive-hours')
        ]);
        
        setWeeklyData(weekly.data);
        setProductivityData(productivity.data);
        setSubjectData(subjects.data);
        setStreakData(streak.data);
        setHoursData(hours.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Analytics</h1>
        <p className="text-text-muted">Detailed insights into your study habits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-orange-100 text-orange-500 rounded-xl"><Flame className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-text-muted font-medium">Current Streak</p>
              <h3 className="text-2xl font-bold text-text">{streakData.currentStreak} Days</h3>
            </div>
          </div>
          <p className="text-xs text-text-muted">Best streak: {streakData.bestStreak} days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Time */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
          <h3 className="text-lg font-bold text-text mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary" /> Weekly Study Time (Minutes)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#FDF2F8'}} />
                <Bar dataKey="minutes" fill="#FF6B9E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Productivity Trend */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
          <h3 className="text-lg font-bold text-text mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary" /> Productivity Trend (1-5)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#FF6B9E" strokeWidth={3} dot={{ fill: '#FF6B9E', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
          <h3 className="text-lg font-bold text-text mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-primary" /> Time by Subject
          </h3>
          <div className="h-[300px]">
            {subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100}
                    paddingAngle={5}
                    dataKey="hours"
                    nameKey="subject"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-text-muted">No subject data available</div>
            )}
          </div>
        </div>

        {/* Most Productive Hours */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
          <h3 className="text-lg font-bold text-text mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary" /> Study Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hoursData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} />
                <Tooltip cursor={{fill: '#FDF2F8'}} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
