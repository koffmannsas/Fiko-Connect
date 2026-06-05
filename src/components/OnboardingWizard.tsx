import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Sparkles, 
  TrendingUp, 
  Smartphone, 
  QrCode, 
  Facebook, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Bot, 
  Wand2, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  ArrowRight,
  Loader2, 
  MessageSquare,
  Building2,
  Lock,
  Zap,
  HelpCircle
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (onboardingData: any) => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState<'plan' | 'connect-mode' | 'qr-connect' | 'api-connect' | 'questions' | 'build-engine'>('plan');
  
  // Onboarding states
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'starter' | 'business' | 'scale' | 'elite'>('free');
  const [connectedNumber, setConnectedNumber] = useState<string>('');
  
  // Steps in questionnaire
  const [qStep, setQStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessType, setBusinessType] = useState<'products' | 'services' | 'both'>('products');
  const [workingHours, setWorkingHours] = useState<'24/7' | 'business' | 'custom'>('24/7');
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState<'Orange' | 'MTN' | 'Moov' | 'Wave'>('Wave');
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [fikoSkills, setFikoSkills] = useState({
    capture: true,
    followUp: true,
    estimates: true,
    payments: false
  });

  // Simulated system setup progress
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);

  // Simulated FB popup state
  const [facebookAuthStep, setFacebookAuthStep] = useState<number>(0);

  // Simulated QR generation delay
  const [qrLoaded, setQrLoaded] = useState(false);
  const [qrCodeScanned, setQrCodeScanned] = useState(false);

  useEffect(() => {
    if (step === 'qr-connect') {
      const timer = setTimeout(() => {
        setQrLoaded(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Handle fake scan simulation
  const simulateQRScan = () => {
    setQrCodeScanned(true);
    setConnectedNumber('+225 07 48 93 11 20');
    setTimeout(() => {
      setStep('questions');
    }, 2000);
  };

  // Simulating the Meta OAuth Steps
  const advanceFBAuth = () => {
    if (facebookAuthStep === 0) {
      setFacebookAuthStep(1);
    } else if (facebookAuthStep === 1) {
      setFacebookAuthStep(2);
    } else if (facebookAuthStep === 2) {
      setConnectedNumber('+225 05 92 84 77 15');
      setStep('questions');
    }
  };

  // Start building the AI sales agent
  const startFikoEngineBuild = () => {
    setStep('build-engine');
    const logs = [
      "⚡ Initialisation de l'instance Fiko Connect...",
      "🔍 Analyse de vos critères commerciaux : " + companyName,
      "🤖 Modélisation de l'Agent Commercial IA spécialisé...",
      "📝 Rédaction automatique des scripts de vente & base de connaissances...",
      "🔗 Configuration de l'API de paiement Mobile Money Orange/MTN/Wave...",
      "📈 Activation des règles de marketing comportemental J+1 & J+2...",
      "🚀 Enregistrement de l'assistant de vente 24h/24 en ligne..."
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setBuildLogs(prev => [...prev, logs[currentLogIndex]]);
        setBuildProgress(prev => Math.min(prev + 15, 100));
        currentLogIndex++;
      } else {
        setBuildProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          onComplete({
            companyName,
            businessType,
            businessCategory,
            workingHours,
            mobileMoneyProvider,
            mobileMoneyNumber,
            fikoSkills,
            selectedPlan,
            connectedNumber: connectedNumber || '+225 07 00 00 00 00'
          });
        }, 1500);
      }
    }, 1200);

    return () => clearInterval(interval);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 text-white">
      {/* HEADER SECTION */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-300 to-[#E10600] bg-clip-text text-transparent">
          Fiko Connect <span className="text-fiko-red">2.0</span>
        </h1>
        <p className="text-gray-400 mt-2 text-md md:text-lg">
          Connectez votre WhatsApp en 5 minutes et donnez un commercial IA intelligent à votre business.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: PLAN SELECTOR */}
        {step === 'plan' && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold">Sélectionnez le plan idéal pour votre entreprise</h2>
              <p className="text-gray-400 text-sm mt-1">Débloquez la puissance marketing et la relance automatique WhatsApp.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* ESSAI GRATUIT */}
              <div 
                onClick={() => setSelectedPlan('free')}
                className={`relative bg-[#0d0d0d] p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlan === 'free' ? 'border-emerald-500 bg-emerald-950/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded font-black uppercase">Essai 7J</span>
                    <span className="text-[#25D366] bg-emerald-500/10 p-1 rounded"><QrCode size={12} /></span>
                  </div>
                  <h3 className="text-xl font-black mb-1">ESSAI GRATUIT</h3>
                  <div className="text-2xl font-black text-emerald-400 mb-1">0 FCFA</div>
                  <p className="text-gray-400 text-[11px] mb-3 leading-tight">Découvrez la puissance de Fiko pendant 7 jours.</p>
                  
                  <div className="space-y-1.5 pt-3 border-t border-gray-900 text-[11px] text-gray-300">
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span>1 compte WhatsApp</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span>Réponses IA</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span className="text-emerald-400 font-bold">5 contacts max</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span>50 mess. IA max</span></div>
                  </div>
                </div>

                <div className="mt-4">
                  <button className={`w-full py-2 rounded-lg font-bold text-xs text-center transition ${
                    selectedPlan === 'free' ? 'bg-emerald-600 text-white font-black' : 'bg-gray-950 text-gray-400 hover:bg-gray-900'
                  }`}>Essayer 7J</button>
                </div>
              </div>

              {/* STARTER */}
              <div 
                onClick={() => setSelectedPlan('starter')}
                className={`relative bg-[#0d0d0d] p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlan === 'starter' ? 'border-[#E10600] bg-red-950/10 shadow-[0_0_15px_rgba(225,6,0,0.15)]' : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded font-black uppercase">Starter</span>
                    <span className="text-[#25D366] bg-green-500/10 p-1 rounded"><QrCode size={12} /></span>
                  </div>
                  <h3 className="text-xl font-black mb-1">STARTER</h3>
                  <div className="text-2xl font-black text-white mb-1">19 900 FCFA</div>
                  <p className="text-gray-400 text-[11px] mb-3 leading-tight">Votre premier commercial IA opérationnel.</p>
                  
                  <div className="space-y-1.5 pt-3 border-t border-gray-900 text-[11px] text-gray-300">
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span>1 compte WhatsApp</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span className="font-semibold text-white">Réponses IA</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span>Capture des leads</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span>Base connaissances</span></div>
                  </div>
                </div>

                <div className="mt-4">
                  <button className={`w-full py-2 rounded-lg font-bold text-xs text-center transition ${
                    selectedPlan === 'starter' ? 'bg-[#E10600] text-white font-black' : 'bg-gray-955 text-gray-400 hover:bg-gray-900'
                  }`}>Choisir Starter</button>
                </div>
              </div>

              {/* BUSINESS - POPULAR */}
              <div 
                onClick={() => setSelectedPlan('business')}
                className={`relative bg-[#090b16] p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlan === 'business' ? 'border-[#0084FF] bg-blue-950/10 shadow-[0_0_15px_rgba(0,132,255,0.2)]' : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[8px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full shadow-lg">
                  Populaire 🔥
                </div>
                
                <div className="mt-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-900/40 px-2 py-0.5 rounded font-black uppercase">Business</span>
                    <span className="text-blue-500 bg-blue-500/10 p-1 rounded"><Facebook size={12} /></span>
                  </div>
                  <h3 className="text-xl font-black mb-1">BUSINESS</h3>
                  <div className="text-2xl font-black text-blue-400 mb-1">49 900 FCFA</div>
                  <p className="text-gray-300 text-[11px] mb-3 leading-tight font-medium">Pour entreprises en pleine croissance.</p>
                  
                  <div className="space-y-1.5 pt-3 border-t border-gray-900 text-[11px] text-gray-300">
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span className="font-semibold text-white">3 comptes WA</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span className="text-green-400 font-bold">Relance J+1 & J+2</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span>Génération de devis</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span>Mobile Money Pay</span></div>
                  </div>
                </div>

                <div className="mt-4">
                  <button className={`w-full py-2 rounded-lg font-bold text-xs text-center transition ${
                    selectedPlan === 'business' ? 'bg-blue-600 text-white font-black' : 'bg-gray-955 text-gray-400 hover:bg-gray-900'
                  }`}>Choisir Business</button>
                </div>
              </div>

              {/* SCALE */}
              <div 
                onClick={() => setSelectedPlan('scale')}
                className={`relative bg-[#0d0d0d] p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlan === 'scale' ? 'border-[#8B5CF6] bg-purple-950/10 shadow-[0_0_15px_rgba(139,92,246,0.15)]' : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] bg-purple-950 text-purple-400 border border-purple-900 px-2 py-0.5 rounded font-black uppercase">Scale</span>
                    <span className="text-purple-500 bg-purple-500/10 p-1 rounded"><Building2 size={12} /></span>
                  </div>
                  <h3 className="text-xl font-black mb-1">SCALE</h3>
                  <div className="text-2xl font-black text-purple-400 mb-1">99 000 FCFA</div>
                  <p className="text-gray-400 text-[11px] mb-3 leading-tight">Pour équipes et ventes intensives.</p>
                  
                  <div className="space-y-1.5 pt-3 border-t border-gray-900 text-[11px] text-gray-300">
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span className="font-semibold text-white">10 comptes WA</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span>Multi-agents IA</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span>Gestion multi-user</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span className="font-bold text-purple-400">API Fiko Connect</span></div>
                  </div>
                </div>

                <div className="mt-4">
                  <button className={`w-full py-2 rounded-lg font-bold text-xs text-center transition ${
                    selectedPlan === 'scale' ? 'bg-purple-600 text-white font-black' : 'bg-gray-955 text-gray-400 hover:bg-gray-900'
                  }`}>Choisir Scale</button>
                </div>
              </div>

              {/* ELITE - RECOMMENDATION */}
              <div 
                onClick={() => setSelectedPlan('elite')}
                className={`relative bg-[#0d0905] p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlan === 'elite' ? 'border-[#F5C542] bg-amber-950/20 shadow-[0_0_20px_rgba(245,197,66,0.3)]' : 'border-amber-950/40 hover:border-amber-700'
                }`}
              >
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-[7px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full shadow-lg">
                  RECOMMANDÉ 👑
                </div>

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-900 px-2 py-0.5 rounded font-black uppercase">Elite</span>
                    <span className="text-amber-500 bg-amber-500/10 p-1 rounded animate-bounce"><Sparkles size={12} /></span>
                  </div>
                  <h3 className="text-xl font-black mb-1">ELITE</h3>
                  <div className="text-2xl font-black text-amber-400 mb-1">199 000 FCFA</div>
                  <p className="text-amber-300/80 text-[10px] mb-3 leading-tight font-bold">Un employé digital autonome 24h/24.</p>
                  
                  <div className="space-y-1.5 pt-3 border-t border-amber-950 text-[10px] text-gray-300">
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span className="font-semibold text-white">IA 100% personnalisée</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span>Fiko Brain dédié</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span className="text-amber-400 font-bold">PDF/Web imports</span></div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-[#25D366] shrink-0" /> <span>Consultant VIP</span></div>
                  </div>
                </div>

                <div className="mt-4">
                  <button className={`w-full py-2 rounded-lg font-bold text-xs text-center transition ${
                    selectedPlan === 'elite' ? 'bg-[#F5C542] text-black hover:bg-amber-400 font-black' : 'bg-gray-955 text-gray-400 hover:bg-gray-900'
                  }`}>Choisir Elite</button>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button 
                onClick={() => setStep('connect-mode')} 
                className="bg-fiko-red text-white text-lg font-bold px-10 py-4 rounded-xl hover:scale-[1.03] active:scale-95 transition flex items-center gap-3 shadow-lg shadow-red-900/20"
              >
                Suivant : Connecter mon WhatsApp <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: CONNECTION MODE CHOICE */}
        {step === 'connect-mode' && (
          <motion.div
            key="connect-mode"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto bg-[#0d0d0d] p-8 rounded-3xl border border-gray-800 space-y-6"
          >
            <div className="text-center">
              <span className="bg-red-950 border border-red-900 text-fiko-red font-bold text-xs uppercase px-3 py-1 rounded-full">Option de couplage</span>
              <h2 className="text-3xl font-extrabold mt-3">Choisissez votre méthode de connexion</h2>
              <p className="text-gray-400 text-sm mt-1">Sélectionnez le canal de synchronisation pour l'assistant intelligent.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Option A: Cloud API */}
              <div 
                onClick={() => setStep('api-connect')}
                className="bg-black/60 border border-gray-800 p-6 rounded-2xl hover:border-blue-500 cursor-pointer transition-all flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-blue-500 font-bold text-xs bg-blue-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                      <Facebook size={12} /> Cloud API Meta
                    </span>
                    <span className="text-blue-400 text-xs bg-gray-900 border border-gray-800 px-2 py-0.5 rounded font-extrabold uppercase">Officiel</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">WhatsApp Business Cloud API</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Connexion sécurisée officielle via Facebook Meta. Idéal pour un volume de messages illimité et une stabilité optimale. Recommandé pour le plan Business et Enterprise.
                  </p>
                </div>
                <div className="border-t border-gray-900/60 pt-4 mt-6 flex justify-between items-center text-xs text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Configurer l'authentification officielle</span> <ChevronRight size={16} />
                </div>
              </div>

              {/* Option B: QR Code Scan */}
              <div 
                onClick={() => setStep('qr-connect')}
                className="bg-black/60 border border-gray-800 p-6 rounded-2xl hover:border-green-500 cursor-pointer transition-all flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[#25D366] font-bold text-xs bg-green-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                      <QrCode size={12} /> QR Code Appareil
                    </span>
                    <span className="text-green-400 text-xs bg-gray-900 border border-gray-800 px-2 py-0.5 rounded font-extrabold uppercase">Express</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">Scanner un QR Code d'appareil</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Couplage express comme sur WhatsApp Web. Scannez un QR code depuis les "Appareils connectés" de votre téléphone personnel ou pro. Idéal pour commencer instantanément en moins d'une minute.
                  </p>
                </div>
                <div className="border-t border-gray-900/60 pt-4 mt-6 flex justify-between items-center text-xs text-green-400 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Générer le QR Code d'activation</span> <ChevronRight size={16} />
                </div>
              </div>
            </div>

            <div className="flex justify-start pt-4">
              <button onClick={() => setStep('plan')} className="flex items-center gap-2 text-gray-400 hover:text-white transition font-semibold">
                <ChevronLeft size={18} /> Retour aux plans
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3A: QR CONNECT SCAN */}
        {step === 'qr-connect' && (
          <motion.div
            key="qr-connect"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-2xl mx-auto bg-[#0d0d0d] p-8 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
              {/* QR instructions */}
              <div className="space-y-4 flex-1">
                <span className="bg-green-950 border border-green-900 text-[#25D366] font-bold text-xs uppercase px-3 py-1 rounded-full">Starter Quick Connect</span>
                <h2 className="text-2xl font-black">Scannez le code magique</h2>
                <ol className="space-y-3 text-sm text-gray-300">
                  <li className="flex gap-2 items-start">
                    <span className="font-extrabold text-[#25D366] bg-green-500/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Ouvrez <strong>WhatsApp</strong> de votre téléphone.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="font-extrabold text-[#25D366] bg-green-500/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Allez dans <strong>Réglages (Paramètres) ⚙</strong> ou <strong>Appareils connectés</strong>.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="font-extrabold text-[#25D366] bg-green-500/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Sélectionnez <strong>Connecter un appareil</strong>.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="font-extrabold text-[#25D366] bg-green-500/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <span>Orientez votre caméra vers le QR Code à droite.</span>
                  </li>
                </ol>

                <div className="pt-4 flex gap-2">
                  <button onClick={() => setStep('connect-mode')} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 transition text-xs font-bold">
                    <ChevronLeft size={16} /> Changer de méthode
                  </button>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="w-56 h-56 bg-black border border-gray-800 rounded-3xl p-4 flex flex-col justify-center items-center relative gap-2 group shadow-xl">
                {!qrLoaded ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 size={32} className="text-[#25D366] animate-spin" />
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Génération du code...</span>
                  </div>
                ) : qrCodeScanned ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <div className="w-12 h-12 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(37,211,102,0.4)] animate-bounce">
                      <Check size={24} className="text-green-400" />
                    </div>
                    <span className="text-sm font-bold text-white">Appareil Connecté !</span>
                    <span className="text-[10px] text-green-400">Initialisation de l'IA en cours...</span>
                  </motion.div>
                ) : (
                  <div className="relative cursor-pointer w-full h-full flex flex-col items-center justify-center" onClick={simulateQRScan}>
                    {/* Visual QR Simulator */}
                    <div className="w-40 h-40 bg-white p-2 rounded-xl relative shadow-md">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FikoConnectWhatsAppSetupTokenSimulation2026" 
                        alt="QR Code WhatsApp Setup"
                        className="w-full h-full opacity-90 transition-opacity"
                      />
                      <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_10px_#25D366] animate-[scan-sweep_2s_infinite]"></div>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-2 text-center select-none font-bold uppercase group-hover:text-[#25D366]">
                      [ Simuler le scan (clic) ]
                    </span>
                  </div>
                )}
              </div>
            </div>

            <style>{`
              @keyframes scan-sweep {
                0% { top: 0%; }
                50% { top: 100%; }
                100% { top: 0%; }
              }
            `}</style>
          </motion.div>
        )}

        {/* STEP 3B: OFFICIEL CLOUD API CONNECT */}
        {step === 'api-connect' && (
          <motion.div
            key="api-connect"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-xl mx-auto bg-[#0d0d0d] p-8 rounded-3xl border border-gray-800 shadow-2xl text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20 animate-pulse">
                <Facebook size={36} />
              </div>
            </div>

            <div className="space-y-2">
              <span className="bg-blue-950 border border-blue-900 text-blue-400 font-extrabold text-xs uppercase px-3 py-1 rounded-full">Meta Business integration</span>
              <h2 className="text-2xl font-black">Liaison de compte Meta Cloud API</h2>
              <p className="text-sm text-gray-400">
                Octroyez l'accès de messagerie à Fiko Connect de manière sécurisée sans stocker de clés personnelles ou de sessions mobiles. Stabilité 100% garantie par Meta.
              </p>
            </div>

            {facebookAuthStep === 0 && (
              <div className="pt-4">
                <button 
                  onClick={advanceFBAuth}
                  className="w-full bg-[#0084FF] text-white py-4 rounded-xl font-black flex items-center justify-center gap-3 hover:bg-blue-600 transition shadow-lg shadow-blue-500/10"
                >
                  <Facebook size={22} /> Se connecter avec Facebook
                </button>
                <button onClick={() => setStep('connect-mode')} className="text-gray-500 hover:text-gray-300 transition text-xs font-semibold mt-4 block mx-auto">
                  Choisir l'Option QR Code
                </button>
              </div>
            )}

            {facebookAuthStep === 1 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/40 p-5 rounded-2xl border border-blue-900/30 text-left space-y-4"
              >
                <div className="flex items-center gap-3 border-b border-gray-900 pb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">K</div>
                  <div>
                    <p className="font-bold text-sm">Koffmann Capital Group</p>
                    <p className="text-gray-500 text-[10px]">Compte Business lié</p>
                  </div>
                </div>
                <p className="text-xs text-gray-300 font-bold uppercase tracking-wider">Selectionnez votre numéro WhatsApp Business :</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 bg-gray-900 p-3 rounded-lg border border-blue-500/40 cursor-pointer">
                    <input type="radio" defaultChecked className="text-blue-500 focus:ring-0" />
                    <div>
                      <p className="text-sm font-bold text-white">+225 05 92 84 77 15</p>
                      <p className="text-[10px] text-gray-400">Service Clients Principal (Meta Verified)</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 bg-gray-950 p-3 rounded-lg border border-transparent opacity-50 cursor-not-allowed">
                    <input type="radio" disabled className="text-blue-500" />
                    <div>
                      <p className="text-sm font-bold text-gray-400">+225 07 48 93 11 20</p>
                      <p className="text-[10px] text-gray-500">Pas encore approuvé par Meta</p>
                    </div>
                  </label>
                </div>

                <button 
                  onClick={advanceFBAuth}
                  className="w-full bg-[#25D366] text-black font-extrabold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-green-400 transition"
                >
                  <CheckCircle2 size={18} /> Associer ce numéro
                </button>
              </motion.div>
            )}

            <div className="text-xs text-gray-500 flex justify-center items-center gap-2 pt-2">
              <Lock size={12} /> Vos données et clés de messagerie sont entièrement protégées.
            </div>
          </motion.div>
        )}

        {/* STEP 4: ONBOARDING ASSISTANT QUESTIONNAIRE */}
        {step === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="max-w-xl mx-auto bg-[#0d0d0d] p-8 rounded-3xl border border-gray-800 shadow-2xl space-y-6"
          >
            {/* Steps indicator */}
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="font-bold text-[#E10600] uppercase tracking-wider">Configuration de l'IA</span>
              <span className="font-mono bg-gray-900 px-3 py-1 rounded-full border border-gray-800 text-gray-400">Étape {qStep} / 5</span>
            </div>

            {/* Step circles */}
            <div className="flex gap-1.5 h-1.5 bg-gray-900 rounded-full overflow-hidden">
              <div className={`h-full bg-fiko-red transition-all duration-300`} style={{ width: `${(qStep / 5) * 100}%` }}></div>
            </div>

            {/* Questionnaire parts */}
            <AnimatePresence mode="wait">
              {qStep === 1 && (
                <motion.div
                  key="q1"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-4 pt-2"
                >
                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-white flex items-center gap-2">Bonjour 👋</h3>
                    <p className="text-sm text-gray-400">Je vais configurer votre assistant commercial automatisé.</p>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quel est le nom de votre entreprise ?</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Koffmann Capital Group, Krypton Store..." 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-black/60 border border-gray-800 rounded-xl p-4 text-white focus:border-fiko-red focus:outline-none transition-all placeholder:text-gray-600 text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quel est votre secteur d'activité / niche ?</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Prêt-à-porter, Immobilier, Cosmétiques, Électronique" 
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full bg-black/60 border border-gray-800 rounded-xl p-4 text-white focus:border-fiko-red focus:outline-none transition-all placeholder:text-gray-600 text-md"
                    />
                  </div>
                </motion.div>
              )}

              {qStep === 2 && (
                <motion.div
                  key="q2"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-4 pt-2"
                >
                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-white">Que vendez-vous principalement ?</h3>
                    <p className="text-sm text-gray-400">Cela permet d'aiguiller notre IA sur les réponses et scénarios.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    <div 
                      onClick={() => setBusinessType('products')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                        businessType === 'products' ? 'border-fiko-red bg-red-950/10' : 'border-gray-800 bg-black/40 hover:border-gray-700'
                      }`}
                    >
                      <span className="text-2xl">📦</span>
                      <div className="text-left">
                        <p className="font-bold text-sm text-white">Produits physiques</p>
                        <p className="text-xs text-gray-500">Prêt-à-porter, vivres, marchandises, etc.</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setBusinessType('services')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                        businessType === 'services' ? 'border-fiko-red bg-red-950/10' : 'border-gray-800 bg-black/40 hover:border-gray-700'
                      }`}
                    >
                      <span className="text-2xl">🛠️</span>
                      <div className="text-left">
                        <p className="font-bold text-sm text-white">Services & Formations</p>
                        <p className="text-xs text-gray-500">Consultation, coaching, cours, prestations de service.</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setBusinessType('both')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                        businessType === 'both' ? 'border-fiko-red bg-red-950/10' : 'border-gray-800 bg-black/40 hover:border-gray-700'
                      }`}
                    >
                      <span className="text-2xl">🔄</span>
                      <div className="text-left">
                        <p className="font-bold text-sm text-white">Les deux (Hybride)</p>
                        <p className="text-xs text-gray-500">Produits combinés à des abonnements ou services.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {qStep === 3 && (
                <motion.div
                  key="q3"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-4 pt-2"
                >
                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-white">Quels sont vos horaires de vente ?</h3>
                    <p className="text-sm text-gray-400">Fiko peut relayer ou automatiser les messages même en dehors.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    <div 
                      onClick={() => setWorkingHours('24/7')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                        workingHours === '24/7' ? 'border-fiko-red bg-red-950/10' : 'border-gray-800 bg-black/40 hover:border-gray-700'
                      }`}
                    >
                      <Clock size={20} className="text-[#25D366]" />
                      <div className="text-left">
                        <p className="font-bold text-sm text-white">24h / 24 & 7j / 7</p>
                        <p className="text-xs text-gray-500">L'IA de Fiko prend le relais à tout instant de la journée.</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setWorkingHours('business')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                        workingHours === 'business' ? 'border-fiko-red bg-red-950/10' : 'border-gray-800 bg-black/40 hover:border-gray-700'
                      }`}
                    >
                      <Clock size={20} className="text-blue-400" />
                      <div className="text-left">
                        <p className="font-bold text-sm text-white">Heures de bureau classiques</p>
                        <p className="text-xs text-gray-500">Lun-Ven 8h-18h. L'IA se déclenche surtout la nuit.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {qStep === 4 && (
                <motion.div
                  key="q4"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-4 pt-2"
                >
                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-white">Quel est votre numéro Mobile Money ?</h3>
                    <p className="text-sm text-gray-400">Pour l'encaissement automatique des commandes de vos clients en Côte d'Ivoire.</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Opérateur préféré</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Wave', 'Orange', 'MTN', 'Moov'].map((provider) => (
                        <div 
                          key={provider}
                          onClick={() => setMobileMoneyProvider(provider as any)}
                          className={`p-3 rounded-lg border text-center font-bold text-sm cursor-pointer select-none transition-all ${
                            mobileMoneyProvider === provider 
                              ? 'border-[#E10600] text-white bg-red-950/20' 
                              : 'border-gray-800 bg-[#111] hover:border-gray-700 text-gray-400'
                          }`}
                        >
                          {provider}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Numéro de téléphone lié</label>
                      <input 
                        type="text" 
                        placeholder="Ex: +225 07 48 93 11 20" 
                        value={mobileMoneyNumber}
                        onChange={(e) => setMobileMoneyNumber(e.target.value)}
                        className="w-full bg-black/60 border border-gray-800 rounded-xl p-4 text-white focus:border-fiko-red focus:outline-none transition-all placeholder:text-gray-600 text-lg"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {qStep === 5 && (
                <motion.div
                  key="q5"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-4 pt-2"
                >
                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-white">Activer les super-pouvoirs de Fiko</h3>
                    <p className="text-sm text-gray-400">Choisissez les automations que Fiko doit opérer de manière autonome.</p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-800 bg-black/40 hover:border-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={fikoSkills.capture} 
                        onChange={(e) => setFikoSkills(prev => ({...prev, capture: e.target.checked}))}
                        className="text-fiko-red bg-[#111] border-gray-800 rounded focus:ring-fiko-red"
                      />
                      <div className="text-left">
                        <p className="text-sm font-bold">Qualification & Capture de Leads en continu</p>
                        <p className="text-[11px] text-gray-500">Fiko capture automatiquement l'identité, les besoins et le numéro des prospects.</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-800 bg-black/40 hover:border-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={fikoSkills.followUp} 
                        onChange={(e) => setFikoSkills(prev => ({...prev, followUp: e.target.checked}))}
                        className="text-fiko-red bg-[#111] border-gray-800 rounded focus:ring-fiko-red"
                      />
                      <div className="text-left">
                        <p className="text-sm font-bold">Relance automatique J+1 & J+2</p>
                        <p className="text-[11px] text-gray-500 font-medium text-green-400">Relance intelligente pour les paniers abandonnés ou demandes non répondues.</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-800 bg-black/40 hover:border-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={fikoSkills.estimates} 
                        onChange={(e) => setFikoSkills(prev => ({...prev, estimates: e.target.checked}))}
                        className="text-fiko-red bg-[#111] border-gray-800 rounded focus:ring-fiko-red"
                      />
                      <div className="text-left">
                        <p className="text-sm font-bold">Édition & Envoi automatique de Devis (IA)</p>
                        <p className="text-[11px] text-gray-500">L'IA génère et partage des proformas au format WhatsApp esthétique.</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-800 bg-black/40 hover:border-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={fikoSkills.payments} 
                        onChange={(e) => setFikoSkills(prev => ({...prev, payments: e.target.checked}))}
                        className="text-fiko-red bg-[#111] border-gray-800 rounded focus:ring-fiko-red"
                      />
                      <div className="text-left">
                        <p className="text-sm font-bold text-amber-400">Paiement Mobile Money direct</p>
                        <p className="text-[11px] text-gray-500">Demander des codes OTP Wave/Orange/MTN pour encaissement immédiat.</p>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav controls */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-900/60">
              <button 
                onClick={() => {
                  if (qStep === 1) {
                    setStep('connect-mode');
                  } else {
                    setQStep(q => q - 1);
                  }
                }}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition text-xs font-bold"
              >
                <ChevronLeft size={16} /> Précédent
              </button>

              <button 
                onClick={() => {
                  if (qStep === 5) {
                    // Start builder loader
                    startFikoEngineBuild();
                  } else {
                    setQStep(q => q + 1);
                  }
                }}
                disabled={qStep === 1 && !companyName}
                className="bg-[#E10600] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                {qStep === 5 ? (
                  <>Initialiser l'IA <Wand2 size={16} /></>
                ) : (
                  <>Continuer <ChevronRight size={16} /></>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 5: REAL-TIME FIKO ONE CLICK BUILDER LOADER */}
        {step === 'build-engine' && (
          <motion.div
            key="build-engine"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto bg-black border border-gray-900 p-8 rounded-3xl shadow-[0_0_50px_rgba(225,6,0,0.1)] relative"
          >
            <div className="absolute top-0 right-10 w-24 h-24 bg-[#E10600]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="text-center space-y-4 mb-8">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-20 h-20 bg-red-950/20 rounded-full border border-red-900/40 flex items-center justify-center">
                  <Bot size={36} className="text-[#E10600] animate-pulse" />
                </div>
                {/* Spinning loader outer ring */}
                <span className="absolute w-24 h-24 border-2 border-[#E10600] border-t-transparent rounded-full animate-spin"></span>
              </div>
              
              <div className="space-y-1">
                <h2 className="text-3xl font-black">FIKO ONE CLICK ENGINE</h2>
                <p className="text-sm text-[#E10600] font-bold uppercase tracking-wider animate-pulse">Déploiement et auto-configuration de votre assistant...</p>
              </div>
            </div>

            {/* Builder console output */}
            <div className="bg-[#050505] p-5 rounded-2xl border border-gray-900 font-mono text-xs text-green-400 space-y-3 min-h-[160px] max-h-[220px] overflow-y-auto shadow-inner text-left">
              <div className="text-gray-500 select-none">// FIKO BUILD CONSOLE OUTPUT v2026.06.04</div>
              {buildLogs.map((log, index) => (
                <p key={index} className="leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
                  ⚡ [SYSTEM] {log}
                </p>
              ))}
              <div className="h-1 animate-pulse px-2 bg-green-500/20 w-fit rounded py-0.5 text-[10px] uppercase font-bold text-green-300 mt-2">
                Compilateur Actif
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-gray-500 font-bold">
                <span>CONSTRUCTION DES BASES IA</span>
                <span>{buildProgress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-green-500 transition-all duration-300" style={{ width: `${buildProgress}%` }}></div>
              </div>
            </div>

            <div className="text-center mt-6 text-xs text-gray-500">
              Génération automatique du script, du profil de vente et de la base de connaissances active.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
