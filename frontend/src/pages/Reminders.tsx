import React, { useState } from 'react';
import { Plus, Bell, Clock, CheckCircle, AlertTriangle, Calendar, Pill, Stethoscope, Dumbbell } from 'lucide-react';
import { Reminder } from '../types';

export const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Take morning medication',
      description: 'Lisinopril 10mg - Take with breakfast',
      type: 'medication',
      dueDate: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
      completed: false,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Doctor appointment',
      description: 'Cardiology follow-up with Dr. Johnson',
      type: 'appointment',
      dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      completed: false,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Evening walk',
      description: '30-minute walk around the neighborhood',
      type: 'exercise',
      dueDate: new Date(Date.now() + 28800000).toISOString(), // 8 hours from now
      completed: false,
      priority: 'low'
    },
    {
      id: '4',
      title: 'Blood pressure check',
      description: 'Record morning blood pressure reading',
      type: 'general',
      dueDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      completed: true,
      priority: 'medium'
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    type: 'general' as Reminder['type'],
    dueDate: '',
    priority: 'medium' as Reminder['priority'],
  });

  const reminderTypes = {
    medication: { icon: Pill, label: 'Medication', color: 'text-blue-600 bg-blue-100' },
    appointment: { icon: Stethoscope, label: 'Appointment', color: 'text-green-600 bg-green-100' },
    exercise: { icon: Dumbbell, label: 'Exercise', color: 'text-purple-600 bg-purple-100' },
    general: { icon: Bell, label: 'General', color: 'text-gray-600 bg-gray-100' },
  };

  const priorityColors = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-yellow-500 bg-yellow-50',
    low: 'border-l-green-500 bg-green-50',
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.title || !newReminder.dueDate) return;

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      description: newReminder.description,
      type: newReminder.type,
      dueDate: new Date(newReminder.dueDate).toISOString(),
      completed: false,
      priority: newReminder.priority,
    };

    setReminders(prev => [reminder, ...prev]);
    setNewReminder({
      title: '',
      description: '',
      type: 'general',
      dueDate: '',
      priority: 'medium',
    });
    setShowAddModal(false);
  };

  const toggleComplete = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) {
      return 'Overdue';
    } else if (diffHours < 1) {
      return 'Due soon';
    } else if (diffHours < 24) {
      return `In ${diffHours} hours`;
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `In ${diffDays} days`;
    }
  };

  const upcomingReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reminders</h1>
            <p className="text-gray-600">Stay on top of your health schedule</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Reminder</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{upcomingReminders.length}</p>
                <p className="text-sm text-gray-600">Upcoming</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{completedReminders.length}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {upcomingReminders.filter(r => new Date(r.dueDate) < new Date()).length}
                </p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Reminders</h2>
          <div className="space-y-4">
            {upcomingReminders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming reminders</h3>
                <p className="text-gray-600 mb-4">You're all caught up! Add a new reminder to stay organized.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Reminder
                </button>
              </div>
            ) : (
              upcomingReminders.map((reminder) => {
                const config = reminderTypes[reminder.type];
                const Icon = config.icon;
                const isOverdue = new Date(reminder.dueDate) < new Date();
                
                return (
                  <div
                    key={reminder.id}
                    className={`bg-white rounded-xl shadow-sm border-l-4 ${priorityColors[reminder.priority]} p-6 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <button
                          onClick={() => toggleComplete(reminder.id)}
                          className="mt-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full hover:border-blue-500 transition-colors"></div>
                        </button>
                        <div className={`p-2 rounded-lg ${config.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{reminder.title}</h3>
                          {reminder.description && (
                            <p className="text-gray-600 mb-2">{reminder.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={`flex items-center ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDueDate(reminder.dueDate)}
                            </span>
                            <span className="text-gray-500 capitalize">{config.label}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              reminder.priority === 'high' ? 'bg-red-100 text-red-800' :
                              reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {reminder.priority} priority
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Completed Reminders */}
        {completedReminders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed</h2>
            <div className="space-y-4">
              {completedReminders.map((reminder) => {
                const config = reminderTypes[reminder.type];
                const Icon = config.icon;
                
                return (
                  <div
                    key={reminder.id}
                    className="bg-white rounded-xl shadow-sm p-6 opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-start space-x-4">
                      <button
                        onClick={() => toggleComplete(reminder.id)}
                        className="mt-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </button>
                      <div className={`p-2 rounded-lg ${config.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 line-through">{reminder.title}</h3>
                        {reminder.description && (
                          <p className="text-gray-600 mb-2">{reminder.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completed
                          </span>
                          <span className="capitalize">{config.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Reminder Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Reminder</h2>
              <form onSubmit={handleAddReminder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter reminder title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newReminder.description}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description (optional)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={newReminder.type}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, type: e.target.value as Reminder['type'] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(reminderTypes).map(([type, config]) => (
                        <option key={type} value={type}>{config.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newReminder.priority}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, priority: e.target.value as Reminder['priority'] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={newReminder.dueDate}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Reminder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};