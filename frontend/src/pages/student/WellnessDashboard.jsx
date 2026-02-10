import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const WellnessDashboard = () => {
  const [wellnessData, setWellnessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityLog, setActivityLog] = useState([]);
  
  const userId = localStorage.getItem('userId') || '123';

  useEffect(() => {
    fetchWellnessData();
  }, []);

  const fetchWellnessData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/wellness/report/${userId}`);
      setWellnessData(response.data.data);
      setActivityLog(response.data.data?.activityLog || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wellness data:', error);
      setLoading(false);
    }
  };

  const analyzeBurnout = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/wellness/analyze/${userId}`);
      setWellnessData(prev => ({
        ...prev,
        wellnessMetrics: response.data.data
      }));
      toast.success('Burnout analysis completed!');
    } catch (error) {
      console.error('Error analyzing burnout:', error);
      toast.error('Failed to analyze burnout');
    }
  };

  const trackActivity = async (action, duration) => {
    try {
      await axios.post('http://localhost:5000/wellness/track', {
        userId,
        action,
        duration
      });
      toast.success('Activity tracked!');
      fetchWellnessData();
    } catch (error) {
      console.error('Error tracking activity:', error);
      toast.error('Failed to track activity');
    }
  };

  const scheduleSession = async () => {
    try {
      await axios.post('http://localhost:5000/wellness/schedule', {
        userId,
        psychologistId: '507f1f77bcf86cd799439011', // Example ID
        sessionDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        notes: 'Scheduled due to high burnout risk'
      });
      toast.success('Psychologist session scheduled!');
      fetchWellnessData();
    } catch (error) {
      console.error('Error scheduling session:', error);
      toast.error('Failed to schedule session');
    }
  };

  const getBurnoutColor = (risk) => {
    if (risk < 30) return 'text-green-600';
    if (risk < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBurnoutBgColor = (risk) => {
    if (risk < 30) return 'from-green-500 to-emerald-500';
    if (risk < 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading wellness data...</div>
      </div>
    );
  }

  const burnoutRisk = wellnessData?.wellnessMetrics?.burnoutRisk || 0;
  const stressLevel = wellnessData?.wellnessMetrics?.stressLevel || 5;
  const activityPattern = wellnessData?.wellnessMetrics?.activityPattern || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Wellness Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your mental health and prevent burnout
          </p>
        </div>

        {/* Burnout Risk Meter */}
        <div className={`bg-gradient-to-r ${getBurnoutBgColor(burnoutRisk)} rounded-2xl shadow-xl p-8 mb-8 text-white`}>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Burnout Risk Level</h2>
            <div className="text-7xl font-bold mb-2">{burnoutRisk}%</div>
            <p className="text-lg opacity-90">
              {burnoutRisk < 30 ? 'You\'re doing great!' : burnoutRisk < 60 ? 'Take it easy' : 'High risk - please rest!'}
            </p>
            <button
              onClick={analyzeBurnout}
              className="mt-6 bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Re-analyze Burnout Risk
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Stress Level</h3>
            <div className="text-4xl font-bold text-purple-600">{stressLevel}/10</div>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${(stressLevel / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Late Night Sessions</h3>
            <div className="text-4xl font-bold text-orange-600">{activityPattern.lateNightSessions || 0}</div>
            <p className="text-sm text-gray-500 mt-2">Sessions after 11 PM</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Consecutive Days</h3>
            <div className="text-4xl font-bold text-blue-600">{activityPattern.consecutiveDays || 0}</div>
            <p className="text-sm text-gray-500 mt-2">Days without break</p>
          </div>
        </div>

        {/* Activity Pattern */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Activity Pattern</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-2">Average Session Length</p>
              <p className="text-3xl font-bold text-indigo-600">
                {activityPattern.averageSessionLength?.toFixed(1) || 0} hours
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Peak Productivity Time</p>
              <p className="text-3xl font-bold text-green-600 capitalize">
                {activityPattern.peakProductivityTime || 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Interventions */}
        {wellnessData?.interventions && wellnessData.interventions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Wellness Recommendations</h2>
            <div className="space-y-4">
              {wellnessData.interventions.filter(i => !i.completed).map((intervention, index) => (
                <div key={index} className="flex items-start p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-yellow-800 capitalize">
                      {intervention.type.replace('_', ' ')}
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">{intervention.message}</p>
                  </div>
                </div>
              ))}
            </div>
            {burnoutRisk > 70 && (
              <button
                onClick={scheduleSession}
                className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Schedule Psychologist Session
              </button>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Track Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['study', 'task_complete', 'quiz', 'break'].map(action => (
              <button
                key={action}
                onClick={() => trackActivity(action, 60)}
                className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg hover:shadow-lg transition-all capitalize"
              >
                {action.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WellnessDashboard;
