// Coordinate / Messaging Page (Screen 8)
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Send, ArrowLeft, Clock, Sparkles, MessageCircle, Calendar, CheckCheck } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function MessagingPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Check if prefilled text was passed from Ayah Finder
  useEffect(() => {
    const prefill = searchParams.get('prefill');
    if (prefill) {
      setInputText(prefill);
    }
  }, [searchParams]);

  const fetchMessages = async () => {
    try {
      const data = await api.getMessages(id);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll messages every 5 seconds for light real-time-like coordination without heavy WebSockets
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isSending) return;

    try {
      setIsSending(true);
      const res = await api.sendMessage(id, inputText.trim());
      setInputText('');
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      alert(err.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setInputText(promptText);
  };

  const quickPrompts = [
    'Assalamu alaikum! Are you available for revision at 7 PM today?',
    'Alhamdulillah, finished my portion! How is your memorization going today?',
    'Shall we test each other on our assigned Surah this evening inshaAllah?',
    'Could we practice mutashabihat (similar verses) today?',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/partnership"
            className="p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-bold text-base sm:text-lg text-[var(--text-primary)] flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[var(--primary)]" />
              <span>Coordinate Study Session</span>
            </h1>
            <p className="text-[11px] text-[var(--text-muted)]">
              Agree on study times and share reflections with your Quran Mate
            </p>
          </div>
        </div>

        <Link
          to="/ayah-finder"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hidden sm:inline"
        >
          Lookup Ayah 📖
        </Link>
      </div>

      {/* Message Thread Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4">
        {loading ? (
          <div className="text-center py-12 text-xs text-[var(--text-muted)]">
            Loading study thread...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)]">
            <MessageCircle className="w-8 h-8 mx-auto text-[var(--text-muted)] mb-2 opacity-60" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Start your study coordination
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Send a salam, propose a study time, or test verses together!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-bold text-[var(--text-muted)]">
                    {isMe ? 'You' : msg.sender_name}
                  </span>
                  <span className="text-[9px] text-[var(--text-muted)]">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-2xs ${
                    isMe
                      ? 'bg-[var(--primary)] text-white rounded-tr-xs'
                      : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Study Coordination Prompts */}
      <div className="shrink-0 mb-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 text-xs whitespace-nowrap">
          <span className="text-[10px] font-bold text-[var(--text-muted)] flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Quick Notes:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPrompt(qp)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary-border)] transition-colors truncate max-w-[220px]"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="shrink-0 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message or propose a revision time..."
          className="flex-1 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-xs"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="px-4 py-3 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
