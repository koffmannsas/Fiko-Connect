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
export const RegisterPage = ({ onToggle }: { onToggle: () => void }) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-white mb-6">Créer un compte</h2>
        <InputField label="Nom" placeholder="Jean" />
        <InputField label="Prénom" placeholder="Doe" />
        <InputField label="WhatsApp (Numéro)" placeholder="+225..." />
        <InputField label="Mot de passe" type="password" placeholder="••••••••" />
        <InputField label="Confirmation mot de passe" type="password" placeholder="••••••••" />
        <button className="w-full bg-fiko-red text-white py-3 rounded-lg font-bold hover:bg-red-700 mt-4">CRÉER MON COMPTE</button>
        <p className="text-gray-400 text-center mt-4">Déjà inscrit ? <button onClick={onToggle} className="text-fiko-red font-semibold">Connexion</button></p>
    </motion.div>
);

// --- Sign In ---
export const LoginPage = ({ onToggle, onLogin }: { onToggle: () => void, onLogin: () => void }) => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-white mb-6">Connexion</h2>
        <InputField label="Numéro de téléphone" placeholder="+225..." />
        <InputField label="Mot de passe" type="password" placeholder="••••••••" />
        <div className="flex justify-end mb-4"><span className="text-fiko-red text-sm cursor-pointer">Mot de passe oublié ?</span></div>
        <button onClick={onLogin} className="w-full bg-fiko-red text-white py-3 rounded-lg font-bold hover:bg-red-700">CONNEXION</button>
        <p className="text-gray-400 text-center mt-4">Pas de compte ? <button onClick={onToggle} className="text-fiko-red font-semibold">Créer mon compte</button></p>
    </motion.div>
);
