/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  auth 
} from './lib/firebase';
import { 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Bot, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Power, 
  User, 
  Megaphone, 
  Lock,
  LogOut,
  AlertTriangle,
  Zap,
  Bell
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import AutomationModule from './components/Automation';
import LeadsModule from './components/Leads';
import CampaignsModule from './components/Campaigns';
import ConversationsModule from './components/Conversations';
import PaymentsModule from './components/Payments';
import AnalyticsModule from './components/Analytics';
import QuantumGate from './components/QuantumGate';

export default function App() {
  const [view, setView] = useState<'quantum' | 'dashboard'>('quantum');
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [autoPilot, setAutoPilot] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>({
    companyName: 'Koffmann Capital Group',
    companyId: 'fiko_prod_68469',
    businessType: 'services',
    businessCategory: 'Fintech & Marketing',
    workingHours: '24/7',
    mobileMoneyProvider: 'Wave',
    mobileMoneyNumber: '+225 07 48 93 11 20',
    selectedPlan: 'free',
    connectedNumber: '+225 05 92 84 77 15'
  });

  // Keep track of auth session to allow seamless redirection if state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !isDemoMode) {
        setView('quantum');
      }
    });
    return unsubscribe;
  }, [isDemoMode]);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Fiko leads', icon: User },
    { name: 'Campagnes', icon: Megaphone },
    { name: 'Conversations', icon: MessageSquareText },
    { name: 'Automation', icon: Bot },
    { name: 'Paiements', icon: CreditCard },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Settings', icon: Settings },
  ];

  // Callback from QuantumGate activation sequences
  const handleEnterPlatform = (data: any, isDemo: boolean) => {
    setIsDemoMode(isDemo);
    if (data) {
      setOnboardingData(data);
    }
    setView('dashboard');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Logout error suppressed under demo restrictions:", err);
    }
    setIsDemoMode(false);
    setView('quantum');
  };

  if (view === 'quantum') {
    return <QuantumGate onEnter={handleEnterPlatform} />;
  }

  return (
    <div className="flex bg-[#050505] text-white min-h-screen font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-[#0a0a0a] border-r border-gray-900 p-6 flex flex-col fixed h-full z-10">
        <h2 className="text-2xl font-[900] mb-8 text-white tracking-tighter">
          FIKO<span className="text-[#E10600]">.</span>
        </h2>
        
        {/* Menu Items List */}
        <ul className="space-y-1.5 flex-1">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer font-semibold text-xs tracking-wide transition-all ${
                activeItem === item.name 
                  ? 'bg-[#E10600] text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-[#111]'
              }`}
              onClick={() => setActiveItem(item.name)}
            >
              <item.icon size={16} className="stroke-[2px]" />
              {item.name}
            </li>
          ))}
        </ul>
        
        {/* Connection and Profile Metrics Container */}
        <div className="space-y-3 pt-4 border-t border-gray-900 mt-auto">
          
          {/* Active Session Status */}
          <div className="p-3.5 rounded-xl border border-gray-900 bg-[#050505] relative overflow-hidden">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDemoMode ? 'bg-amber-400' : 'bg-green-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isDemoMode ? 'bg-amber-500' : 'bg-green-500'}`}></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-200">
                {isDemoMode ? '⚡ MODE DÉMO' : 'WhatsApp Connecté'}
              </span>
            </div>
            
            <p className="text-[11px] text-zinc-400 font-mono select-none truncate">
              {onboardingData?.connectedNumber || '+225 05 92 84 77 15'}
            </p>
            
            <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-gray-900 text-[9.5px] text-zinc-500 font-bold uppercase tracking-wider">
              <span className={isDemoMode ? 'text-amber-500' : 'text-green-500'}>
                {onboardingData?.selectedPlan || 'free'}
              </span>
              <span className="text-zinc-600 font-mono">ID: {isDemoMode ? 'GUEST' : 'FIKO-OS'}</span>
            </div>
          </div>

          {/* Premium Plan Upgrader Info card */}
          {onboardingData?.selectedPlan !== 'elite' && !isDemoMode && (
            <div className="p-3.5 rounded-xl border border-emerald-950 bg-emerald-950/10 flex flex-col gap-2 shadow-[0_0_15px_rgba(16,185,129,0.03)] selection:bg-emerald-900">
              <span className="text-[9px] font-extrabold text-emerald-400 tracking-wider uppercase">Fiko Core Priority</span>
              <div className="space-y-1 text-[10.5px] text-zinc-400">
                <div className="flex justify-between">
                  <span>Quota Contacts :</span>
                  <span className="font-bold text-white">Consommé</span>
                </div>
                <div className="flex justify-between">
                  <span>Vitesse Réponse :</span>
                  <span className="text-emerald-400 font-bold">Standard ⚡</span>
                </div>
              </div>
              <button 
                onClick={() => setView('quantum')}
                className="w-full bg-[#E10600] text-white py-1.5 rounded-lg font-bold text-[10px] tracking-wide uppercase hover:bg-red-700 transition active:scale-95 text-center cursor-pointer mt-1"
              >
                Changer de forfait
              </button>
            </div>
          )}

          {/* Logout / Exit Command Button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-zinc-900/60 hover:bg-[#E10600]/10 border border-white/5 hover:border-[#E10600]/25 text-zinc-400 hover:text-white py-2.5 rounded-xl transition text-[11px] font-bold tracking-wide uppercase cursor-pointer"
          >
            <LogOut size={13} />
            <span>Quitter l'Espace</span>
          </button>

        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        
        {/* RESTRICTED DEMO WARNING BANNER */}
        {isDemoMode && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/20 border border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div>
                <p className="text-xs font-black text-amber-200 uppercase tracking-wider">
                  ⚠️ Mode d'Essai Ouvert (Bac à sable)
                </p>
                <p className="text-[11px] text-amber-400/80 leading-relaxed max-w-2xl">
                  Vous exécutez Fiko Connect en mode démonstration autonome. Les configurations réelles de serveurs de messagerie WhatsApp et Mobile Money ont été simulées de manière read-only.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setView('quantum')}
              className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl shrink-0 transition"
            >
              Déployer un espace réel OS
            </button>
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-[900] tracking-tight">{activeItem}</h1>
            
            <div className="flex items-center gap-6">
                <div className="relative cursor-pointer">
                    <Bell size={20} className="text-gray-400 hover:text-white transition" />
                    {/* Badge logic placeholder - assumed hasUnread from global state */}
                    {true && (
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#E10600] border-2 border-[#050505]"></span>
                    )}
                </div>
                
                <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${autoPilot ? 'bg-green-950/20 border-green-800/40 text-green-400' : 'bg-zinc-900/40 border-gray-800 text-zinc-400'}`}>
                    <Power size={14} className={autoPilot ? 'text-green-500 animate-pulse' : 'text-gray-500'}/>
                    <span className="text-xs font-bold tracking-wide">{autoPilot ? 'Mode Auto Pilot Activé' : 'Mode Auto Pilot Désactivé'}</span>
                    <button 
                      onClick={() => !isDemoMode ? setAutoPilot(!autoPilot) : null} 
                      className={`w-9 h-5 rounded-full relative transition ${autoPilot ? 'bg-green-600' : 'bg-zinc-800'} ${isDemoMode ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                      title={isDemoMode ? 'Désactivé en Mode Démo' : 'Basculer l\'autopilote'}
                    >
                        <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-all ${autoPilot ? 'translate-x-4' : ''}`}></div>
                    </button>
                </div>
            </div>
        </div>

        {/* CONTROLLING SUB-MODULE EXECUTIONS */}
        {activeItem === 'Dashboard' && (
          <Dashboard 
            onboardingData={onboardingData} 
            onUpgrade={() => setView('quantum')} 
          />
        )}
        {activeItem === 'Automation' && <AutomationModule />}
        {activeItem === 'Fiko leads' && <LeadsModule onboardingData={onboardingData} />}
        {activeItem === 'Campagnes' && <CampaignsModule />}
        {activeItem === 'Conversations' && <ConversationsModule onboardingData={onboardingData} />}
        {activeItem === 'Paiements' && <PaymentsModule />}
        {activeItem === 'Analytics' && <AnalyticsModule />}
        {activeItem === 'Settings' && (
          <div className="p-6 bg-zinc-900/20 border border-white/5 rounded-3xl max-w-2xl">
            <h3 className="text-lg font-black text-white mb-2">Paramètres de l'Infrastructure</h3>
            <p className="text-xs text-zinc-400 mb-4 font-medium leading-relaxed">
              Consultez vos variables d'intégration d'entreprise pour les passerelles Fiko OS.
            </p>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 bg-black/60 rounded-xl border border-white/5 flex justify-between items-center">
                <span className="text-zinc-500 font-bold uppercase">COMPANY_ID :</span>
                <span className="text-white font-bold select-all">{isDemoMode ? 'sandbox_demo_reviewer_68' : 'fiko_prod_68469' }</span>
              </div>
              <div className="p-3.5 bg-black/60 rounded-xl border border-white/5 flex justify-between items-center">
                <span className="text-zinc-500 font-bold uppercase">REGION :</span>
                <span className="text-emerald-400 font-bold">Afrique de l'Ouest (Abidjan) 🇨🇮</span>
              </div>
              <div className="p-3.5 bg-black/60 rounded-xl border border-white/5 flex justify-between items-center">
                <span className="text-zinc-500 font-bold uppercase">CAPABILITY_STATUS :</span>
                <span className="text-emerald-400 font-bold">SERVER_SIDE_GEMINI_API_ACTIVE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
