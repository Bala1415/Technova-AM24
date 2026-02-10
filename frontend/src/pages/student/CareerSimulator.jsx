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

  const userId = localStorage.getItem('userId') || '123'; // Get from auth context

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/careerSimulation/history/${userId}`);
      setHistory(response.data.data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/careerSimulation/run', {
        userId,
        careerPath: careerPath1,
        comparisonPath: careerPath2,
        userProfile: {
          currentSkills: ['Python', 'JavaScript'],
          experience: 2,
          education: 'Bachelor'
        }
      });

      setSimulationData(response.data.data);
      toast.success('Simulation completed successfully!');
      fetchHistory();
    } catch (error) {
      console.error('Error running simulation:', error);
      toast.error('Failed to run simulation');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            AI Career Simulator
          </h1>
          <p className="text-gray-600">
            Explore your future with Monte Carlo simulations
          </p>
        </div>

        {/* Career Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Select Career Paths to Compare</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Career Path
              </label>
              <select
                value={careerPath1}
                onChange={(e) => setCareerPath1(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {careerOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comparison Career Path
              </label>
              <select
                value={careerPath2}
                onChange={(e) => setCareerPath2(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {careerOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={runSimulation}
            disabled={loading}
            className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
          >
            {loading ? 'Running Simulation...' : 'Run Monte Carlo Simulation'}
          </button>
        </div>

        {/* Simulation Results */}
        {simulationData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Risk vs Reward */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Risk vs. Reward Analysis</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">{simulationData.careerPath}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Risk Score</span>
                      <span className="text-2xl font-bold text-red-600">
                        {simulationData.riskAnalysis.riskScore}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Reward Score</span>
                      <span className="text-2xl font-bold text-green-600">
                        {simulationData.riskAnalysis.rewardScore}
                      </span>
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg">
                      <p className="text-sm text-gray-700">
                        {simulationData.riskAnalysis.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
                {simulationData.comparisonPath && (
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">{simulationData.comparisonPath}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Risk Score</span>
                        <span className="text-2xl font-bold text-red-600">45</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Reward Score</span>
                        <span className="text-2xl font-bold text-green-600">82</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 5-Year Salary Projection */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6">5-Year Salary Projection</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={simulationData.simulationResults.yearlyProjections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Salary ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="salaryMin" stroke="#ef4444" name="Minimum" strokeWidth={2} />
                  <Line type="monotone" dataKey="salaryAvg" stroke="#8b5cf6" name="Average" strokeWidth={3} />
                  <Line type="monotone" dataKey="salaryMax" stroke="#10b981" name="Maximum" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Job Market Metrics */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Job Market Metrics</h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={simulationData.simulationResults.yearlyProjections}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="year" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Job Stability" dataKey="jobStability" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Radar name="Market Demand" dataKey="marketDemand" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Success Rate */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Success Rate</h3>
                <div className="text-6xl font-bold mb-2">
                  {simulationData.simulationResults.successRate}%
                </div>
                <p className="text-green-100">
                  Based on {simulationData.simulationResults.totalSimulations} Monte Carlo simulations
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Simulation History</h2>
            <div className="space-y-3">
              {history.slice(0, 5).map((sim, index) => (
                <div key={sim._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <span className="font-semibold">{sim.careerPath}</span>
                    {sim.comparisonPath && <span className="text-gray-600"> vs {sim.comparisonPath}</span>}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(sim.createdAt).toLocaleDateString()}
                  </span>
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
