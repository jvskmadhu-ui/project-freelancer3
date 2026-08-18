import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockMessages, mockUsers } from '../../services/mockData';
import VerificationBadge from '../../components/VerificationBadge';
import api from '../../services/api';
import {
  Send,
  Paperclip,
  Image,
  FileText,
  Search,
  MoreVertical,
  CheckCheck,
  Briefcase,
  ShieldCheck,
  Smile,
  Clock
} from 'lucide-react';

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const partnerIdParam = searchParams.get('partner');
  const { user } = useAuth();

  const [activePartnerId, setActivePartnerId] = useState(partnerIdParam ? Number(partnerIdParam) : 3);
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const partners = [
    {
      id: 3,
      name: "Elena Vance",
      role: "Lead 3D WebGL Artist",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
      verified: true,
      online: true,
      lastMsg: "Milestone 1 deliverables are ready for your review!",
      unread: 1,
      contractId: 1
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      role: "Client (TechCorp)",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
      verified: true,
      online: true,
      lastMsg: "The performance is breathtaking! I've approved Milestone 1.",
      unread: 0,
      contractId: 1
    },
    {
      id: 4,
      name: "Alex Chen",
      role: "Full-Stack Architect",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
      verified: true,
      online: false,
      lastMsg: "Thanks for reviewing my proposal.",
      unread: 0,
      contractId: null
    }
  ];

  const activePartner = partners.find(p => p.id === activePartnerId) || partners[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      senderId: user?.id || 2,
      senderName: user?.fullName || 'Sarah Jenkins',
      recipientId: activePartner.id,
      recipientName: activePartner.name,
      content: inputText.trim(),
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    try {
      await api.post('/chat/send', {
        recipientId: activePartner.id,
        content: newMsg.content,
        contractId: activePartner.contractId
      });
    } catch (err) {
      console.warn('REST chat fallback used');
    }

    // Simulate partner response for rich live interaction
    setTimeout(() => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const replyMsg = {
          id: Date.now() + 1,
          senderId: activePartner.id,
          senderName: activePartner.name,
          recipientId: user?.id || 2,
          recipientName: user?.fullName || 'Sarah Jenkins',
          content: "Received loud and clear! I'm currently tuning the 3D physics engine for the next milestone update.",
          isRead: true,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, replyMsg]);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-140px)] min-h-[600px]">
      <div className="glass-panel h-full rounded-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Left Sidebar: Conversations List */}
        <div className="w-full md:w-80 border-r border-white/10 flex flex-col bg-dark-900/60">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-base font-bold text-white font-display mb-3">Messages</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-dark-800 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {partners.map((p) => {
              const isSelected = p.id === activePartner.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePartnerId(p.id)}
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition ${isSelected ? 'bg-primary-950/40 border-l-2 border-primary-500' : 'hover:bg-dark-800/60'}`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover border border-white/10"
                    />
                    {p.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-dark-900 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                      <span className="text-[10px] text-slate-500">11:22 AM</span>
                    </div>
                    <p className="text-[11px] text-primary-300 font-medium truncate">{p.role}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{p.lastMsg}</p>
                  </div>
                  {p.unread > 0 && (
                    <span className="px-1.5 py-0.5 bg-primary-600 text-white rounded-full text-[10px] font-bold">
                      {p.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Workspace */}
        <div className="flex-1 flex flex-col bg-dark-900/40">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-dark-800/60 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activePartner.avatarUrl}
                  alt={activePartner.name}
                  className="w-10 h-10 rounded-xl object-cover border border-primary-500/30"
                />
                {activePartner.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-dark-900 rounded-full" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{activePartner.name}</h3>
                  <VerificationBadge verified={activePartner.verified} size="sm" showLabel={false} />
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-medium">● Online</span> • {activePartner.role}
                </p>
              </div>
            </div>

            {/* Linked Contract Action */}
            {activePartner.contractId && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/contracts/${activePartner.contractId}`}
                  className="px-3 py-1.5 bg-primary-600/20 hover:bg-primary-600 text-primary-300 hover:text-white rounded-xl text-xs font-semibold border border-primary-500/30 transition flex items-center gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5" /> View Active Contract Workspace
                </Link>
              </div>
            )}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((m) => {
              const isMine = m.senderId === (user?.id || 2);
              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2.5 ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMine && (
                    <img
                      src={activePartner.avatarUrl}
                      alt={activePartner.name}
                      className="w-7 h-7 rounded-lg object-cover mb-1 shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${isMine ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-br-none shadow-glow' : 'bg-dark-800 border border-white/10 text-slate-200 rounded-bl-none shadow-sm'}`}
                  >
                    <p>{m.content}</p>
                    <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isMine ? 'text-indigo-200' : 'text-slate-400'}`}>
                      <span>Just now</span>
                      {isMine && <CheckCheck className="w-3.5 h-3.5 text-accent-cyan" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-accent-cyan" />
                <span>{activePartner.name} is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Send Bar */}
          <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-white/10 bg-dark-800/60 backdrop-blur-md flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-dark-700 transition"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activePartner.name}...`}
              className="flex-1 bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-glow transition shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
