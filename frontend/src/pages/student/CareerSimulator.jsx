import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CareerSimulator = () => {
  const [careerPath1, setCareerPath1] = useState('Data Science');
  const [careerPath2, setCareerPath2] = useState('Cybersecurity');
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const careerOptions = [
    'Data Science',
    'Cybersecurity',
    'Software Engineering',
    'Product Management'
  ];

  const userId = localStorage.getItem('userId') || '123';

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/careerSimulation/history/${userId}`);
      setHistory(response.data.data || []);
    } catch (error) { console.error('Error fetching history:', error); }
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/careerSimulation/run', {
        userId,
        careerPath: careerPath1,
        comparisonPath: careerPath2,
        userProfile: { currentSkills: ['Python', 'JavaScript'], experience: 2, education: 'Bachelor' }
      });
      setSimulationData(response.data.data);
      toast.success('Simulation completed successfully!');
      fetchHistory();
    } catch (error) {
      console.error('Error running simulation:', error);
      toast.error('Failed to run simulation');
    } finally { setLoading(false); }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="min-h-screen p-8" style={{ background: '#ffffff' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 mt-[50px]">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#111' }}>
            AI Career <span style={{ color: '#d4a800' }}>Simulator</span>
          </h1>
          <p style={{ color: '#666' }}>Explore your future with Monte Carlo simulations</p>
        </div>

        {/* Career Selection */}
        <div className="rounded-2xl shadow-sm p-6 mb-8" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#111' }}>Select Career Paths to Compare</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>Primary Career Path</label>
              <select value={careerPath1} onChange={(e) => setCareerPath1(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all"
                style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
                onFocus={(e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245,197,24,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; }}>
                {careerOptions.map(option => (<option key={option} value={option}>{option}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>Comparison Career Path</label>
              <select value={careerPath2} onChange={(e) => setCareerPath2(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all"
                style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
                onFocus={(e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245,197,24,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; }}>
                {careerOptions.map(option => (<option key={option} value={option}>{option}</option>))}
              </select>
            </div>
          </div>
          <button onClick={runSimulation} disabled={loading}
            className="mt-6 w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02]"
            style={loading
              ? { background: '#f5f5f5', color: '#999', cursor: 'not-allowed' }
              : { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
            {loading ? 'Running Simulation...' : 'Run Monte Carlo Simulation'}
          </button>
        </div>

        {/* Simulation Results */}
        {simulationData && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            {/* Risk vs Reward */}
            <div className="rounded-2xl shadow-sm p-6" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#111' }}>Risk vs. Reward Analysis</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl p-6" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#111' }}>{simulationData.careerPath}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span style={{ color: '#666' }}>Risk Score</span>
                      <span className="text-2xl font-bold" style={{ color: '#dc2626' }}>{simulationData.riskAnalysis.riskScore}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: '#666' }}>Reward Score</span>
                      <span className="text-2xl font-bold" style={{ color: '#16a34a' }}>{simulationData.riskAnalysis.rewardScore}</span>
                    </div>
                    <div className="mt-4 p-4 rounded-lg" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
                      <p className="text-sm" style={{ color: '#555' }}>{simulationData.riskAnalysis.recommendation}</p>
                    </div>
                  </div>
                </div>
                {simulationData.comparisonPath && (
                  <div className="rounded-xl p-6" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#111' }}>{simulationData.comparisonPath}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span style={{ color: '#666' }}>Risk Score</span>
                        <span className="text-2xl font-bold" style={{ color: '#dc2626' }}>45</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{ color: '#666' }}>Reward Score</span>
                        <span className="text-2xl font-bold" style={{ color: '#16a34a' }}>82</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 5-Year Salary Projection */}
            <div className="rounded-2xl shadow-sm p-6" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#111' }}>5-Year Salary Projection</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={simulationData.simulationResults.yearlyProjections}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Salary ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="salaryMin" stroke="#dc2626" name="Minimum" strokeWidth={2} />
                  <Line type="monotone" dataKey="salaryAvg" stroke="#d4a800" name="Average" strokeWidth={3} />
                  <Line type="monotone" dataKey="salaryMax" stroke="#16a34a" name="Maximum" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Job Market Metrics */}
            <div className="rounded-2xl shadow-sm p-6" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#111' }}>Job Market Metrics</h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={simulationData.simulationResults.yearlyProjections}>
                  <PolarGrid stroke="#e5e5e5" />
                  <PolarAngleAxis dataKey="year" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Job Stability" dataKey="jobStability" stroke="#d4a800" fill="#f5c518" fillOpacity={0.4} />
                  <Radar name="Market Demand" dataKey="marketDemand" stroke="#111" fill="#333" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Success Rate */}
            <div className="rounded-2xl shadow-sm p-8 text-center"
              style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
              <h3 className="text-xl font-semibold mb-2">Success Rate</h3>
              <div className="text-6xl font-bold mb-2">{simulationData.simulationResults.successRate}%</div>
              <p style={{ opacity: 0.8 }}>Based on {simulationData.simulationResults.totalSimulations} Monte Carlo simulations</p>
            </div>
          </motion.div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8 rounded-2xl shadow-sm p-6" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#111' }}>Simulation History</h2>
            <div className="space-y-3">
              {history.slice(0, 5).map((sim) => (
                <div key={sim._id} className="flex justify-between items-center p-4 rounded-lg transition-colors"
                  style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                  <div>
                    <span className="font-semibold" style={{ color: '#111' }}>{sim.careerPath}</span>
                    {sim.comparisonPath && <span style={{ color: '#666' }}> vs {sim.comparisonPath}</span>}
                  </div>
                  <span className="text-sm" style={{ color: '#999' }}>{new Date(sim.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CareerSimulator;
