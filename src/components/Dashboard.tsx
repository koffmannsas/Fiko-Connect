import { useState, useEffect } from 'react';
import { AlertTriangle, Target, Trophy, Wallet, Zap, TrendingUp, Flame, CheckCircle, MessageSquareText, Activity, BarChart3, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', sales: 4200, leads: 2400 },
  { name: 'Tue', sales: 3800, leads: 1398 },
  { name: 'Wed', sales: 2200, leads: 9800 },
  { name: 'Thu', sales: 4900, leads: 3908 },
  { name: 'Fri', sales: 4100, leads: 4800 },
  { name: 'Sat', sales: 5300, leads: 3800 },
  { name: 'Sun', sales: 6490, leads: 4300 },
];

export default function Dashboard() {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* LIVE ACTIVITY */}
      <div className="flex items-center justify-between bg-[#111] p-5 rounded-2xl border border-gray-800 shadow-xl gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`absolute inset-0 bg-fiko-red rounded-full transition-opacity ${pulse ? 'opacity-100' : 'opacity-30'}`}></div>
            <div className="bg-fiko-red w-4 h-4 rounded-full relative"></div>
          </div>
          <p className="text-xl font-bold tracking-tight">
            Fiko Connect <span className='text-gray-500 font-normal'>est actif</span>
          </p>
        </div>
        <div className="flex gap-8">
            <div className='text-center'><p className='text-2xl font-bold text-white'>3</p><p className='text-xs text-gray-500 uppercase tracking-wider'>Leads en cours</p></div>
            <div className='text-center'><p className='text-2xl font-bold text-white'>2</p><p className='text-xs text-gray-500 uppercase tracking-wider'>Convs. actives</p></div>
        </div>
      </div>

      {/* ALERTS */}
      <div className="bg-amber-950 border border-amber-900 text-amber-100 p-5 rounded-2xl flex items-center justify-between">
        <div className='flex items-center gap-4'>
          <AlertTriangle className='text-amber-500' size={24} />
          <div>
            <p className='font-bold text-lg'>Vente potentielle en attente (10 000 FCFA)</p>
            <p className='text-sm opacity-80'>Le client n'a pas reçu de réponse depuis 15 min.</p>
          </div>
        </div>
        <button className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-700 transition">Répondre sur WhatsApp</button>
      </div>

      {/* TOP ROW: COACH + GOAL + LEVEL */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><span className='text-purple-400'>🧠</span> Fiko Insight Pro</h3>
          <p className="text-gray-300 text-sm mb-6">Activez la relance intelligente J+2 pour ce segment. <br/> <strong className='text-green-400'>Gain estimé : +28 000 FCFA</strong></p>
          <button className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition">Appliquer automatiquement</button>
        </div>
        
        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800 flex flex-col justify-center">
            <h3 className="text-gray-400 text-sm mb-4 flex items-center gap-2"><Target size={16}/> Objectif du jour (100 000 FCFA)</h3>
            <p className="text-4xl font-bold text-white mb-4">Progression : 72%</p>
            <div className="w-full bg-gray-900 rounded-full h-3">
              <div className="bg-fiko-red h-3 rounded-full" style={{ width: '72%'}}></div>
            </div>
            <p className='text-sm text-green-500 font-semibold mt-4'>Encore 2 ventes pour atteindre votre objectif 🔥</p>
        </div>

        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800 flex flex-col justify-center">
            <h3 className='text-gray-400 font-semibold flex items-center gap-2 mb-4'><Trophy className='text-yellow-500' size={18}/> Niveau Système</h3>
            <p className='text-4xl font-bold mb-2'>Elite Vendeur</p>
            <div className="w-full bg-gray-900 rounded-full h-3">
              <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '85%'}}></div>
            </div>
            <p className='text-sm text-gray-500 mt-4'>Progression vers "Machine" : 85%</p>
        </div>
      </div>

      {/* KPI + NEXT ACTION */}
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-2 bg-gradient-to-r from-fiko-red to-red-800 p-6 rounded-2xl flex items-center justify-between text-white shadow-xl shadow-red-900/30">
             <div>
                <h3 className='font-bold text-xl mb-1'>🎯 Prochaine meilleure action</h3>
                <p className='text-md opacity-90'>Contacter 2 leads chauds (Score &gt; 85). <br/> <strong className='text-white'>Gain estimé : +18 000 FCFA</strong></p>
             </div>
             <button className='bg-white text-fiko-red px-6 py-4 rounded-xl font-bold text-lg hover:scale-105 transition'>Lancer</button>
        </div>

        {[
            { label: 'Revenus (Auj.)', value: '72 000 FCFA', icon: Wallet },
            { label: 'Taux conversion', value: '11.5%', icon: TrendingUp },
        ].map((kpi, i) => (
            <div key={i} className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800 shadow-xl overflow-hidden relative">
            <div className="flex items-center gap-3 text-gray-400 mb-4">
                <kpi.icon size={22} className='text-fiko-red' />
                <span className="text-sm font-semibold tracking-wide uppercase">{kpi.label}</span>
            </div>
            <p className="text-3xl font-bold text-white tracking-tight">{kpi.value}</p>
            </div>
        ))}
      </div>

      {/* MIDDLE ROW: GRAPH + HOT LEADS + HISTORY */}
      <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-[#0a0a0a] p-8 rounded-2xl border border-gray-800 shadow-lg">
            <h3 className="text-white text-xl font-bold mb-8">Performance Journalière 📈</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#555" axisLine={false} tickLine={false} />
                  <YAxis stroke="#555" axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                  <Line type="monotone" dataKey="sales" stroke="#E10600" strokeWidth={4} strokeLinecap='round' />
                  <Line type="monotone" dataKey="leads" stroke="#444" strokeWidth={4} strokeLinecap='round' />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-gray-800 shadow-lg">
                <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2"><Flame className='text-orange-500' /> Leads chauds (3)</h3>
                <div className='flex flex-col gap-4'>
                {[
                    { name: 'Marie', score: 95 },
                    { name: 'Koffi', score: 91 },
                    { name: 'Awa', score: 88 }
                ].map(lead => (
                    <div key={lead.name} className='flex items-center justify-between bg-[#151515] p-4 rounded-xl border border-gray-800 hover:border-fiko-red transition-all'>
                        <div className='flex items-center gap-3'>
                            <div className='text-xs bg-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold'>{lead.name[0]}</div>
                            <div>
                                <p className='font-bold'>{lead.name}</p>
                                <p className='text-xs text-gray-500'>Score : {lead.score}</p>
                            </div>
                        </div>
                        <button className='text-sm bg-gray-900 text-white px-3 py-2 rounded-lg font-semibold hover:bg-fiko-red transition flex items-center gap-1'>Chat <ArrowRight size={14}/></button>
                    </div>
                ))}
                </div>
            </div>
      </div>
    </div>
  );
}
