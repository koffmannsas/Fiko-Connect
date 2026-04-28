import { useState } from 'react';
import { AlertTriangle, Target, Trophy, Wallet, Zap, TrendingUp, Flame, CheckCircle, CreditCard, Bot, Activity, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', sales: 4000, leads: 2400 },
  { name: 'Tue', sales: 3000, leads: 1398 },
  { name: 'Wed', sales: 2000, leads: 9800 },
  { name: 'Thu', sales: 2780, leads: 3908 },
  { name: 'Fri', sales: 1890, leads: 4800 },
  { name: 'Sat', sales: 2390, leads: 3800 },
  { name: 'Sun', sales: 3490, leads: 4300 },
];

export default function Dashboard() {
  return (
    <>
      {/* ALERTS */}
      <div className="mb-6 bg-amber-950 border border-amber-800 text-amber-200 p-4 rounded-xl flex items-center justify-between">
        <div className='flex items-center gap-3'>
          <AlertTriangle className='text-amber-500' />
          <p>⚠️ Vente potentielle en attente (10 000 FCFA) - Répondez maintenant</p>
        </div>
        <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700">Répondre</button>
      </div>

      {/* TOP ROW: COACH + GOAL + LEVEL */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2"><span className='text-purple-400'>🧠</span> Fiko Insight</h3>
          <p className="text-gray-300 my-4 text-sm">Action recommandée : Activer relance J+2. <br/> <strong className='text-green-400'>Gain estimé : +25 000 FCFA</strong></p>
          <button className="bg-fiko-red text-white py-2 rounded-lg font-semibold hover:bg-red-700">Activer automatiquement</button>
        </div>
        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800 flex flex-col justify-center">
            <h3 className="text-gray-400 text-sm mb-2 flex items-center gap-2"><Target size={16}/> Objectif du jour (100 000 FCFA)</h3>
            <p className="text-3xl font-bold text-white mb-2">Progression : 65%</p>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '65%'}}></div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>Encore 3 ventes pour atteindre votre objectif</p>
        </div>
        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800 flex flex-col gap-2">
            <h3 className='font-semibold flex items-center gap-2'><Trophy className='text-yellow-500'/> Niveau Utilisateur</h3>
            <p className='text-3xl font-bold'>Vendeur actif</p>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '78%'}}></div>
            </div>
            <p className='text-xs text-gray-500'>Progression : 78%</p>
        </div>
      </div>

      {/* NEXT BEST ACTION & KPI */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="col-span-2 bg-fiko-red p-6 rounded-2xl flex items-center justify-between text-white shadow-xl shadow-red-900/20">
            <div>
                <h3 className='font-bold text-lg'>🎯 Prochaine meilleure action</h3>
                <p className='text-sm opacity-90'>Contacter 2 leads chauds maintenant. <br/> <strong className='text-white'>Gain estimé : +15 000 FCFA</strong></p>
            </div>
            <button className='bg-white text-fiko-red px-4 py-2 rounded-lg font-bold'>Lancer maintenant</button>
        </div>

        {[
            { label: 'Revenus (Auj.)', value: '78 000 FCFA', icon: Wallet },
            { label: 'Taux conversion', value: '8.5%', icon: TrendingUp },
        ].map((kpi, i) => (
            <div key={i} className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800 shadow-xl">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
                <kpi.icon size={18} />
                <span className="text-sm">{kpi.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            </div>
        ))}
      </div>

      {/* MIDDLE ROW: GRAPH + HOT LEADS + HISTORY */}
      <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800">
            <h3 className="text-white font-semibold mb-6">Performance Journalière</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="name" stroke="#555" />
                  <YAxis stroke="#555" />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                  <Line type="monotone" dataKey="sales" stroke="#E10600" strokeWidth={3} />
                  <Line type="monotone" dataKey="leads" stroke="#444" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800 flex-1">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2"><Flame className='text-orange-500' /> Leads chauds (3)</h3>
                <div className='flex flex-col gap-3'>
                {['Marie (score 92)', 'Koffi (score 87)', 'Awa (score 81)'].map(lead => (
                    <div key={lead} className='flex justify-between bg-[#151515] p-3 rounded-lg'>
                        <span>{lead}</span>
                        <button className='text-xs text-fiko-red font-semibold hover:underline flex items-center gap-1'>Contacter <CheckCircle size={12}/></button>
                    </div>
                ))}
                </div>
            </div>
          </div>
      </div>

      {/* HISTORY */}
      <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2"><Wallet className='text-green-500' /> Revenus générés avec Fiko</h3>
          <div className='grid grid-cols-3 gap-4 mt-4'>
              <div className='bg-[#151515] p-4 rounded-lg'>
                  <p className='text-gray-400 text-sm'>Aujourd’hui</p>
                  <p className='text-2xl font-bold'>45 000 FCFA</p>
              </div>
              <div className='bg-[#151515] p-4 rounded-lg'>
                  <p className='text-gray-400 text-sm'>Cette semaine</p>
                  <p className='text-2xl font-bold'>210 000 FCFA</p>
              </div>
              <div className='bg-[#151515] p-4 rounded-lg'>
                  <p className='text-gray-400 text-sm'>Ce mois</p>
                  <p className='text-2xl font-bold'>780 000 FCFA</p>
              </div>
          </div>
      </div>
    </>
  );
}
