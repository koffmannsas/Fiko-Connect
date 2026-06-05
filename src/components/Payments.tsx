import { useState } from 'react';
import { 
  CreditCard, 
  Coins, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle, 
  XCircle, 
  Download, 
  Settings, 
  Smartphone,
  ShieldCheck,
  Building,
  RefreshCw,
  Wallet
} from 'lucide-react';

interface Transaction {
  reference: string;
  name: string;
  phone: string;
  amount: number;
  provider: 'Wave' | 'Orange Money' | 'MTN Money' | 'Wari';
  timestamp: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  fees: number;
}

export default function PaymentsModule() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'Wave' | 'Orange Money' | 'MTN Money'>('all');

  const [transactions, setTransactions] = useState<Transaction[]>([
    { reference: 'TX-CIV-9284', name: 'Marie Koné', phone: '+225 07 48 93 11 20', amount: 45000, provider: 'Wave', timestamp: 'Aujourd\'hui, 12:05', status: 'SUCCESS', fees: 450 },
    { reference: 'TX-CIV-9121', name: 'Koffi Yao', phone: '+225 05 92 84 77 15', amount: 24900, provider: 'Orange Money', timestamp: 'Aujourd\'hui, 11:46', status: 'SUCCESS', fees: 249 },
    { reference: 'TX-CIV-8840', name: 'Zadi Simplice', phone: '+225 05 60 70 80 90', amount: 49900, provider: 'Wave', timestamp: 'Hier, 18:22', status: 'SUCCESS', fees: 499 },
    { reference: 'TX-CIV-8812', name: 'Awa Diallo', phone: '+225 01 02 03 04 05', amount: 19900, provider: 'MTN Money', timestamp: 'Hier, 09:12', status: 'SUCCESS', fees: 199 },
    { reference: 'TX-CIV-7100', name: 'Christian Gnamien', phone: '+225 07 11 22 33 44', amount: 99000, provider: 'Orange Money', timestamp: 'Il y a 2 jours', status: 'SUCCESS', fees: 990 },
    { reference: 'TX-CIV-6240', name: 'Aicha Touré', phone: '+225 01 44 55 66 77', amount: 19900, provider: 'Wave', timestamp: 'Il y a 3 jours', status: 'FAILED', fees: 0 }
  ]);

  // Calculations
  const successfulTx = transactions.filter(t => t.status === 'SUCCESS');
  const filteredTx = selectedProvider === 'all' 
    ? transactions 
    : transactions.filter(t => t.provider === selectedProvider);

  const totalRevenue = successfulTx.reduce((sum, t) => sum + t.amount, 0);
  const totalFees = successfulTx.reduce((sum, t) => sum + t.fees, 0);
  const liveNetBalance = totalRevenue - totalFees;

  const copyApiKey = () => {
    setCopiedKey(true);
    navigator.clipboard.writeText('fk_live_2026_koffmann_93710_wave_orange');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* PAY EXECUTIVE COUNTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Wallet Balance widget in FCFA */}
        <div className="bg-[#060a0b] border border-emerald-950/60 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
              <Wallet size={12} /> Solde Mobile Money Net (CIV)
            </span>
            <span className="bg-emerald-950 border border-green-900/60 text-[#25D366] text-[8px] font-black uppercase px-2 py-0.5 rounded">
              Liquidité Réseau
            </span>
          </div>
          <p className="text-3xl font-black text-white font-mono">{liveNetBalance.toLocaleString()} FCFA</p>
          <div className="flex justify-between items-center text-[10px] text-gray-500 mt-4 pt-4 border-t border-gray-900">
            <span>Commission Fiko Pay : <strong className="text-white font-mono">1% Fixe</strong></span>
            <span className="text-[#25D366] font-bold flex items-center gap-1">
              ● API Wave & Orange Connectée
            </span>
          </div>
        </div>

        {/* Total Revenues Collected */}
        <div className="bg-[#0a0a0a] border border-gray-900 p-6 rounded-2xl relative">
          <span className="text-[10px] text-gray-500 font-extrabold uppercase block mb-1">Encaissements Totaux</span>
          <p className="text-2xl font-black text-white font-mono">{totalRevenue.toLocaleString()} FCFA</p>
          <p className="text-[10px] text-green-400 font-semibold mt-3 flex items-center gap-1">
            <TrendingUp size={12}/> +14% par rapport à la semaine dernière
          </p>
        </div>

        {/* Total Transaction Fees */}
        <div className="bg-[#0a0a0a] border border-gray-900 p-6 rounded-2xl relative">
          <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Frais de Réseau Réduits</span>
          <p className="text-2xl font-black text-white font-mono">{totalFees.toLocaleString()} FCFA</p>
          <p className="text-[10px] text-gray-400 mt-3">
            Économie de ~18 500 FCFA vs passerelles traditionnelles
          </p>
        </div>
      </div>

      {/* QUICK DISBURSEMENT ACTION CARD */}
      <div className="bg-gradient-to-r from-emerald-950/20 via-black to-neutral-900/10 border border-emerald-900/30 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-base text-gray-200">Reverser vers votre compte bancaire ou Mobile Money perso</h4>
          <p className="text-xs text-gray-450 mt-0.5">Le virement sera validé de bout en bout en moins de 15 minutes.</p>
        </div>
        <button 
          onClick={() => alert(`Reversement de ${liveNetBalance.toLocaleString()} FCFA initié vers ${transactions[0].phone} !`)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3 rounded-xl text-xs transition active:scale-95 text-center shrink-0 w-full md:w-auto"
        >
          Déclencher le reversement instantané ➡️
        </button>
      </div>

      {/* MID PANEL: TRANS LOG + PARAM INTEGRATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TRANSMISSION LOG TABLE - LEFT/CENTER (2 COLUMNS) */}
        <div className="col-span-1 lg:col-span-2 bg-[#0a0a0a] border border-gray-850 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-gray-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">Journaux des Transactions Fiko Pay</h3>
              <p className="text-gray-550 text-xs">Historique des pushs de paiement Wave et Orange Money de vos clients</p>
            </div>
            
            {/* Filter buttons */}
            <div className="bg-black p-1 rounded-xl border border-gray-900 flex gap-1">
              {['all', 'Wave', 'Orange Money', 'MTN Money'].map((prov) => (
                <button 
                  key={prov}
                  onClick={() => setSelectedProvider(prov as any)}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase transition ${
                    selectedProvider === prov ? 'bg-[#E10600] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {prov === 'all' ? 'Tous' : prov.replace(' Money', '')}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-[#111] text-gray-400 text-[10px] font-black uppercase">
              <tr>
                <th className="p-4">Réf / Prospect</th>
                <th className="p-4">Montant</th>
                <th className="p-4">Passerelle</th>
                <th className="p-4 text-center">Statut</th>
                <th className="p-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-xs">
              {filteredTx.map((tx) => (
                <tr key={tx.reference} className="hover:bg-[#111]/60 transition">
                  <td className="p-4">
                    <p className="font-extrabold text-white text-[11px]">{tx.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono font-bold leading-normal">{tx.reference} • {tx.phone}</p>
                  </td>
                  <td className="p-4 font-black text-white font-mono">{tx.amount.toLocaleString()} FCFA</td>
                  <td className="p-4 font-bold text-gray-300 flex items-center gap-1 mt-2 bg-transparent">
                    <span className={`w-2 h-2 rounded-full ${tx.provider === 'Wave' ? 'bg-[#1b93f3]' : 'bg-[#f16e00]'}`}></span>
                    <span>{tx.provider}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      tx.status === 'SUCCESS' ? 'bg-green-950 text-green-400 border border-green-900/50' 
                      : tx.status === 'PENDING' ? 'bg-amber-950 text-amber-400 border border-amber-900/50'
                      : 'bg-red-950 text-red-400 border border-red-900/50'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-[10px] text-gray-500 font-medium">{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DYNAMIC SETTLEMENT CHECKS - RIGHT (1 COLUMN) */}
        <div className="space-y-4">
          
          <div className="bg-[#0a0a0a] border border-gray-850 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-950">
              <Smartphone className="text-blue-400 shrink-0" size={16} />
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Passerelles Actives (CIV)</h4>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Pour encaisser de manière totalement autonome auprès de vos prospects sur WhatsApp, activez ou configurez les comptes marchands ci-dessous.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center bg-black/60 p-3 rounded-xl border border-gray-950">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="font-bold text-gray-200">Wave Côte d’Ivoire</span>
                </div>
                <span className="bg-emerald-950/40 text-[#25D366] text-[8px] font-black px-2 py-0.5 rounded border border-green-900">ACTIF</span>
              </div>

              <div className="flex justify-between items-center bg-black/60 p-3 rounded-xl border border-gray-950">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                  <span className="font-bold text-gray-200">Orange Money CIV</span>
                </div>
                <span className="bg-emerald-950/40 text-[#25D366] text-[8px] font-black px-2 py-0.5 rounded border border-green-900">ACTIF</span>
              </div>

              <div className="flex justify-between items-center bg-black/60 p-3 rounded-xl border border-gray-950">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                  <span className="font-bold text-gray-200">MTN Mobile Money CIV</span>
                </div>
                <span className="bg-emerald-950/40 text-[#25D366] text-[8px] font-black px-2 py-0.5 rounded border border-green-900">ACTIF</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-850 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-950">
              <ShieldCheck className="text-purple-400 shrink-0" size={16} />
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Clé API Développeur FOS</h4>
            </div>

            <p className="text-[11px] text-gray-400">
              Utilisez cette clé sécurisée pour connecter Fiko Pay à vos passerelles d'acquisitions externes ou à WooCommerce / Prestashop.
            </p>

            <div className="bg-black p-2 rounded-xl border border-gray-950 flex justify-between items-center">
              <span className="font-mono text-[10px] text-gray-500 select-all truncate">fk_live_2026_koffmann...</span>
              <button 
                onClick={copyApiKey}
                className="bg-neutral-900 text-white font-extrabold px-3 py-1.5 rounded-lg text-[9px] hover:bg-neutral-850 transition"
              >
                {copiedKey ? 'Copié !' : 'Copier'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
