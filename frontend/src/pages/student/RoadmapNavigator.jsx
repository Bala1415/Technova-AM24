import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const RoadmapNavigator = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Comprehensive mapping of roles/skills to roadmap.sh URLs
  const roadmaps = {
    // Programming Languages
    'frontend': { url: 'https://roadmap.sh/frontend', category: 'web', icon: '🎨', description: 'Frontend Development' },
    'backend': { url: 'https://roadmap.sh/backend', category: 'web', icon: '⚙️', description: 'Backend Development' },
    'full stack': { url: 'https://roadmap.sh/full-stack', category: 'web', icon: '🔄', description: 'Full Stack Development' },
    'react': { url: 'https://roadmap.sh/react', category: 'web', icon: '⚛️', description: 'React Developer' },
    'angular': { url: 'https://roadmap.sh/angular', category: 'web', icon: '🅰️', description: 'Angular Developer' },
    'vue': { url: 'https://roadmap.sh/vue', category: 'web', icon: '💚', description: 'Vue.js Developer' },
    'nodejs': { url: 'https://roadmap.sh/nodejs', category: 'web', icon: '🟢', description: 'Node.js Developer' },
    'node.js': { url: 'https://roadmap.sh/nodejs', category: 'web', icon: '🟢', description: 'Node.js Developer' },
    'javascript': { url: 'https://roadmap.sh/javascript', category: 'web', icon: '📜', description: 'JavaScript' },
    'typescript': { url: 'https://roadmap.sh/typescript', category: 'web', icon: '📘', description: 'TypeScript' },
    'python': { url: 'https://roadmap.sh/python', category: 'programming', icon: '🐍', description: 'Python Developer' },
    'java': { url: 'https://roadmap.sh/java', category: 'programming', icon: '☕', description: 'Java Developer' },
    'golang': { url: 'https://roadmap.sh/golang', category: 'programming', icon: '🔵', description: 'Go Developer' },
    'go': { url: 'https://roadmap.sh/golang', category: 'programming', icon: '🔵', description: 'Go Developer' },
    'rust': { url: 'https://roadmap.sh/rust', category: 'programming', icon: '🦀', description: 'Rust Developer' },
    'cpp': { url: 'https://roadmap.sh/cpp', category: 'programming', icon: '➕', description: 'C++ Developer' },
    'c++': { url: 'https://roadmap.sh/cpp', category: 'programming', icon: '➕', description: 'C++ Developer' },
    
    // DevOps & Cloud
    'devops': { url: 'https://roadmap.sh/devops', category: 'devops', icon: '🔧', description: 'DevOps Engineer' },
    'docker': { url: 'https://roadmap.sh/docker', category: 'devops', icon: '🐳', description: 'Docker' },
    'kubernetes': { url: 'https://roadmap.sh/kubernetes', category: 'devops', icon: '☸️', description: 'Kubernetes' },
    'aws': { url: 'https://roadmap.sh/aws', category: 'cloud', icon: '☁️', description: 'AWS' },
    'azure': { url: 'https://roadmap.sh/azure', category: 'cloud', icon: '🔷', description: 'Azure' },
    'gcp': { url: 'https://roadmap.sh/gcp', category: 'cloud', icon: '🌥️', description: 'Google Cloud Platform' },
    
    // Data & AI
    'data science': { url: 'https://roadmap.sh/data-science', category: 'data', icon: '📊', description: 'Data Science' },
    'machine learning': { url: 'https://roadmap.sh/machine-learning', category: 'ai', icon: '🤖', description: 'Machine Learning' },
    'ai': { url: 'https://roadmap.sh/ai-engineer', category: 'ai', icon: '🧠', description: 'AI Engineer' },
    'mlops': { url: 'https://roadmap.sh/mlops', category: 'ai', icon: '🔬', description: 'MLOps' },
    'data analyst': { url: 'https://roadmap.sh/data-analyst', category: 'data', icon: '📈', description: 'Data Analyst' },
    'postgresql': { url: 'https://roadmap.sh/postgresql-dba', category: 'data', icon: '🐘', description: 'PostgreSQL DBA' },
    'mongodb': { url: 'https://roadmap.sh/mongodb', category: 'data', icon: '🍃', description: 'MongoDB' },
    
    // Mobile
    'android': { url: 'https://roadmap.sh/android', category: 'mobile', icon: '🤖', description: 'Android Developer' },
    'ios': { url: 'https://roadmap.sh/ios', category: 'mobile', icon: '🍎', description: 'iOS Developer' },
    'react native': { url: 'https://roadmap.sh/react-native', category: 'mobile', icon: '📱', description: 'React Native' },
    'flutter': { url: 'https://roadmap.sh/flutter', category: 'mobile', icon: '💙', description: 'Flutter Developer' },
    
    // Security & Blockchain
    'cybersecurity': { url: 'https://roadmap.sh/cyber-security', category: 'security', icon: '🔒', description: 'Cybersecurity' },
    'blockchain': { url: 'https://roadmap.sh/blockchain', category: 'blockchain', icon: '⛓️', description: 'Blockchain' },
    
    // Design & Product
    'ux design': { url: 'https://roadmap.sh/ux-design', category: 'design', icon: '🎨', description: 'UX Design' },
    'ui design': { url: 'https://roadmap.sh/design-system', category: 'design', icon: '🖌️', description: 'Design System' },
    'product manager': { url: 'https://roadmap.sh/product-manager', category: 'product', icon: '📋', description: 'Product Manager' },
    
    // Other
    'qa': { url: 'https://roadmap.sh/qa', category: 'testing', icon: '✅', description: 'QA Engineer' },
    'software architect': { url: 'https://roadmap.sh/software-architect', category: 'architecture', icon: '🏗️', description: 'Software Architect' },
    'game developer': { url: 'https://roadmap.sh/game-developer', category: 'gaming', icon: '🎮', description: 'Game Developer' },
    'api design': { url: 'https://roadmap.sh/api-design', category: 'architecture', icon: '🔌', description: 'API Design' },
    'graphql': { url: 'https://roadmap.sh/graphql', category: 'web', icon: '◼️', description: 'GraphQL' },
    'sql': { url: 'https://roadmap.sh/sql', category: 'data', icon: '💾', description: 'SQL' },
  };

  const categories = [
    { id: 'all', name: 'All Roadmaps', icon: '🌐' },
    { id: 'web', name: 'Web Development', icon: '🌐' },
    { id: 'programming', name: 'Programming', icon: '💻' },
    { id: 'devops', name: 'DevOps', icon: '🔧' },
    { id: 'cloud', name: 'Cloud', icon: '☁️' },
    { id: 'data', name: 'Data', icon: '📊' },
    { id: 'ai', name: 'AI/ML', icon: '🤖' },
    { id: 'mobile', name: 'Mobile', icon: '📱' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'design', name: 'Design', icon: '🎨' },
  ];

  const findRoadmap = (input) => {
    const searchKey = input.toLowerCase().trim();
    return roadmaps[searchKey] || null;
  };

  const handleSearch = () => {
    const roadmap = findRoadmap(searchTerm);
    if (roadmap) {
      window.open(roadmap.url, '_blank');
      toast.success(`Opening ${roadmap.description} roadmap!`);
    } else {
      toast.error('Roadmap not found. Try: Frontend, Python, DevOps, etc.');
    }
  };

  const filteredRoadmaps = Object.entries(roadmaps).filter(([key, value]) => {
    const matchesCategory = selectedCategory === 'all' || value.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      value.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Remove duplicates by URL
  const uniqueRoadmaps = Array.from(
    new Map(filteredRoadmaps.map(([key, value]) => [value.url, { key, ...value }])).values()
  );

  return (
    <div className="min-h-screen p-8" style={{ background: '#ffffff' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-3" style={{ color: '#111' }}>
            🗺️ Career Roadmap <span style={{ color: '#d4a800' }}>Navigator</span>
          </h1>
          <p className="text-lg" style={{ color: '#666' }}>
            Find your learning path with curated roadmaps from roadmap.sh
          </p>
        </div>

        {/* Search Bar */}
        <div className="rounded-2xl shadow-sm p-6 mb-8" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
          <div className="flex gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter role or skill (e.g., Frontend, Python, DevOps)..."
              className="flex-1 px-6 py-4 border-2 rounded-lg transition-all text-lg focus:outline-none"
              style={{ borderColor: '#e5e5e5', color: '#111' }}
              onFocus={(e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245,197,24,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; }}
            />
            <button
              onClick={handleSearch}
              className="px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all"
              style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}
            >
              Find Roadmap
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-3 pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap"
              style={selectedCategory === category.id
                ? { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a', boxShadow: '0 4px 12px rgba(245,197,24,0.3)' }
                : { background: '#fff', color: '#555', border: '1px solid #e5e5e5' }
              }
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Roadmap Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueRoadmaps.map(({ key, url, icon, description, category }) => (
            <motion.div
              key={url}
              whileHover={{ scale: 1.05 }}
              className="rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all"
              style={{ background: '#fff', border: '1px solid #e5e5e5' }}
              onClick={() => {
                window.open(url, '_blank');
                toast.success(`Opening ${description} roadmap!`);
              }}
            >
              <div className="text-5xl mb-4">{icon}</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#111' }}>{description}</h3>
              <span className="inline-block px-3 py-1 rounded-full text-sm capitalize" style={{ background: '#fffbeb', color: '#92400e' }}>
                {category}
              </span>
              <div className="mt-4 flex items-center font-medium" style={{ color: '#d4a800' }}>
                View Roadmap
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {uniqueRoadmaps.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg" style={{ color: '#999' }}>No roadmaps found. Try a different search term.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RoadmapNavigator;
