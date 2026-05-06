import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeFile, setActiveFile] = useState('bank-rates.json');
  const [fileContent, setFileContent] = useState('');
  const [status, setStatus] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'moneyiq-admin-2026') {
      setIsAuthenticated(true);
      setStatus('');
    } else {
      setStatus('Invalid password');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`/data/${activeFile}`)
        .then(res => res.json())
        .then(data => setFileContent(JSON.stringify(data, null, 2)))
        .catch(err => setStatus(`Error loading ${activeFile}: ${err.message}`));
    }
  }, [isAuthenticated, activeFile]);

  const handleSave = () => {
    try {
      JSON.parse(fileContent);
      // In a real app, this would be a POST to an API
      setStatus('Success: JSON validated! (Note: Manual save requires backend integration)');
    } catch (e) {
      setStatus('Error: Invalid JSON format');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="pt-20 pb-16 min-h-screen flex items-center justify-center">
        <SEOHead title="Admin Login - MoneyIQ" noIndex={true} />
        <div className="glass-card p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-light-50 mb-6">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-50 focus:ring-2 focus:ring-primary outline-none"
            />
            <button className="w-full py-3 rounded-xl gradient-cta text-white font-bold transition-smooth">
              Login to Dashboard
            </button>
            {status && <p className="text-red-400 text-sm mt-2">{status}</p>}
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <SEOHead title="Admin Dashboard - MoneyIQ" noIndex={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-light-50">Admin <span className="gradient-text">Dashboard</span></h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 rounded-lg bg-white/5 text-light-400 hover:text-light-50 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-sm font-bold text-light-400 uppercase tracking-widest mb-4">Select Data File</h3>
            {['bank-rates.json', 'cbk-rates.json', 'exchange-rates.json', 'sacco-rates.json', 'articles.json', 'glossary.json'].map(file => (
              <button
                key={file}
                onClick={() => setActiveFile(file)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-smooth ${activeFile === file ? 'bg-primary/20 text-primary border border-primary/30' : 'text-light-300 hover:bg-white/5'}`}
              >
                {file}
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                <span className="text-sm font-mono text-light-400">Editing: {activeFile}</span>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 rounded-lg bg-success text-white text-sm font-bold hover:opacity-90 transition-smooth"
                >
                  Validate & Save
                </button>
              </div>
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="w-full h-[600px] bg-dark-900/50 p-6 text-sm font-mono text-light-200 outline-none resize-none"
                spellCheck="false"
              />
            </div>
            
            {status && (
              <div className={`p-4 rounded-xl text-sm ${status.startsWith('Error') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-success'}`}>
                {status}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
