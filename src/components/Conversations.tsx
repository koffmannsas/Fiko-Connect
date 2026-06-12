import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Bot, Send, Smartphone, Zap, CheckCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'client' | 'ai' | 'admin';
  content: string;
  timestamp: string;
}

export default function ConversationsModule({ onboardingData }: { onboardingData: any }) {
  const [threads, setThreads] = useState<any[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState('');

  const companyId = onboardingData?.companyId || 'fiko_prod_68469';

  // 1. Fetch Threads
  useEffect(() => {
    const q = query(collection(db, 'leads'), where('companyId', '==', companyId), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsList = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || doc.data().phone,
        lastMsg: doc.data().lastMessage || '...',
        time: doc.data().updatedAt?.toDate?.()?.toLocaleTimeString() || '...'
      }));
      setThreads(leadsList);
      if (!activeThreadId && leadsList.length > 0) setActiveThreadId(leadsList[0].id);
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
        timestamp: doc.data().timestamp?.toDate?.()?.toLocaleTimeString() || '...'
      })) as ChatMessage[];
      setActiveMessages(msgs);
    });
    return unsubscribe;
  }, [activeThreadId, companyId]);

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

  return (
    <div className="grid grid-cols-4 gap-6 h-[720px] text-white">
      <div className="col-span-1 bg-[#0a0a0a] border border-gray-850 rounded-2xl overflow-y-auto">
        {threads.map(t => (
          <div key={t.id} onClick={() => setActiveThreadId(t.id)} className={`p-4 cursor-pointer border-b border-gray-900 ${activeThreadId === t.id ? 'bg-zinc-900' : ''}`}>
            <p className="font-bold text-xs">{t.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{t.lastMsg}</p>
          </div>
        ))}
      </div>

      <div className="col-span-3 bg-[#09090c] border border-gray-850 rounded-2xl flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {activeMessages.map(m => (
            <div key={m.id} className={`flex flex-col max-w-[80%] ${m.sender === 'admin' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
              <div className={`p-3 rounded-2xl text-xs ${m.sender === 'admin' ? 'bg-fiko-red' : 'bg-zinc-900'}`}>
                <p>{m.content}</p>
              </div>
              <span className="text-[8px] text-gray-500 mt-1">{m.timestamp}</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-900 flex gap-2">
          <input value={typedMessage} onChange={e => setTypedMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Message..." className="flex-1 bg-gray-950 border border-gray-900 p-2 rounded-xl text-xs focus:outline-none" />
          <button onClick={handleSend} className="bg-fiko-red px-4 py-2 rounded-xl font-bold">Send</button>
        </div>
      </div>
    </div>
  );
}
