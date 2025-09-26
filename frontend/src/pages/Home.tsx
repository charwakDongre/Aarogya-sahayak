import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  MessageCircle, 
  Bell, 
  TrendingUp, 
  Calendar,
  Heart,
  Thermometer,
  Weight,
  Plus,
  Check
} from 'lucide-react';

export const Home: React.FC = () => {
  const [userName, setUserName] = useState<string>('User');
  const [loading, setLoading] = useState<boolean>(false);
  const [greeting, setGreeting] = useState<string>('Good morning');
  
  // Get appropriate greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    // Try to get user name from localStorage if available
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);
  
  // Simulate refresh functionality
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  const quickStats = [
    { label: 'Heart Rate', value: '72 BPM', status: 'normal', icon: Heart, color: 'text-green-600' },
    { label: 'Temperature', value: '98.6°F', status: 'normal', icon: Thermometer, color: 'text-blue-600' },
    { label: 'Weight', value: '165 lbs', status: 'stable', icon: Weight, color: 'text-purple-600' },
    { label: 'Blood Pressure', value: '120/80', status: 'normal', icon: Activity, color: 'text-red-600' },
  ];

  const recentActivity = [
    { action: 'Vital signs recorded', time: '2 hours ago', type: 'vitals' },
    { action: 'Medication reminder completed', time: '4 hours ago', type: 'reminder' },
    { action: 'Chat with Dr. Smith', time: '1 day ago', type: 'chat' },
    { action: 'Weekly health report generated', time: '2 days ago', type: 'report' },
  ];

  const [reminders, setReminders] = useState([
    { id: 1, title: 'Take morning medication', time: 'In 2 hours', priority: 'high', completed: false },
    { id: 2, title: 'Doctor appointment', time: 'Tomorrow 2:00 PM', priority: 'medium', completed: false },
    { id: 3, title: 'Weekly weigh-in', time: 'In 3 days', priority: 'low', completed: false },
  ]);
  
  const [newReminder, setNewReminder] = useState('');
  const [showReminderInput, setShowReminderInput] = useState(false);
  
  const toggleReminderStatus = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? {...reminder, completed: !reminder.completed} : reminder
    ));
  };
  
  const addReminder = () => {
    if (newReminder.trim() !== '') {
      const newId = reminders.length > 0 ? Math.max(...reminders.map(r => r.id)) + 1 : 1;
      setReminders([
        ...reminders, 
        { 
          id: newId, 
          title: newReminder, 
          time: 'Today', 
          priority: 'medium',
          completed: false 
        }
      ]);
      setNewReminder('');
      setShowReminderInput(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {greeting}, {userName}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your health overview for today, {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Quick Stats</h2>
          <button 
            onClick={() => setLoading(true)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Stats'}
            {loading && (
              <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {stat.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  to="/vitals"
                  className="flex items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Record Vitals</h3>
                    <p className="text-sm text-gray-600">Log your health metrics</p>
                  </div>
                </Link>

                <Link
                  to="/chat"
                  className="flex items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Start Chat</h3>
                    <p className="text-sm text-gray-600">Connect with healthcare</p>
                  </div>
                </Link>

                <Link
                  to="/reminders"
                  className="flex items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                    <Bell className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Set Reminder</h3>
                    <p className="text-sm text-gray-600">Never miss important tasks</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity & Upcoming Reminders */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Reminders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Reminders</h2>
                <button 
                  onClick={() => setShowReminderInput(!showReminderInput)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-5 w-5 text-blue-600" />
                </button>
              </div>
              
              {showReminderInput && (
                <div className="mb-4 flex">
                  <input
                    type="text"
                    value={newReminder}
                    onChange={(e) => setNewReminder(e.target.value)}
                    placeholder="Add a new reminder..."
                    className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <button
                    onClick={addReminder}
                    className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}
              
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div 
                    key={reminder.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors ${
                      reminder.completed ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleReminderStatus(reminder.id)}
                        className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                          reminder.completed 
                            ? 'bg-green-500 text-white' 
                            : 'border-2 border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {reminder.completed && <Check className="h-4 w-4" />}
                      </button>
                      <div>
                        <p className={`font-medium ${reminder.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {reminder.title}
                        </p>
                        <p className="text-sm text-gray-600">{reminder.time}</p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      reminder.priority === 'high' ? 'bg-red-500' :
                      reminder.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};