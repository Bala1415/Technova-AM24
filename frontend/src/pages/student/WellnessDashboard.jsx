import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const WellnessDashboard = () => {
  const [wellnessData, setWellnessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityLog, setActivityLog] = useState([]);
  
  const userId = localStorage.getItem('userId') || '123';

  useEffect(() => { fetchWellnessData(); }, []);

  const fetchWellnessData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/wellness/report/${userId}`);
      setWellnessData(response.data.data);
      setActivityLog(response.data.data?.activityLog || []);
      setLoading(false);
    } catch (error) { console.error('Error fetching wellness data:', error); setLoading(false); }
  };

  const analyzeBurnout = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/wellness/analyze/${userId}`);
      setWellnessData(prev => ({ ...prev, wellnessMetrics: response.data.data }));
      toast.success('Burnout analysis completed!');
    } catch (error) { console.error('Error analyzing burnout:', error); toast.error('Failed to analyze burnout'); }
  };

  const trackActivity = async (action, duration) => {
    try {
      await axios.post('http://localhost:5000/wellness/track', { userId, action, duration });
      toast.success('Activity tracked!');
      fetchWellnessData();
    } catch (error) { console.error('Error tracking activity:', error); toast.error('Failed to track activity'); }
  };

  const scheduleSession = async () => {
    try {
      await axios.post('http://localhost:5000/wellness/schedule', {
        userId,
        psychologistId: '507f1f77bcf86cd799439011',
        sessionDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        notes: 'Scheduled due to high burnout risk'
      });
      toast.success('Psychologist session scheduled!');
      fetchWellnessData();
    } catch (error) { console.error('Error scheduling session:', error); toast.error('Failed to schedule session'); }
  };

  const getBurnoutBgStyle = (risk) => {
    if (risk < 30) return { background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: '#fff' };
    if (risk < 60) return { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' };
    return { background: 'linear-gradient(135deg, #dc2626, #ef4444)', color: '#fff' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fff' }}>
        <div className="text-2xl font-semibold" style={{ color: '#999' }}>Loading wellness data...</div>
      </div>
    );
  }

  const burnoutRisk = wellnessData?.wellnessMetrics?.burnoutRisk || 0;
  const stressLevel = wellnessData?.wellnessMetrics?.stressLevel || 5;
  const activityPattern = wellnessData?.wellnessMetrics?.activityPattern || {};

  return (
    <div className="min-h-screen p-8" style={{ background: '#ffffff' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 mt-[50px]">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#111' }}>
            Wellness <span style={{ color: '#d4a800' }}>Dashboard</span>
          </h1>
          <p style={{ color: '#666' }}>Monitor your mental health and prevent burnout</p>
        </div>

        {/* Burnout Risk Meter */}
        <div className="rounded-2xl shadow-sm p-8 mb-8 text-center" style={getBurnoutBgStyle(burnoutRisk)}>
          <h2 className="text-2xl font-semibold mb-4">Burnout Risk Level</h2>
          <div className="text-7xl font-bold mb-2">{burnoutRisk}%</div>
          <p className="text-lg" style={{ opacity: 0.9 }}>
            {burnoutRisk < 30 ? "You're doing great!" : burnoutRisk < 60 ? 'Take it easy' : 'High risk - please rest!'}
          </p>
          <button onClick={analyzeBurnout}
            className="mt-6 px-6 py-3 rounded-lg font-semibold transition-all"
            style={{ background: '#fff', color: '#111' }}>
            Re-analyze Burnout Risk
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-xl shadow-sm p-6" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#555' }}>Stress Level</h3>
            <div className="text-4xl font-bold" style={{ color: '#d4a800' }}>{stressLevel}/10</div>
            <div className="mt-4 rounded-full h-2" style={{ background: '#f5f5f5' }}>
              <div className="h-2 rounded-full transition-all" style={{ width: `${(stressLevel / 10) * 100}%`, background: '#d4a800' }} />
            </div>
          </div>

          <div className="rounded-xl shadow-sm p-6" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#555' }}>Late Night Sessions</h3>
            <div className="text-4xl font-bold" style={{ color: '#f5c518' }}>{activityPattern.lateNightSessions || 0}</div>
            <p className="text-sm mt-2" style={{ color: '#999' }}>Sessions after 11 PM</p>
          </div>

          <div className="rounded-xl shadow-sm p-6" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#555' }}>Consecutive Days</h3>
            <div className="text-4xl font-bold" style={{ color: '#111' }}>{activityPattern.consecutiveDays || 0}</div>
            <p className="text-sm mt-2" style={{ color: '#999' }}>Days without break</p>
          </div>
        </div>

        {/* Activity Pattern */}
        <div className="rounded-2xl shadow-sm p-6 mb-8" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#111' }}>Activity Pattern</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="mb-2" style={{ color: '#666' }}>Average Session Length</p>
              <p className="text-3xl font-bold" style={{ color: '#d4a800' }}>
                {activityPattern.averageSessionLength?.toFixed(1) || 0} hours
              </p>
            </div>
            <div>
              <p className="mb-2" style={{ color: '#666' }}>Peak Productivity Time</p>
              <p className="text-3xl font-bold capitalize" style={{ color: '#111' }}>
                {activityPattern.peakProductivityTime || 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Interventions */}
        {wellnessData?.interventions && wellnessData.interventions.length > 0 && (
          <div className="rounded-2xl shadow-sm p-6 mb-8" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#111' }}>Wellness Recommendations</h2>
            <div className="space-y-4">
              {wellnessData.interventions.filter(i => !i.completed).map((intervention, index) => (
                <div key={index} className="flex items-start p-4 rounded-lg"
                  style={{ background: '#fffbeb', borderLeft: '4px solid #f5c518' }}>
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6" style={{ color: '#d4a800' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold capitalize" style={{ color: '#92400e' }}>
                      {intervention.type.replace('_', ' ')}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: '#a16207' }}>{intervention.message}</p>
                  </div>
                </div>
              ))}
            </div>
            {burnoutRisk > 70 && (
              <button onClick={scheduleSession}
                className="mt-6 w-full py-3 rounded-lg font-semibold transition-all"
                style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
                Schedule Psychologist Session
              </button>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="rounded-2xl shadow-sm p-6" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#111' }}>Track Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['study', 'task_complete', 'quiz', 'break'].map(action => (
              <button key={action} onClick={() => trackActivity(action, 60)}
                className="p-4 rounded-lg transition-all capitalize hover:shadow-md"
                style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#111' }}>
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
