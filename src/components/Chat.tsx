import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Chat({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'messages'), where('conversationId', '==', conversationId), orderBy('timestamp', 'asc'));
    return onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [conversationId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await addDoc(collection(db, 'messages'), {
      conversationId,
      sender: 'admin',
      content: newMessage,
      timestamp: serverTimestamp()
    });
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-[#111] p-4 rounded-xl">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className={`p-3 rounded-lg ${msg.sender === 'admin' ? 'bg-fiko-red text-white ml-auto' : 'bg-gray-800 text-white'}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={newMessage} onChange={e => setNewMessage(e.target.value)} className="flex-1 p-2 bg-gray-900 rounded" />
        <button onClick={sendMessage} className="bg-fiko-red p-2 rounded">Envoyer</button>
      </div>
    </div>
  );
}
