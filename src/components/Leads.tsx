import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Search, 
  KanbanSquare, 
  ListFilter, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  Wand2, 
  AlertCircle
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  score: number;
  status: 'Nouveau' | 'Qualifié' | 'Proposition' | 'Négociation' | 'Payé';
  lastActivity: string;
  dealValue: number;
  provider: string;
  notes: string;
  lastMessage: string;
}

export default function LeadsModule({ onboardingData }: { onboardingData: any }) {
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [coachStatus, setCoachStatus] = useState<'idle' | 'running' | 'success'>('idle');

  const companyId = onboardingData?.companyId || 'fiko_prod_68469';

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
          phone: data.phone,
          score: data.score || 50,
          status: data.status || 'Nouveau',
          lastActivity: data.updatedAt?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '...',
          dealValue: data.dealValue || 0,
          provider: data.provider || 'Wave',
          notes: data.notes || '',
          lastMessage: data.lastMessage || 'Aucun message'
        };
      }) as Lead[];
      setLeads(leadsList);
    });
    return unsubscribe;
  }, [companyId]);

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  );

  const lanes = [
    { key: 'Nouveau', label: 'Nouveau prospect', countBg: 'bg-blue-950 text-blue-400 border-blue-900', borderTop: 'border-t-blue-500' },
    { key: 'Qualifié', label: 'Prospect Qualifié', countBg: 'bg-emerald-950 text-emerald-400 border-emerald-900', borderTop: 'border-t-emerald-500' },
    { key: 'Proposition', label: 'Offre envoyée', countBg: 'bg-amber-950 text-amber-400 border-amber-900', borderTop: 'border-t-amber-500' },
    { key: 'Négociation', label: 'En Négociation', countBg: 'bg-purple-950 text-purple-400 border-purple-900', borderTop: 'border-t-purple-500' },
    { key: 'Payé', label: 'Payé / Gagné 🎉', countBg: 'bg-green-950 text-green-400 border-green-900', borderTop: 'border-t-[#25D366]' }
  ] as const;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* FIKO SALES COACH CARD (Restored for ROI) */}
      <div className="bg-[#0b0c14] border border-blue-900/40 p-6 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(30,58,138,0.2)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-blue-950 border border-blue-900 text-blue-400 font-black text-xs uppercase px-2.5 py-1 rounded-md animate-pulse">
                💡 FIKO SALES COACH
              </span>
            </div>
            <h2 className="text-xl font-black text-white">Analyse des opportunités</h2>
            <p className="text-sm text-gray-400 max-w-xl">
              Votre IA estime qu'une relance automatique personnalisée peut libérer immédiatement <strong className="text-emerald-400">89 800 FCFA</strong> de ventes.
            </p>
          </div>
          <button className="bg-[#E10600] text-white px-6 py-3.5 rounded-xl font-black text-xs hover:scale-105 transition flex items-center gap-2">
            <Wand2 size={14} /> Déclencher les relances IA 🚀
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Fiko Sales OS</h1>
          <p className="text-gray-400 text-sm">Gestion multi-entreprise active</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Chercher un prospect..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-850 rounded-xl p-2.5 pl-9 text-xs text-white focus:outline-none"
            />
          </div>
          <div className="bg-black border border-gray-850 rounded-xl p-1 flex gap-1">
            <button onClick={() => setViewMode('pipeline')} className={`p-2 rounded-lg ${viewMode === 'pipeline' ? 'bg-[#E10600]' : ''}`}><KanbanSquare size={16}/></button>
            <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-[#E10600]' : ''}`}><ListFilter size={16}/></button>
          </div>
        </div>
      </div>

      {viewMode === 'pipeline' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {lanes.map((lane) => {
            const laneLeads = filteredLeads.filter(l => l.status === lane.key);
            return (
              <div key={lane.key} className={`bg-[#070707] rounded-2xl border border-gray-900 p-4 min-h-[500px] border-t-2 ${lane.borderTop}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-xs text-gray-300 uppercase">{lane.label}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${lane.countBg}`}>{laneLeads.length}</span>
                </div>
                {laneLeads.map(lead => (
                  <div key={lead.id} onClick={() => setSelectedLead(lead)} className="bg-[#0d0d0d] border border-gray-850 p-3 rounded-xl mb-3 cursor-pointer hover:border-fiko-red transition">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-extrabold text-xs text-white">{lead.name}</p>
                      <span className="text-[9px] bg-gray-900 px-1 rounded text-gray-400">{lead.score}%</span>
                    </div>
                    <p className="text-[10px] text-gray-400 line-clamp-2 italic">"{lead.lastMessage}"</p>
                    <div className="mt-3 pt-2 border-t border-gray-900 flex justify-between items-center">
                       <span className="text-[10px] text-emerald-400 font-black">{lead.dealValue.toLocaleString()} F</span>
                       <span className="text-[9px] text-gray-600 uppercase font-bold">{lead.provider}</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#0a0a0a] rounded-2xl border border-gray-850 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#111] text-gray-450 text-[10px] font-black uppercase">
              <tr>
                <th className="p-4">Prospect</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Montant</th>
                <th className="p-4">Dernière activité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-[#111] transition-all cursor-pointer">
                  <td className="p-4 text-xs font-bold">{lead.name}</td>
                  <td className="p-4 text-[10px]"><span className="bg-zinc-900 px-2 py-1 rounded">{lead.status}</span></td>
                  <td className="p-4 text-xs font-black text-emerald-400">{lead.dealValue.toLocaleString()} FCFA</td>
                  <td className="p-4 text-[10px] text-gray-500">{lead.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
