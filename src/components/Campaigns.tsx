import { useState, useRef, useEffect } from 'react';
import { Megaphone, Users, Plus, Upload, CheckCircle2, TrendingUp, Search, Calendar, FileText, Image as ImageIcon, Send, Sparkles, Loader2, Play, DollarSign, Target, Check, X, AlertCircle, Activity, CheckCheck, Wand2, BarChart, MessageCircle } from 'lucide-react';
import Papa from 'papaparse';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query } from 'firebase/firestore';

// Types
interface Contact {
  name: string;
  phone: string;
  email?: string;
  tags?: string;
  company?: string;
}

export default function CampaignsModule() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create' | 'contacts'>('dashboard');
  
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Megaphone className="text-fiko-red" size={32} />
            Campagnes
          </h1>
          <p className="text-gray-400">Gérez vos envois WhatsApp marketing</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold transition ${activeTab === 'contacts' ? 'bg-[#222] border-gray-600' : 'bg-[#111] border-gray-800 hover:border-gray-600'}`}
          >
            <Users size={18} /> Contacts
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-2 bg-fiko-red text-white px-4 py-2 rounded-xl font-bold hover:bg-red-700 transition"
          >
            <Plus size={18} /> Nouvelle Campagne
          </button>
          {activeTab !== 'dashboard' && (
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-gray-800 transition"
              >
                Retour Dashboard
              </button>
          )}
        </div>
      </div>

      {activeTab === 'dashboard' && <BroadcastDashboard />}
      {activeTab === 'create' && <CampaignBuilder onComplete={() => setActiveTab('dashboard')} />}
      {activeTab === 'contacts' && <ContactManager />}
    </div>
  );
}

function BroadcastDashboard() {
  // Mock analytics
  const kpis = [
    { label: 'Revenus Générés', value: '124,500 €', icon: DollarSign, color: 'text-emerald-500' },
    { label: 'ROI Moyen', value: '342%', icon: TrendingUp, color: 'text-blue-500' },
    { label: 'Taux Conversion', value: '14.8%', icon: Target, color: 'text-fiko-red' },
    { label: 'Taux Ouverture', value: '87.4%', icon: Activity, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 bg-[#111] rounded-lg ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              <h3 className="text-gray-400 font-semibold">{kpi.label}</h3>
            </div>
            <p className="text-3xl font-bold">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0a0a0a] rounded-2xl border border-gray-800 overflow-hidden">
         <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold">Campagnes Récentes</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-gray-500" size={16} />
              <input type="text" placeholder="Rechercher..." className="bg-[#111] border border-gray-800 rounded-xl p-3 pl-10 text-sm text-white w-64" />
            </div>
         </div>
         <table className="w-full text-left">
          <thead className="bg-[#111] text-gray-400 text-sm">
            <tr>
              <th className="p-4">Nom</th>
              <th className="p-4">Statut</th>
              <th className="p-4">Audience</th>
              <th className="p-4">Envoyés</th>
              <th className="p-4">Ouverts</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-800'>
            {[
              { name: 'Promo Fin Année', status: 'COMPLETED', audience: '2,400', sent: '2,400', opened: '2,100 (87%)' },
              { name: 'Lancement V2', status: 'SENDING', audience: '15,000', sent: '8,400', opened: '4,200 (50%)' },
              { name: 'Relance Paniers Abandonnés', status: 'SCHEDULED', audience: '320', sent: '0', opened: '-' },
            ].map((camp, i) => (
              <tr key={i} className='hover:bg-[#111] transition'>
                <td className="p-4 font-bold">{camp.name}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    camp.status === 'COMPLETED' ? 'bg-green-950 text-green-400' 
                    : camp.status === 'SENDING' ? 'bg-blue-950 text-blue-400' 
                    : 'bg-yellow-950 text-yellow-400'
                  }`}>
                    {camp.status}
                  </span>
                </td>
                <td className="p-4">{camp.audience}</td>
                <td className="p-4">{camp.sent}</td>
                <td className="p-4 text-green-400 font-semibold">{camp.opened}</td>
                <td className="p-4">
                  <button className="text-gray-400 hover:text-white font-semibold">Rapport</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContactManager() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    
    // Example data
    const existingContacts = [
        { name: 'Jean Dupont', phone: '+33612345678', tags: 'VIP, HOT', company: 'Acme Corp' },
        { name: 'Alice Martin', phone: '+33687654321', tags: 'Prospect', company: 'Startup Inc' },
    ];

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: import('react').ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsParsing(true);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsed = results.data.map((row: any) => ({
                    name: row.name || row.Nom || 'Inconnu',
                    phone: row.phone || row.Telephone || row['Téléphone'] || '',
                    email: row.email || row.Email || '',
                    tags: row.tags || row.Tags || '',
                    company: row.company || row.Entreprise || ''
                })).filter(c => c.phone); // Require phone

                setContacts(parsed);
                setIsParsing(false);
            },
            error: (error) => {
                console.error("CSV Parse Error", error);
                setIsParsing(false);
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center">
                <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                />
                <div className="bg-gray-900 p-4 rounded-full mb-4">
                    <Upload size={32} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-bold mb-2">Importer vos contacts (.csv)</h2>
                <p className="text-gray-400 mb-6 max-w-md">
                    Le fichier CSV doit contenir une colonne "phone" (ou Téléphone). Les colonnes "name", "email", "tags", et "company" sont optionnelles.
                </p>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isParsing}
                    className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition flex items-center gap-2"
                >
                    {isParsing ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                    {isParsing ? 'Analyse...' : 'Choisir un fichier CSV'}
                </button>
                {contacts.length > 0 && (
                    <p className="mt-4 text-green-400 font-semibold">{contacts.length} contacts prêts à être importés !</p>
                )}
            </div>

            <div className="bg-[#0a0a0a] rounded-2xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Base de contacts</h2>
                     <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition">
                        Gérer les Segments
                    </button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-[#111] text-gray-400 text-sm">
                        <tr>
                            <th className="p-4">Nom</th>
                            <th className="p-4">Téléphone</th>
                            <th className="p-4">Entreprise</th>
                            <th className="p-4">Tags</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-800'>
                        {/* Show newly imported if any, else existing */}
                        {(contacts.length > 0 ? contacts.slice(0, 10) : existingContacts).map((contact, i) => (
                            <tr key={i} className='hover:bg-[#111] transition'>
                                <td className="p-4 font-semibold">{contact.name}</td>
                                <td className="p-4 font-mono text-gray-300">{contact.phone}</td>
                                <td className="p-4 text-gray-400">{contact.company || '-'}</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        {contact.tags?.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, j) => (
                                            <span key={j} className="bg-gray-800 text-xs px-2 py-1 rounded-md">{tag}</span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {contacts.length > 10 && (
                     <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-800">
                         ... et {contacts.length - 10} autres contacts.
                     </div>
                )}
            </div>
        </div>
    )
}

function CampaignBuilder({ onComplete }: { onComplete: () => void }) {
    const [name, setName] = useState('');
    const [audience, setAudience] = useState('all');
    const [message, setMessage] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiObjective, setAiObjective] = useState('');
    const [aiTone, setAiTone] = useState('professionnel');

    const [isSaving, setIsSaving] = useState(false);
    
    // AI Score & Sim State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [scoreData, setScoreData] = useState<any>(null);
    const [previewState, setPreviewState] = useState<'typing'|'sent'|'delivered'|'read'>('read');
    const [isOptimizing, setIsOptimizing] = useState(false);

    // Simulate WhatsApp Typing
    useEffect(() => {
        if (!message) return;
        setPreviewState('typing');
        const t1 = setTimeout(() => setPreviewState('sent'), 1000);
        const t2 = setTimeout(() => setPreviewState('delivered'), 1500);
        const t3 = setTimeout(() => setPreviewState('read'), 2200);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [message]);

    const analyzeCampaign = async () => {
        if (!message) return;
        setIsAnalyzing(true);
        try {
            const res = await fetch('/api/campaigns/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await res.json();
            setScoreData({
                ...data,
                // Ensure default values if AI doesn't return them
                predictedOpenRate: data.predictedOpenRate || 75,
                predictedReplyRate: data.predictedReplyRate || 15
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const optimizeWithAI = async () => {
        if (!message || !scoreData) return;
        setIsOptimizing(true);
        try {
            const res = await fetch('/api/campaigns/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, suggestions: scoreData.suggestions })
            });
            const data = await res.json();
            if (data.optimizedMessage) {
                setMessage(data.optimizedMessage);
                // Re-analyze after optimize
                setTimeout(analyzeCampaign, 500);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsOptimizing(false);
        }
    };

    const generateWithAI = async () => {
        if (!aiObjective) return;
        setIsGenerating(true);
        try {
            const res = await fetch('/api/campaigns/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ objective: aiObjective, audience, tone: aiTone })
            });
            const data = await res.json();
            if (data && data.length > 0) {
                // Find short or first version
                const shortVer = data.find((d: any) => d.version === 'short') || data[0];
                setMessage(shortVer.content);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSend = async () => {
        if (!name || !message) return;
        setIsSaving(true);
        try {
            // Save to DB
            const docRef = await addDoc(collection(db, 'campaigns'), {
                name,
                audience,
                message,
                mediaUrl,
                status: 'SENDING',
                createdAt: serverTimestamp()
            });

            // Call Backend Mock Trigger
            await fetch('/api/campaigns/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ campaignId: docRef.id, contactCount: 2400 }) // Mock total count
            });

            onComplete();
        } catch (error) {
            console.error("Error creating campaign:", error);
            // Ideally handle error via a toast not just console
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
                <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800">
                    <h2 className="text-xl font-bold mb-6">Détails de la campagne</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Nom de la campagne</label>
                            <input 
                                type="text" 
                                value={name} onChange={e => setName(e.target.value)}
                                placeholder="Ex: Relance Hiver 2024" 
                                className="w-full bg-[#111] border border-gray-800 rounded-xl p-3 text-white focus:border-fiko-red outline-none transition" 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Audience cible</label>
                            <select 
                                value={audience} onChange={e => setAudience(e.target.value)}
                                className="w-full bg-[#111] border border-gray-800 rounded-xl p-3 text-white focus:border-fiko-red outline-none transition"
                            >
                                <option value="all">Tous les contacts (2,400)</option>
                                <option value="hot_leads">Leads Chauds (Score &gt; 80) (340)</option>
                                <option value="vip">Clients VIP (120)</option>
                                <option value="custom">Importer CSV Spécifique...</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-purple-500" size={20}/> Assistant IA Marketing</h2>
                    </div>
                    <div className="flex gap-3 mb-4">
                        <input 
                            type="text" 
                            value={aiObjective}
                            onChange={(e) => setAiObjective(e.target.value)}
                            placeholder="De quoi parle la campagne ? (ex: promo 50% sur les chaussures)" 
                            className="flex-1 bg-[#111] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none transition"
                        />
                        <select 
                            value={aiTone}
                            onChange={(e) => setAiTone(e.target.value)}
                            className="bg-[#111] border border-gray-800 rounded-xl p-3 text-sm text-gray-300 w-40"
                        >
                            <option value="professionnel">Pro / Formel</option>
                            <option value="agressif">Promo URGENT</option>
                            <option value="drole">Humouristique</option>
                            <option value="storytelling">Storytelling</option>
                        </select>
                        <button 
                            onClick={generateWithAI}
                            disabled={isGenerating || !aiObjective}
                            className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : 'Générer'}
                        </button>
                    </div>

                    <label className="block text-sm font-semibold text-gray-400 mb-2 mt-6">Message WhatsApp</label>
                    <textarea 
                        value={message} onChange={e => setMessage(e.target.value)}
                        placeholder="Bonjour {{name}}, découvrez notre offre..."
                        className="w-full bg-[#111] border border-gray-800 rounded-xl p-4 text-white focus:border-fiko-red outline-none transition min-h-[200px]" 
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <div className="flex gap-4">
                            <span>Variables : <code className="bg-gray-800 px-1 rounded">{"{{name}}"}</code> <code className="bg-gray-800 px-1 rounded">{"{{company}}"}</code></span>
                            <span>Emojis autorisés 🎉</span>
                        </div>
                        <span>{message.length} caractères</span>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-800">
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Média (Optionnel)</label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="url" 
                                value={mediaUrl} onChange={e => setMediaUrl(e.target.value)}
                                placeholder="URL d'une image ou PDF" 
                                className="flex-1 bg-[#111] border border-gray-800 rounded-xl p-3 text-white focus:border-fiko-red outline-none" 
                            />
                            <div className="bg-gray-900 p-3 rounded-xl cursor-pointer hover:bg-gray-800 transition">
                                <ImageIcon size={20} className="text-gray-400"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button 
                        onClick={analyzeCampaign}
                        disabled={isAnalyzing || !message}
                        className="px-6 py-3 rounded-xl font-bold border border-purple-600/50 text-purple-400 hover:bg-purple-900/20 transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Activity size={18} />} 
                        Smart Score
                    </button>
                    <button className="px-6 py-3 rounded-xl font-bold border border-gray-700 hover:bg-gray-900 transition flex items-center gap-2">
                        <Calendar size={18} /> Programmer
                    </button>
                    <button 
                        onClick={handleSend}
                        disabled={isSaving || !name || !message}
                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-500 transition shadow-lg shadow-green-900/20 flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />} 
                        Lancer
                    </button>
                </div>
                
                {scoreData && (
                    <div className="bg-[#1a0f2e] border border-purple-500/30 p-6 rounded-2xl mt-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-6">
                                <div className="relative w-24 h-24 flex items-center justify-center bg-black/50 rounded-full border-4 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                    <span className="text-3xl font-bold text-white">{scoreData.score}</span>
                                    <span className="absolute -bottom-2 bg-purple-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Score</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Analyse Marketing IA</h3>
                                    <p className="text-sm text-purple-300">Notre IA a évalué la force de persuasion de votre message.</p>
                                </div>
                            </div>
                            <button 
                                onClick={optimizeWithAI}
                                disabled={isOptimizing}
                                className="bg-purple-600/20 text-purple-400 border border-purple-500/50 hover:bg-purple-600/40 hover:text-white px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50"
                            >
                                {isOptimizing ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                ✨ Optimize with AI
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Predictions */}
                            <div className="bg-black/40 p-4 rounded-xl border border-purple-500/20 flex flex-col gap-4 justify-center">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <Activity size={16} className="text-blue-400" />
                                        <span className="text-sm font-semibold">Taux d'ouverture estimé</span>
                                    </div>
                                    <span className="text-lg font-bold text-blue-400">{scoreData.predictedOpenRate}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <MessageCircle size={16} className="text-green-400" />
                                        <span className="text-sm font-semibold">Taux de réponse estimé</span>
                                    </div>
                                    <span className="text-lg font-bold text-green-400">{scoreData.predictedReplyRate}%</span>
                                </div>
                            </div>

                            {/* Detailed Scores */}
                            <div className="bg-black/40 p-4 rounded-xl border border-purple-500/20 space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Hook (Accroche)</span>
                                        <span className="text-purple-400 font-bold">{scoreData.hookScore}/25</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(scoreData.hookScore / 25) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Call to Action</span>
                                        <span className="text-purple-400 font-bold">{scoreData.ctaScore}/20</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(scoreData.ctaScore / 20) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Émotion & Urgence</span>
                                        <span className="text-purple-400 font-bold">{scoreData.emotionalScore}/20</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(scoreData.emotionalScore / 20) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {scoreData.suggestions && scoreData.suggestions.length > 0 && (
                            <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/20">
                                <h4 className="font-bold text-purple-400 mb-3 flex items-center gap-2"><Sparkles size={16}/> Suggestions pour améliorer la conversion</h4>
                                <ul className="space-y-2 text-sm text-purple-100/80">
                                    {scoreData.suggestions.map((s: string, i: number) => (
                                        <li key={i} className="flex gap-2 items-start"><Check size={14} className="text-purple-500 shrink-0 mt-0.5"/> {s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* PREVIEW SIDEBAR */}
            <div className="relative">
                <div className="sticky top-6">
                    <h2 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Aperçu WhatsApp</h2>
                    <div className="bg-[#ffe4cc] rounded-3xl w-[300px] h-[600px] border-[8px] border-[#1f2937] overflow-hidden flex flex-col shadow-2xl relative">
                        {/* iOS Header */}
                        <div className="bg-[#f0f0f0] px-4 pt-8 pb-3 flex items-center gap-3 shadow-sm z-10">
                            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">F</div>
                            <div className="flex-1">
                                <p className="font-bold text-black text-sm leading-tight">Votre Entreprise</p>
                                {previewState === 'typing' ? (
                                    <p className="text-xs text-green-600 font-medium">en train d'écrire...</p>
                                ) : (
                                    <p className="text-xs text-gray-500">Compte certifié</p>
                                )}
                            </div>
                        </div>
                        
                        {/* Chat Body */}
                        <div className="flex-1 p-4 bg-[#e5ddd5] overflow-y-auto space-y-3 relative" style={{ backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')", opacity: 0.9 }}>
                            <div className="flex justify-center mb-4">
                                <span className="bg-[#e1f3fb] text-black text-[10px] px-2 py-1 rounded-md shadow-sm">Aujourd'hui</span>
                            </div>
                            
                            {(message || mediaUrl) && previewState !== 'typing' && (
                                <div className="bg-white p-2 rounded-xl rounded-tl-sm shadow-sm max-w-[90%] relative animate-in fade-in slide-in-from-left-2 duration-300">
                                    {mediaUrl && (
                                        <div className="mb-2">
                                            <img src={mediaUrl.startsWith('http') ? mediaUrl : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500'} alt="Preview" className="rounded-lg max-h-40 object-cover w-full" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                        </div>
                                    )}
                                    <p className="text-black text-sm whitespace-pre-wrap break-words font-sans">
                                        {message.replace(/{{name}}/g, 'Jean').replace(/{{company}}/g, 'Acme') || "Votre message Marketing s'affichera ici..."}
                                    </p>
                                    <div className="float-right mt-1 ml-2 flex items-center gap-1">
                                        <span className="text-[10px] text-gray-400">12:00</span>
                                        {previewState === 'sent' && <Check size={12} className="text-gray-400" />}
                                        {previewState === 'delivered' && <CheckCheck size={12} className="text-gray-400" />}
                                        {previewState === 'read' && <CheckCheck size={12} className="text-blue-500" />}
                                    </div>
                                    <div className="clear-both"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
