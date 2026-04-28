/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { LayoutDashboard, MessageSquareText, Bot, CreditCard, BarChart3, Settings, Power } from 'lucide-react';
import Dashboard from './components/Dashboard';
import AutomationModule from './components/Automation';
import { SplashScreen, LoginPage, RegisterPage } from './components/AuthLayouts';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'splash' | 'login' | 'register' | 'dashboard'>('splash');
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [autoPilot, setAutoPilot] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Conversations', icon: MessageSquareText },
    { name: 'Automation', icon: Bot },
    { name: 'Paiements', icon: CreditCard },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Settings', icon: Settings },
  ];

  if (view === 'splash') return <SplashScreen onComplete={() => setView('login')} />;
  
  if (view === 'login' || view === 'register') {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center">
              <AnimatePresence mode="wait">
                  {view === 'login' ? 
                    <LoginPage key="login" onLogin={() => setView('dashboard')} onToggle={() => setView('register')} /> : 
                    <RegisterPage key="register" onToggle={() => setView('login')} />
                  }
              </AnimatePresence>
          </div>
      );
  }

  return (
    <div className="flex bg-[#050505] text-white min-h-screen font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#0a0a0a] border-r border-gray-900 p-6 flex flex-col fixed h-full z-10">
        <h2 className="text-2xl font-bold mb-10 text-white tracking-tighter">Fiko<span className="text-fiko-red">.</span></h2>
        <ul className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${activeItem === item.name ? 'bg-fiko-red text-white' : 'text-gray-400 hover:text-white hover:bg-[#111]'}`}
              onClick={() => setActiveItem(item.name)}
            >
              <item.icon size={20} />
              {item.name}
            </li>
          ))}
        </ul>
        <button className="flex w-full items-center justify-center gap-2 bg-green-600 text-white font-semibold p-3 rounded-lg hover:bg-green-700 mt-4 transition-colors">
          <MessageSquareText size={18} /> WhatsApp Directe
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
            <h1 className='text-3xl font-bold'>{activeItem}</h1>
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${autoPilot ? 'bg-green-950 border-green-800' : 'bg-gray-900 border-gray-700'}`}>
                <Power size={18} className={autoPilot ? 'text-green-500' : 'text-gray-500'}/>
                <span className='text-sm font-semibold'>{autoPilot ? 'Mode Auto Pilot Activé' : 'Mode Auto Pilot Désactivé'}</span>
                <button onClick={() => setAutoPilot(!autoPilot)} className={`w-10 h-5 rounded-full relative transition ${autoPilot ? 'bg-green-600' : 'bg-gray-700'}`}>
                    <div className={`absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition ${autoPilot ? 'translate-x-5' : ''}`}></div>
                </button>
            </div>
        </div>

        {activeItem === 'Dashboard' && <Dashboard />}
        {activeItem === 'Automation' && <AutomationModule />}
      </div>
    </div>
  );
}

