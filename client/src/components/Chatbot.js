    import React, { useState, useEffect, useRef, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './Chatbot.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

const Chatbot = () => {

  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [healthSummary, setHealthSummary] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load health summary on mount
  useEffect(() => {
    const fetchHealthSummary = async () => {
      try {
        console.log('Fetching health summary from:', `${API_URL}/chatbot/health-summary`);
        const response = await fetch(`${API_URL}/chatbot/health-summary`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Health summary response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Health summary data:', data);
          setHealthSummary(data.summary);
          // Add initial greeting message with personalization
          setMessages([{
            role: 'model',
            content: `Hello ${data.summary.patientName}! 👋 I'm your personalized health assistant. I have access to your medical records including your diagnoses, current medications, and vital signs. How can I assist you today with your health questions?`,
            timestamp: new Date()
          }]);
        } else {
          const errorText = await response.text();
          console.error('Health summary error:', response.status, errorText);
          setError(`Failed to load health data: ${response.status}`);
          setMessages([{
            role: 'model',
            content: 'Hello! I\'m your health assistant. How can I help you today?',
            timestamp: new Date()
          }]);
        }
      } catch (err) {
        console.error('Failed to load health summary:', err);
        setError(`Network error: ${err.message}. Please check if the server is running.`);
        setMessages([{
          role: 'model',
          content: 'Hello! I\'m your health assistant. How can I help you today?',
          timestamp: new Date()
        }]);
      }
    };

    if (token && user?.role === 'patient') {
      fetchHealthSummary();
    }
  }, [token, user]);


  // Send message to chatbot
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Store the message before clearing input
    const messageText = input;

    // Add user message to chat
    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      console.log('Sending message to:', `${API_URL}/chatbot/message`);
      const response = await fetch(`${API_URL}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: messageText })
      });

      console.log('Message response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Message error:', errorData);
        throw new Error(errorData.error || errorData.details || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Message response data:', data);

      // Add AI response to chat
      const aiMessage = {
        role: 'model',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Send message error:', err);
      setError(`Error: ${err.message}`);
      const errorMessage = {
        role: 'model',
        content: `Sorry, I encountered an error: ${err.message}. Please check your connection and try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };


  // Clear conversation history
  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear the conversation history?')) {
      try {
        await fetch(`${API_URL}/chatbot/history`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setMessages([{
          role: 'model',
          content: `Hello ${healthSummary?.patientName}! 👋 I'm ready to assist you again. What would you like to know about your health?`,
          timestamp: new Date()
        }]);
      } catch (err) {
        setError('Failed to clear history');
      }
    }
  };

  if (user?.role !== 'patient') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
          <p className="text-gray-300">Only patients can access the health assistant chatbot.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-content">
          <h1 className="header-title">🏥 Health Assistant</h1>
          <p className="header-subtitle">Personalized AI-Powered Health Support</p>
        </div>
        <div className="header-actions">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="info-button"
            title="View health summary"
          >
            ℹ️
          </button>
          <button
            onClick={handleClearHistory}
            className="clear-button"
            title="Clear conversation"
          >
            🗑️
          </button>
        </div>
      </div>

      {showInfo && healthSummary && (
        <div className="health-summary">
          <h3>📊 Your Health Summary</h3>
          
          {healthSummary.recentDiagnoses && healthSummary.recentDiagnoses.length > 0 && (
            <div className="summary-section">
              <h4>Recent Diagnoses:</h4>
              <ul>
                {healthSummary.recentDiagnoses.map((d, i) => (
                  <li key={i}>{d.diagnosis}</li>
                ))}
              </ul>
            </div>
          )}

          {healthSummary.currentMedications && healthSummary.currentMedications.length > 0 && (
            <div className="summary-section">
              <h4>Current Medications:</h4>
              <ul>
                {healthSummary.currentMedications.map((m, i) => (
                  <li key={i}>💊 {m}</li>
                ))}
              </ul>
            </div>
          )}

          {healthSummary.allergies && healthSummary.allergies.length > 0 && (
            <div className="summary-section">
              <h4>Allergies:</h4>
              <ul>
                {healthSummary.allergies.map((a, i) => (
                  <li key={i}>⚠️ {a}</li>
                ))}
              </ul>
            </div>
          )}

          {Object.keys(healthSummary.latestVitals || {}).length > 0 && (
            <div className="summary-section">
              <h4>Latest Vitals:</h4>
              <ul>
                {Object.entries(healthSummary.latestVitals).map(([key, value]) => (
                  value && (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  )
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className={`message-content ${msg.role === 'user' ? 'user-content' : 'ai-content'}`}>
              <p>{msg.content}</p>
              <span className="message-time">
                {msg.timestamp?.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message ai-message">
            <div className="message-content ai-content typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="chatbot-input-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your health, medications, or symptoms..."
            disabled={loading}
            className="message-input"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="send-button"
          >
            {loading ? '⏳' : '➤'}
          </button>
        </div>
        <p className="input-disclaimer">
          💡 This AI assistant provides information based on your medical records. Always consult your doctor for serious health concerns.
        </p>
      </form>
    </div>
  );
};

export default Chatbot;
