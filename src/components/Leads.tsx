import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Phone, 
  MessageSquare, 
  KanbanSquare, 
  ListFilter, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Coins, 
  ChevronRight, 
  Wand2, 
  AlertCircle, 
  ArrowRight,
  UserCheck,
  Send,
  Play
} from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  phone: string;
  score: number;
  status: 'Nouveau' | 'Qualifié' | 'Proposition' | 'Négociation' | 'Payé';
  lastActivity: string;
  dealValue: number;
  provider: string; // Wave, Orange, MTN
  notes: string;
  lastMessage: string;
}

export default function LeadsModule() {
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Dynamic Leads State
  const [leads, setLeads] = useState<Lead[]>([
    { id: 1, name: 'Marie Koné', phone: '+225 07 48 93 11 20', score: 95, status: 'Négociation', lastActivity: 'Il y a 5 min', dealValue: 45000, provider: 'Wave', notes: 'Intéressée par le pack Luxe. Prête à payer via Wave dès réception du devis.', lastMessage: 'Je veux acheter le pack, vous prenez Wave ?' },
    { id: 2, name: 'Koffi Yao', phone: '+225 05 92 84 77 15', score: 91, status: 'Qualifié', lastActivity: 'Il y a 12 min', dealValue: 24900, provider: 'Orange Money', notes: 'Demande des détails sur la livraison à Cocody.', lastMessage: 'Est-ce que la livraison est gratuite aujourd’hui ?' },
    { id: 3, name: 'Awa Diallo', phone: '+225 01 02 03 04 05', score: 88, status: 'Nouveau', lastActivity: 'Il y a 25 min', dealValue: 19900, provider: 'MTN Money', notes: 'A cliqué sur la pub WhatsApp, attend la réponse de l’IA.', lastMessage: 'Bonjour, je souhaite connaître vos tarifs.' },
    { id: 4, name: 'Zadi Simplice', phone: '+225 05 60 70 80 90', score: 65, status: 'Payé', lastActivity: 'Hier', dealValue: 49900, provider: 'Wave', notes: 'Achat validé automatiquement de bout en bout par l’IA.', lastMessage: 'Merci ! J’ai bien reçu le reçu Wave.' },
    { id: 5, name: 'Christian Gnamien', phone: '+225 07 11 22 33 44', score: 82, status: 'Proposition', lastActivity: 'Il y a 2 jours', dealValue: 99000, provider: 'Orange Money', notes: 'Devis envoyé par l’IA. En attente de feedback du client.', lastMessage: 'J’examine le montant avec mon associé.' },
    { id: 6, name: 'Aicha Touré', phone: '+225 01 44 55 66 77', score: 45, status: 'Nouveau', lastActivity: 'Hier', dealValue: 19900, provider: 'Wave', notes: 'A abandonné le panier après avoir demandé les conditions.', lastMessage: 'Ok merci, je vais réfléchir.' },
  ]);

  // Sales Coach interactive state
  const [coachStatus, setCoachStatus] = useState<'idle' | 'running' | 'success'>('idle');
  const [successLeadName, setSuccessLeadName] = useState('');

  // Search filter
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm) ||
    lead.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouping for Pipeline Lanes
  const lanes = [
    { key: 'Nouveau', label: 'Nouveau prospect', countBg: 'bg-blue-950 text-blue-400 border-blue-900', borderTop: 'border-t-blue-500' },
    { key: 'Qualifié', label: 'Prospect Qualifié', countBg: 'bg-emerald-950 text-emerald-400 border-emerald-900', borderTop: 'border-t-emerald-500' },
    { key: 'Proposition', label: 'Offre envoyée', countBg: 'bg-amber-950 text-amber-400 border-amber-900', borderTop: 'border-t-amber-500' },
    { key: 'Négociation', label: 'En Négociation', countBg: 'bg-purple-950 text-purple-400 border-purple-900', borderTop: 'border-t-purple-500' },
    { key: 'Payé', label: 'Payé / Gagné 🎉', countBg: 'bg-green-950 text-green-400 border-green-900', borderTop: 'border-t-[#25D366]' }
  ] as const;

  // Run J+2 Auto Relance from Fiko AI Sales Coach
  const triggerCoachRelance = () => {
    setCoachStatus('running');
    setTimeout(() => {
      // Find Marie Koné (or another high score) and convert them to Paid
      setLeads(prevLeads => prevLeads.map(lead => {
        if (lead.id === 1) { // Marie Koné
          return {
            ...lead,
            status: 'Payé',
            lastActivity: 'À l’instant',
            notes: 'Convertie automatiquement via Relance J+2 Fiko FOS ! Paiement Wave de 45 000 FCFA validé.'
          };
        }
        return lead;
      }));
      setSuccessLeadName('Marie Koné');
      setCoachStatus('success');
    }, 2000);
  };

  // Convert currently selected lead manually to Paid
  const markAsPaid = (leadId: number) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, status: 'Payé', lastActivity: 'À l’instant', notes: 'Paiement Wave/Orange validé en un clic !' };
      }
      return l;
    }));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: 'Payé', lastActivity: 'À l’instant' } : null);
    }
  };

  // Move lead stage
  const advanceLeadStage = (leadId: number) => {
    const stages: Lead['status'][] = ['Nouveau', 'Qualifié', 'Proposition', 'Négociation', 'Payé'];
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const currentIndex = stages.indexOf(l.status);
        const nextStage = stages[Math.min(currentIndex + 1, stages.length - 1)];
        const updated = { ...l, status: nextStage, lastActivity: 'À l’instant' };
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(updated);
        }
        return updated;
      }
      return l;
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* 4. FIKO SALES COACH ADVISOR CARD */}
      <div className="bg-[#0b0c14] border border-blue-900/40 p-6 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(30,58,138,0.2)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-blue-950 border border-blue-900 text-blue-400 font-black text-xs uppercase px-2.5 py-1 rounded-md animate-pulse">
                💡 FIKO SALES COACH
              </span>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Optimisation des ventes</span>
            </div>
            <h2 className="text-xl font-black text-white">3 Leads chauds inactifs détectés (Marie, Koffi, Awa)</h2>
            <p className="text-sm text-gray-400 max-w-xl">
              Votre IA estime qu'une relance automatique personnalisée basée sur l'intérêt détecté peut libérer immédiatement <strong className="text-emerald-400">89 800 FCFA</strong> de ventes.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {coachStatus === 'idle' && (
              <button 
                onClick={triggerCoachRelance}
                className="w-full md:w-auto bg-[#E10600] text-white px-6 py-3.5 rounded-xl font-black text-xs hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 shadow-lg shadow-red-900/30"
              >
                <Wand2 size={14} /> Déclencher les relances IA 🚀
              </button>
            )}

            {coachStatus === 'running' && (
              <button 
                disabled
                className="w-full md:w-auto bg-gray-900 border border-gray-800 text-gray-400 px-6 py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-wait"
              >
                <Clock size={14} className="animate-spin text-[#25D366]" /> Envoi des relances par WhatsApp...
              </button>
            )}

            {coachStatus === 'success' && (
              <div className="bg-green-950/40 border border-green-900/80 px-5 py-3 rounded-xl flex items-center gap-2 text-green-300 font-extrabold text-xs">
                <CheckCircle className="text-[#25D366]" size={16} />
                <span>Succès ! {successLeadName} a de suite payé 45 000 FCFA par Wave ! 🎉</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Fiko Sales OS & Pipeline CRM</h1>
          <p className="text-gray-400 text-sm">Organisez vos conversations, qualifiez vos leads et encaissez de manière autonome</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* SEARCHBAR */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-3 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Chercher Marie, Wave, Cocody..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-850 rounded-xl p-2.5 pl-9 text-xs text-white focus:outline-none focus:border-fiko-red" 
            />
          </div>

          {/* VIEW SWITCHER */}
          <div className="bg-black border border-gray-850 rounded-xl p-1 flex gap-1">
            <button 
              onClick={() => setViewMode('pipeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition ${viewMode === 'pipeline' ? 'bg-[#E10600] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <KanbanSquare size={14} /> Pipeline
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition ${viewMode === 'table' ? 'bg-[#E10600] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <ListFilter size={14} /> Tableau des Leads
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'pipeline' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {lanes.map((lane) => {
            const laneLeads = filteredLeads.filter(l => l.status === lane.key);
            const totalValue = laneLeads.reduce((sum, lead) => sum + lead.dealValue, 0);

            return (
              <div 
                key={lane.key} 
                className={`bg-[#070707] rounded-2xl border border-gray-900 p-4 flex flex-col min-h-[500px] border-t-2 ${lane.borderTop}`}
              >
                {/* Lane Header */}
                <div className="flex justify-between items-center mb-3">
                  <span className="font-black text-xs text-gray-300 uppercase tracking-wider">{lane.label}</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${lane.countBg}`}>
                    {laneLeads.length}
                  </span>
                </div>

                {/* Total Value in Lane */}
                <div className="bg-black/60 px-2.5 py-1 rounded-lg border border-gray-900/50 mb-4 flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>Revenus potentiels:</span>
                  <span className="font-bold text-white">{totalValue.toLocaleString()} FCFA</span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1">
                  {laneLeads.length === 0 ? (
                    <div className="h-24 rounded-xl border border-dashed border-gray-900 flex items-center justify-center text-center text-[10px] text-gray-650">
                      Aucun lead
                    </div>
                  ) : (
                    laneLeads.map((lead) => (
                      <div 
                        key={lead.id} 
                        onClick={() => setSelectedLead(lead)}
                        className={`bg-[#0d0d0d] border border-gray-850 hover:border-gray-700 rounded-xl p-3 cursor-pointer transition active:scale-98 shadow-sm hover:shadow-[0_4px_15px_rgba(0,0,0,0.4)] flex flex-col group justify-between`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <span className="font-extrabold text-xs text-white group-hover:text-fiko-red transition-colors truncate">{lead.name}</span>
                            <span className={`text-[9px] font-mono shrink-0 font-bold px-1.5 py-0.2 rounded ${
                              lead.score >= 80 ? 'bg-red-950 text-red-400 border border-red-900/50' : 'bg-gray-900 text-gray-400'
                            }`}>
                              Score {lead.score}%
                            </span>
                          </div>

                          <p className="text-[10px] text-gray-400 leading-tight line-clamp-2 mb-3 font-medium">"{lead.lastMessage}"</p>
                        </div>

                        <div className="pt-2 border-t border-gray-950 flex justify-between items-center">
                          <span className="text-[10px] bg-black border border-gray-900 px-1.5 py-0.5 rounded text-gray-400 font-mono font-bold">
                            {lead.provider}
                          </span>
                          <span className="text-[11px] font-black text-emerald-400 font-mono">
                            {lead.dealValue.toLocaleString()} F
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-[#0a0a0a] rounded-2xl border border-gray-850 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#111] text-gray-450 text-xs font-black uppercase">
              <tr>
                <th className="p-4">Prospect</th>
                <th className="p-4 text-center">Score d'Intérêt</th>
                <th className="p-4">Fiko Etape</th>
                <th className="p-4">Montant Estimé</th>
                <th className="p-4">Canal Canard</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-sm">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-[#111] transition-all cursor-pointer" onClick={() => setSelectedLead(lead)}>
                  <td className="p-4 flex items-center gap-3">
                    <div className="bg-gray-900 border border-gray-800 rounded-full w-10 h-10 flex items-center justify-center font-black text-sm text-fiko-red">{lead.name[0]}</div>
                    <div>
                      <p className="font-extrabold text-white text-xs">{lead.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{lead.phone}</p>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded font-mono text-xs font-bold ${
                      lead.score >= 80 ? 'bg-red-950 text-fiko-red border border-red-900/60' : 'bg-gray-900 text-gray-400'
                    }`}>
                      {lead.score} %
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs bg-gray-900 border border-gray-800 text-gray-300 px-2 py-1 rounded-md font-semibold">
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 font-black text-[#25D366] font-mono text-xs">{lead.dealValue.toLocaleString()} FCFA</td>
                  <td className="p-4 font-mono text-xs text-blue-400">{lead.provider}</td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => advanceLeadStage(lead.id)}
                        className="p-2 bg-gray-900 hover:bg-fiko-red hover:text-white rounded-lg transition text-xs font-bold"
                        title="Avancer d'étape"
                      >
                        <ChevronRight size={14}/>
                      </button>
                      <button 
                        onClick={() => markAsPaid(lead.id)}
                        disabled={lead.status === 'Payé'}
                        className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-green-900 hover:bg-emerald-900 hover:text-white rounded-lg transition text-[10px] font-black disabled:opacity-30"
                      >
                        Paiement ✓
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LEAD DETAIL POPOVER MODAL (SIDEBAR DRAWER SIMULATION) */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/80 flex justify-end z-50 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#0a0a0a] border-l border-gray-850 h-full p-6 flex flex-col justify-between shadow-2xl relative overflow-y-auto">
            
            {/* Top Close */}
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-900 mb-6">
                <div>
                  <span className="text-[10px] tracking-widest font-black uppercase text-fiko-red bg-red-955 border border-red-900/30 px-2.5 py-0.5 rounded">
                    Fiko CRM Native Record
                  </span>
                  <h3 className="text-xl font-black text-white mt-1.5">{selectedLead.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="bg-gray-900 hover:bg-gray-850 border border-gray-850 text-gray-400 p-2 rounded-xl transition"
                >
                  Fermer ×
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/40 p-3 rounded-xl border border-gray-950">
                  <span className="text-[10px] text-gray-500 font-bold block uppercase mb-1">Montant Estimé</span>
                  <p className="text-xl font-black text-white font-mono">{selectedLead.dealValue.toLocaleString()} FCFA</p>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-gray-950">
                  <span className="text-[10px] text-gray-500 font-bold block uppercase mb-1">Passerelle de Paiement</span>
                  <p className="text-xs font-bold text-[#25D366] flex items-center gap-1">
                    🟢 {selectedLead.provider} actif
                  </p>
                </div>
              </div>

              {/* Conversation Log & notes */}
              <div className="space-y-4 mb-6 text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 tracking-wider font-extrabold uppercase block mb-1.5">Dernier Message Prospect (WhatsApp) :</span>
                  <div className="bg-black p-3 rounded-xl border border-gray-900 italic text-gray-300 leading-relaxed font-sans">
                    "{selectedLead.lastMessage}"
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 tracking-wider font-extrabold uppercase block mb-1.5">Historique Fiko CRM Notes :</span>
                  <p className="text-gray-400 bg-black p-3 border border-gray-950 rounded-xl leading-relaxed">
                    {selectedLead.notes}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 tracking-wider font-extrabold uppercase block mb-1.5">Informations du Lead :</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400">
                    <div>Téléphone: <span className="font-mono text-white font-bold">{selectedLead.phone}</span></div>
                    <div>Statut Plan: <span className="text-green-400 font-black">ESSAI GRATUIT</span></div>
                    <div>Score Global IA: <span className="text-fiko-red font-bold font-mono">{selectedLead.score}%</span></div>
                    <div>Dernière Interaction: <span className="text-white font-bold">{selectedLead.lastActivity}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="border-t border-gray-950 pt-6 mt-6 space-y-3">
              <span className="text-[9px] uppercase font-bold text-gray-500 block">Actions Commerciales FOS :</span>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => advanceLeadStage(selectedLead.id)}
                  disabled={selectedLead.status === 'Payé'}
                  className="bg-gray-900 border border-gray-850 hover:bg-gray-800 text-white font-black text-xs py-3.5 rounded-xl transition flex justify-center items-center gap-1.5 disabled:opacity-35"
                >
                  Etape Suivante ➡️
                </button>

                <button 
                  onClick={() => markAsPaid(selectedLead.id)}
                  disabled={selectedLead.status === 'Payé'}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3.5 rounded-xl transition flex justify-center items-center gap-1.5 disabled:opacity-35"
                >
                  Confirmer le paiement 💰
                </button>
              </div>

              {/* Automatic AI follow-up draft */}
              {selectedLead.status !== 'Payé' && (
                <div className="bg-[#1f1e1a] border border-amber-900/60 p-4 rounded-xl text-xs space-y-2 text-gray-300">
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold uppercase text-[10px]">
                    <AlertCircle size={14} /> Relance Auto J+1 Fiko Ready
                  </div>
                  <p className="leading-tight">
                    "Bonjour {selectedLead.name}, je vois que vous préfériez payer par {selectedLead.provider}. Souhaitez-vous recevoir votre lien de paiement Wave/Orange direct ?"
                  </p>
                  <button 
                    onClick={() => {
                      alert(`WhatsApp envoyé à ${selectedLead.name} !`);
                      advanceLeadStage(selectedLead.id);
                    }}
                    className="w-full bg-[#E10600] text-white py-1.5 rounded font-black hover:bg-red-700 transition uppercase text-[10px]"
                  >
                    Envoyer cette relance maintenant ⚡
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
