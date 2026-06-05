import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Sparkles, 
  Globe2, 
  CheckCircle, 
  Layers, 
  HelpCircle,
  Percent,
  Timer
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const monthlyLeadsData = [
  { month: 'Jan', automated: 120, total: 180, rev: 890000 },
  { month: 'Feb', automated: 210, total: 310, rev: 1450000 },
  { month: 'Mar', automated: 340, total: 450, rev: 1980000 },
  { month: 'Apr', automated: 512, total: 642, rev: 2450000 }, // Matches current active 642
];

const funnelSteps = [
  { id: 1, name: '1. Landing Page → Inscription', rate: '84%', count: '2 840 prospects', desc: 'Taux de conversion d’acquisition initial' },
  { id: 2, name: '2. Inscription → WhatsApp connecté', rate: '71%', count: '2 016 connectés', desc: 'Configuration de l’assistant professionnel' },
  { id: 3, name: '3. WhatsApp connecté → Premier message IA', rate: '92%', count: '1 854 initiations', desc: 'L’intelligence Fiko prend le relais' },
  { id: 4, name: '4. Premier message IA → Session de closing', rate: '48%', count: '890 en cours', desc: 'Discussions autour du catalogue / produits' },
  { id: 5, name: '5. Session de closing → Paiement Mobile Money', rate: '14.8%', count: '87 payés', desc: 'Renseigné directement via Fiko Pay (Wave, Orange)' },
  { id: 6, name: '6. Paiement → Renouvellement d’abonnement', rate: '94%', count: '82 abonnés', desc: 'Rétention d’usage FOS exceptionnelle' }
];

export default function AnalyticsModule() {
  const [activeRange, setActiveRange] = useState<'7d' | '30d' | 'all'>('30d');

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
      
      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Time Saved Metric */}
        <div className="bg-[#0a0a0a] border border-gray-900 p-6 rounded-2xl relative">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Temps de Vente Épargné</span>
            <Timer className="text-fiko-red" size={16} />
          </div>
          <p className="text-3xl font-black text-white font-mono">162 Heures</p>
          <p className="text-[10px] text-gray-400 mt-3">
            Équivalent à <span className="text-[#25D366] font-bold">~20 jours de travail</span> de secrétaire gérés par Fiko
          </p>
        </div>

        {/* Total Conversions */}
        <div className="bg-[#0a0a0a] border border-gray-900 p-6 rounded-2xl relative">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Taux Conversion Global</span>
            <Percent className="text-fiko-red" size={16} />
          </div>
          <p className="text-3xl font-black text-white font-mono">14.8 %</p>
          <p className="text-[10px] text-[#25D366] font-semibold mt-3">
            Supérieur à la moyenne nationale (4.2%)
          </p>
        </div>

        {/* Business Speed */}
        <div className="bg-[#0a0a0a] border border-gray-900 p-6 rounded-2xl relative">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Vitesse de Réponse Moyenne</span>
            <Clock className="text-[#25D366]" size={16} />
          </div>
          <p className="text-3xl font-black text-white font-mono">2.4 Secondes</p>
          <p className="text-[10px] text-gray-400 mt-3">
            Temps de réponse instantané nuit et jour
          </p>
        </div>

        {/* Fiko ROI Index */}
        <div className="bg-[#060a0b] border border-emerald-950/60 p-6 rounded-2xl relative">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase block">Multiplicateur ROI Net</span>
            <TrendingUp className="text-[#25D366]" size={16} />
          </div>
          <p className="text-3xl font-black text-white font-mono">48 × Revenu</p>
          <p className="text-[10px] text-[#25D366] font-bold mt-3">
            4 809% de retour sur abonnement
          </p>
        </div>

      </div>

      {/* CORE 7D V 30D RECHARTS ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEADS & REVENUE GROWTH GRAPH (2 COLS) */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-gray-850 p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-white text-base font-black uppercase tracking-wider flex items-center gap-2">
                <BarChart3 size={18} className="text-fiko-red" /> Progression Mensuelle de l'Acquisition IA
              </h3>
              <p className="text-xs text-gray-450 mt-1">Évolution des leads capturés automatiquement par Fiko contre les revenus générés</p>
            </div>

            <div className="bg-black p-1 rounded-xl border border-gray-900 flex gap-1">
              {['7d', '30d', 'all'].map((range) => (
                <button 
                  key={range}
                  onClick={() => setActiveRange(range as any)}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition ${
                    activeRange === range ? 'bg-[#E10600] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {range === '7d' ? '7 Jours' : range === '30d' ? '30 Jours' : 'Tout'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyLeadsData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E10600" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#E10600" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#161616" vertical={false} />
                <XAxis dataKey="month" stroke="#444" axisLine={false} tickLine={false} />
                <YAxis stroke="#444" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #1f2937' }} />
                <Area type="monotone" dataKey="rev" name="Revenus (FCFA)" stroke="#E10600" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Bar dataKey="automated" name="Leads Automatisés" fill="#1b93f3" radius={[4, 4, 0, 0]} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REGIONAL GROWTH IN FRANCOPHONE AFRICA */}
        <div className="bg-[#0a0a0a] border border-gray-850 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[#E10600] font-black text-[9px] uppercase tracking-widest bg-red-955 border border-red-900/30 px-2.5 py-0.5 rounded">
              SaaS Horizons 2027
            </span>
            <h3 className="text-white text-base font-black mt-2 mb-4 flex items-center gap-2">
              <Globe2 size={18} className="text-[#25D366]" /> Expansion Marché Régional (FCFA Zone)
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Fiko Connect unifie la communication et les encaissements en s'étendant à l'Afrique de l'Ouest dominée par Orange Money, Wave et MTN.
            </p>

            <div className="space-y-3">
              {[
                { country: 'Côte d’Ivoire 🇨🇮', status: 'ACTIF / PRODUCTION', color: 'text-[#25D366]' },
                { country: 'Sénégal 🇸🇳', status: 'BETA PRIVÉE', color: 'text-blue-400' },
                { country: 'Cameroun 🇨🇲', status: 'ROADMAP MOIS 3', color: 'text-purple-400' },
                { country: 'Bénin 🇧🇯', status: 'ROADMAP MOIS 4', color: 'text-gray-500' },
                { country: 'Burkina Faso 🇧🇫', status: 'ROADMAP MOIS 5', color: 'text-gray-500' }
              ].map((c) => (
                <div key={c.country} className="bg-black/60 p-3 rounded-xl border border-gray-950 flex justify-between items-center">
                  <span className="text-xs font-bold text-white">{c.country}</span>
                  <span className={`text-[9.5px] font-black uppercase font-mono px-2 py-0.5 rounded ${c.color} bg-black border border-gray-900`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CORE 6. FUNNEL CONVERSION MATRIX DIAGRAM */}
      <div className="bg-[#0a0a10] border border-blue-900/20 p-6 md:p-8 rounded-2xl relative shadow-2xl">
        <div className="absolute top-0 right-1/2 transform translate-x-1/2 w-96 h-20 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Layers className="text-fiko-red animate-pulse" size={18} />
            <h3 className="text-xl font-black text-white">Séquence d'Entonnoir & Métriques Firebase Analytics</h3>
          </div>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Parcours complet de conversion. Nous monitorons l'efficacité de chaque étape pour éliminer toute friction et maximiser le chiffre d'affaires d'affaires des PME ivoiriennes.
          </p>
        </div>

        {/* Funnel list layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {funnelSteps.map((step) => (
            <div 
              key={step.id} 
              className="bg-black/60 border border-gray-950 hover:bg-[#0e0e13] hover:border-[#1f2937]/50 p-4 rounded-xl flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-extrabold text-white group-hover:text-fiko-red transition-colors">
                    {step.name}
                  </h4>
                  <span className="text-xs font-black text-emerald-400 font-mono">
                    {step.rate}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-gray-950 flex justify-between text-[9px] font-mono text-gray-500 uppercase">
                <span>Volume actif :</span>
                <span className="font-bold text-white">{step.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
