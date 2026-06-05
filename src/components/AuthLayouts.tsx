import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';

// --- Splash Screen ---
export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-black"
    >
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-6xl font-bold text-white tracking-tighter"
      >
        Fiko<span className="text-fiko-red">.</span>
      </motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-gray-500 mt-4 text-xl"
      >
        WhatsApp Business Engine
      </motion.p>
    </motion.div>
  );
};

// --- Input Component ---
const InputField = ({ label, type = "text", ...props }: any) => {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    
    return (
        <div className="space-y-2 mb-4">
            <label className="text-gray-400 text-sm font-semibold">{label}</label>
            <div className="relative">
                <input 
                    type={isPassword ? (show ? "text" : "password") : type} 
                    className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-white focus:border-fiko-red focus:outline-none"
                    {...props}
                />
                {isPassword && (
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-gray-500">
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
};

// --- Sign Up ---
export const RegisterPage = ({ onToggle, onRegisterSuccess }: { onToggle: () => void, onRegisterSuccess: () => void }) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-white mb-6">Créer un compte</h2>
        <InputField label="Nom" placeholder="Jean" />
        <InputField label="Prénom" placeholder="Doe" />
        <InputField label="WhatsApp (Numéro)" placeholder="+225..." />
        <InputField label="Mot de passe" type="password" placeholder="••••••••" />
        <InputField label="Confirmation mot de passe" type="password" placeholder="••••••••" />
        <button onClick={onRegisterSuccess} className="w-full bg-fiko-red text-white py-3 rounded-lg font-bold hover:bg-red-700 mt-4">CRÉER MON COMPTE</button>
        <p className="text-gray-400 text-center mt-4">Déjà inscrit ? <button onClick={onToggle} className="text-fiko-red font-semibold">Connexion</button></p>
    </motion.div>
);

// --- Sign In ---
export const LoginPage = ({ onToggle, onLogin }: { onToggle: () => void, onLogin: (userData?: any) => void }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    
    if (!identifier.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);

    try {
      const emailLower = identifier.trim().toLowerCase();
      // Check for Meta Review bypass
      if (emailLower === 'review@krypton-ia.tech' && password === 'MetaReview2026!') {
        try {
          const { signInWithEmailAndPassword } = await import('firebase/auth');
          const { auth } = await import('../lib/firebase');
          await signInWithEmailAndPassword(auth, emailLower, password);
          console.log("Firebase Auth signed in for Meta Review Team.");
        } catch (authErr) {
          console.warn("Firebase Auth client bypass active (running offline / sandbox context):", authErr);
        }

        // Return Elite pre-configured meta reviewer session
        onLogin({
          companyName: 'Meta Review Environment',
          businessType: 'technology',
          businessCategory: 'SaaS Platform Review',
          workingHours: '24/7',
          mobileMoneyProvider: 'Wave',
          mobileMoneyNumber: '+225 07 48 93 11 20',
          selectedPlan: 'elite',
          reviewMode: true,
          connectedNumber: '+225 05 92 84 77 15'
        });
        return;
      }

      // Normal phone or other email logic
      onLogin();
    } catch (err: any) {
      setError(err.message || "Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-8 max-w-md w-full bg-[#0a0a0c] border border-gray-900 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Connexion</h2>
        <p className="text-xs text-gray-400 mb-6 font-sans">Accédez à votre cockpit Fiko OS</p>
        
        {error && (
          <div className="bg-red-950/40 border border-red-900/60 text-fiko-red p-3 rounded-lg text-xs font-semibold mb-4 leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <InputField 
            label="Numéro de téléphone ou Email" 
            placeholder="review@krypton-ia.tech ou +225..." 
            value={identifier}
            onChange={(e: any) => setIdentifier(e.target.value)}
          />
          <InputField 
            label="Mot de passe" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />

          <div className="flex justify-between items-center text-xs mb-4">
            <button 
              type="button" 
              onClick={() => {
                setIdentifier('review@krypton-ia.tech');
                setPassword('MetaReview2026!');
              }}
              className="text-[#25D366] hover:text-emerald-400 font-extrabold underline cursor-pointer hover:no-underline flex items-center gap-1"
            >
              ⚡ Remplir Compte Revue Meta
            </button>
            <span className="text-fiko-red cursor-pointer hover:underline">Mot de passe oublié ?</span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-fiko-red text-white py-3 rounded-lg font-black tracking-wider uppercase hover:bg-red-700 transition active:scale-98 disabled:opacity-50 cursor-pointer text-xs"
          >
            {loading ? "Connexion..." : "CONNEXION"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-xs">
          Pas de compte ?{' '}
          <button onClick={onToggle} className="text-fiko-red font-semibold hover:underline">
            Créer mon compte
          </button>
        </p>
    </motion.div>
  );
};
