import { useState, useEffect, useRef } from 'react';
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
  id: number;
  sender: 'client' | 'ai' | 'admin';
  text: string;
  timestamp: string;
  paymentWidget?: {
    item: string;
    value: number;
    provider: 'Wave' | 'Orange Money' | 'MTN Money' | string;
    isPaid?: boolean;
  };
}

interface Thread {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: boolean;
  score: number;
  mobile: string;
  category: string;
  messages: ChatMessage[];
}

export default function ConversationsModule() {
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: 1,
      name: 'Marie Koné',
      avatar: 'M',
      lastMsg: 'Je veux acheter le pack Luxe. Est-ce que vous prenez Wave ?',
      time: '12:04',
      unread: true,
      score: 95,
      mobile: '+225 07 48 93 11 20',
      category: 'Client VIP',
      messages: [
        { id: 1, sender: 'client', text: 'Bonjour ! J’ai vu vos articles sur Instagram.', timestamp: '12:00' },
        { id: 2, sender: 'ai', text: 'Bonjour Marie ! Bienvenue chez nous 🌸 L’assistant automatisé de Koffmann Capital est à votre disposition. Comment puis-je vous aider ? Notre catalogue est disponible ici.', timestamp: '12:01' },
        { id: 3, sender: 'client', text: 'Je veux acheter le pack Luxe. Est-ce que vous prenez Wave ?', timestamp: '12:02' }
      ]
    },
    {
      id: 2,
      name: 'Koffi Yao (Cocody)',
      avatar: 'K',
      lastMsg: 'D’accord, j’envoie par Orange Money alors.',
      time: '11:45',
      unread: false,
      score: 91,
      mobile: '+225 05 92 84 77 15',
      category: 'Boutique Phys.',
      messages: [
        { id: 1, sender: 'client', text: 'Bonjour, faites-vous des livraisons sur Cocody Saint-Jean ?', timestamp: '11:40' },
        { id: 2, sender: 'ai', text: 'Oui Koffi ! La livraison est de 1 500 FCFA sur Cocody Saint-Jean, assurée sous 2h par nos coursiers 🛵', timestamp: '11:41' },
        { id: 3, sender: 'client', text: 'Super, d’accord, j’envoie par Orange Money alors.', timestamp: '11:43' }
      ]
    },
    {
      id: 3,
      name: 'Awa Diallo',
      avatar: 'A',
      lastMsg: 'Combien coûte votre kit de formation de mode ?',
      time: 'Hier',
      unread: false,
      score: 88,
      mobile: '+225 01 02 03 04 05',
      category: 'Formation',
      messages: [
        { id: 1, sender: 'client', text: 'Hello, je cherche vos tarifs pour la formation de couture.', timestamp: 'Hier 15:30' },
        { id: 2, sender: 'ai', text: 'Bonjour Awa ! Notre formation de couture niveau Débutant est proposée à 19 900 FCFA avec accès à vie à la base Fiko Brain Academy.', timestamp: 'Hier 15:32' },
        { id: 3, sender: 'client', text: 'Combien coûte votre kit de formation de mode ?', timestamp: 'Hier 15:35' }
      ]
    }
  ]);

  const [activeThreadId, setActiveThreadId] = useState<number>(1);
  const [typedMessage, setTypedMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [ussdProgress, setUssdProgress] = useState<'idle' | 'pushing' | 'verified'>('idle');

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread.messages, isAiTyping, ussdProgress]);

  // Handle manual sender actions
  const handleSend = () => {
    if (!typedMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'admin',
      text: typedMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMsg: typedMessage,
          unread: false,
          messages: [...t.messages, userMsg]
        };
      }
      return t;
    }));

    setTypedMessage('');

    // Trigger dynamic automated reply logic if specific keys exist
    const lowered = typedMessage.toLowerCase();
    if (lowered.includes('wave') || lowered.includes('acheter') || lowered.includes('pay') || lowered.includes('prix')) {
      simulateAiResponse();
    }
  };

  // Simulate Fiko Pay Payment Generator Trigger
  const simulateAiResponse = () => {
    setIsAiTyping(true);
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: Date.now(),
        sender: 'ai',
        text: "Génération automatique d'un lien Fiko Pay intelligent sécurisé. Vous pouvez payer en un clic de manière autonome : ",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        paymentWidget: {
          item: activeThread.id === 1 ? 'Kit Couture Moderne' : 'Frais de Formation Elite',
          value: activeThread.id === 1 ? 45000 : 24900,
          provider: 'Wave',
          isPaid: false
        }
      };

      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMsg: '💳 [Paiement Mobile Money en attente]',
            messages: [...t.messages, aiReply]
          };
        }
        return t;
      }));
      setIsAiTyping(false);
    }, 1500);
  };

  // Mock Pay with USSD Process
  const handleConfirmPaymentSim = (msgId: number) => {
    setUssdProgress('pushing');
    setTimeout(() => {
      setUssdProgress('verified');

      // Update Payment State inside threads
      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          const updatedMsgs = t.messages.map(m => {
            if (m.id === msgId && m.paymentWidget) {
              return {
                ...m,
                paymentWidget: { ...m.paymentWidget, isPaid: true }
              };
            }
            return m;
          });
          return {
            ...t,
            lastMsg: '💰 Paiement validé de ' + (activeThread.id === 1 ? '45 000 FCFA ✓' : '24 900 FCFA ✓'),
            messages: [...updatedMsgs, {
              id: Date.now() + 1,
              sender: 'ai',
              text: "✅ Votre paiement de " + (activeThread.id === 1 ? '45 000 FCFA' : '24 900' ) + " FCFA via Mobile Money Mobile a été réceptionné avec succès par le robot Fiko Connect ! La transaction a été enregistrée dans vos logs FOS.",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]
          };
        }
        return t;
      }));

    }, 2500);
  };

  // Quick prompt triggers
  const sendQuickTrigger = (text: string) => {
    setTypedMessage(text);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[720px] text-white animate-in fade-in duration-700">

      {/* THREADS LISTING - LEFT SIDE */}
      <div className="lg:col-span-1 bg-[#0a0a0a] border border-gray-850 rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-900 bg-black/40 flex justify-between items-center">
          <h3 className="font-black text-sm uppercase tracking-wider text-gray-200">Inbox Prospect (WA)</h3>
          <span className="bg-[#E10600] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
            {threads.filter(t => t.unread).length} Nouveau(x)
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-950">
          {threads.map((thread) => {
            const isSelected = thread.id === activeThreadId;
            return (
              <div
                key={thread.id}
                onClick={() => {
                  setActiveThreadId(thread.id);
                  // Mark as read
                  setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unread: false } : t));
                }}
                className={`p-4 cursor-pointer transition flex justify-between gap-3 items-start relative ${
                  isSelected ? 'bg-zinc-900/60 border-l-4 border-fiko-red' : 'hover:bg-zinc-950/40'
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-850 to-gray-950 border border-gray-800 flex items-center justify-center font-black text-sm text-fiko-red">
                    {thread.avatar}
                  </div>
                  {thread.unread && (
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#E10600] rounded-full border-2 border-black"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-extrabold text-xs text-white truncate">{thread.name}</p>
                    <span className="text-[9px] text-gray-500 font-mono">{thread.time}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate leading-relaxed">
                    {thread.lastMsg}
                  </p>

                  {/* Score Tag */}
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[8px] bg-red-950 text-fiko-red px-1.5 py-0.2 rounded font-black font-mono">
                      SCORE {thread.score}
                    </span>
                    <span className="text-[8px] text-gray-500 font-mono font-semibold">
                      {thread.mobile}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT INTERACTIVE WINDOW - CENTER */}
      <div className="lg:col-span-2 bg-[#09090c] border border-gray-850 rounded-2xl flex flex-col overflow-hidden relative">

        {/* Dynamic header */}
        <div className="p-4 border-b border-gray-900 bg-black/40 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-950 border border-red-900/45 text-fiko-red flex items-center justify-center font-black text-xs">
              {activeThread.avatar}
            </div>
            <div>
              <p className="font-black text-xs text-white">{activeThread.name}</p>
              <p className="text-[9px] text-[#25D366] font-extrabold uppercase flex items-center gap-1.5 leading-none mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                AI Vendeur Synch. Actif (FOS Agent)
              </p>
            </div>
          </div>
          <span className="text-[9px] bg-rose-950 text-fiko-red font-bold px-2 py-0.5 rounded border border-rose-900 uppercase">
            {activeThread.category}
          </span>
        </div>

        {/* Chat screen */}
        <div
          className="flex-1 p-4 overflow-y-auto space-y-4"
          style={{
            backgroundImage: `radial-gradient(ellipse at bottom, rgba(50,15,15,0.08) 0%, rgba(5,5,5,0) 100%)`
          }}
        >
          {activeThread.messages.map((message) => {
            const isAdmin = message.sender === 'admin';
            const isAI = message.sender === 'ai';

            return (
              <div
                key={message.id}
                className={`flex flex-col max-w-[85%] ${
                  isAdmin ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                {/* bubble */}
                <div className={`p-3.5 rounded-2xl ${
                  isAdmin
                    ? 'bg-fiko-red text-white rounded-tr-none'
                    : isAI
                      ? 'bg-zinc-900 border border-zinc-800 text-gray-200 rounded-tl-none relative overflow-hidden'
                      : 'bg-zinc-950 border border-zinc-900 text-white rounded-tl-none'
                }`}>
                  {isAI && (
                    <div className="flex items-center gap-1 mb-1.5 text-[8px] uppercase tracking-widest font-black text-red-400">
                      <Bot size={10} /> <span>Fiko Brain Assistant</span>
                    </div>
                  )}
                  <p className="text-xs font-medium leading-relaxed font-sans">{message.text}</p>

                  {/* Interactive payment widget inside the chat */}
                  {message.paymentWidget && (
                    <div className="mt-3 p-3 rounded-xl bg-black border border-emerald-900/60 flex flex-col gap-2 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] uppercase font-black tracking-widest text-[#25D366]">💲 Fiko Pay Automation</span>
                        <span className="font-mono text-xs font-black text-white">{message.paymentWidget.value.toLocaleString()} FCFA</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Frais d'activation de la transaction par clé USSD sécurisée.</p>

                      {message.paymentWidget.isPaid ? (
                        <div className="bg-emerald-950/50 border border-green-900/50 p-2 rounded-lg text-center text-green-400 font-black text-[10px] flex justify-center items-center gap-1.5">
                          <CheckCheck size={12} className="text-[#25D366]" /> Paiement validé avec succès
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          <div className="grid grid-cols-3 gap-1 text-[8px] font-black uppercase text-center">
                            <span className="bg-emerald-950 border border-green-900/40 text-[#25D366] py-1 rounded">Wave CIV ✓</span>
                            <span className="bg-orange-950 border border-orange-900/40 text-orange-400 py-1 rounded">Orange ✓</span>
                            <span className="bg-yellow-950 border border-yellow-900/40 text-yellow-400 py-1 rounded">MTN Pay ✓</span>
                          </div>

                          {ussdProgress === 'idle' && (
                            <button
                              onClick={() => handleConfirmPaymentSim(message.id)}
                              className="w-full bg-[#E10600] text-white py-1.5 rounded-lg text-[10px] font-black hover:bg-red-700 transition active:scale-95 flex items-center justify-center gap-1 mt-1"
                            >
                              <Zap size={10} /> Payer par Mobile Money direct ⚡
                            </button>
                          )}

                          {ussdProgress === 'pushing' && (
                            <div className="p-1.5 rounded bg-[#111] text-[9px] text-center text-gray-300 font-bold flex justify-center items-center gap-2">
                              <Smartphone size={12} className="text-[#25D366] animate-pulse" />
                              Envoi du Push USSD sur {activeThread.mobile}...
                            </div>
                          )}

                          {ussdProgress === 'verified' && (
                            <div className="p-1.5 rounded bg-emerald-950 text-[9px] text-center text-emerald-300 font-extrabold flex justify-center items-center gap-1.5">
                              Paiement Recouvré ! Débit validé ✓
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Meta details */}
                <span className="text-[8px] text-gray-500 font-mono mt-1 px-1">
                  {message.timestamp} • {isAdmin ? 'Agent' : isAI ? 'Fiko AI' : 'Prospect'}
                </span>
              </div>
            );
          })}

          {isAiTyping && (
            <div className="mr-auto flex gap-1.5 items-center p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs">
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AND ACTIONS */}
        <div className="p-4 border-t border-gray-900 bg-black/40 space-y-3">
          {/* Quick Triggers */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-[9px] font-bold uppercase text-gray-400">
            <span className="shrink-0 pt-1 text-gray-650">Scénarios FOS :</span>
            <button
              onClick={() => sendQuickTrigger("Combien coûte l'inscription ?")}
              className="shrink-0 bg-neutral-900 hover:bg-neutral-850 px-2.5 py-1 rounded-full text-white border border-gray-900"
            >
              Tarifs 🏷️
            </button>
            <button
              onClick={() => sendQuickTrigger("Avez-vous une boutique physique à Abidjan ?")}
              className="shrink-0 bg-neutral-900 hover:bg-neutral-850 px-2.5 py-1 rounded-full text-white border border-gray-900"
            >
              Adresse / Boutique 📍
            </button>
            <button
              onClick={() => sendQuickTrigger("Je veux acheter le pack Luxe. Vous prenez Wave ?")}
              className="shrink-0 bg-emerald-950 hover:bg-emerald-900 hover:text-white px-2.5 py-1 rounded-full text-emerald-400 border border-emerald-900/60"
            >
              Lien Fiko Pay 💳
            </button>
          </div>

          <div className="flex gap-2">
            <input
              value={typedMessage}
              onChange={e => setTypedMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Écrivez un message en tant que Koffmann Admin... (tapez 'Wave' pour l'IA)"
              className="flex-1 p-2.5 pl-4 bg-gray-950 border border-gray-900 text-white rounded-xl text-xs focus:outline-none focus:border-fiko-red"
            />
            <button
              onClick={handleSend}
              className="bg-[#E10600] text-white p-2.5 rounded-xl font-bold hover:bg-red-700 transition"
            >
              <Send size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT INFORMATION SIDE PANEL */}
      <div className="lg:col-span-1 space-y-4">
        {/* FIKO BRAIN INFERENCES */}
        <div className="bg-[#0a0a0a] border border-gray-850 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-950">
            <Bot className="text-purple-400 shrink-0" size={16} />
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Compte Rendu Fiko Brain</h4>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-gray-400">
            <p>
              Fiko utilise les connaissances apprises du fichier <strong className="text-white">Scénarios de vente IA v2.pdf</strong> pour converser avec <strong className="text-white">{activeThread.name}</strong>.
            </p>

            <div className="bg-black/60 p-2.5 rounded-xl border border-gray-950 space-y-1">
              <span className="text-[8px] font-black text-gray-500 uppercase block tracking-widest">Règle d'affaires apprise :</span>
              <p className="text-[10px] italic text-gray-300">
                "Si un client exprime une intention d'achat ('Je veux acheter', 'Combien', 'Prix') de produits de beauté, rediriger automatiquement vers la page de checkout Wave ou Orange Money."
              </p>
            </div>

            <div className="flex justify-between text-[10px]">
              <span>Fiabilité de la réponse:</span>
              <span className="text-[#25D366] font-bold">98% (Excellent)</span>
            </div>
          </div>
        </div>

        {/* METADATA COOPERATIVES */}
        <div className="bg-[#0a0a0a] border border-gray-850 rounded-2xl p-4 space-y-3 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-950">
            <ShieldCheck className="text-emerald-500 shrink-0" size={16} />
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Sécurité Koffmann</h4>
          </div>

          <div className="space-y-1.5 text-gray-400">
            <div className="flex justify-between">
              <span>Niveau de cryptage:</span>
              <span className="font-mono text-white text-[10px]">AES-256</span>
            </div>
            <div className="flex justify-between">
              <span>Token WhatsApp API:</span>
              <span className="text-green-500 font-extrabold">Actif (Vérifié)</span>
            </div>
            <div className="flex justify-between">
              <span>Domaine webhook secure:</span>
              <span className="font-mono text-white text-[10px]">api.fiko.ci</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
