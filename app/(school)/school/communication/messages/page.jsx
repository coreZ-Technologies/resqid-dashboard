'use client';

/**
 * SCHOOL ADMIN — MESSAGES
 * Place at: app/(school)/school/messages/page.jsx
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import {
    MessageSquare, Search, Send, Plus, X,
    ChevronDown, Loader2, Check, CheckCheck,
    User, Users, Clock, ArrowLeft, Paperclip,
    MoreVertical, Phone, Circle
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_THREADS = [
    { id: 't1', name: 'Mrs. Priya Sharma',    role: 'Parent', student: 'Aarav Sharma (Cls 9-A)',   avatar: 'PS', color: 'bg-blue-500',    unread: 2, lastMessage: 'Thank you for the update on his attendance.', lastAt: '10:32 AM', online: true  },
    { id: 't2', name: 'Mr. Rohit Verma',      role: 'Parent', student: 'Sneha Verma (Cls 7-B)',    avatar: 'RV', color: 'bg-violet-500',  unread: 0, lastMessage: 'We will attend the PTM on 15th June.',         lastAt: '9:15 AM',  online: false },
    { id: 't3', name: 'Mrs. Ananya Reddy',    role: 'Parent', student: 'Karan Reddy (Cls 11-A)',   avatar: 'AR', color: 'bg-emerald-500', unread: 1, lastMessage: 'Is there any remedial class for Physics?',     lastAt: 'Yesterday',online: false },
    { id: 't4', name: 'Mr. Vikram Singh',     role: 'Parent', student: 'Priya Singh (Cls 8-C)',    avatar: 'VS', color: 'bg-amber-500',   unread: 0, lastMessage: 'Noted. Thank you.',                            lastAt: 'Yesterday',online: true  },
    { id: 't5', name: 'Mrs. Meera Pillai',    role: 'Parent', student: 'Arjun Pillai (Cls 10-A)',  avatar: 'MP', color: 'bg-rose-500',    unread: 3, lastMessage: 'Can you share the exam schedule?',             lastAt: 'Mon',      online: false },
    { id: 't6', name: 'Mr. Suresh Nair',      role: 'Parent', student: 'Divya Nair (Cls 6-D)',     avatar: 'SN', color: 'bg-cyan-500',    unread: 0, lastMessage: 'She has been absent due to fever.',            lastAt: 'Sun',      online: false },
];

const MOCK_MESSAGES = {
    t1: [
        { id: 'm1', from: 'them', text: 'Good morning. I wanted to ask about Aarav\'s attendance this week.',              time: '10:20 AM', read: true  },
        { id: 'm2', from: 'me',   text: 'Good morning Mrs. Sharma. Aarav was present all 5 days this week.',              time: '10:25 AM', read: true  },
        { id: 'm3', from: 'them', text: 'That is great to hear. He mentioned having difficulty in Mathematics.',          time: '10:28 AM', read: true  },
        { id: 'm4', from: 'me',   text: 'Yes, we have noticed that as well. We suggest he attends the Saturday remedial class at 10 AM.', time: '10:30 AM', read: true },
        { id: 'm5', from: 'them', text: 'Thank you for the update on his attendance.',                                    time: '10:32 AM', read: false },
    ],
    t2: [
        { id: 'm1', from: 'them', text: 'Hello, I received the PTM invite. We will attend on 15th June.',                time: '9:10 AM',  read: true  },
        { id: 'm2', from: 'me',   text: 'Thank you Mr. Verma. The meeting will be from 10 AM to 1 PM.',                  time: '9:12 AM',  read: true  },
        { id: 'm3', from: 'them', text: 'We will attend the PTM on 15th June.',                                          time: '9:15 AM',  read: true  },
    ],
    t3: [
        { id: 'm1', from: 'them', text: 'Is there any remedial class for Physics this week?',                            time: 'Yesterday', read: false },
    ],
    t4: [
        { id: 'm1', from: 'me',   text: 'Priya scored 92% in the mid-term test. Well done!',                             time: 'Yesterday', read: true  },
        { id: 'm2', from: 'them', text: 'Noted. Thank you.',                                                             time: 'Yesterday', read: true  },
    ],
    t5: [
        { id: 'm1', from: 'them', text: 'Can you share the exam schedule for Class 10?',                                 time: 'Mon',       read: false },
        { id: 'm2', from: 'them', text: 'Also when will the results be out?',                                            time: 'Mon',       read: false },
        { id: 'm3', from: 'them', text: 'Can you share the exam schedule?',                                              time: 'Mon',       read: false },
    ],
    t6: [
        { id: 'm1', from: 'them', text: 'Divya has been absent due to fever. She will return Monday.',                   time: 'Sun',       read: true  },
        { id: 'm2', from: 'me',   text: 'Thank you for informing us. Please submit a medical certificate on return.',    time: 'Sun',       read: true  },
        { id: 'm3', from: 'them', text: 'She has been absent due to fever.',                                             time: 'Sun',       read: true  },
    ],
};

// ─── Thread Item ──────────────────────────────────────────────────────────────
const ThreadItem = ({ thread, active, onClick }) => (
    <div onClick={onClick}
        className={`px-4 py-3.5 cursor-pointer transition-colors border-b border-slate-100 ${active ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-slate-50'}`}>
        <div className="flex items-center gap-3">
            <div className="relative shrink-0">
                <div className={`w-10 h-10 rounded-full ${thread.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {thread.avatar}
                </div>
                {thread.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm font-semibold truncate ${active ? 'text-blue-700' : 'text-slate-900'}`}>{thread.name}</span>
                    <span className="text-xs text-slate-400 shrink-0 ml-2">{thread.lastAt}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 truncate">{thread.lastMessage}</span>
                    {thread.unread > 0 && (
                        <span className="ml-2 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {thread.unread}
                        </span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MessagesPage() {
    const [threads, setThreads]       = useState(MOCK_THREADS);
    const [messages, setMessages]     = useState(MOCK_MESSAGES);
    const [activeId, setActiveId]     = useState('t1');
    const [search, setSearch]         = useState('');
    const [input, setInput]           = useState('');
    const [sending, setSending]       = useState(false);
    const bottomRef                   = useRef(null);

    const activeThread = threads.find(t => t.id === activeId);
    const activeMessages = messages[activeId] || [];

    const filteredThreads = useMemo(() => threads.filter(t =>
        !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.student.toLowerCase().includes(search.toLowerCase())
    ), [threads, search]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeId, activeMessages.length]);

    const handleSend = async () => {
        if (!input.trim()) return;
        setSending(true);
        const msg = { id: `m${Date.now()}`, from: 'me', text: input.trim(), time: 'Just now', read: false };
        setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), msg] }));
        setThreads(prev => prev.map(t => t.id === activeId ? { ...t, lastMessage: input.trim(), lastAt: 'Just now' } : t));
        setInput('');
        await new Promise(r => setTimeout(r, 300));
        setSending(false);
    };

    const totalUnread = threads.reduce((a, t) => a + t.unread, 0);

    return (
        <div className="max-w-[1300px]">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[1.375rem] font-bold text-slate-900 m-0">Messages</h1>
                    <p className="text-sm text-slate-500 mt-1">Direct messages to parents and staff</p>
                </div>
                {totalUnread > 0 && (
                    <span className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-200">
                        <MessageSquare size={15} /> {totalUnread} unread
                    </span>
                )}
            </div>

            {/* Chat Layout */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex h-[680px]">

                {/* Sidebar — thread list */}
                <div className="w-80 shrink-0 border-r border-slate-200 flex flex-col">
                    <div className="p-3 border-b border-slate-100">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search conversations..."
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredThreads.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">No conversations found</div>
                        ) : filteredThreads.map(t => (
                            <ThreadItem key={t.id} thread={t} active={activeId === t.id}
                                onClick={() => { setActiveId(t.id); setThreads(prev => prev.map(th => th.id === t.id ? { ...th, unread: 0 } : th)); }} />
                        ))}
                    </div>
                </div>

                {/* Chat area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Chat header */}
                    {activeThread && (
                        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3 bg-white">
                            <div className="relative shrink-0">
                                <div className={`w-10 h-10 rounded-full ${activeThread.color} flex items-center justify-center text-white font-bold text-sm`}>
                                    {activeThread.avatar}
                                </div>
                                {activeThread.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-slate-900 text-sm">{activeThread.name}</div>
                                <div className="text-xs text-slate-400">{activeThread.role} · {activeThread.student}</div>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className={`text-xs font-medium ${activeThread.online ? 'text-emerald-500' : 'text-slate-400'}`}>
                                    {activeThread.online ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50">
                        {activeMessages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${msg.from === 'me'
                                    ? 'bg-blue-600 text-white rounded-br-sm'
                                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm'}`}>
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    <div className={`flex items-center gap-1 mt-1 ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                                        <span className={`text-[10px] ${msg.from === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>{msg.time}</span>
                                        {msg.from === 'me' && (
                                            msg.read
                                                ? <CheckCheck size={12} className="text-blue-200" />
                                                : <Check size={12} className="text-blue-200" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-slate-100 bg-white flex items-center gap-3">
                        <button className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            <Paperclip size={18} />
                        </button>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-slate-50"
                        />
                        <button onClick={handleSend} disabled={!input.trim() || sending}
                            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white disabled:opacity-50 transition-colors shrink-0">
                            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}