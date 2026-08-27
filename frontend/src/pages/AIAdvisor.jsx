import { useState, useEffect } from 'react';
import api from '../services/api';
import { BrainCircuit, MessageSquare, Loader2, Sparkles } from 'lucide-react';

const AIAdvisor = () => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Hello! I am your AI Study Advisor. Based on your current progress, I can give you personalized study recommendations, or you can ask me a specific question!' }
  ]);

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ai/recommendation');
      setRecommendation(res.data.recommendation);
      setError(null);
    } catch (err) {
      setError('Failed to get AI recommendation. Make sure you have some study sessions logged!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation();
  }, []);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Simulate AI typing delay, in a real app this would call another AI endpoint
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        content: `That's a great question about "${userMessage}". To improve in this area, try breaking down the topic into smaller chunks and using the Pomodoro technique to study them with high focus.` 
      }]);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text flex items-center">
          <BrainCircuit className="w-6 h-6 mr-2 text-primary" /> AI Study Advisor
        </h1>
        <p className="text-text-muted">Get personalized insights and chat with your AI assistant.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendation Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 text-white shadow-soft relative overflow-hidden">
            <Sparkles className="absolute top-4 right-4 w-12 h-12 text-white opacity-20" />
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <BrainCircuit className="w-5 h-5 mr-2" /> Daily Insight
            </h2>
            
            {loading ? (
              <div className="flex items-center space-x-3 text-white/80">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing your data...</span>
              </div>
            ) : error ? (
              <div className="text-white/90 text-sm">
                {error}
                <button onClick={fetchRecommendation} className="block mt-2 underline">Try again</button>
              </div>
            ) : (
              <div>
                <p className="text-white/90 leading-relaxed mb-6">{recommendation}</p>
                <button 
                  onClick={fetchRecommendation}
                  className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors font-medium text-sm"
                >
                  Refresh Insight
                </button>
              </div>
            )}
          </div>

          <div className="bg-surface rounded-3xl p-6 border border-border shadow-soft">
            <h3 className="font-bold text-text mb-4">AI Capabilities</h3>
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="flex items-start"><span className="text-primary mr-2">•</span> Analyzes your study session history</li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span> Identifies your most productive times</li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span> Suggests focus areas based on goals</li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span> Provides personalized study techniques</li>
            </ul>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 bg-surface rounded-3xl border border-border shadow-soft flex flex-col h-[600px] overflow-hidden">
          <div className="p-4 border-b border-border bg-gray-50 flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-light bg-opacity-20 flex items-center justify-center mr-3">
              <BrainCircuit className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-text">Study Assistant</h3>
              <p className="text-xs text-green-500 font-medium">● Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-white border border-border text-text rounded-bl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border bg-white">
            <form onSubmit={handleChat} className="flex items-center gap-2">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask for study advice..."
                className="flex-1 px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim()}
                className="p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
