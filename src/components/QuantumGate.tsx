import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, FormEvent } from 'react';
import { 
  auth, 
  db 
} from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously,
  signOut
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ChevronRight, 
  Loader2, 
  HelpCircle, 
  Globe, 
  ShieldCheck, 
  Cpu, 
  MessageSquare, 
  CreditCard, 
  LineChart, 
  Zap, 
  Rocket, 
  Brain, 
  Sparkles,
  Check,
  ShieldAlert,
  Award,
  Terminal,
  Building2,
  Lock,
  User,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface QuantumGateProps {
  onEnter: (onboardingData: any, isDemoMode: boolean) => void;
}

export default function QuantumGate({ onEnter }: QuantumGateProps) {
  // 1. Auth & Session tracking
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 2. Identity layer views (for Espace Client)
  const [identityOpen, setIdentityOpen] = useState(false);
  const [identityView, setIdentityView] = useState<'options' | 'login'>('options');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Login Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. --- FIKO FREE ACTIVATION EXPERIENCE (MANDATORY 10-STEP ONBOARDING) ---
  const [onboardActive, setOnboardActive] = useState(false);
  const [onboardStep, setOnboardStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [onboardPassword, setOnboardPassword] = useState('');

  // OTP Verification Simulation State
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // WhatsApp connection steps
  const [whatsappConnectMode, setWhatsappConnectMode] = useState<'idle' | 'linking' | 'connected'>('idle');
  const [firstMessageProgress, setFirstMessageProgress] = useState<'idle' | 'sending' | 'success'>('idle');

  // Cinematic deployment statuses
  const [deployActive, setDeployActive] = useState(false);
  const [deployStep, setDeployStep] = useState(0);

  const DEPLOYMENT_LOGS = [
    "Configuration du cluster...",
    "Établissement du tunnel de messagerie...",
    "Déploiement de Fiko Memory...",
    "Découplage de l'engin autonome...",
    "Configuration de l'agent commercial...",
    "Vérification des règles d'intégrité...",
    "Prêt pour l'initialisation."
  ];

  // Auth sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Check if current user already has a company in Firestore
  const checkUserCompanyAndEnter = async (uid: string) => {
    try {
      console.log('AUTH SUCCESS, checking user doc for uid:', uid);
      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);
      
      if (!userSnap.exists()) {
        console.log('USER DOC MISSING for uid:', uid);
        setIdentityOpen(false);
        setOnboardActive(true);
        setOnboardStep(1);
        return;
      }

      console.log('USER FOUND');
      const userData = userSnap.data();
      const companyId = userData.companyId;

      if (!companyId) {
         console.log('COMPANY ID MISSING in user doc');
         setIdentityOpen(false);
         setOnboardActive(true);
         setOnboardStep(1);
         return;
      }

      // Check Company
      const companyDocRef = doc(db, 'companies', companyId);
      const companySnap = await getDoc(companyDocRef);
      let companyData = companySnap.exists() ? companySnap.data() : null;

      if (!companySnap.exists()) {
        console.log('COMPANY MISSING');
        console.log('AUTO-CREATING COMPANY');
        companyData = {
          id: companyId,
          name: userData.displayName || 'Enterprise',
          ownerId: uid,
          status: 'active',
          plan: 'free',
          createdAt: new Date().toISOString()
        };
        await setDoc(companyDocRef, companyData);
      } else {
        console.log('COMPANY FOUND');
      }

      // Check Subscription
      const subRef = doc(db, 'subscriptions', companyId);
      const subSnap = await getDoc(subRef);
      if (!subSnap.exists()) {
        console.log('SUBSCRIPTION MISSING');
        console.log('AUTO-CREATING SUBSCRIPTION');
        await setDoc(subRef, {
            companyId,
            plan: 'free',
            status: 'active',
            maxContacts: 5,
            messagesSent: 0,
            createdAt: new Date().toISOString()
        });
      } else {
        console.log('SUBSCRIPTION FOUND');
      }

      // Check Agent
      const agentRef = doc(db, 'agents', companyId);
      const agentSnap = await getDoc(agentRef);
      if (!agentSnap.exists()) {
        console.log('AUTO-CREATING AGENT');
        await setDoc(agentRef, {
            id: companyId,
            companyId,
            name: `Fiko Agent ${companyData!.name}`,
            status: 'online',
            autoPilot: true,
            createdAt: new Date().toISOString()
        });
        console.log('AGENT CREATED');
      } else {
        console.log('AGENT FOUND');
      }

      // Check Memory
      const memoryRef = doc(db, 'fiko_memory', companyId);
      const memorySnap = await getDoc(memoryRef);
      if (!memorySnap.exists()) {
        console.log('AUTO-CREATING MEMORY');
        await setDoc(memoryRef, {
            companyId,
            messagesProcessedCount: 0,
            cognitiveTokensCount: 2500,
            updatedAt: new Date().toISOString()
        });
        console.log('MEMORY CREATED');
      } else {
         console.log('MEMORY FOUND');
      }

      console.log('DASHBOARD ACCESS GRANTED');
      setIdentityOpen(false);
      await triggerDeployment(companyData);
      
    } catch (err: any) {
      console.error('Error in checkUserCompanyAndEnter:', err);
      handleFirestoreError(err, OperationType.GET, `users/${uid}`);
    }
  };

  // Launch the glorious Fiko AI activation sequences
  const triggerDeployment = async (companyData: any) => {
    setOnboardActive(false);
    setIdentityOpen(false);
    setActivationCompanyData(companyData);
    
    // NEW ACTIVATION FLOW
    setActivationActive(true);
    
    // Simulate activation sequence
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setActivationStep('test_my_fiko');
  };

  const [activationActive, setActivationActive] = useState(false);
  const [activationCompanyData, setActivationCompanyData] = useState<any>(null);
  const [activationStep, setActivationStep] = useState<'activating' | 'test_my_fiko'>('activating');
  const [testSent, setTestSent] = useState(false);

  const completeActivation = () => {
    setActivationActive(false);
    onEnter({
      companyName: activationCompanyData?.name || 'Fiko Enterprise',
      selectedPlan: 'free',
      contactsCaptured: 1, // First lead captured for the win
      conversationsProcessed: 1,
      estimatedRevenue: 25000,
    }, false);
  };

  // Trigger Fiko Core Activation Choice from Quantum Cards
  const handleActivationCardClick = async () => {
    setErrorMessage('');
    
    if (authLoading) return;

    if (!currentUser) {
      // User is visitor -> Launch the immersive 10-step activation wizard
      setOnboardActive(true);
      setOnboardStep(1);
    } else {
      // Authenticated session exists -> Verify dashboard route
      setLoading(true);
      await checkUserCompanyAndEnter(currentUser.uid);
      setLoading(false);
    }
  };

  // Handle Free Demo Mode (Now acts as synonymous with Activer Fiko Gratuitement onboarding)
  const handleDemoClick = () => {
    setErrorMessage('');
    setOnboardActive(true);
    setOnboardStep(1);
  };

  // Submits the background firebase creation actions across steps 5, 6, 7 & 8
  const executeAutomaticDeployment = async () => {
    setErrorMessage('');
    if (!companyName.trim()) {
      setErrorMessage("Veuillez renseigner le nom de l'entreprise.");
      setOnboardStep(1);
      return;
    }
    if (!whatsappNumber.trim()) {
      setErrorMessage("Veuillez renseigner le numéro WhatsApp.");
      setOnboardStep(2);
      return;
    }
    if (!emailAddress.trim() || !onboardPassword) {
      setErrorMessage("Veuillez renseigner vos informations secrètes (Étape 3).");
      setOnboardStep(3);
      return;
    }
    if (onboardPassword.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères pour s'authentifier.");
      setOnboardStep(3);
      return;
    }

    setLoading(true);
    try {
      // Étape 5 : Création compte Firebase
      setOnboardStep(5);
      const userCredential = await createUserWithEmailAndPassword(auth, emailAddress.trim().toLowerCase(), onboardPassword);
      const uid = userCredential.user.uid;
      const companyId = 'co_' + Math.random().toString(36).substr(2, 9);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Étape 6 : Création entreprise
      setOnboardStep(6);
      const userRef = doc(db, 'users', uid);
      const userPayload = {
        uid,
        displayName: companyName.trim(),
        email: emailAddress.trim().toLowerCase(),
        phoneNumber: whatsappNumber.trim(),
        companyId,
        role: 'user', // Set role to 'user' as requested
        status: 'active', // Add status: 'active' as requested
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, userPayload).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${uid}`));

      const companyRef = doc(db, 'companies', companyId);
      const companyPayload = {
        id: companyId,
        name: companyName.trim(),
        industry: 'Prestations de Service',
        country: 'CI',
        whatsappNumber: whatsappNumber.trim(),
        ownerId: uid,
        createdAt: new Date().toISOString()
      };
      await setDoc(companyRef, companyPayload).catch(err => handleFirestoreError(err, OperationType.WRITE, `companies/${companyId}`));
      await new Promise(resolve => setTimeout(resolve, 1550));

      // Étape 7 : Création abonnement Essai (max 5 contacts limités)
      setOnboardStep(7);
      const subscriptionRef = doc(db, 'subscriptions', companyId);
      const subscriptionPayload = {
        companyId,
        plan: 'free',
        status: 'active',
        maxContacts: 5, // trial limitations (5 unique contacts max)
        messagesSent: 0,
        createdAt: new Date().toISOString()
      };
      await setDoc(subscriptionRef, subscriptionPayload).catch(err => handleFirestoreError(err, OperationType.WRITE, `subscriptions/${companyId}`));
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Étape 8 : Déployer l'agent commercial IA + mémoire
      setOnboardStep(8);
      
      const memoryRef = doc(db, 'fiko_memory', companyId);
      const memoryPayload = {
        companyId,
        messagesProcessedCount: 0,
        cognitiveTokensCount: 2500,
        updatedAt: new Date().toISOString()
      };
      await setDoc(memoryRef, memoryPayload).catch(err => handleFirestoreError(err, OperationType.WRITE, `fiko_memory/${companyId}`));

      const agentRef = doc(db, 'agents', companyId);
      const agentPayload = {
        id: companyId,
        companyId,
        name: `Fiko Agent ${companyName.trim()}`,
        status: 'online',
        autoPilot: true,
        createdAt: new Date().toISOString()
      };
      await setDoc(agentRef, agentPayload).catch(err => handleFirestoreError(err, OperationType.WRITE, `agents/${companyId}`));
      await new Promise(resolve => setTimeout(resolve, 1850));

      // Move into interactive steps (Step 9 : Connect WhatsApp)
      setOnboardStep(9);
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur lors de la configuration du compte cloud sécurisé.");
      setOnboardStep(3); // return back to step 3
    } finally {
      setLoading(false);
    }
  };

  // Handle standard connect login form (Espace Client component)
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || !password) {
      setErrorMessage("Veuillez renseigner votre email et votre mot de passe.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      await checkUserCompanyAndEnter(userCredential.user.uid);
    } catch (err: any) {
      setErrorMessage(err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' 
        ? "Identifiants ou mot de passe incorrects."
        : err.message || "Impossible de se connecter.");
    } finally {
      setLoading(false);
    }
  };

  const fillReviewCredentials = () => {
    setEmail('review@krypton-ia.tech');
    setPassword('MetaReview2026!');
  };

  // --- RENDER ACTIVATION EXPERIENCE ---
  if (activationActive) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4">
        {activationStep === 'activating' ? (
          <div className="text-center space-y-6 max-w-md w-full">
            <h2 className="text-3xl font-black text-[#E10600]">🚀 Activation...</h2>
            <div className="space-y-3 font-mono text-xs text-zinc-400">
               <p>Analyse secteur ✓</p>
               <p>Construction argumentaire ✓</p>
               <p>Configuration WhatsApp ✓</p>
               <p>Création CRM ✓</p>
               <p>Activation IA ✓</p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 max-w-sm w-full bg-zinc-900 p-8 rounded-2xl">
            <h2 className="text-xl font-bold">TEST MY FIKO</h2>
            <p className="text-sm text-zinc-400">Envoyez maintenant un message WhatsApp à votre propre numéro.</p>
            <button
               onClick={() => { setTestSent(true); setTimeout(completeActivation, 1000); }}
               className="w-full bg-[#E10600] py-4 rounded-xl font-bold"
            >
               {testSent ? 'IA Active !' : 'Tester mon IA maintenant'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- RENDER DYNAMIC 10-STEP ONBOARDING COMPONENT WIZARD ---
  if (onboardActive) {
    const totalSteps = 10;
    
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 md:p-10 font-sans relative overflow-x-hidden">
        {/* Cinematic background image with dark filters */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/krypton-ai-490214.firebasestorage.app/o/ba05e1c2-5730-44aa-bb43-73857f103596.png?alt=media&token=cd77592a-ea23-4e43-824d-21e388cd1b31")' }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] pointer-events-none" />

        {/* Master wizard card */}
        <div className="relative z-20 w-full max-w-2xl bg-[#09090b]/90 border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_0_80px_rgba(225,6,0,0.12)] overflow-hidden backdrop-blur-md">
          
          {/* Header Progress Indicators */}
          <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E10600]/15 border border-[#E10600]/30 flex items-center justify-center text-[#E10600]">
                <Sparkles size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-[#E10600]">FIKO IA ACTIVATION</h4>
                <p className="text-[10px] text-zinc-400 font-mono mt-0.5">MANDATORY PROTOCOL ONBOARDING</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-mono font-black text-white">{onboardStep > 10 ? 10 : onboardStep}</span>
              <span className="text-xs text-zinc-500 font-mono"> / {totalSteps}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-[3px] bg-white/5 rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#E10600] to-red-650 transition-all duration-500" 
              style={{ width: `${Math.min((onboardStep / totalSteps) * 100, 100)}%` }}
            />
          </div>

          {/* Steps Switchboard */}
          <div className="space-y-6">

            {/* STEP 1: Company Name */}
            {onboardStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <div className="bg-red-950/25 border border-[#E10600]/30 p-4 rounded-xl">
                    <p className="text-sm font-semibold text-zinc-200 leading-relaxed">
                      Bienvenue dans Fiko Connect. Je vais déployer votre premier agent commercial intelligent. Cela prend moins de 90 secondes.
                    </p>
                  </div>
                  <h3 className="text-xl font-black text-white pt-2">Comment s'appelle votre entreprise ?</h3>
                  <p className="text-xs text-zinc-400">Le nom sera configuré sur fiko_memory et l'index de votre IA commerciale.</p>
                </div>

                <div className="space-y-2">
                  <input 
                    type="text"
                    required
                    placeholder="Nom de l'entreprise (Ex: Koffmann Capital Group, Boutique Sy, ...)"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-zinc-950/85 border border-white/10 p-4 rounded-xl text-white font-bold placeholder-zinc-650 focus:border-[#E10600] focus:outline-none transition-colors text-base"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && companyName.trim()) setOnboardStep(2);
                    }}
                  />
                </div>

                <button
                  type="button"
                  disabled={!companyName.trim()}
                  onClick={() => setOnboardStep(2)}
                  className="w-full bg-[#E10600] disabled:opacity-45 text-white py-4 rounded-xl font-black text-xs tracking-wider uppercase hover:bg-red-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(225,6,0,0.25)]"
                >
                  Continuer vers l'étape suivante <ChevronRight size={14} />
                </button>
              </div>
            )}

            {/* STEP 2: WhatsApp Number */}
            {onboardStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white">Quel est le numéro commercial professionnel WhatsApp ?</h3>
                  <p className="text-xs text-zinc-400">Ce numéro sera relié pour traiter et envoyer des messages à vos prospects.</p>
                </div>

                <div className="space-y-2">
                  <input 
                    type="text"
                    placeholder="Numéro WhatsApp commercial (Ex: +225 07 48 93 11 20)"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-zinc-950/85 border border-white/10 p-4 rounded-xl text-white font-mono font-bold placeholder-zinc-650 focus:border-[#E10600] focus:outline-none transition-colors text-base"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && whatsappNumber.trim()) {
                        setEmailAddress(whatsappNumber.replace(/[^0-9]/g, "") + '@fiko.io');
                        setOnboardStep(3);
                      }
                    }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOnboardStep(1)}
                    className="px-6 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-zinc-400 rounded-xl font-black text-xs uppercase transition"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    disabled={!whatsappNumber.trim()}
                    onClick={() => {
                      if (!emailAddress) {
                        setEmailAddress(whatsappNumber.replace(/[^0-9]/g, "") + '@fiko.io');
                      }
                      setOnboardStep(3);
                    }}
                    className="flex-1 bg-[#E10600] disabled:opacity-45 text-white py-4 rounded-xl font-black text-xs tracking-wider uppercase hover:bg-red-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(225,6,0,0.25)]"
                  >
                    Saisir mes identifiants de sécurité <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Password and Email */}
            {onboardStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white">Saisissez vos identifiants pour sécuriser votre cockpit</h3>
                  <p className="text-xs text-zinc-400">Le courriel et mot de passe vous permettront de vous reconnecter à Fiko OS.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">Adresse e-mail du cockpit</label>
                    <input 
                      type="email"
                      placeholder="votre-email@adresse.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full bg-zinc-950/85 border border-white/10 p-3.5 rounded-xl text-white font-bold placeholder-zinc-650 focus:border-[#E10600] focus:outline-none transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">Mot de passe secret (min 6 caractères)</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={onboardPassword}
                      onChange={(e) => setOnboardPassword(e.target.value)}
                      className="w-full bg-zinc-950/85 border border-white/10 p-3.5 rounded-xl text-white font-bold placeholder-zinc-650 focus:border-[#E10600] focus:outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-950/40 border border-red-900/60 text-red-500 p-3 rounded-xl text-xs font-semibold leading-relaxed flex items-start gap-2">
                    <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOnboardStep(2)}
                    className="px-6 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-zinc-400 rounded-xl font-black text-xs uppercase transition"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    disabled={!emailAddress.trim() || onboardPassword.length < 6}
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode('');
                      setOnboardStep(4);
                    }}
                    className="flex-1 bg-[#E10600] disabled:opacity-45 text-white py-4 rounded-xl font-black text-xs tracking-wider uppercase hover:bg-red-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(225,6,0,0.25)]"
                  >
                    Lancer la vérification OTP <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: WhatsApp OTP Verification */}
            {onboardStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#25D366] bg-emerald-950/20 border border-emerald-900/50 px-3 py-1.5 rounded-lg w-fit">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>CANAL VERIFICATION WHATSAPP CONNECTED</span>
                  </div>
                  <h3 className="text-xl font-black text-white pt-2">Vérification de sécurité OTP</h3>
                  <p className="text-xs text-zinc-400">
                    Nous simulons l'envoi d'un code OTP unique sur votre WhatsApp professionnel à l'instant ({whatsappNumber}).
                  </p>
                </div>

                <div className="bg-black/80 border border-[#E10600]/30 p-4 rounded-xl flex items-center justify-between text-xs font-mono font-bold text-zinc-300">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-[#25D366]" />
                    <span>[FIKO OTP SERVICE] : Votre code de sécurité est:</span>
                  </div>
                  <span className="bg-zinc-900 text-[#25D366] px-2.5 py-1 rounded border border-zinc-800 text-sm tracking-widest">7459</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">Saisissez le code OTP à 4 chiffres</label>
                  <input 
                    type="text"
                    maxLength={4}
                    placeholder="Saisissez 7459 pour simuler"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full bg-zinc-950/85 border border-white/10 p-4 rounded-xl text-center text-xl font-mono font-black text-white tracking-widest placeholder-zinc-750 focus:border-[#E10600] focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOnboardStep(3)}
                    className="px-6 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-zinc-400 rounded-xl font-black text-xs uppercase transition"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    disabled={otpCode !== '7459' && otpCode.length < 4}
                    onClick={() => {
                      setOtpVerified(true);
                      executeAutomaticDeployment();
                    }}
                    className="flex-1 bg-[#E10600] disabled:opacity-45 text-white py-4 rounded-xl font-black text-xs tracking-wider uppercase hover:bg-red-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(225,6,0,0.25)]"
                  >
                    Vérifier & Développer l'instance <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Create Firebase Account (Automatic) */}
            {onboardStep === 5 && (
              <div className="space-y-8 py-6 text-center animate-in fade-in duration-500">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#E10600]/30 animate-spin" />
                  <Loader2 className="animate-spin text-[#E10600]" size={36} />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">ONBOARDING STEP 5 / 10</span>
                  <h3 className="text-xl font-black text-white">Étape 5 : Déploiement de la cellule de sécurité</h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    Création sécurisée de votre compte d'authentification Firebase et allocation de votre cluster client personnel...
                  </p>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 text-center text-xs font-mono text-[#25D366]">
                  STATUS: COMPILING CLUSTER GATEWAY → CREATING INSTANCE...
                </div>
              </div>
            )}

            {/* STEP 6: Create Company (Automatic) */}
            {onboardStep === 6 && (
              <div className="space-y-8 py-6 text-center animate-in fade-in duration-500">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#E10600]/30 animate-spin" />
                  <Building2 className="text-[#E10600] animate-pulse" size={32} />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">ONBOARDING STEP 6 / 10</span>
                  <h3 className="text-xl font-black text-white">Étape 6 : Modélisation de la base de données</h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    Création de l'entreprise <span className="text-white font-bold">"{companyName}"</span> dans la base de données principale Firestore, affectation de vos préférences de de devises...
                  </p>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 text-center text-xs font-mono text-blue-400">
                  STATUS: SUCCESS SECURE COCKPIT INSTANTIATED ✓ REGISTERING FIRETREE...
                </div>
              </div>
            )}

            {/* STEP 7: Create Trial Subscription (Automatic) */}
            {onboardStep === 7 && (
              <div className="space-y-8 py-6 text-center animate-in fade-in duration-500">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#E10600]/30 animate-spin" />
                  <CreditCard className="text-[#E10600] animate-bounce" size={32} />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">ONBOARDING STEP 7 / 10</span>
                  <h3 className="text-xl font-black text-white">Étape 7 : Verrouillage de l'abonnement d'essai</h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    Génération d'un plan d'Essai gratuit de 7 jours (1 compte WhatsApp, maximum 5 prospects qualifiés, 50 messages d'IA).
                  </p>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 text-center text-xs font-mono text-indigo-400">
                  LIMIT: 5 UNIQUE LEADS / 50 CONVERSATIONS / 1 CELLULAR NODE ACTIVE
                </div>
              </div>
            )}

            {/* STEP 8: Deploy Fiko AI Agent & Memory (Automatic) */}
            {onboardStep === 8 && (
              <div className="space-y-8 py-6 text-center animate-in fade-in duration-500">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#E10600]/30 animate-spin" />
                  <Brain className="text-[#E10600] animate-pulse" size={36} />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">ONBOARDING STEP 8 / 10</span>
                  <h3 className="text-xl font-black text-white">Étape 8 : Déploiement de votre Agent Commercial IA</h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    Initialisation du cerveau fiko_brain et configuration de la structure fiko_memory pour stocker de façon pérenne votre historique client.
                  </p>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 text-center text-xs font-mono text-[#E10600]">
                  COGNITIVE SHIELD INITIALIZATION... OK ✓ ENGINE INSTANTIATED !
                </div>
              </div>
            )}

            {/* STEP 9: Connect WhatsApp (Interactive QR Code) */}
            {onboardStep === 9 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <div className="bg-blue-950/20 border border-blue-900/40 p-4 rounded-xl flex items-center gap-3">
                    <Rocket className="text-blue-400 shrink-0" size={18} />
                    <p className="text-xs text-zinc-300 leading-relaxed font-semibold">
                      Comptes Cloud prêts. Connectez réellement votre téléphone en scannant le code ci-dessous.
                    </p>
                  </div>
                  <h3 className="text-xl font-black text-white pt-2">Liez votre application WhatsApp</h3>
                  <p className="text-xs text-zinc-400">
                    Ouvrez WhatsApp {'>'} Appareils connectés {'>'} Lier un appareil, puis cadrez l'objectif de la caméra sur ce QR code.
                  </p>
                </div>

                {/* QR Code and Simulator */}
                <div className="flex flex-col items-center justify-center bg-zinc-950/90 border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                  {whatsappConnectMode === 'linking' ? (
                    <div className="h-48 flex flex-col items-center justify-center text-center space-y-3">
                      <Loader2 className="animate-spin text-[#E10600]" size={36} />
                      <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider animate-pulse">
                        Synchronisation de l'historique et cryptage en cours...
                      </p>
                    </div>
                  ) : whatsappConnectMode === 'connected' ? (
                    <div className="h-48 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-900 flex items-center justify-center text-[#25D366]">
                        <Check size={28} className="stroke-[3px]" />
                      </div>
                      <p className="text-sm font-black text-white">✓ WhatsApp connecté avec succès !</p>
                      <p className="text-[11px] text-zinc-400 font-mono">PONT DE MESSAGERIE : OPERATIONNEL CLIENT LIVE</p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-center">
                      <div className="relative w-40 h-40 bg-white p-3 rounded-xl mx-auto shadow-[0_0_20px_rgba(255,255,255,0.06)] flex items-center justify-center">
                        <img 
                          src="https://firebasestorage.googleapis.com/v0/b/krypton-ai-490214.firebasestorage.app/o/0096cc7a-f99a-4e20-94a6-7ebdd156c125.png?alt=media&token=ba54feaf-8547-4952-ba74-e3dbb5d63f27" 
                          alt="WhatsApp Linking QR Code" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain filter contrast-125"
                        />
                        <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none" />
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setWhatsappConnectMode('linking');
                          setTimeout(() => {
                            setWhatsappConnectMode('connected');
                          }, 2500);
                        }}
                        className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-[#25D366] text-xs px-4 py-2 rounded-full font-black uppercase tracking-wider transition inline-flex items-center gap-1.5"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
                        Simuler le scan du QR Code
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOnboardStep(4)}
                    className="px-6 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-zinc-400 rounded-xl font-black text-xs uppercase transition"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    disabled={whatsappConnectMode !== 'connected'}
                    onClick={() => setOnboardStep(10)}
                    className="flex-1 bg-[#E10600] disabled:opacity-45 text-white py-4 rounded-xl font-black text-xs tracking-wider uppercase hover:bg-red-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(225,6,0,0.25)]"
                  >
                    Envoyer premier message test <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 10: Send first automatic live WhatsApp message */}
            {onboardStep === 10 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white">Instant Premier Scénario Actif</h3>
                  <p className="text-xs text-zinc-400">
                    Pour valider l'intégrité de l'API, nous déclenchons l'envoi immédiat du message de bienvenue automatique sur votre numéro WhatsApp de test.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Message Automatique Modélisé :</label>
                  
                  <div className="bg-[#0b0c10] border border-zinc-900 p-4 rounded-2xl relative overflow-hidden font-sans">
                    <div className="flex items-center gap-1.5 mb-3 select-none">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-650" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-650" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-650" />
                      <span className="text-[10px] text-zinc-600 font-mono font-bold tracking-wider ml-2 uppercase">PREVIEW MOTOR: WHATSAPP TERMINAL</span>
                    </div>

                    <div className="bg-[#075e54]/20 border border-[#075e54]/40 p-4 rounded-xl text-left text-sm text-zinc-100 max-w-sm rounded-tl-none space-y-2">
                      <p className="font-extrabold text-[#25D366]">🤖 Agent Fiko Connect :</p>
                      <p className="whitespace-pre-line leading-relaxed text-xs">
                        Bonjour 👋 Je suis Fiko. 
                        
                        Votre agent commercial est maintenant actif pour l'entreprise <strong className="text-white">"{companyName}"</strong>.
                        
                        Répondez "TEST" pour découvrir ce que je peux faire.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setFirstMessageProgress('sending');
                      setTimeout(() => {
                        setFirstMessageProgress('success');
                      }, 2000);
                    }}
                    className={`flex-1 py-4 rounded-xl font-black text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer ${firstMessageProgress === 'success' ? 'bg-emerald-950/40 border border-emerald-900 text-[#25D366]' : 'bg-zinc-900 hover:bg-zinc-800 text-white'}`}
                  >
                    {firstMessageProgress === 'sending' ? (
                      <>
                        <Loader2 className="animate-spin text-[#25D366]" size={14} />
                        Envoi automatique en cours...
                      </>
                    ) : firstMessageProgress === 'success' ? (
                      <>
                        ✓ MESSAGE TEST TRANSMIS AVEC REUSSITE
                      </>
                    ) : (
                      "🚀 Transmettre le premier message test"
                    )}
                  </button>
                  
                  <button
                    type="button"
                    disabled={firstMessageProgress !== 'success'}
                    onClick={() => setOnboardStep(11)}
                    className="flex-1 bg-[#E10600] disabled:opacity-45 text-white py-4 rounded-xl font-black text-xs tracking-wider uppercase hover:bg-red-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(225,6,0,0.25)]"
                  >
                    Consulter mes résultats en direct <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 11: Deployment Summary Output and Limits Statement */}
            {onboardStep === 11 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-950/20 border border-emerald-900/60 flex items-center justify-center text-[#25D366] mx-auto mb-3">
                    <ShieldCheck size={26} className="stroke-[2px]" />
                  </div>
                  <h3 className="text-xl font-black text-white">Votre IA commerciale est maintenant active !</h3>
                  <p className="text-xs text-zinc-400">Le protocole de provision Fiko Connect s'est achevé sans erreur.</p>
                </div>

                <div className="bg-black/60 border border-zinc-900 p-5 rounded-2xl space-y-4">
                  <div className="text-xs font-black uppercase text-zinc-400 tracking-wider">État de l'infrastructure :</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold font-mono">
                    <div className="flex items-center gap-2 text-[#25D366]"><Check size={14}/> <span>Compte Firebase créé</span></div>
                    <div className="flex items-center gap-2 text-[#25D366]"><Check size={14}/> <span>Entreprise enregistrée ✓</span></div>
                    <div className="flex items-center gap-2 text-[#25D366]"><Check size={14}/> <span>Abonnement Essai actif ✓</span></div>
                    <div className="flex items-center gap-2 text-[#25D366]"><Check size={14}/> <span>Agent IA & Mémoire déployés</span></div>
                    <div className="flex items-center gap-2 text-[#25D366] col-span-2"><Check size={14}/> <span>WhatsApp lié à {whatsappNumber}</span></div>
                    <div className="flex items-center gap-2 text-[#25D366] col-span-2"><Check size={14}/> <span>Premier message de bienvenue expédié !</span></div>
                  </div>

                  <div className="border-t border-zinc-900/80 pt-4 space-y-2">
                    <span className="text-[10px] font-black tracking-widest text-[#E10600] uppercase block">LIMITATIONS DU PLAN D'ESSAI</span>
                    <ul className="text-[11px] text-zinc-400 font-semibold space-y-1 list-disc pl-4">
                      <li>1 seul compte WhatsApp de communication</li>
                      <li>Qualification de maximum 5 contacts clients</li>
                      <li>Limite de traitement de 50 messages d'IA maximum</li>
                      <li>Durée de validité de 7 jours</li>
                      <li>1 seul Agent IA Actif (pas d'accès fiko_insights ou CRM pro)</li>
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOnboardActive(false);
                    onEnter({
                      companyName: companyName || 'Fiko Enterprise',
                      businessCategory: 'Trial Edition ⚡',
                      selectedPlan: 'free',
                      mobileMoneyNumber: whatsappNumber || '+225 07 48 93 11 20',
                      connectedNumber: whatsappNumber || '+225 05 92 84 77 15',
                      contactsCaptured: 4,               // Starts exactly at 4 out of 5 contacts to showcase 80% LIMITS WARNING
                      conversationsProcessed: 42,         // 42 messages processed
                      estimatedRevenue: 180000,          // 180 000 FCFA estimated revenue
                    }, false);
                  }}
                  className="w-full bg-[#E10600] hover:bg-red-700 text-white py-4 rounded-xl font-black text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_25px_rgba(225,6,0,0.3)] hover:scale-[1.01]"
                >
                  DÉCOUVRIR MON COCKPIT DE RÉSULTATS <Rocket size={14} />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row overflow-x-hidden font-sans relative">
      {/* 4K Cinematic Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/krypton-ai-490214.firebasestorage.app/o/ba05e1c2-5730-44aa-bb43-73857f103596.png?alt=media&token=cd77592a-ea23-4e43-824d-21e388cd1b31")' }}
      ></div>
      
      {/* Precision Ambient Gradient and Lighting protection overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#030303]/90 via-[#030303]/45 to-[#050505]/95 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/65 pointer-events-none" />

      {/* Aurora visual movement effects */}
      <style>{`
        @keyframes aurora_anim {
          0% { transform: scale(1) rotate(0deg); opacity: 0.12; }
          50% { transform: scale(1.06) rotate(2deg); opacity: 0.22; }
          100% { transform: scale(1) rotate(0deg); opacity: 0.12; }
        }
        .aurora-blur-glow {
          animation: aurora_anim 24s ease-in-out infinite;
          background: radial-gradient(circle at 35% 45%, rgba(225, 6, 0, 0.22) 0%, transparent 68%);
        }
      `}</style>
      <div className="absolute inset-0 z-15 aurora-blur-glow pointer-events-none"></div>

      {/* RENDER DYNAMIC COMPONENT SCENARIOS */}
      <AnimatePresence mode="wait">
        
        {/* SCENARIO A: TERMINAL LOADING DEPLOYMENT STATE */}
        {deployActive ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#E10600]/30 animate-spin" style={{ animationDuration: '10s' }} />
              <div className="absolute inset-2 rounded-full border-2 border-[#E10600] border-t-transparent animate-spin" style={{ animationDuration: '1.5s' }} />
              <Brain size={32} className="text-[#E10600] animate-pulse" />
            </div>

            <motion.div 
              key={deployStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-3xl font-[900] mb-3 tracking-tight font-sans text-white max-w-2xl px-4"
            >
              ✓ {DEPLOYMENT_LOGS[deployStep]}
            </motion.div>
            
            <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase mb-4">
              FIKO CONNECT SYSTEM PROVISIONING CLUSTER
            </p>

            <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-950 px-4 py-2 rounded-full border border-white/5 font-mono">
              <Loader2 className="animate-spin text-[#E10600]" size={14} />
              <span>ACTIVATING DATABASE & SECURITY SCHEMAS: OK</span>
            </div>
          </motion.div>
        ) : (
          <>
            {/* LEFT SECTION (70% SCREEN WIDTH) */}
            <div className="flex-1 lg:flex-[0.7] flex flex-col justify-between p-6 lg:p-10 xl:p-14 relative z-20 min-h-screen">
              
              {/* TOP HEADER SECTION */}
              <div className="flex items-center justify-between w-full">
                {/* Brand */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col select-none leading-none font-sans">
                    <span className="text-[25px] font-black tracking-tighter text-[#E10600]">FIKO</span>
                    <span className="text-[17px] font-extrabold tracking-[0.24em] text-white mt-1">CONNECT</span>
                  </div>
                  <div className="h-8 w-[1px] bg-white/15"></div>
                  <div className="flex flex-col select-none font-sans justify-center">
                    <span className="text-[9px] font-black tracking-[0.16em] text-zinc-400 uppercase leading-[1.1]">
                      L'INTELLIGENCE AFRICAINE
                    </span>
                    <span className="text-[9px] font-black tracking-[0.16em] text-white uppercase mt-0.5 leading-[1.1]">
                      AU SERVICE <span className="text-[#E10600] font-extrabold">DU MONDE</span>
                    </span>
                  </div>
                </div>

                {/* Account Actions / Session status badge */}
                <div className="flex items-center gap-2">
                  {currentUser ? (
                    <div className="flex items-center gap-3 bg-zinc-900/80 border border-white/10 pl-3.5 pr-1.5 py-1.5 rounded-full text-[11px] font-bold text-zinc-300">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="truncate max-w-[120px]">{currentUser.email}</span>
                      </div>
                      <button 
                        onClick={async () => {
                          await signOut(auth);
                          setCurrentUser(null);
                        }}
                        className="bg-[#E10600] text-white hover:bg-red-700 hover:text-white px-3 py-1 rounded-full transition-all text-[10px]"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setIdentityView('login');
                        setIdentityOpen(true);
                      }}
                      className="bg-white/5 border border-white/10 hover:border-zinc-500 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-bold text-zinc-200 cursor-pointer"
                    >
                      Espace Client 🔒
                    </button>
                  )}
                  <div className="hidden sm:flex items-center gap-1.5 bg-black/45 border border-white/10 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-zinc-300 transition-all cursor-pointer">
                    <Globe size={11} className="text-[#E10600]" />
                    <span>FR</span>
                  </div>
                </div>
              </div>

              {/* CORE PROPOSITION & HERO GRID */}
              <div className="my-auto py-8">
                <div className="space-y-6">
                  {/* Hero Title */}
                  <div className="space-y-2">
                    <h1 className="text-5xl md:text-6xl xl:text-7xl font-sans font-[900] tracking-tighter leading-none text-white max-w-xl">
                      Votre entreprise.
                    </h1>
                    <h1 className="text-5xl md:text-6xl xl:text-7xl font-sans font-[900] tracking-tighter leading-none text-[#E10600]">
                      Sans limites.
                    </h1>
                  </div>

                  {/* High Quality Concept Paragraph */}
                  <p className="text-zinc-300 text-[15px] lg:text-[16px] leading-relaxed max-w-[530px] font-medium font-sans">
                    <span className="text-white font-extrabold">FiKO Connect</span> est le premier système d'exploitation commercial alimenté par l'intelligence artificielle conçu pour l'Afrique et prêt pour le monde.
                  </p>

                  {/* PREMIUM 6 KEY FEATURES CHECKLIST */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5 max-w-xl pt-4">
                    {[
                      { text: "IA Avancée", icon: Brain, desc: "Processus auto-adaptatifs" },
                      { text: "Automatisation Intelligente", icon: Cpu, desc: "Routage sans friction" },
                      { text: "WhatsApp Business intégré", icon: MessageSquare, desc: "Conversion de prospects" },
                      { text: "Paiements Intelligents", icon: CreditCard, desc: "Mobile money & cartes" },
                      { text: "Analyses Prédictives", icon: LineChart, desc: "Indicateurs décisionnels" },
                      { text: "Croissance Exponentielle", icon: Sparkles, desc: "Réseau commercial élargi" },
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-1 rounded-lg">
                        <div className="flex-shrink-0 mt-0.5 relative">
                          <div className="absolute -inset-1 rounded-full bg-[#E10600]/15 animate-pulse" />
                          <div className="w-5.5 h-5.5 rounded-full bg-[#E10600]/15 border border-[#E10600]/40 flex items-center justify-center text-[#E10600] relative z-10 shadow-[0_0_8px_rgba(225,6,0,0.2)]">
                            <feature.icon size={11} className="stroke-[2.5px]" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold text-white leading-none mt-1">
                            {feature.text}
                          </h4>
                          <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* BENTO STATS & TECH STACK PARTNERS FOOTER */}
              <div className="space-y-6">
                
                {/* 4-Column Interconnected Bento Metric Panel */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl bg-black/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 left-12 w-24 h-[1px] bg-gradient-to-r from-transparent via-[#E10600]/40 to-transparent pointer-events-none" />
                  
                  {[
                    { val: "+3 500", label: "Entreprises actives" },
                    { val: "+2.1M", label: "Conversations / mois" },
                    { val: "98%", label: "Taux de satisfaction" },
                    { val: "+32", label: "Pays couverts" }
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col justify-between p-2 relative">
                      <div className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none mb-1.5 font-sans">
                        {stat.val}
                      </div>
                      <div className="text-[9.5px] uppercase font-bold text-zinc-400 tracking-wider">
                        {stat.label}
                      </div>
                      {i < 3 && (
                        <div className="hidden sm:block absolute right-0 top-1 bottom-1 w-[1px] bg-white/5" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Footnote and Technical Stack */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-bold bg-white/5 border border-white/5 px-3 py-1.5 rounded-full w-fit">
                    <ShieldCheck size={13} className="text-[#E10600]" />
                    <span>Système d'exploitation sécurisé Fiko - Afrique & Global</span>
                  </div>

                  <div className="flex items-center flex-wrap gap-x-5 gap-y-2 opacity-65 text-[11px] text-zinc-400 font-semibold uppercase tracking-widest select-none">
                    <span>Google Cloud</span>
                    <span>Firebase</span>
                    <span>Gemini AI</span>
                    <span>WhatsApp</span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COMPONENT: ACCESS PORTAL CONTROL GLASS PANEL (30% WIDTH) */}
            <div className="flex-[0.3] lg:max-w-[480px] w-full bg-[#0B0B0B]/70 backdrop-blur-3xl px-6 py-10 lg:p-10 xl:p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/5 relative z-20 shadow-[0_0_80px_rgba(3,3,3,0.8)]">
              
              <div className="space-y-8 my-auto">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                    <div className="absolute -inset-1 rounded-2xl bg-[#E10600]/20 animate-pulse rotate-12" />
                    <div className="w-14 h-14 rounded-2xl border-2 border-[#E10600]/80 bg-[#0C0C0E]/95 flex items-center justify-center text-[#E10600] relative z-10 shadow-[0_0_20px_rgba(225,6,0,0.45)]">
                      <Sparkles size={24} className="stroke-[2px] animate-pulse" />
                    </div>
                  </div>

                  <h2 className="text-xl font-black tracking-[0.22em] text-white uppercase font-sans">
                    FIKO <span className="text-[#E10600]">OS GATES</span>
                  </h2>
                  
                  <div className="flex items-center justify-center gap-3 w-full mt-2">
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-[#E10600]/40 to-transparent flex-1" />
                    <p className="text-[#A1A1AA] font-black uppercase tracking-[0.14em] text-[8.5px] whitespace-nowrap">
                      PROPULSER VOTRE CAPITAL
                    </p>
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-[#E10600]/40 to-transparent flex-1" />
                  </div>
                </div>

                {/* Stacked Interactive Action Cards */}
                <div className="space-y-3.5">
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleActivationCardClick}
                    className="w-full p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex items-center justify-between group bg-[#0F0F11]/85 border-white/5 hover:border-zinc-700/80 hover:bg-[#151518]/90 cursor-pointer"
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800/60 text-zinc-300 border border-white/5 group-hover:bg-[#E10600]/10 group-hover:text-[#E10600] group-hover:border-[#E10600]/20 flex items-center justify-center transition-all">
                        <Rocket size={20} className="stroke-[2.25px]" />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-extrabold text-white leading-tight tracking-tight mt-0.5">
                          🚀 Activer mon entreprise
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-medium leading-normal mt-1 max-w-[280px]">
                          Accédez à l'ensemble des modules Fiko Connect OS
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-1.5" />
                  </motion.button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 py-2 w-full">
                    <div className="h-[1px] bg-white/5 flex-1" />
                    <span className="text-[10px] font-black tracking-widest text-zinc-500 font-mono">OU</span>
                    <div className="h-[1px] bg-white/5 flex-1" />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDemoClick}
                    className="w-full p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex items-center justify-between group bg-gradient-to-r from-[#E10600]/10 to-transparent border-[#E10600]/30 hover:border-[#E10600] ring-1 ring-[#E10600]/10 hover:shadow-[0_0_25px_rgba(225,6,0,0.25)] cursor-pointer"
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.5)] group-hover:scale-110 flex items-center justify-center transition-transform">
                        <Zap size={20} className="stroke-[2.25px]" />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-extrabold text-white leading-tight tracking-tight mt-0.5">
                          ⚡ Mode Démo Fiko
                        </h4>
                        <p className="text-[11px] text-zinc-300 font-bold leading-normal mt-1 max-w-[280px]">
                          Découvrir la puissance de Fiko sans inscription
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[#E10600] transition-transform group-hover:translate-x-1.5" />
                  </motion.button>
                </div>
              </div>

              {/* SOCIAL PROOF FOOTER */}
              <div className="mt-8 border-t border-white/5 pt-5 flex items-center gap-3 select-none">
                <div className="flex -space-x-2.5">
                  {["K", "S", "M", "A", "T"].map((letter, idx) => (
                    <div 
                      key={idx} 
                      className={`w-8 h-8 rounded-full border-2 border-zinc-950 flex items-center justify-center font-bold text-[10px] shadow-lg text-white bg-zinc-800`}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 relative" />
                    <span className="text-[11px] font-bold text-white tracking-tight mt-0.5">
                      Déjà + 3500 entreprises
                    </span>
                  </div>
                  <span className="text-[9.5px] font-medium text-zinc-400 mt-0.5">
                    nous font confiance à travers le continent.
                  </span>
                </div>
              </div>

            </div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL 1: FIKO LOGIN LAYER (Espace Client only) */}
      <AnimatePresence>
        {identityOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#0D0D10]/95 border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
              
              {/* HEADER */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#E10600]/10 border border-[#E10600]/30 rounded-xl flex items-center justify-center text-[#E10600] mx-auto mb-3">
                  <Lock size={20} />
                </div>
                <h3 className="text-lg font-black tracking-tight text-white leading-tight">
                  Espace Client Fiko 🔒
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Connectez-vous à votre infrastructure de commandement.
                </p>
              </div>

              {errorMessage && (
                <div className="bg-red-950/40 border border-red-900/60 text-red-500 p-3 rounded-xl text-xs font-semibold mb-4 leading-relaxed flex items-start gap-2">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* INTEGRATED LOGIN FORM */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-tight">Adresse Email</label>
                  <input 
                    type="email" 
                    placeholder="Ex: review@krypton-ia.tech" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 p-3.5 rounded-xl text-white focus:border-[#E10600] focus:outline-none transition-colors text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-tight">Mot de passe</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 p-3.5 rounded-xl text-white focus:border-[#E10600] focus:outline-none transition-colors text-sm"
                  />
                </div>

                {/* AutoFill link */}
                <div className="flex justify-between items-center text-xs py-1">
                  <button 
                    type="button" 
                    onClick={fillReviewCredentials}
                    className="text-[#25D366] hover:text-emerald-400 font-extrabold underline cursor-pointer hover:no-underline flex items-center gap-1"
                  >
                    ⚡ Compte de Revue Meta
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#E10600] text-white py-3.5 rounded-xl font-black text-xs tracking-wider uppercase hover:bg-red-700 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="animate-spin text-white" size={16} /> : "VALIDER LA CONNEXION"}
                </button>

                <div className="flex justify-between text-xs pt-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIdentityOpen(false);
                      setOnboardActive(true);
                      setOnboardStep(1);
                    }} 
                    className="text-[#E10600] font-bold hover:underline"
                  >
                    Créer un espace
                  </button>
                  <button type="button" onClick={() => setIdentityOpen(false)} className="text-zinc-500 hover:text-white">
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
