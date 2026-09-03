// Partner Requests Page (Screen 6)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import PartnerRequestCard from '../components/PartnerRequestCard.jsx';

export default function PartnerRequestsPage() {
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const { refreshProfile } = useAuth();
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [recData, sentData] = await Promise.all([
        api.getReceivedRequests(),
        api.getSentRequests(),
      ]);
      setReceivedRequests(recData.requests || []);
      setSentRequests(sentData.requests || []);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      setIsProcessing(true);
      const res = await api.acceptRequest(requestId);
      await refreshProfile();
      setAlertMsg(res.message || 'Partner request accepted successfully.');
      setTimeout(() => {
        navigate('/partnership');
      }, 1000);
    } catch (err) {
      alert(err.message || 'Failed to accept request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      setIsProcessing(true);
      await api.declineRequest(requestId);
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Failed to decline request');
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingReceivedCount = receivedRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Partner Requests
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          Review 1-to-1 Quran Mate requests and pair up for accountability.
        </p>
      </div>

      {alertMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] mb-6">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'received'
              ? 'border-[var(--primary)] text-[var(--primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Received</span>
          {pendingReceivedCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold">
              {pendingReceivedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'sent'
              ? 'border-[var(--primary)] text-[var(--primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent</span>
          <span className="text-[10px] text-[var(--text-muted)] font-normal">
            ({sentRequests.length})
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] animate-pulse"
            />
          ))}
        </div>
      ) : activeTab === 'received' ? (
        receivedRequests.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)]">
            <Inbox className="w-10 h-10 mx-auto text-[var(--text-muted)] mb-3 opacity-60" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              You don&rsquo;t have any partner requests yet
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
              When sisters browse learners on the Discover page, their pairing requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((req) => (
              <PartnerRequestCard
                key={req.id}
                request={req}
                type="received"
                onAccept={handleAccept}
                onDecline={handleDecline}
                isSubmitting={isProcessing}
              />
            ))}
          </div>
        )
      ) : sentRequests.length === 0 ? (
        <div className="text-center py-16 rounded-3xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)]">
          <Send className="w-10 h-10 mx-auto text-[var(--text-muted)] mb-3 opacity-60" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            No outgoing partner requests
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
            Browse the Discover directory to find and connect with compatible sisters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sentRequests.map((req) => (
            <PartnerRequestCard key={req.id} request={req} type="sent" />
          ))}
        </div>
      )}
    </div>
  );
}
