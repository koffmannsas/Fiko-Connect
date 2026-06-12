import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  MessageSquare,
  Send,
  Bot,
  Smartphone,
  ShieldCheck,
  Coins,
  CreditCard,
  FileText,
  BadgeCheck,
  CheckCheck,
  Power,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'client' | 'ai' | 'admin';
  content: string;
  timestamp: string;
  paymentWidget?: {
    item: string;
    value: number;
    provider: 'Wave' | 'Orange Money' | 'MTN Money' | string;
    isPaid?: boolean;
  };
}

interface Thread {
  id: string;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: boolean;
  score: number;
  mobile: string;
  category: string;
}

export default function ConversationsModule({ onboardingData }: { onboardingData: any }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [ussdProgress, setUssdProgress] = useState<'idle' | 'pushing' | 'verified'>('idle');

  const companyId = onboardingData?.companyId || 'fiko_prod_68469';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Threads (Leads)
  useEffect(() => {
    const q = query(
      collection(db, 'leads'),
      where('companyId', '==', companyId),
      orderBy('updatedAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || data.phone,
          avatar: (data.name || 'P')[0],
          lastMsg: data.lastMessage || '...',
          time: data.updatedAt?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '...',
          unread: false,
          score: data.score || 50,
          mobile: data.phone,
          category: data.status || 'NEW'
        };
      }) as Thread[];
      setThreads(leadsList);
      if (!activeThreadId && leadsList.length > 0) {
        setActiveThreadId(leadsList[0].id);
      }
    });
    return unsubscribe;
  }, [companyId]);

  // 2. Fetch Messages
  useEffect(() => {
    if (!activeThreadId) return;
    const q = query(
      collection(db, 'messages'),
      where('companyId', '==', companyId),
      where('conversationId', '==', activeThreadId),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '...'
      })) as ChatMessage[];
      setActiveMessages(msgs);
    });
    return unsubscribe;
  }, [activeThreadId, companyId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSend = async () => {
    if (!typedMessage.trim() || !activeThreadId) return;
    const content = typedMessage;
    setTypedMessage('');
    await addDoc(collection(db, 'messages'), {
      companyId,
      conversationId: activeThreadId,
      sender: 'admin',
      content,
      timestamp: serverTimestamp()
    });
  };

  const activeThread = threads.find(t => t.id === activeThreadId);

  if (!activeThread && threads.length > 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[720px] text-white animate-in fade-in duration-700">

      {/* THREADS LISTING */}
      <div className="lg:col-span-1 bg-[#0a0a0a] border border-gray-850 rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-900 bg-black/40 flex justify-between items-center">
          <h3 className="font-black text-sm uppercase tracking-wider">Inbox WhatsApp</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-950">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setActiveThreadId(thread.id)}
              className={`p-4 cursor-pointer transition flex gap-3 items-start ${thread.id === activeThreadId ? 'bg-zinc-900/60 border-l-4 border-fiko-red' : 'hover:bg-zinc-950/40'}`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-850 border border-gray-800 flex items-center justify-center font-black text-fiko-red">
                {thread.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-extrabold text-xs truncate">{thread.name}</p>
                  <span className="text-[9px] text-gray-500">{thread.time}</span>
                </div>
                <p className="text-[10px] text-gray-400 truncate">{thread.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className="lg:col-span-2 bg-[#09090c] border border-gray-850 rounded-2xl flex flex-col overflow-hidden">
        {activeThread ? (
          <>
            <div className="p-4 border-b border-gray-900 bg-black/40 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-950 border border-red-900/45 text-fiko-red flex items-center justify-center font-black text-xs">
                  {activeThread.avatar}
                </div>
                <div>
                  <p className="font-black text-xs">{activeThread.name}</p>
                  <p className="text-[9px] text-[#25D366] font-extrabold uppercase flex items-center gap-1.5 leading-none mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                    AI Vendeur Actif
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-black/20 to-transparent">
              {activeMessages.map((message) => (
                <div key={message.id} className={`flex flex-col max-w-[85%] ${message.sender === 'admin' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                  <div className={`p-3.5 rounded-2xl ${message.sender === 'admin' ? 'bg-fiko-red text-white rounded-tr-none' : 'bg-zinc-900 border border-zinc-800 text-gray-200 rounded-tl-none'}`}>
                    {message.sender === 'ai' && (
                      <div className="flex items-center gap-1 mb-1.5 text-[8px] uppercase tracking-widest font-black text-red-400">
                        <Bot size={10} /> <span>Fiko Brain</span>
                      </div>
                    )}
                    <p className="text-xs font-medium leading-relaxed">{message.content}</p>
                  </div>
                  <span className="text-[8px] text-gray-500 mt-1 px-1">{message.timestamp}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-900 bg-black/40">
              <div className="flex gap-2">
                <input
                  value={typedMessage}
                  onChange={e => setTypedMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Écrire une réponse..."
                  className="flex-1 p-2.5 bg-gray-950 border border-gray-900 text-white rounded-xl text-xs focus:outline-none"
                />
                <button onClick={handleSend} className="bg-[#E10600] text-white p-2.5 rounded-xl font-bold"><Send size={14}/></button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 font-mono text-xs">
            SÉLECTIONNEZ UNE CONVERSATION
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-[#0a0a0a] border border-gray-850 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-950">
            <Bot className="text-purple-400" size={16} />
            <h4 className="font-extrabold text-xs uppercase tracking-wider">IA Insights</h4>
          </div>
          <div className="text-xs text-gray-400 space-y-3">
             <div className="bg-black/60 p-2.5 rounded-xl border border-gray-950">
               <span className="text-[8px] font-black text-gray-500 uppercase block">Règle appliquée :</span>
               <p className="text-[10px] italic">"Closer la vente en proposant un lien de paiement dès que l'intention est détectée."</p>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}
