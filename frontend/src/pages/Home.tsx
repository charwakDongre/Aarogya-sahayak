import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus } from 'lucide-react';

const Home = () => {
  const [recentActivity, setRecentActivity] = useState([]);
  const [showReminderInput, setShowReminderInput] = useState(false);

  useEffect(() => {
    // Simulate fetching data
    setRecentActivity([
      { id: 1, action: 'Checked vitals', time: '2 hours ago' },
      { id: 2, action: 'Scheduled appointment', time: '1 day ago' },
    ]);
  }, []);

  return (
    <div>
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No recent activity.</p>
          )}
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
      </div>
    </div>
  );
};

export default Home;