import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  CheckCircle, 
  Sparkles, 
  Zap, 
  Bot, 
  Smartphone, 
  DollarSign, 
  Clock, 
  Check, 
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Award,
  Flame,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface SaaSGrowthEngineProps {
  onboardingData?: any;
  onUpgrade: () => void;
}

export default function SaaSGrowthEngine({ onboardingData, onUpgrade }: SaaSGrowthEngineProps) {
  // 1. Success Meter States
  const [successSteps, setSuccessSteps] = useState([
    { id: 'wa', label: 'WhatsApp Connecté', weight: 20, done: true, desc: 'Liaison instantanée de votre numéro de vente' },
    { id: 'profile', label: 'Profil de l\'Entreprise Complété', weight: 15, done: true, desc: 'Définition des horaires et Mobile Money' },
    { id: 'contact', label: 'Premier Contact Traité', weight: 22, done: true, desc: 'Acquisition automatique d\'un lead qualifié' },
    { id: 'chat', label: 'Première Conversation IA', weight: 25, done: true, desc: 'Fiko a répondu de manière autonome en < 1s' },
    { id: 'payment', label: 'Premier Paiement Initié', weight: 10, done: false, desc: 'Liaison directe avec Wave ou Orange Money' },
    { id: 'sale', label: 'Première Vente Réalisée', weight: 8, done: false, desc: 'Règlement encaissé avec succès sur fiko_pay' }
  ]);

  // Calculate success score dynamically based on checked items
  const successScore = successSteps.reduce((acc, curr) => curr.done ? acc + curr.weight : acc, 0);

  // Toggle a milestone
  const toggleStep = (id: string) => {
    setSuccessSteps(prev => prev.map(step => {
      if (step.id === id) {
        const nextState = !step.done;
        // If they checked "Première Vente", trigger magic moment!
        if (id === 'sale' && nextState) {
          setShowMagicMoment(true);
        }
        return { ...step, done: nextState };
      }
      return step;
    }));
  };

  // 4. Fiko Prime Closing Assistant Chat State
  const [primeChat, setPrimeChat] = useState<Array<{ sender: 'prime' | 'user'; text: string; time: string }>>([
    { 
      sender: 'prime', 
      text: `Bonjour ${onboardingData?.representativeName || 'Paul'}. Votre IA Fiko Connect a déjà traité 42 conversations et capturé 4 contacts qualifiés pour ${onboardingData?.companyName || 'votre activité'}.`,
      time: '14:20'
    },
    { 
      sender: 'prime', 
      text: "Si vous continuez au même rythme, vos quotas gratuits de test seront épuisés d'ici aujourd'hui. Souhaitez-vous débloquer la version illimitée avec Fiko Starter ?",
      time: '14:20'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handlePrimeOption = (option: string) => {
    // Add user message
    const userMsg = { sender: 'user' as const, text: option, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) };
    setPrimeChat(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply = "";
      if (option.includes('débloquer')) {
        reply = "Merveilleux choix ! En passant à Starter, vous débloquez l'intégration WhatsApp permanente, les relances intelligentes illimitées et l'autopilote. Vos revenus potentiels de 245 000 FCFA sont à portée de main ! Cliquez ci-dessous pour activer le forfait 🚀";
      } else if (option.includes('ROI')) {
        reply = "C'est très simple : Fiko Starter coûte 19 900 FCFA/mois (soit environ 660 FCFA par jour). Avec déjà 4 contacts qualifiés d'une valeur estimée à 245 000 FCFA en 1 jour, votre abonnement est amorti à plus de 1 200% dès le premier jour de conversion !";
      } else {
        reply = "Chez Fiko, tout est transparent : l'abonnement Starter est sans engagement de durée, annulable en 1 clic depuis vos paramètres. Vous gardez 100% de la propriété de vos prospects et de vos ventes.";
      }

      setPrimeChat(prev => [...prev, {
        sender: 'prime',
        text: reply,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  // 5. Fullscreen celebration modal (Le moment magique)
  const [showMagicMoment, setShowMagicMoment] = useState(false);

  // Automatically show magic moment once on mount after 3 seconds to catch user attention
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMagicMoment(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* MOMENT MAGIQUE : CELEBRATION OVERLAY */}
      {showMagicMoment && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 via-black to-red-950/20 pointer-events-none"></div>
          
          {/* Confetti particles simulator (pure CSS / Tailwind) */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/4 right-20 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>

          <div className="bg-[#0b0c15] border border-emerald-500/30 p-6 md:p-10 rounded-3xl max-w-lg w-full text-center relative overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.25)] animate-in fade-in zoom-in duration-300">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600"></div>
            
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 mb-6 text-emerald-400 animate-pulse">
              <Sparkles size={32} />
            </div>

            <h2 className="text-3xl font-black text-white tracking-tight uppercase">
              🎉 Premier Prospect Capturé & Qualifié !
            </h2>
            <p className="text-emerald-400 text-xs font-mono font-black mt-2 tracking-widest uppercase">
              Fiko vient de prouver sa valeur instantanément.
            </p>

            {/* Simulated WhatsApp Lead Card */}
            <div className="my-6 bg-black/55 border border-zinc-900 rounded-2xl p-5 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">Koffi Yao (Cocody)</h4>
                    <span className="text-[10px] text-zinc-500 font-mono">+225 07 48 93 11 20</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-black uppercase text-[#25D366] bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/40">
                  QUALIFIÉ À 95%
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-zinc-400 bg-zinc-950/50 p-3 rounded-lg border border-white/5 font-mono">
                <p>&gt; <span className="text-zinc-500">Canal :</span> WhatsApp Business API</p>
                <p>&gt; <span className="text-zinc-500">Intérêt :</span> Prestation Premium (Pack Luxe)</p>
                <p>&gt; <span className="text-zinc-500">Budget validé :</span> 245 000 FCFA</p>
                <p>&gt; <span className="text-zinc-500">Lien paiement :</span> Prêt à payer via Wave</p>
              </div>

              <div className="text-[10px] text-zinc-500 text-center italic">
                Règlement pré-autorisé. En attente de déblocage starter.
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto mb-6">
              Votre clone commercial autonome a structuré et qualifié cette vente en arrière-plan pendant que vous créiez votre compte.
            </p>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  setShowMagicMoment(false);
                  onUpgrade();
                }}
                className="w-full bg-[#E10600] text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(225,6,0,0.3)]"
              >
                Débloquer mes revenus et prospects 🚀
              </button>
              <button 
                onClick={() => setShowMagicMoment(false)}
                className="w-full bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white font-bold text-xs uppercase py-3 rounded-xl transition border border-zinc-900"
              >
                Prendre conscience du lead et continuer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THREE BENTO CONTAINER ELEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ELEMENT 1: PREMIÈRES VICTOIRE WIDGET & ROI TRACKER */}
        <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Trophy className="text-[#25D366]" size={16} /> PREMIÈRES VICTOIRES ACTIVES
              </h4>
              <span className="text-[9px] font-mono font-black text-[#25D366] bg-emerald-950/60 border border-green-900 px-2.5 py-1 rounded-full animate-pulse">
                FONCTIONNE EN ARRIÈRE-PLAN
              </span>
            </div>
            
            <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
              Votre IA n'affiche pas seulement des statistiques froides. Elle a déjà sécurisé des victoires concrètes pour votre activité en moins de 5 minutes :
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              <div className="bg-black/60 border border-zinc-900 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center text-[#25D366]">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Ligne de Vente</span>
                  <strong className="text-xs text-white">WhatsApp Connecté ✓</strong>
                </div>
              </div>

              <div className="bg-black/60 border border-zinc-900 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center text-[#25D366]">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Interaction</span>
                  <strong className="text-xs text-white">4 Prospects Traités ✓</strong>
                </div>
              </div>

              <div className="bg-black/60 border border-zinc-900 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center text-[#25D366]">
                  <Clock size={16} className="text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Heures Gagnées</span>
                  <strong className="text-xs text-[#25D366]">3h 12m Économisés</strong>
                </div>
              </div>

              <div className="bg-black/60 border border-emerald-950/50 p-3.5 rounded-2xl flex items-center gap-3 ring-1 ring-emerald-500/20">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 animate-pulse">
                  <DollarSign size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Pipeline Estimé</span>
                  <strong className="text-xs text-emerald-400">245 000 FCFA Détectés</strong>
                </div>
              </div>

            </div>
          </div>

          <div className="border-t border-gray-900 mt-5 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <Award size={14} className="text-yellow-500" />
              <span>Conversion estimée de l'espace : <strong className="text-white">+ 23.4 %</strong></span>
            </div>
            
            <button 
              onClick={() => setShowMagicMoment(true)}
              className="text-[10px] font-mono text-zinc-500 hover:text-white underline cursor-pointer"
            >
              Simuler à nouveau le "Moment Magique"
            </button>
          </div>
        </div>

        {/* ELEMENT 2: FIKO SUCCESS METER™ */}
        <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Award className="text-yellow-500" size={16} /> FIKO SUCCESS METER™
              </h4>
              <span className="text-[10px] text-zinc-500 font-mono">PILOTE COMMERCIAL</span>
            </div>

            {/* Real-time calculated score indicator with conditional text */}
            <div className="bg-zinc-950 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-900/40 rounded-full text-xs font-extrabold text-[#25D366]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-ping"></span>
                  {successScore}%
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">
                  {successScore >= 100 
                    ? "Félicitations ! Votre infrastructure est calibrée au maximum pour exploser vos ventes." 
                    : "Votre IA est presque prête à générer ses premiers revenus de manière 100% autonome."}
                </p>
              </div>

              {/* Radial or semi circular progress circle */}
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.03)" strokeWidth="4" fill="transparent" />
                  <circle cx="32" cy="32" r="28" stroke={successScore >= 100 ? "#10b981" : "#E10600"} strokeWidth="5" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 28} 
                    strokeDashoffset={2 * Math.PI * 28 * (1 - successScore / 100)} 
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute text-[11px] font-mono font-black text-white">{successScore}%</span>
              </div>
            </div>

            {/* Checklist of milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {successSteps.map((step) => (
                <div 
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer select-none transition-all ${step.done ? 'bg-emerald-955/20 border-emerald-900/30' : 'bg-black/55 border-zinc-900 hover:border-zinc-800'}`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition ${step.done ? 'bg-[#25D366] border-[#25D366] text-black' : 'border-zinc-700'}`}>
                    {step.done && <Check size={11} className="stroke-[3px]" />}
                  </div>
                  <div>
                    <h5 className={`font-bold leading-tight ${step.done ? 'text-white' : 'text-zinc-500'}`}>{step.label}</h5>
                    <p className="text-[9px] text-zinc-500 font-mono leading-none mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="text-[10px] text-zinc-500 text-center italic mt-1 bg-black/45 p-2 rounded-lg border border-white/5">
            Cliquez sur un jalon ci-dessus pour simuler sa mise en ligne.
          </div>
        </div>

      </div>

      {/* TWO COLUMNS CONTINUED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ENHANCED VALUE-BASED UPGRADE INCENTIVE TILE (ELEMENT 3) */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#0c0d16] to-[#050508] border border-red-900/40 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-red-950/80 border border-red-900/60 text-fiko-red font-black text-[9px] uppercase px-2.5 py-1 rounded">
                ⚡ DISPONIBLE MAINTENANT
              </span>
              <span className="text-[10px] font-mono text-zinc-500">CONVERSION DE VALEUR</span>
            </div>

            <h3 className="text-lg font-black text-white leading-tight">
              Prendre part à l'échelle supérieure
            </h3>

            {/* Strategic comparisons table */}
            <div className="bg-black/60 rounded-xl border border-zinc-900 p-4 space-y-3 font-semibold text-xs text-zinc-300">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <span className="text-zinc-500">Prospects traités :</span>
                <span className="text-white font-mono">4 prospects</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <span className="text-zinc-500">Marge d'action gratuite restante :</span>
                <span className="text-red-400 font-mono">1 contact gratuit</span>
              </div>

              <div className="p-3 bg-[#E10600]/5 border border-red-950/50 rounded-lg text-left space-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-950 px-1 text-[7px] font-mono text-red-400 uppercase border-l border-b border-red-900/40">PROJECTION</div>
                <p className="text-[10px] text-zinc-500">Estimation d'activité ce mois-ci :</p>
                <p className="text-xs text-white">
                  <strong>+17 prospects supplémentaires</strong> à récolter. Débloquez la suite avec le forfait Starter de Fiko.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed font-mono">
              La valeur capturée sur un seul prospect de votre quota restant paiera typiquement l'équivalent de 12 mois de licence Starter.
            </p>
          </div>

          <div className="space-y-2.5 mt-5">
            <button 
              onClick={onUpgrade}
              className="w-full bg-[#E10600] text-white py-3.5 px-4 rounded-xl font-black text-xs tracking-wider uppercase hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(225,6,0,0.3)] animate-pulse"
            >
              Activer mon forfait illimité 🚀
            </button>
            <div className="flex justify-between items-center text-[10px] px-1 text-zinc-400 font-mono">
              <span>Sans engagement</span>
              <span>19 900 FCFA / mois</span>
            </div>
          </div>
        </div>

        {/* FIKO PRIME AGENT closing interaction area (ELEMENT 4 & CLOSING FLOW) */}
        <div className="lg:col-span-2 bg-[#0a0a0f] border border-gray-900 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-900/50 flex items-center justify-center text-purple-400 font-black">
                  🤖
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">
                    Fiko Prime Assistant <span className="w-1.5 h-1.5 bg-purple-500 rounded-full inline-block animate-ping"></span>
                  </h4>
                  <p className="text-[9px] text-zinc-500 font-mono">Closing direct et coaching de croissance</p>
                </div>
              </div>
              <span className="bg-purple-950/50 border border-purple-900/40 text-purple-400 text-[9px] font-mono px-2 py-0.5 rounded font-black">
                80% ALERTE QUOTA
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 bg-black/45 border border-zinc-900 rounded-2xl p-4 overflow-y-auto space-y-3 font-mono text-xs max-h-[180px] min-h-[140px]">
              {primeChat.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <span className="text-[8px] text-zinc-600 mb-0.5">{msg.sender === 'prime' ? 'Fiko Prime' : 'Vous'} • {msg.time}</span>
                  <div className={`p-3 rounded-2xl leading-normal text-[11px] ${msg.sender === 'user' ? 'bg-[#E10600] text-white rounded-tr-none' : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-white/5'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1 mr-auto text-zinc-600 text-xs italic pl-2 animate-pulse">
                  <span>Fiko Prime est en train d'écrire...</span>
                </div>
              )}
            </div>

            {/* Fast Choice Answers Form */}
            <div className="pt-3">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-2 font-mono">Actions / Réponses rapides :</p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handlePrimeOption("🚀 Oui, débloquer la licence illimitée Fiko Starter")}
                  className="bg-purple-950/80 border border-purple-900/50 hover:bg-purple-900 hover:text-white px-3 py-2 rounded-xl text-[10px] text-purple-300 font-black transition cursor-pointer"
                >
                  Débloquer le forfait illimité 🤝
                </button>
                <button 
                  onClick={() => handlePrimeOption("📈 Quel est le ROI sur 19 900 FCFA ?")}
                  className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 px-3 py-2 rounded-xl text-[10px] text-zinc-300 font-black transition cursor-pointer"
                >
                  Vérifier l'estimation de ROI 💵
                </button>
                <button 
                  onClick={() => handlePrimeOption("🛡️ Puis-je annuler de manière transparente ?")}
                  className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 px-3 py-2 rounded-xl text-[10px] text-zinc-300 font-black transition cursor-pointer"
                >
                  Garanties et Annulation 📑
                </button>
              </div>
            </div>

          </div>

          <div className="border-t border-zinc-900 mt-4 pt-3 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <span>Canal d'Intervention : Fiko Prime (SaaS Closer Engine v1)</span>
            <span className="text-[#25D366] font-bold">● Actif en ligne</span>
          </div>
        </div>

      </div>

    </div>
  );
}
