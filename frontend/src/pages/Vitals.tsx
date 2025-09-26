import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Activity, Heart, Thermometer, Weight, Droplets } from 'lucide-react';
import { Vital } from '../types';
import { logVitals, getUserVitals } from '../services/api';

export const Vitals: React.FC = () => {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newVital, setNewVital] = useState({
    type: 'heart_rate' as Vital['type'],
    value: '',
    unit: 'BPM',
  });

  const vitalTypes = {
    heart_rate: { icon: Heart, label: 'Heart Rate', unit: 'BPM', color: 'text-red-600' },
    blood_pressure: { icon: Activity, label: 'Blood Pressure', unit: 'mmHg', color: 'text-blue-600' },
    temperature: { icon: Thermometer, label: 'Temperature', unit: '°F', color: 'text-orange-600' },
    weight: { icon: Weight, label: 'Weight', unit: 'lbs', color: 'text-purple-600' },
    glucose: { icon: Droplets, label: 'Blood Glucose', unit: 'mg/dL', color: 'text-green-600' },
  };

  // Load vitals data on component mount
  useEffect(() => {
    const loadVitals = async () => {
      try {
        setLoading(true);
        setError(null);
        // For now, using a dummy user ID. In a real app, this would come from auth context
        const userId = 1;
        const vitalsData = await getUserVitals(userId);
        
        // Transform backend data to frontend format
        const transformedVitals = vitalsData.vitals?.map((vital: any) => ({
          id: vital.id.toString(),
          type: vital.vital_type,
          value: vital.value.toString(),
          unit: vital.unit || vitalTypes[vital.vital_type as keyof typeof vitalTypes]?.unit || '',
          timestamp: vital.recorded_at,
          status: vital.status || 'normal'
        })) || [];
        
        setVitals(transformedVitals);
      } catch (err) {
        console.error('Error loading vitals:', err);
        setError('Failed to load vitals data');
      } finally {
        setLoading(false);
      }
    };

    loadVitals();
  }, []);

  const handleAddVital = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVital.value) return;

    try {
      setError(null);
      // For now, using a dummy user ID. In a real app, this would come from auth context
      const userId = 1;
      
      const vitalsData = {
        user_id: userId,
        vital_type: newVital.type,
        value: parseFloat(newVital.value),
        unit: vitalTypes[newVital.type].unit,
        status: 'normal' // In a real app, this would be calculated based on the value
      };

      const response = await logVitals(vitalsData);
      
      // Add the new vital to the local state
      const newVitalRecord: Vital = {
        id: response.vital?.id?.toString() || Date.now().toString(),
        type: newVital.type,
        value: newVital.value,
        unit: vitalTypes[newVital.type].unit,
        timestamp: new Date().toISOString(),
        status: 'normal',
      };

      setVitals(prev => [newVitalRecord, ...prev]);
      setNewVital({ type: 'heart_rate', value: '', unit: 'BPM' });
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding vital:', err);
      setError('Failed to add vital reading');
    }
  };

  const getStatusColor = (status: Vital['status']) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Group vitals by type for summary cards
  const vitalSummary = Object.entries(vitalTypes).map(([type, config]) => {
    const latestVital = vitals.find(v => v.type === type);
    return {
      type: type as Vital['type'],
      ...config,
      latest: latestVital,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Vitals</h1>
            <p className="text-gray-600">Track and monitor your health metrics</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Reading</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading vitals...</span>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {vitalSummary.map((vital) => {
            const Icon = vital.icon;
            return (
              <div key={vital.type} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-gray-50 ${vital.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {vital.latest && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(vital.latest.status)}`}>
                      {vital.latest.status}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{vital.label}</h3>
                {vital.latest ? (
                  <>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {vital.latest.value} <span className="text-sm font-normal text-gray-500">{vital.latest.unit}</span>
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(vital.latest.timestamp)}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">No data yet</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent Readings */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Readings</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {vitals.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vitals recorded yet</h3>
                <p className="text-gray-600 mb-4">Start tracking your health by adding your first reading</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add First Reading
                </button>
              </div>
            ) : (
              vitals.map((vital) => {
                const config = vitalTypes[vital.type];
                const Icon = config.icon;
                return (
                  <div key={vital.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg bg-gray-100 ${config.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{config.label}</h3>
                          <p className="text-sm text-gray-600">{formatDate(vital.timestamp)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {vital.value} <span className="text-sm font-normal text-gray-500">{vital.unit}</span>
                        </p>
                        <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(vital.status)}`}>
                          {vital.status === 'normal' && <TrendingUp className="h-3 w-3 mr-1" />}
                          {vital.status === 'warning' && <TrendingDown className="h-3 w-3 mr-1" />}
                          {vital.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Add Vital Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Reading</h2>
              <form onSubmit={handleAddVital} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vital Type
                  </label>
                  <select
                    value={newVital.type}
                    onChange={(e) => setNewVital(prev => ({ 
                      ...prev, 
                      type: e.target.value as Vital['type'],
                      unit: vitalTypes[e.target.value as Vital['type']].unit
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(vitalTypes).map(([type, config]) => (
                      <option key={type} value={type}>{config.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={newVital.value}
                      onChange={(e) => setNewVital(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="Enter value"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <div className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600">
                      {vitalTypes[newVital.type].unit}
                    </div>
                  </div>
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
                    Add Reading
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