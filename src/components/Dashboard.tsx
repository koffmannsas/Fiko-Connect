import React, { useState, useEffect, FormEvent } from 'react';
import SaaSGrowthEngine from './SaaSGrowthEngine';
import { 
  AlertTriangle, 
  Target, 
  Trophy, 
  Wallet, 
  Zap, 
  TrendingUp, 
  Flame, 
  CheckCircle, 
  MessageSquareText, 
  Activity, 
  BarChart3, 
  ArrowRight, 
  Upload, 
  FileText, 
  Globe, 
  Gift, 
  Sparkles, 
  Bot, 
  PhoneCall, 
  Server, 
  Plus, 
  Check,
  ChevronRight,
  RefreshCw,
  Send,
  ShieldCheck,
  Download,
  Layers,
  MapPin,
  Search,
  Calendar,
  FileCheck,
  Coins,
  BookOpen,
  AlertCircle,
  FileSpreadsheet,
  Users,
  Handshake,
  Award,
  GraduationCap
} from 'lucide-react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const graphData = [
  { name: 'Lun', sales: 420000, leads: 12 },
  { name: 'Mar', sales: 580000, leads: 18 },
  { name: 'Mer', sales: 720000, leads: 24 },
  { name: 'Jeu', sales: 640000, leads: 15 },
  { name: 'Ven', sales: 910000, leads: 29 },
  { name: 'Sam', sales: 1250000, leads: 38 },
  { name: 'Dim', sales: 1850000, leads: 47 },
];

const playbookData = {
  ecommerce: {
    objections: [
      { q: "C'est trop cher pour mon petit commerce, je préfère faire les ventes manuellement.", r: "Fiko montre que répondre manuellement fait perdre 45% de clients le soir. Fiko Starter coûte 660 FCFA/jour et capture 10x plus de paniers oubliés." },
      { q: "Je ne fais confiance qu'aux paiements directs par Wave à la livraison.", r: "Fiko sécurise l'intention d'achat en envoyant un lien direct de paiement ou l'option acompte Wave pré-remplie, réduisant les faux bonds de livraison de 80%." }
    ],
    scripts: [
      "🛒 'Bonjour {Prénom}, j'ai bien réservé votre Pack. Préfériez-vous un règlement direct par Wave ou Orange Money pour expédier votre colis dès ce soir ?'",
      "🔥 'Vente Flash: Plus que 3 exemplaires disponibles. Cliquez pour valider votre commande par Wave en 1 clic: {Lien}'"
    ],
    times: "Dimanche soir (18h - 22h) & Mercredi midi.",
    conversion: "18.5% à 24.2%"
  },
  immo: {
    objections: [
      { q: "Les acheteurs de villas de luxe veulent parler à un vrai agent humain.", r: "L'IA de Fiko n'essaie pas de signer la vente finale : elle qualifie la solvabilité, collecte le budget exact, envoie la fiche technique PDF sous 2 secondes, et bloque immédiatement une heure de visite." },
      { q: "Les prospects oublient souvent les heures de visite planifiées.", r: "Fiko envoie des relances automatisées pleines d'humour et de courtoisie à J-1 et H-2, éliminant les rendez-vous manqués." }
    ],
    scripts: [
      "🏢 'Bonjour ! La villa F4 à la Riviera 3 est très convoitée. J'ai deux créneaux de visite libres : Jeudi à 10h ou Samedi à 14h. Lequel vous convient le mieux ?'",
      "🔑 'Fiko Immobilier : Votre dossier de budget de {Budget} FCFA a été pré-qualifié. Notre agent humain prend la suite.'"
    ],
    times: "Samedi matin (8h - 11h) & Mardi après-midi.",
    conversion: "12.0% à 15.5%"
  },
  assur: {
    objections: [
      { q: "Les devis maladie sont impossibles à tarifer par chatbot simple.", r: "Fiko utilise fiko_memory et fiko_brain pour poser les 4 questions cruciales (âge, nombre d'enfants, antécédents, budget max). Le devis indicatif s'établit en temps réel." },
      { q: "La réglementation ivoirienne exige une documentation signée.", r: "L'IA guide le client pour capturer sa pièce d'identité en photo et génère un pré-contrat officiel." }
    ],
    scripts: [
      "🛡️ 'Bonjour ! Pour valider la simulation de votre couverture Santé Famille, pourriez-vous m'indiquer l'âge des bénéficiaires directs ?'",
      "📄 'Voici votre pré-devis personnalisé de {Montant} FCFA rédigé par notre agent conseil. Cliquez pour approuver.'"
    ],
    times: "Mardi & Jeudi (9h - 12h).",
    conversion: "7.8% à 11.2%"
  },
  formation: {
    objections: [
      { q: "Les étudiants s'inscrivent mais ne paient jamais la formation en ligne.", r: "Fiko applique des barrières de paiement à l'entrée par micro-acompte Wave direct de 5 000 FCFA pour verrouiller l'inscription." },
      { q: "Les gens s'excluent car ils manquent de temps ou de motivation.", r: "Fiko envoie des sessions exclusives sous forme d'audios Wolof/Nouchi de 3 minutes et de fiches mémo rapides pour stimuler l'apprentissage." }
    ],
    scripts: [
      "🎓 'Félicitations pour votre inscription ! Pour réserver votre place dans l'académie KCG, réglez votre acompte de 5 000 FCFA ici: {Lien}'",
      "💡 'Rappel : La session d'initiation au closing commence ce soir à 19h Abidjan. Êtes-vous prêt ?'"
    ],
    times: "Lundi matin (7h - 9h) & Mercredi soir (19h - 21h).",
    conversion: "14.0% à 20.1%"
  },
  resto: {
    objections: [
      { q: "Les clients appellent directement pour commander, le chatbot ralentit.", r: "Fiko répond en 0.5s avec le menu dynamique, calcule la facture avec livraison incluse (Yopougon, Marcory, Plateau) et génère le lien Wave direct." },
      { q: "La gestion des allergènes et des options de cuisson est délicate.", r: "L'IA pose poliment des questions de précision (Cuisson bien cuite ? Sans piment ?) et transmet les notes précises en cuisine." }
    ],
    scripts: [
      "🍔 'Bonjour ! Nos grillades de poulet braisé sont de sortie aujourd'hui ! Livraison Cocody en 30 min. Je vous envoie notre menu de midi ?'",
      "🛵 'Fiko Resto : Votre livreur de Chawarma est en route. Suivez votre commande ou payez par Wave ici: {Lien}'"
    ],
    times: "De 11h - 13h30 & de 18h30 - 21h30.",
    conversion: "25.0% à 32.5%"
  }
};

interface DashboardProps {
  onboardingData?: any;
  onUpgrade?: () => void;
}

export default function Dashboard({ onboardingData, onUpgrade }: DashboardProps) {
  const [pulse, setPulse] = useState(true);
  const [activeTab, setActiveTab] = useState<'command' | 'closer' | 'memory' | 'reports' | 'roadmap' | 'marketplace' | 'investor' | 'network' | 'partners'>('command');

  const [roleFilter, setRoleFilter] = useState<'pme' | 'pro' | 'investor'>('pro');
  const [selectedPartnerCategory, setSelectedPartnerCategory] = useState<'all' | 'integrateur' | 'agency' | 'expert_crm' | 'expert_ia'>('all');
  const [partnerReferralAmount, setPartnerReferralAmount] = useState(150000);
  const [showInvitePartnerModal, setShowInvitePartnerModal] = useState(false);
  const [partnerFilterQuery, setPartnerFilterQuery] = useState('');

  // Fiko Certification & University states
  const [certType, setCertType] = useState<'expert' | 'agency' | 'trainer'>('expert');
  const [certificationExamStatus, setCertificationExamStatus] = useState<'idle' | 'taking' | 'passed' | 'failed'>('idle');
  const [examStep, setExamStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [examScore, setExamScore] = useState(0);
  
  const [academyTab, setAcademyTab] = useState<'courses' | 'classroom'>('courses');
  const [activeCourseId, setActiveCourseId] = useState<string>('wa_sales');
  const [viewingLessonIdx, setViewingLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Record<string, number[]>>({
    'wa_sales': [0]
  });

  const [activePartnerDetailIndex, setActivePartnerDetailIndex] = useState<number | null>(null);

  const [opportunities, setOpportunities] = useState([
    { id: 1, client: "Marie Cosmétiques (CIV)", need: "Besoin de copywriting pour relance flash v2", sector: "E-Commerce", revenue: 45000, matchedPartner: "Fatou Diatta (Growth Marketer)", status: "Match sémantique suggéré ✓" },
    { id: 2, client: "SCI Abidjan Invest (CIV)", need: "Fiche technique PDF de 15 villas de prestige à assembler", sector: "Immobilier", revenue: 120000, matchedPartner: "Kamara Digital Agence", status: "En attente d'approbation" },
    { id: 3, client: "Coaching Academy West (SN)", need: "Système de barrière de micro-acompte Wave automatisé", sector: "Formation", revenue: 70000, matchedPartner: "Yao Koffi (Consultant Certifié)", status: "Prise de contact initiée ✓" }
  ]);

  // Dashboard Live Stats (react to simulated operations)
  const [revenueToday, setRevenueToday] = useState(3250000);
  const [leadsToday, setLeadsToday] = useState(127);
  const [paymentsToday, setPaymentsToday] = useState(89);
  const [activeIAs, setActiveIAs] = useState(14);
  const [roiPercentage, setRoiPercentage] = useState(4809);

  // Strategic Maturity Audit Scores (Interactive)
  const [maturityScores, setMaturityScores] = useState({
    acquisition: 9.0,
    onboarding: 10.0,
    whatsappIa: 9.0,
    crm: 8.5,
    paiement: 8.5,
    reporting: 9.0,
    expansion: 8.0,
    monetisation: 9.0,
    fidelisation: 8.5
  });

  const calculatedMaturityAverage = parseFloat(
    ((maturityScores.acquisition + 
      maturityScores.onboarding + 
      maturityScores.whatsappIa + 
      maturityScores.crm + 
      maturityScores.paiement + 
      maturityScores.reporting + 
      maturityScores.expansion + 
      maturityScores.monetisation + 
      maturityScores.fidelisation) / 9).toFixed(2)
  );

  // Projections Financières State
  const [projectedClientsCount, setProjectedClientsCount] = useState(100);

  // Fiko Board & Executive Strategy States
  const [boardCac, setBoardCac] = useState(15000); // FCFA per client CAC
  const [boardNps, setBoardNps] = useState(78); // NPS Score
  const [boardChurn, setBoardChurn] = useState(2.4); // Churn Rate %
  const [fikoInsightsAddonPercent, setFikoInsightsAddonPercent] = useState(30); // 30% of clients buy Fiko Insights
  const [boardNrr, setBoardNrr] = useState(108); // Net Revenue Retention %
  const [ruleOf40Growth, setRuleOf40Growth] = useState(48); // Annual Growth Rate %
  const [ruleOf40Ebitda, setRuleOf40Ebitda] = useState(20); // EBITDA Margin %
  const [selectedPlaybookSector, setSelectedPlaybookSector] = useState<'immo' | 'assur' | 'resto' | 'formation' | 'ecommerce'>('ecommerce');
  const [launchOnboardProgress, setLaunchOnboardProgress] = useState(38); // 38 of 50 clients onboarded
  const [reactivationLogs, setReactivationLogs] = useState<string[]>([]);
  const [reactivatorRunning, setReactivatorRunning] = useState(false);

  // Cohort-specific Health Scores
  const [healthScores, setHealthScores] = useState({
    ecommerce: 88,
    immo: 85,
    formation: 72,
    assur: 32, // starts below 40 to highlight automatic reactive warning
    resto: 91
  });

  // Fiko Revenue AI state
  const [revenueAiState, setRevenueAiState] = useState<'idle' | 'running' | 'success'>('idle');
  const [revenueConsoleLogs, setRevenueConsoleLogs] = useState<string[]>([]);
  const [potentialRecovered, setPotentialRecovered] = useState(850000);

  // Fiko Autonomous Closer state
  const [closerTarget, setCloserTarget] = useState<'fatou' | 'alassane' | 'amina'>('fatou');
  const [closerStep, setCloserStep] = useState(0);
  const [closerLogs, setCloserLogs] = useState<Array<{ sender: 'buyer' | 'ai'; text: string; systemTag?: string }>>([]);
  const [closerStatus, setCloserStatus] = useState<'idle' | 'running' | 'completed'>('idle');

  // Business Memory Queries
  const [memorySearch, setMemorySearch] = useState('');
  const [memoryAnswer, setMemoryAnswer] = useState<string | null>(null);

  // Memory Database Simulation
  const clientHistory = [
    { name: 'Koffi Yao (Cocody)', lastOrder: 'Il y a 8 mois (Pack Luxe - 45 000 FCFA)', timesAsked: 4, preference: 'Livraison le samedi matin' },
    { name: 'Awa Diallo (Plateau)', lastOrder: 'Aucun (En négociation)', timesAsked: 3, preference: 'Intérêt répété pour le pack de cosmétiques' },
    { name: 'Marie Koné (Abidjan)', lastOrder: 'Aujourd\'hui (Pack Gold - 99 000 FCFA)', timesAsked: 8, preference: 'Préfère régler par Wave et Orange Money' }
  ];

  // Executive PDF Reports state
  const [selectedReportType, setSelectedReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);

  // Multi-Country Domination State
  const [selectedCountry, setSelectedCountry] = useState<'CI' | 'SN' | 'CM' | 'BJ' | 'TG'>('CI');

  // Multi-Country localization details
  const countryConfig = {
    CI: { name: 'Côte d’Ivoire', flag: '🇨🇮', currency: 'FCFA (XOF)', tax: '18%', code: '+225', providers: ['Wave CIV', 'Orange Money CIV', 'MTN MoMo CIV', 'Moov Flooz'] },
    SN: { name: 'Sénégal', flag: '🇸🇳', currency: 'FCFA (XOF)', tax: '18%', code: '+221', providers: ['Wave Senegal', 'Orange Money SN', 'Free Money', 'Expresso'] },
    CM: { name: 'Cameroun', flag: '🇨🇲', currency: 'FCFA (XAF)', tax: '19.25%', code: '+237', providers: ['MTN MoMo Cameroun', 'Orange Money CM'] },
    BJ: { name: 'Bénin', flag: '🇧🇯', currency: 'FCFA (XOF)', tax: '18%', code: '+229', providers: ['MTN Benin', 'Moov Money BJ', 'Celtiis Pay'] },
    TG: { name: 'Togo', flag: '🇹🇬', currency: 'FCFA (XOF)', tax: '18%', code: '+228', providers: ['T-Money Togo', 'Moov Flooz Togo'] },
  };

  // Original states preserved
  const [scoreActions, setScoreActions] = useState({ mobMoney: false, website: false, catalog: false });
  const baseScore = 72;
  const currentFikoScore = baseScore + (scoreActions.mobMoney ? 12 : 0) + (scoreActions.website ? 8 : 0) + (scoreActions.catalog ? 5 : 0);

  const [brainFiles, setBrainFiles] = useState([
    { name: 'Scénarios de vente IA v2.pdf', size: '1.8 MB', status: 'active' as const },
    { name: 'Grille_Tarifs_Livraison_CIV.xlsx', size: '750 KB', status: 'active' as const },
    { name: 'Faq_Fiko_Reponses_Auto_Base.txt', size: '24 KB', status: 'active' as const }
  ]);
  const [newUrl, setNewUrl] = useState('');
  const [indexingSystem, setIndexingSystem] = useState(false);
  const [knowledgePointCount, setKnowledgePointCount] = useState(2457);

  const [installedAgentIds, setInstalledAgentIds] = useState<string[]>(['mode']);
  const agents = [
    { id: 'mode', name: 'Agent Boutique Mode', icon: '👗', desc: 'Optimisé pour le prêt-à-porter, tailles et coloris.' },
    { id: 'resto', name: 'Agent Resto & Lounge', icon: '🍔', desc: 'Gestion du menu, prise de commande, réservations.' },
    { id: 'immo', name: 'Agent Immobilier CIV', icon: '🏢', desc: 'Capture de budget, fiches de visites de villas/terrains.' },
    { id: 'assur', name: 'Agent Conseil Assurances', icon: '🛡️', desc: 'Qualification des besoins maladie, auto et habitation.' },
    { id: 'finance', name: 'Agent Micro-Invest', icon: '📈', desc: 'Évaluation des projets et simulation de crédits.' },
    { id: 'formation', name: 'Agent Coach Academy', icon: '🎓', desc: 'Prise de contact, partage de planning de formation.' }
  ];

  const [copiedReferral, setCopiedReferral] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1200);
    return () => clearInterval(interval);
  }, []);

  // SIMULATE: Fiko Revenue AI Follow-ups
  const triggerRevenueAiRelance = () => {
    if (revenueAiState !== 'idle') return;
    setRevenueAiState('running');
    setRevenueConsoleLogs(['[Fiko ROS] Analyse des logs des dernières 24 heures...']);
    
    setTimeout(() => {
      setRevenueConsoleLogs(prev => [...prev, '[Fiko ROS] Identifier 7 prospects inactifs à forte intention de conversion']);
    }, 500);

    setTimeout(() => {
      setRevenueConsoleLogs(prev => [...prev, '[WhatsApp API] Formulation des pitchs personnalisés basés sur fiko_memory']);
    }, 1000);

    setTimeout(() => {
      setRevenueConsoleLogs(prev => [...prev, '⚡ Envoi d\'une relance à Marie Koné (+225 07 48...) -> Convaincue!']);
    }, 1500);

    setTimeout(() => {
      setRevenueConsoleLogs(prev => [...prev, '⚡ Envoi d\'une relance à Abdoulaye Sy (Dakar) -> Paiement Wave initié!']);
    }, 2000);

    setTimeout(() => {
      setRevenueConsoleLogs(prev => [...prev, '💰 Succès: Encaissé 45 000 FCFA de Marie et 250 000 FCFA d\'Abdoulaye!']);
      setRevenueConsoleLogs(prev => [...prev, '🎉 Récupération totale: 850 000 FCFA récoltés en mode autopilot!']);
      
      // Update global dashboard metrics
      setRevenueToday(prev => prev + 850000);
      setPaymentsToday(prev => prev + 7);
      setLeadsToday(prev => prev + 7);
      setRoiPercentage(prev => prev + 650);
      setRevenueAiState('success');
    }, 2800);
  };

  // SIMULATE: Fiko Autonomous Closer
  const startAutonomousCloser = () => {
    setCloserStatus('running');
    setCloserStep(1);
    setCloserLogs([
      { sender: 'buyer', text: "Bonjour ! Est-ce qu'il vous reste des articles du Pack Luxe ?", systemTag: "PROSPECT IDENTIFIED" }
    ]);

    // Step 2: Qualification IA (1s)
    setTimeout(() => {
      setCloserStep(2);
      setCloserLogs(prev => [
        ...prev,
        { sender: 'ai', text: "Bonjour ! Oui absolument, il nous reste 3 lots de cosmétiques de luxe disponibles à Abidjan pour livraison sous 2h 🛵. Vous préférez la couleur Rose Gold ou l'édition Platine ?", systemTag: "QUALIFICATION IA" }
      ]);
    }, 1500);

    // Step 3: Offre Personnalisée (3s)
    setTimeout(() => {
      setCloserStep(3);
      setCloserLogs(prev => [
        ...prev,
        { sender: 'buyer', text: "Je préfère l'édition Platine. Quel est le meilleur tarif que vous proposez aujourd'hui ?" },
        { sender: 'ai', text: "Excellent choix ! L'édition Platine est en promotion aujourd'hui à 45 000 FCFA avec livraison gratuite à Cocody et garantie J+30. Je vous bloque cet article ?", systemTag: "OFFRE PERSONNALISÉE" }
      ]);
    }, 3200);

    // Step 4: Objection (4.5s)
    setTimeout(() => {
      setCloserStep(4);
      setCloserLogs(prev => [
        ...prev,
        { sender: 'buyer', text: "C'est un peu coûteux, mes amies l'ont acheté moins cher ailleurs." },
        { sender: 'ai', text: "Je comprends tout à fait ! Sachez que notre Pack Platine comprend un produit original certifié KCG avec notre support client direct 24/7 sur WhatsApp et un bon d'achat cadeau de 5 000 FCFA pour votre prochaine visite. C'est l'excellence Koffmann !", systemTag: "OBJECTION RESOLVED" }
      ]);
    }, 5000);

    // Step 5: Paiement (6s)
    setTimeout(() => {
      setCloserStep(5);
      setCloserLogs(prev => [
        ...prev,
        { sender: 'buyer', text: "D'accord, vous me rassurez. Envoyez-moi un moyen de paiement s'il vous plaît." },
        { sender: 'ai', text: "Parfait ! Voici votre lien de facturation sécurisé Fiko Pay. Vous pouvez régler en un clic via Wave, Orange Money ou MTN Mobile Money :", systemTag: "GENERATING PAYMENT LINK" },
        { sender: 'ai', text: "💳 LIEN FIKO PAY : pay.fiko.ci/kcg_lux_9381. Montant : 45 000 FCFA" }
      ]);
    }, 7000);

    // Step 6: Facturation (7.5s)
    setTimeout(() => {
      setCloserStep(6);
      setCloserLogs(prev => [
        ...prev,
        { sender: 'buyer', text: "C'est bon, j'ai cliqué sur le lien et validé par Wave. C'est débité !" },
        { sender: 'ai', text: "✅ Paiement reçu ! Wave CIV a validé la transaction de 45 000 FCFA avec succès.", systemTag: "PAYMENT VERIFIED" }
      ]);
    }, 8500);

    // Step 7: Suivi (9s)
    setTimeout(() => {
      setCloserStep(7);
      setCloserLogs(prev => [
        ...prev,
        { sender: 'ai', text: "🧾 Votre reçu fiscal KCG a été généré : FACT-2026-94819.pdf. Notre livreur 🛵 est en route, livraison estimée à 21h45 ! Merci de faire confiance à Koffmann Capital Group.", systemTag: "SUCCESS TRANSACTION COMPLETED" }
      ]);
      setCloserStatus('completed');
    }, 10000);
  };

  // SIMULATE: Business Memory Search
  const handleMemorySearchQuery = (e: FormEvent) => {
    e.preventDefault();
    if (!memorySearch.trim()) return;
    
    const query = memorySearch.toLowerCase();
    if (query.includes('koffi') || query.includes(' Yao')) {
      setMemoryAnswer("D'après fiko_memory, M. Koffi Yao habite à Cocody Saint-Jean. Il a effectué son dernier achat chez vous il y a 8 mois (Pack Luxe d'une valeur de 45 000 FCFA). Il a sollicité l'IA 4 fois cette semaine pour des modalités de livraison, de préférence le samedi matin.");
    } else if (query.includes('awa') || query.includes('diallo')) {
      setMemoryAnswer("fiko_memory indique qu'Awa Diallo (Plateau) est un prospect chaud sans achat historique. Elle a demandé des renseignements sur le pack de cosmétiques 3 fois cette semaine. Elle s'inquiète des frais d'envoi en dehors d'Abidjan.");
    } else if (query.includes('marie') || query.includes('koné')) {
      setMemoryAnswer("Marie Koné est répertoriée comme cliente VIP avec un panier moyen superbe de 99 000 FCFA validé aujourd'hui par Wave. fiko_memory indique qu'elle réagit positivement aux codes promotionnels du week-end.");
    } else {
      setMemoryAnswer(`Recherche effectuée sur "fiko_memory". Aucun historique exact trouvé pour "${memorySearch}". Suggestions d'agents : Koffi Yao, Marie Koné, Awa Diallo.`);
    }
  };

  // SIMULATE: Executive Reports PDF
  const triggerReportGeneration = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      setShowReportPreview(true);
    }, 1500);
  };

  // SIMULATE: Automated Reactivation Campaign (Fiko Customer Success)
  const triggerReactivationCampaign = () => {
    if (reactivatorRunning) return;
    setReactivatorRunning(true);
    setReactivationLogs(['[SYSTEM] Initialisation de la campagne d\'urgence pour les segments Froids (Score de Santé < 40)...']);
    
    setTimeout(() => {
      setReactivationLogs(prev => [...prev, '[CRM ANALYTICS] Identification de 5 cabinets de courtage d\'assurance inactifs depuis 14 jours']);
    }, 600);

    setTimeout(() => {
      setReactivationLogs(prev => [...prev, '[WhatsApp IA] Rédaction automatisée d\'invitations VIP personnalisées (offres spéciales d\'audit de conversion)']);
    }, 1300);

    setTimeout(() => {
      setReactivationLogs(prev => [...prev, '⚡ Envoi à Cabinet Assurances Cocody (+225 05...) -> Formulaire sémantique réengagé ✓']);
    }, 2000);

    setTimeout(() => {
      setReactivationLogs(prev => [...prev, '⚡ Envoi à Abidjan Mutuelle Courtage (+225 07...) -> Appel vocal de suivi programmé avec l\'intégration CRM ✓']);
    }, 2705);

    setTimeout(() => {
      setReactivationLogs(prev => [...prev, '🎉 Campagne finalisée avec succès ! 3 comptes réactivés pour Fiko Pay. Score de santé rehaussé !']);
      setHealthScores(prev => ({ ...prev, assur: 68 }));
      setReactivatorRunning(false);
    }, 3500);
  };

  // Preserved original logic
  const handleFileUploadSim = () => {
    setIndexingSystem(true);
    setTimeout(() => {
      const newDoc = {
        name: `Catalogue_Import_CIV_${Math.floor(Math.random() * 900 + 100)}.pdf`,
        size: '2.4 MB',
        status: 'active' as const
      };
      setBrainFiles(prev => [...prev, newDoc]);
      setKnowledgePointCount(prev => prev + 410);
      setIndexingSystem(false);
    }, 1500);
  };

  const handleParseWeblinkSim = () => {
    if (!newUrl) return;
    setIndexingSystem(true);
    setTimeout(() => {
      const newDoc = {
        name: newUrl.replace('https://', '').replace('http://', ''),
        size: '140 KB',
        status: 'active' as const
      };
      setBrainFiles(prev => [...prev, newDoc]);
      setKnowledgePointCount(prev => prev + 185);
      setNewUrl('');
      setIndexingSystem(false);
    }, 1800);
  };

  const toggleAgentInstall = (id: string) => {
    if (installedAgentIds.includes(id)) {
      setInstalledAgentIds(prev => prev.filter(a => a !== id));
    } else {
      setInstalledAgentIds(prev => [...prev, id]);
    }
  };

  const copyReferralLink = () => {
    setCopiedReferral(true);
    navigator.clipboard.writeText('https://fiko.connect/join?ref=koffmann2026');
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-700 font-sans">
      {/* UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0c15] border border-red-900/50 p-8 rounded-3xl max-w-lg w-full text-center">
            <h2 className="text-2xl font-black text-white mb-4">Activation Starter 🚀</h2>
            <p className="text-sm text-zinc-400 mb-6">Prêt à débloquer l'illimité ? Complétez votre paiement sécurisé Wave pour finaliser l'activation de votre IA.</p>
            <div className="space-y-3">
                <button className="w-full bg-[#E10600] text-white py-4 rounded-xl font-bold uppercase text-xs">Payer avec Wave</button>
                <button onClick={() => setShowUpgradeModal(false)} className="w-full bg-zinc-900 text-zinc-400 py-4 rounded-xl font-bold uppercase text-xs">Annuler</button>
            </div>
          </div>
        </div>
      )}
      
      {/* SPRIT 1: FIRST VALUE ENGINE - SUCCESS SCORE & MOMENT */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
        <div className="flex justify-between items-center text-xs text-zinc-400 font-mono">
            <span>FIKO LIKELIHOOD TO SCALE: 60/100</span>
            <span className="text-[#25D366]">Objectif 100/100</span>
        </div>
        <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
            <div className="bg-[#E10600] h-full" style={{ width: '60%' }}></div>
        </div>
        <div className="bg-emerald-950/20 border border-emerald-900/50 p-4 rounded-xl text-emerald-400 text-sm">
            🎉 FIKO A DÉJÀ COMMENCÉ À TRAVAILLER: 1 prospect capturé. Temps économisé: 12 min. Valeur: 25 000 FCFA.
        </div>
      </div>
      {/* 🛡️ META REVIEW ACCOUNT DISCRETE BANNER */}
      {onboardingData?.reviewMode && (
        <div className="bg-gradient-to-r from-purple-950/20 via-[#0a0a14] to-[#050510] border border-purple-900/60 p-4 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-950/60 border border-purple-900/40 rounded-xl flex items-center justify-center text-purple-400 font-bold shrink-0 animate-pulse">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-950 text-purple-400 border border-purple-900/50 text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono">
                  META REVIEW ENVIRONMENT
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] text-[#25D366] font-bold uppercase tracking-wider font-mono">Full Premium Access Active</span>
              </div>
              <h4 className="text-xs font-black text-white mt-1">META REVIEW TEAM COCKPIT</h4>
              <p className="text-[11px] text-gray-400">
                Espace de certification et d'approbation réglementaire Meta. Accès complet sans frais, bypass de facturation activé, sécurité et quotas illimités.
              </p>
            </div>
          </div>
          <div className="bg-black/60 border border-zinc-900 px-3 py-1.5 rounded-xl shrink-0 text-right min-w-32 font-mono">
            <span className="text-[8px] text-gray-500 block uppercase font-bold">ABONNEMENT</span>
            <span className="text-xs font-black text-[#25D366] uppercase">ELITE / SANS RESTR.</span>
          </div>
        </div>
      )}
      
      {/* 👤 CHANGER DE RÔLE : FILTRE DE COMPLEXITÉ */}
      <div className="bg-[#0b0b10] border border-gray-950 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">PLATFORM LAYER COCKPIT</span>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Layers className="text-purple-400" size={16} /> Configuration active : {roleFilter === 'pme' ? '👤 VUE SIMPLE PME' : roleFilter === 'pro' ? '🧠 VUE PRO & RECHERCHE' : '🏦 VUE INVESTISSEUR (VENTURE)'}
            </h3>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">Personnalisez la densité d'information pour piloter au bon niveau.</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              setRoleFilter('pme');
              setActiveTab('command');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${roleFilter === 'pme' ? 'bg-[#E10600] text-white border-transparent shadow-[0_4px_15px_rgba(225,6,0,0.25)]' : 'bg-black/40 text-gray-500 border-zinc-900/60 hover:text-white hover:bg-zinc-900/50'}`}
          >
            <span>👤 PME (Vente)</span>
          </button>
          
          <button
            onClick={() => {
              setRoleFilter('pro');
              setActiveTab('marketplace');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${roleFilter === 'pro' ? 'bg-purple-700 text-white border-transparent shadow-[0_4px_15px_rgba(147,51,234,0.25)]' : 'bg-black/40 text-gray-500 border-zinc-900/60 hover:text-white hover:bg-zinc-900/50'}`}
          >
            <span>🧠 PRO (Savoir)</span>
          </button>
          
          <button
            onClick={() => {
              setRoleFilter('investor');
              setActiveTab('investor');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${roleFilter === 'investor' ? 'bg-[#312e81] text-indigo-300 border-transparent shadow-[0_4px_15px_rgba(79,70,229,0.25)]' : 'bg-black/40 text-gray-500 border-zinc-900/60 hover:text-white hover:bg-zinc-900/50'}`}
          >
            <span>🏦 INVESTOR (Arr)</span>
          </button>
        </div>
      </div>

      {/* 2. FIKO NATIVE SUB-MENU TABS */}
      <div className="flex overflow-x-auto gap-2 bg-[#09090c] border border-gray-900 rounded-2xl p-1.5 shadow-md">
        {roleFilter === 'pme' && (
          <>
            <button 
              onClick={() => setActiveTab('command')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${activeTab === 'command' ? 'bg-[#E10600] text-white shadow-lg shadow-red-950/20' : 'text-gray-400 hover:text-white hover:bg-zinc-900/50'}`}
            >
              <Activity size={14} /> Command Center
            </button>
            <button 
              onClick={() => setActiveTab('closer')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${activeTab === 'closer' ? 'bg-[#E10600] text-white shadow-lg shadow-red-955/20' : 'text-gray-400 hover:text-white hover:bg-zinc-900/50'}`}
            >
              <Bot size={14} /> Fiko Closer
            </button>
            <button 
              onClick={() => setActiveTab('memory')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${activeTab === 'memory' ? 'bg-[#E10600] text-white shadow-lg shadow-red-955/20' : 'text-gray-400 hover:text-white hover:bg-zinc-900/50'}`}
            >
              <BookOpen size={14} /> Business Memory
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${activeTab === 'reports' ? 'bg-[#E10600] text-white shadow-lg shadow-red-955/20' : 'text-gray-400 hover:text-white hover:bg-zinc-900/50'}`}
            >
              <FileText size={14} /> Executive Reports
            </button>
          </>
        )}

        {roleFilter === 'pro' && (
          <>
            <button 
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center gap-2 px-4 py-2. shape-btn rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${activeTab === 'marketplace' ? 'bg-purple-700 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-zinc-900/50'}`}
            >
              <Sparkles size={14} /> Connaissances & Agents
            </button>
            <button 
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${activeTab === 'roadmap' ? 'bg-purple-700 text-white shadow-lg shadow-red-955/20' : 'text-gray-400 hover:text-white hover:bg-zinc-900/50'}`}
            >
              <Globe size={14} /> Playbooks & Horizons
            </button>
            <button 
              onClick={() => setActiveTab('network')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${activeTab === 'network' ? 'bg-purple-700 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-zinc-900/50'}`}
            >
              <TrendingUp size={14} /> fiko_network & Index
            </button>
            <button 
              onClick={() => setActiveTab('partners')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${activeTab === 'partners' ? 'bg-purple-700 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-zinc-900/50'}`}
            >
              <Handshake size={14} /> Certified Partners & Moat
            </button>
          </>
        )}

        {roleFilter === 'investor' && (
          <>
            <button 
              onClick={() => setActiveTab('investor')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${activeTab === 'investor' ? 'bg-[#312e81] text-indigo-300 shadow-lg shadow-red-955/20' : 'text-gray-400 hover:text-white hover:bg-zinc-900/50'}`}
            >
              <Trophy size={14} /> Fiko Board (Investor)
            </button>
          </>
        )}
      </div>

      {/* RENDER TAB 1: COMMAND CENTER & REVENUE AI */}
      {activeTab === 'command' && (
        <div className="space-y-6">
          
          {/* PREMIUM TRIAL PERFORMANCE & LIMITS TRACKER (80%+ UPGRADE WARNING TRIGGERED) */}
          {onboardingData?.selectedPlan === 'free' && !onboardingData?.reviewMode && (
            <div className="bg-[#0b0c15] border border-red-900/60 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-[0_0_50px_rgba(225,6,0,0.15)] flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-650/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-red-950/80 border border-red-900/60 text-fiko-red font-black text-[10px] uppercase px-3 py-1 rounded-full animate-pulse tracking-wider">
                    ⚠️ ALERTE DE QUOTAS : ATTEINT À Plus de 80%
                  </span>
                  <span className="text-xs text-zinc-400 font-mono tracking-widest uppercase">
                    Espace : {onboardingData?.companyName || 'Mon Entreprise'} • ESSAI GRATUIT FIKO CONNECT
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-white leading-tight font-sans">
                  Votre IA fonctionne déjà. Passez au plan Starter pour continuer à développer votre activité.
                </h3>
                
                <p className="text-sm text-zinc-400 max-w-2xl">
                  L'infrastructure cloud Fiko Connect a déjà généré un fort impact sur votre business en moins de 2 minutes. Voici l'état de consommation en temps-réel de vos quotas de test gratuit :
                </p>

                {/* LIMITS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                  
                  {/* LIMIT 1: WhatsApp Account */}
                  <div className="bg-black/60 border border-zinc-900 p-3 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Comptes WhatsApp</span>
                      <strong className="text-sm font-mono text-white mt-1 block">1 / 1</strong>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-full"></div>
                    </div>
                  </div>

                  {/* LIMIT 2: Contacts Qualifications (starts at 4/5 = 80%) */}
                  <div className="bg-black/60 border border-zinc-900 p-3 rounded-xl flex flex-col justify-between relative overflow-hidden ring-1 ring-red-900/40">
                    <div className="absolute top-0 right-0 bg-red-950 px-1 text-[7px] font-mono text-red-400 uppercase font-black border-l border-b border-red-900/40">80%</div>
                    <div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Contacts Capturés</span>
                      <strong className="text-sm font-mono text-red-400 mt-1 block">
                        {onboardingData?.contactsCaptured || 4} / 5
                      </strong>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>

                  {/* LIMIT 3: AI Messages (starts at 42/50 = 84%) */}
                  <div className="bg-black/60 border border-zinc-900 p-3 rounded-xl flex flex-col justify-between relative overflow-hidden ring-1 ring-red-900/40">
                    <div className="absolute top-0 right-0 bg-red-950 px-1 text-[7px] font-mono text-red-400 uppercase font-black border-l border-b border-red-900/40">84%</div>
                    <div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Messages IA Envoyés</span>
                      <strong className="text-sm font-mono text-red-400 mt-1 block">
                        {onboardingData?.conversationsProcessed || 42} / 50
                      </strong>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: '84%' }}></div>
                    </div>
                  </div>

                  {/* LIMIT 4: Trial Duration */}
                  <div className="bg-black/60 border border-zinc-900 p-3 rounded-xl flex flex-col justify-between relative overflow-hidden ring-1 ring-red-900/40">
                    <div className="absolute top-0 right-0 bg-red-950 px-1 text-[7px] font-mono text-red-400 uppercase font-black border-l border-b border-red-900/40">85%</div>
                    <div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Période d'essai</span>
                      <strong className="text-sm font-mono text-red-400 mt-1 block">6 / 7 Jours</strong>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  {/* LIMIT 5: Active Agent */}
                  <div className="bg-black/60 border border-zinc-900 p-3 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Agents IA Déployés</span>
                      <strong className="text-sm font-mono text-white mt-1 block">1 / 1</strong>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-full"></div>
                    </div>
                  </div>

                </div>

                {/* STRATEGIC ROI INFO DISPLAY */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-950/55 border border-white/5 p-4 rounded-2xl text-xs text-zinc-300 font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-[#25D366] shrink-0" size={16} />
                    <span>WhatsApp Connectivité : Option WhatsApp En Ligne Connectée ☑</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-[#25D366] shrink-0" size={16} />
                    <span>Revenus Potentiels Estimés : <strong>{(onboardingData?.estimatedRevenue || 180000).toLocaleString()} FCFA</strong></span>
                  </div>
                </div>
              </div>

              {/* UPGRADE INCENTIVE FORM */}
              <div className="flex flex-col items-stretch xl:items-end justify-center gap-3 shrink-0 min-w-full xl:min-w-64 bg-black/45 border border-zinc-900 xl:border-0 p-5 xl:p-0 rounded-2xl">
                <button 
                  onClick={onUpgrade}
                  className="w-full bg-[#E10600] text-white py-4 px-6 rounded-2xl font-black text-xs tracking-wider uppercase hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-[0_4px_30px_rgba(225,6,0,0.35)] hover:scale-[1.01]"
                >
                  PASSER AU PLAN STARTER 🚀
                </button>
                
                <div className="text-center xl:text-right font-mono">
                  <span className="text-[#25D366] font-black text-sm block">19 900 FCFA / mois</span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Sans engagement • Annulable en un clic</span>
                </div>
              </div>
            </div>
          )}

          {/* KCG BANNER (Original preserved) */}
          <div className="koffmann-banner-wrapper">
              <div className="banner-shine"></div>
              <div className="banner-glow"></div>
              <div className="banner-particle banner-particle-1"></div>
              <div className="banner-particle banner-particle-2"></div>
              <div className="banner-particle banner-particle-3"></div>
              <div className="banner-particle banner-particle-4"></div>

              <div className="banner-inner">
                  <div className="badge-section">
                      <div className="meta-badge">
                          <div className="check-ring"></div>
                          <svg viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                      </div>
                      <div className="badge-text border-r-0 border-transparent">
                          <span className="verified-label">Entreprise de croissance</span>
                          <span className="verified-name text-fiko-red">Koffmann Capital Group</span>
                      </div>
                  </div>

                  <div className="info-section">
                      <div className="main-text font-sans">
                          Fiko <span className="highlight font-black">Revenue Operating System (ROS)</span> — Centralisez l'Acquisition, Conversation, Conversion et Encaissement.
                      </div>
                      <div className="sub-text">
                          Directeur Commercial Numérique 24h/24 • <span className="wa-highlight">Fiko Pay Multi-Devises Actif</span>
                      </div>
                  </div>

                  <div className="compat-section hidden md:flex">
                      <div className="koffmann-logo text-right">
                          Fiko ROS v2026<span>BUSINESS ENGINE</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* FIKO COMMAND CENTER PRIMARY COUNTERS - 5 SECONDS COMPREHENSION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="bg-[#0a0a0f] border border-gray-900 p-5 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl"></div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">CA GÉNERÉ AUJOURD'HUI</span>
                <p className="text-xl font-mono font-black text-white">{revenueToday.toLocaleString()} F</p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-[#25D366] font-semibold mt-4 pt-2 border-t border-gray-900/50">
                <span>Direct Fiko Pay</span>
                <span className="bg-emerald-950/20 text-[#25D366] px-1 rounded">Actif</span>
              </div>
            </div>

            <div className="bg-[#0a0a0f] border border-gray-900 p-5 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">LEADS CAPTURÉS</span>
                <p className="text-2xl font-mono font-black text-white">{leadsToday}</p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-400 mt-4 pt-2 border-t border-gray-900/50">
                <span>+37 les dernières 24h</span>
                <span className="text-gray-500 text-[9px]">WhatsApp</span>
              </div>
            </div>

            <div className="bg-[#0a0a0f] border border-gray-900 p-5 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">PAIEMENTS ENCAISSÉS</span>
                <p className="text-2xl font-mono font-black text-white">{paymentsToday}</p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-[#25D366] font-semibold mt-4 pt-2 border-t border-gray-900/50">
                <span>Taux de réussite 100%</span>
                <span className="text-white">Wave/Orange</span>
              </div>
            </div>

            <div className="bg-[#0a0a0f] border border-gray-900 p-5 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">AGENTS IA ACTIFS</span>
                <p className="text-2xl font-mono font-black text-purple-400">{activeIAs}</p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-400 mt-4 pt-2 border-t border-gray-900/50">
                <span>Boutique, Resto & Immo</span>
                <span className="text-purple-400">● Live</span>
              </div>
            </div>

            <div className="bg-[#050907] border border-emerald-950 p-5 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl"></div>
              <div>
                <span className="text-[10px] text-emerald-500 font-black uppercase tracking-wider block mb-1">ROI SUR ABONNEMENT</span>
                <p className="text-2xl font-mono font-black text-emerald-400">{roiPercentage.toLocaleString()} %</p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-emerald-500/80 mt-4 pt-2 border-t border-emerald-900/40">
                <span>Frais fixes 1%</span>
                <span className="font-extrabold uppercase text-[8px] bg-emerald-950 text-[#25D366] px-1 py-0.2 rounded">Excellent</span>
              </div>
            </div>

          </div>

          {/* FIKO REVENUE AI - DAILY MORNING BRIEFING COMPONENT */}
          <div className="bg-[#0b0c15] border border-blue-900/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-950 text-blue-400 border border-blue-900/80 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Sparkles size={11} className="animate-spin" /> FIKO REVENUE AI
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 uppercase">Directeur Commercial Numérique</span>
                </div>
                <h3 className="text-xl font-black text-white">Bonjour Paul, voici votre synthèse des dernières 24h 👋</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="bg-black/40 border border-gray-900 p-3 rounded-xl">
                    <span className="text-[9px] font-bold text-gray-500 block">NOUVEAUX PROSPECTS DETECTÉS</span>
                    <strong className="text-sm font-mono text-white">+37 Prospects</strong>
                  </div>
                  <div className="bg-black/40 border border-gray-900 p-3 rounded-xl">
                    <span className="text-[9px] font-bold text-gray-500 block">PAIEMENTS RECETTE</span>
                    <strong className="text-sm font-mono text-[#25D366]">+12 Paiements</strong>
                  </div>
                  <div className="bg-black/40 border border-gray-900 p-3 rounded-xl">
                    <span className="text-[9px] font-bold text-gray-500 block">VOLUME FINANCIER GÉNÉRÉ</span>
                    <strong className="text-sm font-mono text-white">+2 450 000 FCFA</strong>
                  </div>
                  <div className="bg-black/40 border border-gray-900 p-3 rounded-xl text-left">
                    <span className="text-[9px] font-bold text-fiko-red block uppercase">Opportunités froides</span>
                    <strong className="text-sm font-mono text-fiko-red">7 inactifs à qualifier</strong>
                  </div>
                </div>

                <div className="bg-black/60 border border-red-950 p-4 rounded-xl flex items-center justify-between text-xs gap-4">
                  <div className="space-y-0.5">
                    <p className="text-gray-300 font-extrabold flex items-center gap-1">
                      ⚠️ <strong className="text-fiko-red">{potentialRecovered.toLocaleString()} FCFA</strong> de potentiel perdu sur la table.
                    </p>
                    <p className="text-gray-400 text-[11px]">7 prospects à forte intention d'achat n'ont pas encore reçu d'interventions de relance personnalisée.</p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto shrink-0 flex flex-col gap-2.5">
                {revenueAiState === 'idle' && (
                  <button 
                    onClick={triggerRevenueAiRelance}
                    className="bg-[#E10600] text-white py-3.5 px-6 rounded-xl font-black text-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 w-full"
                  >
                    <Zap size={14} /> Déclencher les relances IA 🚀
                  </button>
                )}
                {revenueAiState === 'running' && (
                  <button 
                    disabled 
                    className="bg-gray-900 border border-gray-800 text-gray-400 py-3.5 px-6 rounded-xl font-black text-xs w-full flex items-center justify-center gap-2 cursor-wait"
                  >
                    <RefreshCw size={14} className="animate-spin text-fiko-red" /> Exécution des relances...
                  </button>
                )}
                {revenueAiState === 'success' && (
                  <div className="bg-emerald-950/40 border border-emerald-900 text-emerald-400 p-4 rounded-xl text-center text-xs font-black">
                    🎉 +850 000 FCFA récupérés avec succès !
                  </div>
                )}

                <div className="text-[10px] text-gray-550 italic w-full text-center">
                  Fiko utilise fiko_memory et WhatsApp API pour clore de bout en bout.
                </div>
              </div>
            </div>

            {/* Simulated Live Console Logs */}
            {revenueConsoleLogs.length > 0 && (
              <div className="mt-4 bg-black p-4 rounded-xl border border-gray-900 font-mono text-[10px] leading-relaxed text-gray-400 space-y-1">
                <span className="text-[9px] font-black uppercase text-gray-500 block mb-1">Journal de l’IA en temps réel :</span>
                {revenueConsoleLogs.map((log, idx) => (
                  <p key={idx} className={log.includes('Succès') || log.includes('recouv') ? 'text-[#25D366]' : log.includes('Relance') ? 'text-blue-400' : 'text-gray-400'}>
                    &gt; {log}
                  </p>
                ))}
              </div>
            )}

          </div>

          {/* DYNAMIC GRAPH + INACTIVE LEADS HIGHLIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-white text-sm font-black uppercase tracking-wider flex items-center gap-2">
                    <Activity size={16} className="text-fiko-red" /> Rendement Commercial Autonome
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Comparaison des leads qualifiés contre les volumes de ventes récoltés sur Wave/Orange (CIV)</p>
                </div>
                <span className="text-[10px] bg-gray-900 border border-gray-800 text-gray-400 px-3 py-1 rounded">Cette Semaine</span>
              </div>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={graphData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E10600" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#E10600" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#16161c" vertical={false} />
                    <XAxis dataKey="name" stroke="#444" axisLine={false} tickLine={false} />
                    <YAxis stroke="#444" axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid #1f2937' }} />
                    <Area type="monotone" dataKey="sales" name="Ventes (FCFA)" stroke="#E10600" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Inactive High-Intention Leads Panel */}
            <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <h4 className="text-white text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Flame className="text-orange-500" size={16} /> 3 Leads VIP chauds (Dernières 24h)
                </h4>
                <p className="text-xs text-gray-400 mb-4">
                  Prospects identifiés avec fiko_memory ayant manifesté de fortes intentions de conversion via Wave ou Orange Money.
                </p>

                <div className="space-y-3">
                  {[
                    { name: 'Marie Koné', score: 95, value: '99 000 FCFA', action: 'Déclenché avec succès ✓', active: true },
                    { name: 'Koffi Yao (Cocody)', score: 91, value: '45 000 FCFA', action: 'Relancer via WhatsApp', active: false },
                    { name: 'Awa Diallo (Plateau)', score: 88, value: '19 900 FCFA', action: 'Relancer via WhatsApp', active: false }
                  ].map((l, idx) => (
                    <div key={idx} className="bg-black/40 border border-gray-900/60 hover:border-gray-800 p-3 rounded-xl flex justify-between items-center transition-all">
                      <div>
                        <p className="text-xs font-bold text-white">{l.name}</p>
                        <p className="text-[10px] text-gray-550">Valeur : <strong className="text-emerald-400 font-mono">{l.value}</strong> • Score {l.score}%</p>
                      </div>
                      <button 
                        onClick={() => {
                          if (!l.active) {
                            alert(`Une relance WhatsApp hautement qualifiée a été envoyée à ${l.name}`);
                            setPaymentsToday(prev => prev + 1);
                            setRevenueToday(prev => prev + (idx === 1 ? 45000 : 19900));
                          }
                        }}
                        className={`text-[9px] font-black px-2.5 py-1.5 rounded-lg transition-colors ${l.active ? 'bg-emerald-950 text-[#25D366] border border-green-900' : 'bg-gray-900 hover:bg-[#E10600] text-gray-300 hover:text-white border border-gray-850'}`}
                      >
                        {l.active ? 'Validé ✓' : 'Relancer ⚡'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-900 mt-4 pt-4 flex gap-1 justify-between text-[10px] text-gray-500">
                <span>Total à débloquer :</span>
                <span className="font-extrabold text-white">163 900 FCFA</span>
              </div>
            </div>

          </div>

          {/* FIKO CONVERSION HUB & REAL ACTIVATION LOGIC */}
          <SaaSGrowthEngine onboardingData={onboardingData} onUpgrade={() => setShowUpgradeModal(true)} />

          {/* FIKO CORE METRIC SCORE SECTION (Original preserved & fully functional) */}
          <div className="bg-[#0c0d16] p-6 rounded-2xl border border-blue-900/30 flex flex-col justify-between relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className='text-gray-400 text-xs font-black flex items-center gap-2 uppercase tracking-widest'>
                    <Trophy className='text-yellow-500' size={16}/> CONFIGURATION TECHNIQUE SCORE FIKO™
                  </h3>
                  <span className="text-2xl font-black text-blue-400">{currentFikoScore} / 100</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-[#E10600] to-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${currentFikoScore}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-300">
                <div 
                  onClick={() => setScoreActions(prev => ({...prev, mobMoney: !prev.mobMoney}))}
                  className="flex justify-between items-center bg-black/40 hover:bg-black p-3.5 rounded-xl border border-gray-950 hover:border-blue-900/50 cursor-pointer transition select-none"
                >
                  <span className="font-medium">⚡ +12 pts : Liaison Mobile Money direct</span> 
                  <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${scoreActions.mobMoney ? "bg-green-950 text-green-300 border border-green-900" : "bg-[#E10600]/10 text-fiko-red"}`}>
                    {scoreActions.mobMoney ? "Actif ✓" : "Désactivé"}
                  </span>
                </div>

                <div 
                  onClick={() => setScoreActions(prev => ({...prev, website: !prev.website}))}
                  className="flex justify-between items-center bg-black/40 hover:bg-black p-3.5 rounded-xl border border-gray-950 hover:border-blue-900/50 cursor-pointer transition select-none"
                >
                  <span className="font-medium">🌐 +8 pts : Renseigner le site internet</span> 
                  <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${scoreActions.website ? "bg-green-950 text-green-300 border border-green-900" : "bg-gray-900 text-gray-500"}`}>
                    {scoreActions.website ? "Actif ✓" : "Configurer"}
                  </span>
                </div>

                <div 
                  onClick={() => setScoreActions(prev => ({...prev, catalog: !prev.catalog}))}
                  className="flex justify-between items-center bg-black/40 hover:bg-black p-3.5 rounded-xl border border-gray-950 hover:border-blue-900/50 cursor-pointer transition select-none"
                >
                  <span className="font-medium">📂 +5 pts : Importer catalogue PDF v2</span> 
                  <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${scoreActions.catalog ? "bg-green-950 text-green-300 border border-green-900" : "bg-gray-900 text-gray-500"}`}>
                    {scoreActions.catalog ? "Actif ✓" : "Importer"}
                  </span>
                </div>
              </div>
          </div>

        </div>
      )}

      {/* RENDER TAB 2: AUTONOMOUS CLOSER ENGINE */}
      {activeTab === 'closer' && (
        <div className="space-y-6">
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-900 pb-4 mb-6 gap-4">
              <div>
                <span className="bg-purple-950 text-purple-400 border border-purple-900/50 text-[10px] font-black px-2.5 py-1 rounded">
                  🔥 FIKO AUTONOMOUS CLOSER
                </span>
                <h3 className="text-xl font-black text-white mt-2">Démonstrateur de closing autonome en un clic</h3>
                <p className="text-xs text-gray-400">Voyez Fiko qualifier, proposer une offre, résoudre les objections et valider le paiement d'un prospect sans aucune intervention humaine.</p>
              </div>

              <div className="flex gap-2">
                <select 
                  value={closerTarget} 
                  onChange={(e) => setCloserTarget(e.target.value as any)}
                  className="bg-black border border-gray-850 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:border-fiko-red"
                >
                  <option value="fatou">Fatou Diop (Sénégal 🇸🇳)</option>
                  <option value="alassane">Alassane Koné (Côte d’Ivoire 🇨🇮)</option>
                  <option value="amina">Amina Bello (Cameroun 🇨🇲)</option>
                </select>

                <button 
                  onClick={startAutonomousCloser}
                  disabled={closerStatus === 'running'}
                  className="bg-[#E10600] shrink-0 text-white px-5 py-2.5 rounded-xl font-black text-xs hover:bg-red-700 transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Zap size={14} /> Lancer le closing 🤖
                </button>
              </div>
            </div>

            {/* Steps tracker indicators */}
            <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center text-[10px] uppercase font-mono font-bold mb-6">
              {[
                { step: 1, label: '1. Message' },
                { step: 2, label: '2. Qualification' },
                { step: 3, label: '3. Offre' },
                { step: 4, label: '4. Objection' },
                { step: 5, label: '5. Lien Pay' },
                { step: 6, label: '6. Validation' },
                { step: 7, label: '7. Suivi/Facture' }
              ].map((s) => (
                <div 
                  key={s.step} 
                  className={`p-2.5 rounded-xl border leading-none transition-all ${
                    closerStep === s.step 
                      ? 'bg-[#E10600] text-white border-[#E10600] animate-pulse' 
                      : closerStep > s.step 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-900/60' 
                        : 'bg-black text-gray-500 border-gray-900'
                  }`}
                >
                  <p>{s.label}</p>
                  <span className="text-[8px] font-sans lowercase mt-1 block">
                    {closerStep === s.step ? 'en cours' : closerStep > s.step ? 'complété ✓' : 'en attente'}
                  </span>
                </div>
              ))}
            </div>

            {/* Chat simulation screen */}
            <div className="bg-[#050507] rounded-2xl border border-gray-900 h-96 p-6 overflow-y-auto space-y-4 shadow-inner flex flex-col justify-between">
              
              <div className="space-y-4 overflow-y-auto flex-1 pb-4">
                {closerLogs.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center text-gray-500 space-y-2">
                    <Bot size={36} className="text-gray-700 animate-bounce" />
                    <p className="text-xs font-mono">En attente du lancement. Sélectionnez un lead et cliquez sur "Lancer le closing".</p>
                  </div>
                ) : (
                  closerLogs.map((log, index) => {
                    const isAi = log.sender === 'ai';
                    return (
                      <div key={index} className="space-y-1">
                        {log.systemTag && (
                          <div className="flex justify-center my-3">
                            <span className="bg-zinc-900 border border-zinc-800 text-gray-400 text-[8px] font-mono px-3 py-0.5 rounded-full uppercase tracking-wider">
                              ⚙️ FOS State: {log.systemTag}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isAi ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3.5 rounded-2xl text-xs max-w-xl leading-relaxed ${
                            isAi 
                              ? 'bg-zinc-900 border border-zinc-800 text-gray-200 rounded-tr-none' 
                              : 'bg-red-950/40 border border-red-900/40 text-gray-200 rounded-tl-none'
                          }`}>
                            <span className="text-[8px] uppercase tracking-widest font-black block mb-1 text-gray-500">
                              {isAi ? 'Fiko Connect ROS IA' : 'Prospect'}
                            </span>
                            <p>{log.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Status footer inside closer */}
              {closerStatus === 'completed' && (
                <div className="bg-emerald-950/40 border border-green-900/60 p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom duration-500">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-extrabold text-left">
                    <CheckCircle className="text-[#25D366]" size={16} />
                    <div>
                      <p>Pipeline closée avec succès par l'IA !</p>
                      <p className="text-[10px] text-gray-400 font-normal">Revenu encaissé de 45 000 FCFA. Facture émise et transmise.</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      alert("Facture FACT-2026-94819.pdf prête. Téléchargement simulé ✓");
                      setRevenueToday(prev => prev + 45000);
                      setPaymentsToday(prev => prev + 1);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-[10px] transition"
                  >
                    Télécharger la facture 🧾
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* RENDER TAB 3: BUSINESS MEMORY */}
      {activeTab === 'memory' && (
        <div className="space-y-6">
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl">
            <div className="border-b border-gray-900 pb-4 mb-6">
              <span className="bg-emerald-950 text-[#25D366] border border-emerald-900 text-[10px] font-black px-2.5 py-1 rounded">
                🧠 FIKO BUSINESS MEMORY (`fiko_memory` active)
              </span>
              <h3 className="text-xl font-black text-white mt-2">Base de données relationnelle client Koffmann</h3>
              <p className="text-xs text-gray-400">Rappelez-vous instantanément des habitudes, produits préférés et historiques de paiements. Difficile à copier, extrêmement puissant.</p>
            </div>

            {/* Query terminal */}
            <div className="bg-black p-5 rounded-2xl border border-gray-900 mb-6">
              <h4 className="text-white text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                <Bot size={14} className="text-purple-400" /> Poser une question à la Business Memory (KCG Brain)
              </h4>
              
              <form onSubmit={handleMemorySearchQuery} className="flex gap-2">
                <input 
                  type="text" 
                  value={memorySearch}
                  onChange={(e) => setMemorySearch(e.target.value)}
                  placeholder="Ex: 'Quelles sont les préférences de Koffi ?' ou 'Marie a-t-elle déjà payé ?'" 
                  className="flex-1 bg-zinc-950 border border-gray-800 text-xs p-3 rounded-xl focus:outline-none focus:border-fiko-red text-white"
                />
                <button type="submit" className="bg-[#E10600] text-white px-5 py-3 rounded-xl font-black text-xs hover:bg-red-700 transition">
                  Consulter la mémoire
                </button>
              </form>

              {/* Memory Smart Alerts / Responses */}
              {memoryAnswer && (
                <div className="mt-4 bg-zinc-900/60 border border-blue-900/30 p-4 rounded-xl text-xs space-y-2 text-gray-300 animate-in fade-in duration-300">
                  <span className="text-[10px] text-blue-400 font-extrabold uppercase block font-mono">🧠 Koffmann AI Memory Search Answer :</span>
                  <p className="leading-relaxed">{memoryAnswer}</p>
                </div>
              )}
            </div>

            {/* Simulated Memory Records */}
            <div className="space-y-3">
              <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Index client stocké (`fiko_memory/historique_client`) :</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {clientHistory.map((h, i) => (
                  <div key={i} className="bg-black/60 p-4 rounded-xl border border-gray-900 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <strong className="text-xs font-extrabold text-white">{h.name}</strong>
                        <span className="bg-zinc-900 text-blue-400 border border-zinc-800 text-[8px] font-mono px-1.5 py-0.5 rounded uppercase">
                          Score 98
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-450">Dernier achat : <strong className="text-white">{h.lastOrder}</strong></p>
                    </div>

                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex justify-between text-gray-500">
                        <span>Intérêts répétés :</span>
                        <span className="text-white font-semibold">{h.timesAsked} fois</span>
                      </div>
                      <div className="bg-black p-2 rounded border border-gray-950 italic text-gray-400 text-[9px]">
                        "{h.preference}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* RENDER TAB 4: EXECUTIVE WEEKLY REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl">
            <div className="border-b border-gray-900 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="bg-amber-950 text-amber-400 border border-amber-900/60 text-[10px] font-black px-2.5 py-1 rounded">
                  📈 FIKO EXECUTIVE Weekly PDF REPORTS
                </span>
                <h3 className="text-xl font-black text-white mt-2">Générateur automatisé de rapports de croissance</h3>
                <p className="text-xs text-gray-400">Tous les lundis matin. Compilé automatiquement depuis Firebase Analytics et Fiko Pay.</p>
              </div>

              <div className="flex gap-2">
                <select 
                  value={selectedReportType} 
                  onChange={(e) => setSelectedReportType(e.target.value as any)}
                  className="bg-black border border-gray-850 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:border-[#E10600]"
                >
                  <option value="weekly">Rapport Hebdomadaire (7 derniers jours)</option>
                  <option value="monthly">Rapport Mensuel (30 derniers jours)</option>
                </select>

                <button 
                  onClick={triggerReportGeneration}
                  disabled={isGeneratingReport}
                  className="bg-[#E10600] text-white px-5 py-2.5 rounded-xl font-black text-xs hover:bg-red-700 transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isGeneratingReport ? 'Compilation...' : 'Générer le PDF 📥'}
                </button>
              </div>
            </div>

            {/* PDF Preview rendering online simulated */}
            {showReportPreview ? (
              <div className="bg-[#050505] rounded-2xl border border-[#333] p-8 space-y-6 shadow-2xl relative overflow-hidden animate-in zoom-in duration-500 max-w-3xl mx-auto">
                <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-gray-600">DOCUMENT OFFICIEL KCG</div>
                
                {/* PDF Header */}
                <div className="flex justify-between items-start border-b border-gray-850 pb-6">
                  <div>
                    <h2 className="text-lg font-black text-white tracking-widest">FIKO EXECUTIVE GRAPH REPORT</h2>
                    <p className="text-xs text-gray-400 font-mono">Période : {selectedReportType === 'weekly' ? 'Semaine du 28 Mai au 04 Juin 2026' : 'Mensuel Mai 2026'}</p>
                    <p className="text-[10px] text-emerald-400 font-mono mt-1">Généré le : 04 Juin 2026 à 20h34 UTC</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-black text-white">KOFFMANN CAPITAL GROUP</p>
                    <p className="text-[10px] text-gray-500">Abidjan, Côte-d'Ivoire</p>
                    <p className="text-[9px] text-[#25D366] font-extrabold uppercase font-mono mt-1">SOLDE VALIDÉ ✓</p>
                  </div>
                </div>

                {/* PDF Metrics list */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  <div className="border-l-4 border-[#E10600] pl-3">
                    <span className="text-[10px] text-gray-500 uppercase font-black block">PROSPECTS UNIQUES</span>
                    <strong className="text-xl font-mono text-white tracking-tight">+342 Nouveaux</strong>
                    <span className="text-[9px] text-gray-400 block">+14% vs période précédente</span>
                  </div>
                  <div className="border-l-4 border-emerald-500 pl-3">
                    <span className="text-[10px] text-gray-500 uppercase font-black block">CONVERSIONS VALIDÉES</span>
                    <strong className="text-xl font-mono text-white tracking-tight">+68 Ventes</strong>
                    <span className="text-[9px] text-gray-400 block">Wave, Orange & MTN</span>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-3">
                    <span className="text-[10px] text-gray-500 uppercase font-black block">CA GLOBAL FIKO PAY</span>
                    <strong className="text-xl font-mono text-[#25D366] tracking-tight">12 850 000 FCFA</strong>
                    <span className="text-[9px] text-gray-400 block">Débit net instantané</span>
                  </div>
                </div>

                {/* Second Row metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-900">
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase font-black block">TAUX DE CONVERSION MOYEN</span>
                    <strong className="text-base font-mono text-white block">19.8 %</strong>
                    <span className="text-[9px] text-gray-400">Canal prioritaire : WhatsApp</span>
                  </div>
                  
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase font-black block">TOP CANAL D'ACQUISITION</span>
                    <strong className="text-base font-mono text-[#25D366] block">WhatsApp Business v2</strong>
                    <span className="text-[9px] text-gray-400">92% d'interactions de closing</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-fiko-red uppercase font-black block">OPPORTUNITÉS PERDUES/FROIDES</span>
                    <strong className="text-base font-mono text-fiko-red block">3 250 000 FCFA</strong>
                    <span className="text-[9px] text-gray-400 font-sans">À récupérer via Relance J+2</span>
                  </div>
                </div>

                <div className="bg-[#111] p-4 rounded-xl border border-gray-900 text-[11px] leading-relaxed text-gray-400 space-y-1">
                  <span className="font-extrabold text-white uppercase text-[10px] block">💡 Suggestion Stratégique de Fiko Intelligence :</span>
                  <p>Votre taux de conversion à Cocody a augmenté de 4.2% grâce à l'intervention automatique d'objections sur le prix. Vous devriez injecter +12% de budget publicitaire Instagram redirigeant vers WhatsApp pour capter 40 opportunités supplémentaires.</p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-gray-500 pt-4 border-t border-gray-900/50">
                  <span>Signé électroniquement par Fiko connect ROS</span>
                  <button 
                    onClick={() => alert("Téléchargement du rapport officiel finalisé sous format PDF pour KCG!")}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    <Download size={12} /> Télécharger maintenant (750 KB)
                  </button>
                </div>

              </div>
            ) : (
              <div className="h-64 border border-dashed border-gray-800 rounded-2xl flex flex-col justify-center items-center text-center p-8 space-y-2 text-gray-500">
                <FileText size={40} className="text-gray-700" />
                <p className="text-xs">Aucun rapport compilé généré pour l'instant. Choisissez la période et pressez "Générer le PDF" ci-dessus.</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* RENDER TAB 5: ROADMAP DOMINATION AFRIQUE */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          
          {/* Section 1: Regional Country Selector & localization (Original Preserved) */}
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl">
            <div className="border-b border-gray-900 pb-4 mb-6">
              <span className="bg-blue-950 text-blue-400 border border-blue-900/50 text-[10px] font-black px-2.5 py-1 rounded">
                🌍 REGIONAL EXPANSION CENTRALIZER (CÔTE D'IVOIRE & CIMA ZONE)
              </span>
              <h3 className="text-xl font-black text-white mt-1.5">Console Multinationale & Gestion Multi-devises</h3>
              <p className="text-xs text-gray-400">Configurez votre extension continentale. Adaptez les devises, la TVA légale et les opérateurs de mobile money locaux en un instant.</p>
            </div>

            {/* Country buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {Object.entries(countryConfig).map(([code, data]) => {
                const isActive = selectedCountry === code;
                return (
                  <button 
                    key={code}
                    onClick={() => setSelectedCountry(code as any)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      isActive 
                        ? 'bg-zinc-900/80 border-[#E10600] shadow-[0_4px_15px_rgba(225,6,0,0.1)]' 
                        : 'bg-black border-gray-900 hover:border-gray-800'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{data.flag}</span>
                    <strong className="text-xs font-black text-white block truncate">{data.name}</strong>
                    <span className="text-[10px] text-gray-500 block uppercase font-mono mt-0.5">
                      {code === 'CI' ? 'Production ACTIVE ✓' : code === 'SN' ? 'BETA PRIVÉE' : 'ROADMAP MOIS 3'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* localized setup variables info */}
            <div className="bg-[#050505] p-6 rounded-2xl border border-gray-900 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-gray-450 text-[10px] font-bold uppercase tracking-wider mb-3">Paramètres monétaires :</h4>
                <div className="bg-[#0e0e0f] border border-gray-950 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Devise Locale :</span>
                    <strong className="text-white font-mono">{countryConfig[selectedCountry].currency}</strong>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Code pays :</span>
                    <strong className="text-white font-mono">{countryConfig[selectedCountry].code}</strong>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Taux TVA Légale :</span>
                    <strong className="text-white font-mono">{countryConfig[selectedCountry].tax}</strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-gray-450 text-[10px] font-bold uppercase tracking-wider mb-3">Opérateurs Mobile Money supportés {countryConfig[selectedCountry].flag} :</h4>
                <div className="bg-[#0e0e0f] border border-gray-950 p-4 rounded-xl space-y-2 text-xs">
                  {countryConfig[selectedCountry].providers.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center text-gray-400">
                      <span className="flex items-center gap-1.5 font-semibold text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> {p}
                      </span>
                      <span className="text-[8px] bg-emerald-100/5 text-emerald-400 border border-green-950 px-1.5 py-0.2 rounded uppercase font-bold font-mono">Dispo</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-gray-450 text-[10px] font-bold uppercase tracking-wider mb-3">Sélecteur de Localization :</h4>
                <div className="bg-[#0e0e0f] border border-gray-950 p-4 rounded-xl space-y-3 text-xs leading-relaxed text-gray-400">
                  <p>Fiko Connect connecte par défaut les règles d'affaires locales. Les termes de salutation et relance s'adaptent.</p>
                  
                  <div className="bg-black p-2.5 rounded border border-gray-900">
                    <span className="text-[8px] uppercase tracking-widest font-black text-gray-500 block mb-1">Phrase de relance localisée :</span>
                    <p className="text-[10px] italic text-gray-300">
                      {selectedCountry === 'CI' ? '"Voici ton reçu de paiement direct par Wave. C\'est le nouchi de la réussite, dja goule ça de suite !"' : '"Kër gui contente na trop ci yow ! Voici votre lien Wave sécurisé pour la livraison immédiate sous 2h."'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Interactive Strategic Maturity Audit */}
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-900 pb-4 gap-4">
              <div>
                <span className="bg-amber-950 text-amber-400 border border-amber-900/40 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                  🏆 AUDIT DE MATURITÉ DU ROS
                </span>
                <h3 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
                  Ajustement de l'Indicateur Global Fiko ROS
                </h3>
                <p className="text-xs text-gray-400">Visualisez et modulez interactivement nos scores de maturité par pilier stratégique.</p>
              </div>
              <div className="text-right bg-zinc-950 p-3 rounded-xl border border-zinc-900 inline-block">
                <span className="text-3xl font-black text-[#25D366] font-mono">{calculatedMaturityAverage} <span className="text-xs text-gray-500">/ 10</span></span>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black mt-0.5">Score de Cohérence Global</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'acquisition', label: '📣 Acquisition', desc: 'Canaux d\'acquisition & pub direct' },
                { key: 'onboarding', label: '⚡ Onboarding', desc: 'Tunnel d\'onboarding multi-sectoriel' },
                { key: 'whatsappIa', label: '💬 WhatsApp IA', desc: 'Synthèse sémantique & réactivité' },
                { key: 'crm', label: '🗂️ CRM Relationnel', desc: 'Base fiko_memory active & logs' },
                { key: 'paiement', label: '💳 Fiko Pay Core', desc: 'Checkout Wave / Orange direct' },
                { key: 'reporting', label: '📊 PDF Executive Reports', desc: 'Compilation automatisée' },
                { key: 'expansion', label: '🌍 Expansion Afrique', desc: 'Localization multi-langues' },
                { key: 'monetisation', label: '💰 Monétisation Core', desc: 'Abonnements récurrents Starter/Elite' },
                { key: 'fidelisation', label: '💎 Fidélisation', desc: 'Réseau de parrainage & bonus' },
              ].map((item) => (
                <div key={item.key} className="bg-black/40 p-4 border border-zinc-900/60 hover:border-zinc-800 rounded-xl space-y-2.5 transition duration-200">
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="text-gray-200 text-[11px]">{item.label}</span>
                    <span className="text-emerald-400 font-mono">{maturityScores[item.key as keyof typeof maturityScores]} / 10</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="0.5"
                    value={maturityScores[item.key as keyof typeof maturityScores]} 
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setMaturityScores(prev => ({ ...prev, [item.key]: val }));
                    }}
                    className="w-full accent-[#E10600] h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-gray-500 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 5 Phases de Croissance de Fiko (The Strategic Plan) */}
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl space-y-6">
            <div>
              <span className="bg-purple-950 text-purple-400 border border-purple-900/40 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                🚀 FIKO POWER PLAY : DOMINATION REGIONALE EN 5 ÉTAPES
              </span>
              <h3 className="text-lg font-black text-white mt-1.5">Le Plan de Vol Stratégique de Koffmann Capital Group</h3>
              <p className="text-xs text-gray-400">Bâtir un fossé de données incontournable (Data-Moat) et développer les barrières à l'entrée par phases d'exécution.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative">
              {[
                {
                  phase: 1,
                  title: "PHASE 1 : Les 50 Clients",
                  desc: "Concentration intense sur un noyau de 50 entreprises actives. Observation brute des points de friction, objections et taux de conversion réels.",
                  action: "Priorité UX & Retours",
                  color: "from-blue-950/20 to-blue-900/5",
                  badge: "Bootstrapping"
                },
                {
                  phase: 2,
                  title: "PHASE 2 : Data Network",
                  desc: "Mise en place de l' index d'IA sectorielles (Immobilier, Resto, Assurance, Formation) pour capter les objections récurrentes et les heures optimales.",
                  action: "Fiko Data Network Core",
                  color: "from-pink-950/20 to-pink-900/5",
                  badge: "Fonds Data-Moat"
                },
                {
                  phase: 3,
                  title: "PHASE 3 : AI Benchmark",
                  desc: "Comparateurs d'efficacité. Offrez aux dirigeants un comparatif immédiat entre leur taux de conversion ROS et les standards de leur secteur.",
                  action: "Benchmark Sectoriel",
                  color: "from-amber-950/20 to-amber-900/5",
                  badge: "Intelligence"
                },
                {
                  phase: 4,
                  title: "PHASE 4 : Partner Network",
                  desc: "Déploiement du réseau d'affiliation récurrent (20%) pour community managers, consultants et freelances. Le levier de croissance organique ultime.",
                  action: "Commissions Récurrentes",
                  color: "from-emerald-950/20 to-emerald-900/5",
                  badge: "Réseau Affiliés"
                },
                {
                  phase: 5,
                  title: "PHASE 5 : Certified Experts",
                  desc: "Créer un écosystème d'intégrateurs professionnels certifiés KCG sur Fiko OS par secteur vertical. Une barrière concurrentielle infranchissable.",
                  action: "Écosystème Certifié",
                  color: "from-red-950/20 to-red-900/5",
                  badge: "Empire SaaS"
                }
              ].map((p, idx) => (
                <div key={idx} className="bg-gradient-to-br from-zinc-950 to-black border border-zinc-900/80 hover:border-[#E10600]/40 p-5 rounded-xl flex flex-col justify-between space-y-4 transition duration-300 relative group">
                  <div className="absolute top-2.5 right-2.5 text-[8px] uppercase tracking-widest font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850">
                    {p.badge}
                  </div>
                  <div className="space-y-2">
                    <span className="text-2xl font-black text-[#E10600] block">0{p.phase}</span>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#E10600] transition-colors">{p.title}</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="bg-[#E10600]/5 hover:bg-[#E10600]/10 p-2 rounded text-center text-[10px] font-mono text-gray-300 border border-[#E10600]/20 flex items-center justify-center gap-1 transition">
                    <Sparkles size={11} className="text-yellow-500" /> {p.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Projections Financières & Interactive MRR Calculator */}
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-900 pb-4 gap-4">
              <div>
                <span className="bg-emerald-950 text-[#25D366] border border-emerald-900/40 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                  💰 FIKO REVENUE SIMULATOR (MRR)
                </span>
                <h3 className="text-lg font-black text-white mt-1.5">Vision Financière : Abonnements Récurrents KCG</h3>
                <p className="text-xs text-gray-400">Modélisez les rendements mensuels en ajustant le nombre d'entreprises clientes actives.</p>
              </div>
              <div className="bg-black/60 p-4 rounded-xl border border-zinc-900 text-right min-w-[280px]">
                <span className="text-[9px] text-gray-500 uppercase font-black block mb-1">REVENU MENSUEL RÉCURRENT (MRR) PROJETÉ</span>
                <span className="text-2xl font-mono font-black text-[#25D366] block">
                  {Math.round(projectedClientsCount * 0.60 * 19900 + projectedClientsCount * 0.25 * 49900 + projectedClientsCount * 0.10 * 99000 + projectedClientsCount * 0.05 * 199000).toLocaleString()} <span className="text-xs text-gray-400 font-sans">FCFA/mois</span>
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Presets and range slider */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                  <label className="text-xs font-black text-gray-300">NOMBRE D'ENTREPRISES CLIENTES ACTIVES (N) :</label>
                  <div className="flex overflow-x-auto gap-2">
                    {[
                      { count: 50, label: '50 Clients (Phase 1)' },
                      { count: 100, label: '100 Clients' },
                      { count: 500, label: '500 Clients (22M)' },
                      { count: 2000, label: '2 000 Clients (88M)' }
                    ].map((p) => (
                      <button 
                        key={p.count}
                        onClick={() => setProjectedClientsCount(p.count)} 
                        className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition cursor-pointer ${projectedClientsCount === p.count ? 'bg-[#E10600] text-white border-none' : 'bg-black text-gray-400 hover:text-white border border-zinc-900'}`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="10" 
                    max="3000" 
                    step="10"
                    value={projectedClientsCount} 
                    onChange={(e) => setProjectedClientsCount(parseInt(e.target.value))}
                    className="flex-1 accent-[#E10600] h-2 bg-black rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="bg-black border border-zinc-900 px-4 py-2.5 rounded-xl text-xs font-mono font-black text-white shrink-0 min-w-[120px] text-center">
                    {projectedClientsCount.toLocaleString()} PMEs
                  </span>
                </div>
              </div>

              {/* Distribution tiers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                <div className="bg-zinc-950/60 border border-zinc-900 p-4.5 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-1 bg-zinc-900/80 border-l border-b border-zinc-850 text-[8px] font-mono font-bold text-zinc-500">60% TIER</div>
                  <span className="bg-[#E10600]/10 text-[#E10650] border border-[#E10600]/20 text-[9px] font-black uppercase px-2 py-0.5 rounded">Starter</span>
                  <p className="text-[10px] text-gray-400 mt-2">19 900 FCFA / mois</p>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <span className="text-[8px] text-gray-500 block">CLIENTS ACTIFS</span>
                      <strong className="text-lg font-mono font-black text-white">{Math.round(projectedClientsCount * 0.60)}</strong>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">{(Math.round(projectedClientsCount * 0.60) * 19900).toLocaleString()} F</span>
                  </div>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-900 p-4.5 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-1 bg-zinc-900/80 border-l border-b border-zinc-850 text-[8px] font-mono font-bold text-zinc-500">25% TIER</div>
                  <span className="bg-blue-950/20 text-blue-400 border border-blue-900/20 text-[9px] font-black uppercase px-2 py-0.5 rounded">Business</span>
                  <p className="text-[10px] text-gray-400 mt-2">49 900 FCFA / mois</p>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <span className="text-[8px] text-gray-500 block">CLIENTS ACTIFS</span>
                      <strong className="text-lg font-mono font-black text-white">{Math.round(projectedClientsCount * 0.25)}</strong>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">{(Math.round(projectedClientsCount * 0.25) * 49900).toLocaleString()} F</span>
                  </div>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-900 p-4.5 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-1 bg-zinc-900/80 border-l border-b border-zinc-850 text-[8px] font-mono font-bold text-zinc-500">10% TIER</div>
                  <span className="bg-purple-950/20 text-purple-400 border border-purple-900/20 text-[9px] font-black uppercase px-2 py-0.5 rounded">Scale</span>
                  <p className="text-[10px] text-gray-400 mt-2">99 000 FCFA / mois</p>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <span className="text-[8px] text-gray-500 block">CLIENTS ACTIFS</span>
                      <strong className="text-lg font-mono font-black text-white">{Math.round(projectedClientsCount * 0.10)}</strong>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">{(Math.round(projectedClientsCount * 0.10) * 99000).toLocaleString()} F</span>
                  </div>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-900 p-4.5 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-1 bg-zinc-900/80 border-l border-b border-zinc-850 text-[8px] font-mono font-bold text-zinc-500">5% TIER</div>
                  <span className="bg-amber-950/20 text-amber-400 border border-amber-900/20 text-[9px] font-black uppercase px-2 py-0.5 rounded">Elite</span>
                  <p className="text-[10px] text-gray-400 mt-2">199 000 FCFA / mois</p>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <span className="text-[8px] text-gray-500 block">CLIENTS ACTIFS</span>
                      <strong className="text-lg font-mono font-black text-white">{Math.round(projectedClientsCount * 0.05)}</strong>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#25D366]">{(Math.round(projectedClientsCount * 0.05) * 199000).toLocaleString()} F</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Fiko OS Architecture Visual Constellation */}
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-900 pb-4">
              <div>
                <span className="bg-blue-950 text-blue-400 border border-blue-900/40 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                  🌌 HISTOIRE DE CONSTELLATION TECHNIQUE : FIKO OS
                </span>
                <h3 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
                  <Layers className="text-[#E10600]" size={18} /> Architecture Centralisée Tout-en-Un : Fiko OS
                </h3>
                <p className="text-xs text-gray-400">La suite logicielle complète centralisée pour les PMEs sous un tenant d'accès unique.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'Fiko Connect', desc: 'Acquisition & Relance WhatsApp', icon: '💬', status: 'Production live' },
                { label: 'Fiko CRM', desc: 'Base client fiko_memory', icon: '🗂️', status: 'Production live' },
                { label: 'Fiko Pay', desc: 'Encaissement Multi-Devises', icon: '💳', status: 'Production live' },
                { label: 'Fiko Brain', desc: 'Connaissances et base FAQ', icon: '🧠', status: 'Production live' },
                { label: 'Fiko Analytics', desc: 'Executive Weekly PDF Reports', icon: '📊', status: 'Production live' },
                { label: 'Fiko Voice', desc: 'Call vocal intelligent (Wolof/Nouchi)', icon: '🎙️', status: 'Phase R&D' },
                { label: 'Fiko SEO', desc: 'Génération automatique de vitrines', icon: '🌐', status: 'Roadmap M+6' }
              ].map((module, idx) => (
                <div key={idx} className="bg-black border border-zinc-900 hover:border-zinc-800 p-4 rounded-xl flex flex-col justify-between space-y-3 transition duration-200">
                  <div>
                    <span className="text-2xl block">{module.icon}</span>
                    <h4 className="text-xs font-black text-white mt-2 leading-tight">{module.label}</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-snug">{module.desc}</p>
                  </div>
                  <span className={`text-[8px] font-mono uppercase font-black text-center px-1.5 py-0.5 rounded ${
                    module.status.includes('live') 
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-900/30' 
                      : module.status.includes('R&D') 
                        ? 'bg-purple-950/50 text-purple-300 border border-purple-900/30 animate-pulse'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                  }`}>
                    {module.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* RENDER TAB 6: KNOWLEDGE PDF LOADER & AGENT MARKETPLACE (Previous dashboard core, preserved perfectly) */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          
          {/* BRAIN FAQS INDEXER */}
          <div className="bg-[#0a0a0f] p-6 rounded-2xl border border-gray-900 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fiko-red/2 rounded-full blur-3xl pointer-events-none"></div>
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[#E10600] font-black text-[9px] uppercase tracking-widest bg-red-955 border border-red-900/30 px-2 py-0.5 rounded">
                    Fiko Brain Base v2.0
                  </span>
                  <h3 className="text-xl font-black text-white mt-1.5 flex items-center gap-2">
                    🧠 Base de Connaissances Active & Gestion Documentaire
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#25D366]">{knowledgePointCount}</span>
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider font-extrabold">Points d'information IA</p>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Déposez vos grilles tarifaires, vos documents d'entreprise ou renseignez simplement l'URL de votre boutique en ligne. Votre agent Fiko analyse et modélise instantanément l'intégralité du contenu pour des réponses parfaites à vos prospects 24h/24.
              </p>

              {/* Existing Documents List */}
              <div className="space-y-2 mb-6">
                <span className="text-[10px] text-gray-500 tracking-wider font-bold uppercase block mb-1">Sources de connaissances synchronisées :</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {brainFiles.map((file, idx) => (
                    <div key={idx} className="bg-black/60 p-3 rounded-xl border border-gray-900 flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 bg-transparent overflow-hidden">
                        {file.name.includes('CIV') || file.name.includes('pdf') || file.name.includes('.txt') ? (
                          <FileText className="text-blue-400 shrink-0" size={16} />
                        ) : (
                          <Globe className="text-[#25D366] shrink-0" size={16} />
                        )}
                        <div className="text-left overflow-hidden">
                          <p className="text-xs font-bold text-gray-200 truncate">{file.name}</p>
                          <p className="text-[9px] text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <Check className="text-[#25D366] shrink-0" size={14} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload Input and Crawl Action Bar */}
            <div className="border-t border-gray-950 pt-5 mt-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Fake Crawlers web */}
                <div className="relative w-full flex-1">
                  <input 
                    type="text" 
                    placeholder="https://votre-boutique.ci/produits" 
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full bg-black border border-gray-900 rounded-xl p-3 text-xs focus:outline-none focus:border-fiko-red text-white placeholder:text-gray-700"
                  />
                  <button 
                onClick={handleParseWeblinkSim}
                disabled={indexingSystem || !newUrl}
                className="absolute right-2 top-1.5 bg-fiko-red text-white py-1.5 px-4 rounded-lg font-bold text-[10px] hover:bg-red-700 transition disabled:opacity-50"
                  >
                Scanner l'URL 🌐
                  </button>
                </div>

                {/* Document upload simulation */}
                <button 
                  onClick={handleFileUploadSim}
                  disabled={indexingSystem}
                  className="w-full sm:w-auto shrink-0 bg-gray-900 hover:bg-gray-850 border border-gray-800 text-white font-extrabold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
                >
                  {indexingSystem ? "Traitement avec l'IA..." : "Uploader PDF / Doc (CIV) 📂"}
                </button>
              </div>
            </div>
          </div>

          {/* FIKO MARKETPLACE COMMERCIAUX */}
          <div className="bg-[#0a0a0f] p-6 md:p-8 rounded-2xl border border-gray-900 shadow-lg relative">
            <div className="absolute top-0 right-1/2 transform translate-x-1/2 w-96 h-20 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="text-yellow-500 animate-pulse" size={18} />
                  <h3 className="text-xl font-black text-white">👑 Marketplace d'Agents Spécialisés IA</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Déployez en un clic un commercial entraîné sur les spécificités de votre créneau d'activité. (Disponible pour plans Business, Scale & Elite)
                </p>
              </div>
              <span className="text-[9px] bg-purple-950 text-purple-400 font-black tracking-widest uppercase border border-purple-900 px-3 py-1 rounded-full shrink-0">
                Premium Templates CIV
              </span>
            </div>

            {/* Agents grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => {
                const isInstalled = installedAgentIds.includes(agent.id);
                return (
                  <div 
                    key={agent.id} 
                    className="bg-black/60 border border-gray-950 hover:bg-[#0d0d0d] hover:border-gray-850 p-4 rounded-xl flex flex-col justify-between transition-all group h-full"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-2xl pt-1">{agent.icon}</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          isInstalled ? "bg-green-950 text-[#25D366] border border-green-800" : "bg-gray-900 text-gray-500"
                        }`}>
                          {isInstalled ? "Configuré ✓" : "Inactif"}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-fiko-red transition-colors">{agent.name}</h4>
                      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{agent.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-950">
                      <button 
                        onClick={() => toggleAgentInstall(agent.id)}
                        className={`w-full py-2 rounded-lg font-black text-[10px] text-center transition flex justify-center items-center gap-1.5 ${
                          isInstalled ? "bg-gray-900 text-gray-300 hover:bg-gray-800" : "bg-fiko-red text-white hover:bg-red-700"
                        }`}
                      >
                        {isInstalled ? "Désactiver l'agent" : "Activer en 1 clic ⚡"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PARRAINAGE WIDGET */}
          <div className="bg-[#111] p-6 rounded-2xl border border-gray-900 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="text-yellow-500" size={20} />
                <h3 className="text-lg font-black text-white">💰 Gagnez des commissions récurrentes (CIV Cash)</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Invitez vos partenaires de vente et collègues entrepreneurs ivoiriens sur Fiko Connect et empochez de fiers bonus de parrainage de 10% mensuels récurrents !
              </p>

              <div className="bg-black/80 rounded-xl p-3 border border-gray-900 space-y-2.5 text-xs mb-4">
                <div className="flex justify-between items-center text-gray-300">
                  <span>1 Parrainage option <strong>Starter</strong> :</span>
                  <span className="text-[#25D366] font-extrabold">5 000 FCFA / mois</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>1 Parrainage option <strong>Business</strong> :</span>
                  <span className="text-[#25D366] font-extrabold">10 000 FCFA / mois</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>1 Parrainage option <strong>Elite</strong> :</span>
                  <span className="text-yellow-500 font-extrabold">25 000 FCFA / mois</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black block">Votre lien affilié magique :</span>
              <div className="bg-black p-2.5 rounded-xl border border-gray-900 flex justify-between items-center">
                <span className="font-mono text-[10px] text-gray-400 truncate">fiko.connect/join?ref=koffmann2026</span>
                <button 
                  onClick={copyReferralLink}
                  className="bg-[#E10600] text-white px-3 py-1.5 rounded-lg font-black text-[10px] hover:bg-red-700 transition active:scale-95 shrink-0"
                >
                  {copiedReferral ? "Lien copié ! ✓" : "Copier"}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* RENDER TAB: NETWORK & INDEX LAYER */}
      {activeTab === 'network' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          
          {/* Header section */}
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
            <div>
              <span className="bg-purple-950 text-purple-450 border border-purple-800/50 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                🌍 THE NETWORK ENGINE (FIKO KNOWLEDGE INDEX)
              </span>
              <h3 className="text-xl font-black text-white mt-1.5 flex items-center gap-2">
                <Globe className="text-purple-400 animate-pulse" size={18} /> FIKO Africa Commerce Index : L'observateur Continental
              </h3>
              <p className="text-xs text-gray-450 mt-1">
                Le premier index analytique en temps réel mesurant l'activité commerciale sémantique et les taux de conversion réels pour l'Afrique de l'Ouest francophone.
              </p>
            </div>
          </div>

          {/* Commerce Index Selector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Country Selector Card */}
            <div className="bg-[#0e0e15] border border-gray-900 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-gray-950 pb-2">
                📍 Sélection du marché (2026-2027)
              </h4>
              <div className="space-y-2">
                {[
                  { code: 'CI', name: 'Côte d’Ivoire', index: '92.4 pts', speed: '11s', closing: '17%' },
                  { code: 'SN', name: 'Sénégal', index: '88.1 pts', speed: '14s', closing: '15%' },
                  { code: 'CM', name: 'Cameroun', index: '81.5 pts', speed: '19s', closing: '12%' },
                  { code: 'BJ', name: 'Bénin', index: '77.8 pts', speed: '18s', closing: '13%' },
                  { code: 'TG', name: 'Togo', index: '72.0 pts', speed: '22s', closing: '11%' }
                ].map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCountry(c.code as any)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer ${selectedCountry === c.code ? 'bg-purple-950/40 border-purple-850 text-white' : 'bg-black/40 border-zinc-904/60 text-gray-400 hover:text-white hover:bg-zinc-900/35'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{(countryConfig as any)[c.code]?.flag}</span>
                      <div>
                        <span className="text-xs font-extrabold block">{c.name}</span>
                        <span className="text-[9px] text-gray-500 font-mono">Index Commercial : {c.index}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black ${selectedCountry === c.code ? 'bg-purple-800 text-white' : 'bg-zinc-900 text-gray-400'}`}>
                      {c.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Country Specific Index Stats */}
            <div className="bg-[#0e0e15] border border-gray-900 rounded-2xl p-5 space-y-4 lg:col-span-2">
              <div className="flex justify-between items-center border-b border-gray-950 pb-2">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
                  📈 Métriques Localisées — {(countryConfig as any)[selectedCountry]?.name}
                </h4>
                <div className="text-[10px] bg-emerald-950 text-emerald-450 px-2 py-1 rounded font-mono font-bold">
                  Wave / OM Intégration Native Actived
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-black/60 p-4 rounded-xl border border-zinc-900">
                  <span className="text-[9px] text-zinc-500 uppercase block font-medium">Activité Réseau</span>
                  <strong className="text-lg font-mono text-white block mt-1">
                    {selectedCountry === 'CI' ? '92.4 %' : selectedCountry === 'SN' ? '88.1 %' : selectedCountry === 'CM' ? '81.5 %' : selectedCountry === 'BJ' ? '77.8 %' : '72.0 %'}
                  </strong>
                  <span className="text-[8px] text-emerald-400 font-mono">Très Actif ✓</span>
                </div>

                <div className="bg-black/60 p-4 rounded-xl border border-zinc-900">
                  <span className="text-[9px] text-zinc-500 uppercase block font-medium flex items-center gap-1">Réponse WhatsApp</span>
                  <strong className="text-lg font-mono text-purple-400 block mt-1">
                    {selectedCountry === 'CI' ? '11 sec' : selectedCountry === 'SN' ? '14 sec' : selectedCountry === 'CM' ? '19 sec' : selectedCountry === 'BJ' ? '18 sec' : '22 sec'}
                  </strong>
                  <span className="text-[8px] text-gray-550 font-mono">Optimisé sémantique</span>
                </div>

                <div className="bg-black/60 p-4 rounded-xl border border-zinc-900">
                  <span className="text-[9px] text-zinc-500 uppercase block font-medium">Conversion Moyenne</span>
                  <strong className="text-lg font-mono text-emerald-400 block mt-1">
                    {selectedCountry === 'CI' ? '17.2 %' : selectedCountry === 'SN' ? '15.0 %' : selectedCountry === 'CM' ? '12.4 %' : selectedCountry === 'BJ' ? '13.1 %' : '11.0 %'}
                  </strong>
                  <span className="text-[8px] text-zinc-500 font-mono">Vs 5% e-mail standard</span>
                </div>

                <div className="bg-black/60 p-4 rounded-xl border border-zinc-900">
                  <span className="text-[9px] text-zinc-500 uppercase block font-medium">Top Performers Fiko</span>
                  <strong className="text-lg font-mono text-yellow-500 block mt-1">
                    {selectedCountry === 'CI' ? '24.8 %' : selectedCountry === 'SN' ? '22.0 %' : selectedCountry === 'CM' ? '19.5 %' : selectedCountry === 'BJ' ? '20.2 %' : '18.1 %'}
                  </strong>
                  <span className="text-[8px] text-zinc-500 font-mono">IA + Scripts KCG</span>
                </div>
              </div>

              {/* Index Narrative Box */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3 text-xs leading-relaxed text-zinc-300">
                <p>
                  <strong>💡 Analyse Fiko Insight pour le pays {(countryConfig as any)[selectedCountry]?.name} :</strong>
                  {" "}Le canal WhatsApp couplé à une passerelle de paiement automatisée ({((countryConfig as any)[selectedCountry]?.providers || []).slice(0, 2).join(' / ')}) observe une accélération sémantique majeure ce trimestre. Les PME utilisant <em>fiko_brain</em> augmentent leur vélocité d'encaissement de +115% face au modèle de relance traditionnel. Modèle d'acquisition d'actifs sémantiques éprouvé.
                </p>
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] bg-purple-950 text-purple-400 border border-purple-900 px-2 py-0.5 rounded uppercase font-black">Recommandation payante</span>
                  <p className="text-[10px] text-gray-450 font-semibold">Les rapports de tendances sémantiques complets CIV/SEN 2027 sont réservés aux comptes Fiko Insights.</p>
                </div>
              </div>

              {/* Fiko Insights Option Card */}
              <div className="bg-[#110f18] border border-purple-900/40 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-purple-400 font-black text-xs block uppercase">💎 ACTIVER FIKO INSIGHTS & INDEX (ADD-ON)</span>
                  <p className="text-[11px] text-gray-440 leading-snug">Vendez l'accès aux benchmarks sectoriels et rapports de conversion exclusifs à vos clients locaux.</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-white font-mono font-black text-xs">29 900 FCFA / mois</span>
                  <button className="bg-purple-700 text-white px-4 py-2 rounded-lg font-black text-xs hover:bg-purple-850 transition shadow-[0_4px_10px_rgba(147,51,234,0.3)]">
                    Souscrire
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Africa Expansion Roadmap 2027-2028 */}
          <div className="bg-[#0e0e15] border border-gray-900 rounded-2xl p-6 space-y-6">
            <div className="border-b border-gray-950 pb-3">
              <span className="text-[9px] text-gray-500 uppercase font-black block">VISION COLLECTIVE</span>
              <h4 className="text-sm font-black text-white">Roadmap d'Expansion FIKO AFRICA NETWORK (2027-2028)</h4>
              <p className="text-xs text-zinc-400 mt-0.5">La transformation officielle du logiciel en réseau de domination de vente augmentée par IA.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-black/40 border border-[#25D366]/30 p-4 rounded-xl space-y-2 relative">
                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-[#25D366] rounded-full animate-pulse"></span>
                <span className="text-[#25D366] font-bold text-[9px] uppercase font-mono block">PHASE 1 : ACTIF ✓</span>
                <h5 className="text-xs font-black text-white">Côte d'Ivoire</h5>
                <p className="text-[11px] text-gray-400 font-sans">Objectif historique de 500 clients réguliers. Base d'enrichissement de fiko_brain ouest-africain.</p>
              </div>

              <div className="bg-black/40 border border-purple-900/40 p-4 rounded-xl space-y-2">
                <span className="text-purple-400 font-bold text-[9px] uppercase font-mono block">PHASE 2 : EXPANSION SAAS</span>
                <h5 className="text-xs font-black text-white">Sénégal, Bénin, Togo</h5>
                <p className="text-[11px] text-gray-400 font-sans">Pénétration du marché de l'UEMOA. Partage automatique de benchmarks inter-frontaliers.</p>
              </div>

              <div className="bg-black/40 border border-zinc-900 p-4 rounded-xl space-y-2">
                <span className="text-gray-500 font-bold text-[9px] uppercase font-mono block">PHASE 3 : CONTINENTAL REACH</span>
                <h5 className="text-xs font-black text-white">Cameroun, Gabon, Congo</h5>
                <p className="text-[11px] text-gray-400 font-sans">Conquête de l'Afrique Centrale et interconnexion des corridors MTN/Orange Money.</p>
              </div>

              <div className="bg-purple-950/20 border border-purple-800/40 p-4 rounded-xl space-y-1">
                <span className="text-purple-300 font-bold text-[9px] uppercase font-mono block">🏆 PHASE FINALE : NETWORK MOAT</span>
                <h5 className="text-xs font-black text-white">FIKO AFRICA NETWORK</h5>
                <p className="text-[11px] text-gray-400 font-sans">Le premier écosystème commercial augmenté par IA raccordant les PME aux leads qualifiés.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* RENDER TAB: PARTNER NETWORK & VALUE GENERATOR */}
      {activeTab === 'partners' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          
          {/* Header section */}
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-700/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="bg-purple-950 text-purple-400 border border-purple-900/40 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                  🤝 ECOSYSTEM DISTRIBUTION MATRIX (MARKET NETWORK)
                </span>
                <h3 className="text-xl font-black text-white mt-1.5 flex items-center gap-2">
                  <Handshake className="text-purple-400 animate-pulse" size={18} /> Réseau d'Écosystème & Partenaires Certifiés
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Les partenaires certifiés forment notre canal d'acquisition, de support et de distribution. Ils connectent physiquement Fiko Connect à l'économie réelle d'Afrique de l'Ouest.
                </p>
              </div>
              
              <div className="bg-zinc-950 border border-zinc-900 p-3.5 rounded-xl text-right shrink-0">
                <span className="text-[9px] text-gray-550 uppercase font-black block font-mono">COMMISSIONS DE RECOMMANDATION VERSÉES</span>
                <strong className="text-lg font-mono text-emerald-400 block mt-0.5">{partnerReferralAmount.toLocaleString()} FCFA</strong>
                <button 
                  onClick={() => {
                    alert("Félicitations Koffmann ! Vos commissions accumulées ont été créditées par Wave sur votre compte principal.");
                    setPartnerReferralAmount(0);
                  }}
                  disabled={partnerReferralAmount === 0}
                  className="text-[9px] text-zinc-450 hover:text-[#25D366] font-extrabold uppercase mt-1 cursor-pointer underline disabled:opacity-45"
                >
                  Retirer via Wave Pay
                </button>
              </div>
            </div>
          </div>

          {/* Sub Navigation for Ecosystem Layer */}
          <div className="flex gap-2 border-b border-gray-900 pb-0.5 overflow-x-auto">
            <button
              onClick={() => setAcademyTab('courses')}
              className={`pb-3 px-4 text-xs font-bold uppercase transition-all tracking-wider relative cursor-pointer whitespace-nowrap ${academyTab === 'courses' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 hover:text-white'}`}
            >
              💼 Annuaire & Opportunités
            </button>
            <button
              onClick={() => setAcademyTab('classroom')}
              className={`pb-3 px-4 text-xs font-bold uppercase transition-all tracking-wider relative cursor-pointer whitespace-nowrap ${academyTab === 'classroom' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 hover:text-white'}`}
            >
              🎓 Fiko University & Certification
            </button>
          </div>

          {academyTab === 'courses' ? (
            <>
              {/* Module 1: Fiko Opportunities (The Live Matchmaker) */}
              <div className="bg-[#0e0e15] border border-gray-900 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-950 pb-3 gap-2">
                  <div>
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/50 text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono">
                      📡 MODULE 1 : FIKO OPPORTUNITIES INBOUND
                    </span>
                    <h4 className="text-sm font-black text-white mt-1">Générateur d'Opportunités d'Affaires sémantiques (Matchmaking)</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 font-sans">Intelligence de détection des besoins non couverts pour les attribuer et générer des commissions automatiques.</p>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded font-mono font-black flex items-center gap-1">
                    ⚡ {opportunities.length} Leads disponibles
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {opportunities.map((opp) => (
                    <div key={opp.id} className="bg-black/65 border border-zinc-900 p-4 rounded-xl flex flex-col justify-between space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 text-[8px] bg-purple-950 px-2.5 py-1 text-purple-400 rounded-bl font-black uppercase font-mono tracking-wider">{opp.sector}</div>
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[9px] text-gray-500 uppercase font-bold block">{opp.client}</span>
                        <h5 className="text-xs font-black text-white leading-relaxed">{opp.need}</h5>
                        <p className="text-[11px] text-gray-400">Budget estimé : <strong className="text-white font-mono">{opp.revenue.toLocaleString()} FCFA</strong></p>
                      </div>

                      <div className="space-y-2 border-t border-zinc-950 pt-2 text-xs">
                        <div className="bg-purple-900/10 border border-purple-800/20 p-2.5 rounded-lg">
                          <span className="text-[8px] text-purple-400 block uppercase font-black">Partenaire suggéré par sémantique</span>
                          <strong className="text-xs text-zinc-300 block mt-0.5">{opp.matchedPartner}</strong>
                        </div>

                        <button
                          onClick={() => {
                            alert(`Besoin de "${opp.client}" transféré et clôturé avec "${opp.matchedPartner}". Commissions de parrainage de 15 000 FCFA ajoutées à votre solde !`);
                            setPartnerReferralAmount(prev => prev + 15000);
                            setOpportunities(prev => prev.filter(o => o.id !== opp.id));
                          }}
                          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-black uppercase text-[9px] tracking-wider py-2 rounded-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Attribuer et toucher Commission</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {opportunities.length === 0 && (
                    <div className="col-span-3 text-center py-8 text-xs text-gray-400 bg-black rounded-xl border border-dashed border-zinc-800">
                      🎉 Toutes les opportunités d'affaires ont été recommandées avec succès aux partenaires certifiés.
                    </div>
                  )}
                </div>
              </div>

              {/* Module 2: The fiko certified partners directory */}
              <div className="bg-[#0e0e15] border border-gray-900 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-950 pb-3 gap-2">
                  <div>
                    <span className="bg-purple-950 text-purple-400 border border-purple-900/50 text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono">
                      📇 MODULE 2 : partner_directory (2026-2027)
                    </span>
                    <h4 className="text-sm font-black text-white mt-1">Annuaire public de l'Écosystème Fiko</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 font-sans">Recruter et mandater des consultants, intégrateurs, experts IA et formateurs certifiés.</p>
                  </div>
                  <button
                    onClick={() => setShowInvitePartnerModal(true)}
                    className="bg-black border border-purple-800 hover:bg-purple-955 text-purple-300 font-black text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> Devenir Partenaire Certifié
                  </button>
                </div>

                {/* Directory Controls */}
                <div className="flex flex-col md:flex-row justify-between gap-3 text-xs bg-black/40 p-3 rounded-xl border border-zinc-950">
                  {/* Category selector */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'all', label: 'Tout l\'écosystème' },
                      { id: 'integrateur', label: '🛠️ Intégrateurs CRM' },
                      { id: 'agency', label: '📢 Agences de Growth' },
                      { id: 'expert_crm', label: '💻 Experts Brain' },
                      { id: 'expert_ia', label: '🧠 Prompt Engineers' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedPartnerCategory(cat.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition cursor-pointer font-sans ${selectedPartnerCategory === cat.id ? 'bg-purple-600 text-white' : 'text-gray-450 hover:text-white hover:bg-zinc-950'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Search bar */}
                  <div className="relative w-full md:w-64">
                    <Search size={14} className="absolute left-3 top-[10px] text-gray-500" />
                    <input
                      type="text"
                      placeholder="Rechercher un partenaire, région..."
                      value={partnerFilterQuery}
                      onChange={(e) => setPartnerFilterQuery(e.target.value)}
                      className="w-full bg-black/90 p-2 pl-9 rounded-lg text-xs text-white border border-zinc-900/60 focus:outline-none focus:border-purple-800 font-sans"
                    />
                  </div>
                </div>

                {/* List of Partners with interactive Trust Score */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Kamara Digital Agence", location: "Cocody, Abidjan 🇨🇮", rating: "⭐ 4.90", trustScore: 97, reviews: "98/100", responseTime: "12s", revenueSimulated: "12 400 000 FCFA", nps: 98, seniority: "14 mois", level: "Accredited Agency", category: "agency", services: "Campagnes de pubs Meta & Cohérence sémantique de l'IA", contacts: "contact@kamara.ci", desc: "Leader de l'implémentation de fiko_closer en Côte d'Ivoire. Aide les PME e-commerce à clore en moins de 10 min." },
                    { name: "Yao Koffi (Consultant Certifié)", location: "Dakar, Sénégal 🇸🇳", rating: "⭐ 4.85", trustScore: 94, reviews: "96/100", responseTime: "18s", revenueSimulated: "8 700 000 FCFA", nps: 94, seniority: "9 mois", level: "Certified Expert", category: "expert_crm", services: "Interconnections API, fiko_brain et fiko_memory complexes", contacts: "koffi@fiko-partner.net", desc: "Expert en branchements Salesforce / HubSpot ouest-africains avec le CRM augmenté de Fiko pour vos clients." },
                    { name: "Fatou Diatta (Growth Marketer)", location: "Yoff, Thiaroye 🇸🇳", rating: "⭐ 4.95", trustScore: 98, reviews: "99/100", responseTime: "11s", revenueSimulated: "15 200 000 FCFA", nps: 99, seniority: "18 mois", level: "Certified Trainer", category: "expert_ia", services: "Création de FAQ sémantiques et de scripts locaux", contacts: "fatou@growtheast.com", desc: "Ancienne consultante Orange Sénégal. Spécialisée dans la tonalité wolof et nouchi hyper-locale de l'IA." },
                    { name: "Bamba Tech Integrations", location: "Douala, Cameroun 🇨🇲", rating: "⭐ 4.75", trustScore: 89, reviews: "93/100", responseTime: "24s", revenueSimulated: "4 100 000 FCFA", nps: 91, seniority: "6 mois", level: "Accredited Integrator", category: "integrateur", services: "Déploiement physique Fiko, Onboarding de commerciaux", contacts: "bamba@bambatech.cm", desc: "Formateurs certifiés pour les équipes de vente terrain. Assure une maîtrise complète de Fiko Pay." }
                  ]
                    .filter(p => selectedPartnerCategory === 'all' || p.category === selectedPartnerCategory)
                    .filter(p => !partnerFilterQuery || p.name.toLowerCase().includes(partnerFilterQuery.toLowerCase()) || p.services.toLowerCase().includes(partnerFilterQuery.toLowerCase()) || p.location.toLowerCase().includes(partnerFilterQuery.toLowerCase()))
                    .map((p, idx) => (
                      <div key={idx} className="bg-black/80 border border-zinc-900/70 p-4 rounded-xl flex flex-col justify-between space-y-4 relative">
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-purple-400 font-mono font-bold block">{p.location} — {p.level}</span>
                              <h5 className="text-xs font-black text-white">{p.name}</h5>
                            </div>
                            
                            {/* Trust Score block click trigger */}
                            <button
                              onClick={() => setActivePartnerDetailIndex(activePartnerDetailIndex === idx ? null : idx)}
                              className="bg-purple-950/80 hover:bg-purple-900/90 border border-purple-800/40 text-purple-300 px-2 py-1.5 rounded-lg text-[10px] font-mono font-black flex flex-col items-end transition cursor-pointer"
                              title="Cliquer pour voir le score de confiance"
                            >
                              <span className="text-[8px] text-gray-400 font-medium font-sans">FIKO TRUST SCORE</span>
                              <span className="text-emerald-400 text-xs font-black">{p.trustScore}/100</span>
                            </button>
                          </div>

                          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{p.desc}</p>
                          
                          <div className="flex flex-wrap gap-1 pt-1">
                            <span className="bg-purple-950/40 text-purple-300 font-semibold px-2 py-0.5 rounded text-[9px] border border-purple-900/20">{p.services}</span>
                          </div>

                          {/* Interactive Trust Score Popover/Drawer breakdown */}
                          {activePartnerDetailIndex === idx && (
                            <div className="bg-[#0c0c12] border border-purple-900/60 p-3.5 rounded-xl space-y-2 text-xs absolute inset-x-3 bottom-14 z-10 shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
                              <div className="flex justify-between items-center border-b border-gray-900 pb-1.5">
                                <span className="font-extrabold text-white text-[10px] uppercase tracking-wider flex items-center gap-1">
                                  <ShieldCheck className="text-purple-400" size={13} /> Trust Score Protocol V2
                                </span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActivePartnerDetailIndex(null);
                                  }}
                                  className="text-gray-500 hover:text-white font-bold"
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-[10px] font-sans">
                                <div className="bg-black/40 p-1.5 rounded border border-zinc-900 flex justify-between">
                                  <span className="text-gray-400">⭐ Avis Clients :</span>
                                  <span className="font-mono text-white font-bold">{p.reviews}</span>
                                </div>
                                <div className="bg-black/40 p-1.5 rounded border border-zinc-900 flex justify-between">
                                  <span className="text-gray-400">⏱️ Vitesse de Réponse :</span>
                                  <span className="font-mono text-purple-400 font-bold">{p.responseTime}</span>
                                </div>
                                <div className="bg-black/40 p-1.5 rounded border border-zinc-900 flex justify-between col-span-2">
                                  <span className="text-gray-400">💰 Volume d'Affaires Généré :</span>
                                  <span className="font-mono text-emerald-400 font-bold">{p.revenueSimulated}</span>
                                </div>
                                <div className="bg-black/40 p-1.5 rounded border border-zinc-900 flex justify-between">
                                  <span className="text-gray-400">🔥 Score NPS :</span>
                                  <span className="font-mono text-white font-bold">{p.nps}/100</span>
                                </div>
                                <div className="bg-black/40 p-1.5 rounded border border-zinc-900 flex justify-between">
                                  <span className="text-gray-400">📅 Ancienneté :</span>
                                  <span className="font-mono text-white font-bold">{p.seniority}</span>
                                </div>
                              </div>
                              <p className="text-[9px] text-gray-500 italic mt-1 leading-snug">Calculé dynamiquement via les interactions anonymisées de Fiko Connect.</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 items-center text-xs border-t border-zinc-950 pt-3">
                          <button
                            onClick={() => {
                              alert(`Coordonnées de ${p.name} copiées: (${p.contacts}). Un e-mail d'introduction sémantique direct a été partagé.`);
                            }}
                            className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-350 border border-zinc-800 hover:text-white p-2 rounded-lg text-center text-[9px] transition uppercase font-black cursor-pointer"
                          >
                            Mandater via Fiko Direct
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(p.contacts);
                              alert(`Adresse de contact officielle de ${p.name} copiée !`);
                            }}
                            className="bg-black p-2 rounded-lg border border-zinc-900 hover:bg-zinc-950 text-gray-500 hover:text-white transition"
                            title="Copier les coordonnées directes"
                          >
                            <FileText size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Panel: Fiko University Syllabus representing classes */}
              <div className="bg-[#0e0e15] border border-gray-900 rounded-2xl p-5 space-y-4 lg:col-span-2">
                <div className="border-b border-gray-950 pb-3 flex justify-between items-center">
                  <div>
                    <span className="bg-purple-950 text-purple-400 border border-purple-900/40 text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono">
                      📚 ACADEMY.FIKO.AFRICA LOGGED
                    </span>
                    <h4 className="text-sm font-black text-white mt-1">Syllabus & Formations Commerciales IA</h4>
                  </div>
                  <span className="text-xs font-mono text-purple-400 font-bold">Portail Étudiant Actif ✓</span>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: "wa_sales",
                      title: "1. Vente & Closing sur WhatsApp",
                      sub: "Scripting local, désamorçage d'objections d'Afrique de l'Ouest (CIV/SEN)",
                      lessons: [
                        "Le timing parfait d'engagement (Dimanche soir 3x plus mémorable)",
                        "L'utilisation sémantique du Wolof, Gbaya & Nouchi locale dans l'IA",
                        "Structurer une proposition flash WhatsApp de moins de 160 caractères"
                      ]
                    },
                    {
                      id: "ai_closing",
                      title: "2. Fiko Brain & Automation Expert",
                      sub: "Raccordement sémantique du Moat de données collective",
                      lessons: [
                        "Maîtriser les triggers d'intention Fiko sémantiques",
                        "Injection de FAQ business dans Fiko Memory en un clic",
                        "Interconnecter Salesforce / HubSpot sans écrire de code"
                      ]
                    },
                    {
                      id: "mobile_money_commerce",
                      title: "3. Micro-Acquittement & Mobile Money",
                      sub: "Paiements barrières Wave & Orange Money automatisés",
                      lessons: [
                        "Pourquoi l'acompte mobile à l'épaule résout 80% des désistements",
                        "Configuration des liens profonds (deep links) Wave sécurisés",
                        "Gérer les remboursements sémantiquement sans assistance humaine"
                      ]
                    }
                  ].map((course) => {
                    const progress = completedLessons[course.id] ? Math.round((completedLessons[course.id].length / course.lessons.length) * 100) : 0;
                    return (
                      <div key={course.id} className={`p-4 rounded-xl border transition-all ${activeCourseId === course.id ? 'bg-purple-950/20 border-purple-900/70' : 'bg-black/40 border-zinc-900 hover:border-zinc-800'}`}>
                        <div className="flex justify-between items-start cursor-pointer" onClick={() => { setActiveCourseId(course.id); setViewingLessonIdx(0); }}>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                              <GraduationCap size={15} className="text-purple-400" /> {course.title}
                            </h5>
                            <p className="text-[10px] text-gray-400 leading-snug">{course.sub}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-mono font-black text-purple-400 block">{progress}% Complété</span>
                            <span className="text-[8px] text-gray-500 font-medium block uppercase tracking-wide">Sélectionner</span>
                          </div>
                        </div>

                        {activeCourseId === course.id && (
                          <div className="border-t border-zinc-900/60 mt-3 pt-3 space-y-3">
                            <div className="space-y-1.5">
                              <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block">Cours actif — Leçon {viewingLessonIdx + 1} de {course.lessons.length}</span>
                              <p className="text-xs text-zinc-200 font-sans leading-relaxed bg-[#050508] p-3 rounded-lg border border-zinc-950">
                                📖 <strong>{course.lessons[viewingLessonIdx]}</strong> : Dans cette section d'apprentissage, vous étudiez les meilleures pratiques analysées par Fiko Network. Chaque action de re-partage consolide notre data moat collectif.
                              </p>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                              <div className="flex gap-1">
                                {course.lessons.map((_, lIdx) => {
                                  const isDone = (completedLessons[course.id] || []).includes(lIdx);
                                  return (
                                    <span 
                                      key={lIdx} 
                                      onClick={() => setViewingLessonIdx(lIdx)}
                                      className={`h-2.5 w-6 rounded-full cursor-pointer transition ${viewingLessonIdx === lIdx ? 'bg-purple-500' : isDone ? 'bg-[#25D366]' : 'bg-zinc-800'}`} 
                                    />
                                  );
                                })}
                              </div>

                              <button
                                onClick={() => {
                                  setCompletedLessons(prev => {
                                    const current = prev[course.id] || [];
                                    const next = current.includes(viewingLessonIdx) ? current : [...current, viewingLessonIdx];
                                    return { ...prev, [course.id]: next };
                                  });
                                  if (viewingLessonIdx < course.lessons.length - 1) {
                                    setViewingLessonIdx(prev => prev + 1);
                                  } else {
                                    alert("Félicitations ! Vous avez complété ce programme de formation. Votre score de confiance potentiel a augmenté !");
                                  }
                                }}
                                className="bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer"
                              >
                                { (completedLessons[course.id] || []).includes(viewingLessonIdx) ? "✓ Validé" : "Reconnaître & Valider" }
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Panel: Fiko Certification Authority Exams Simulator */}
              <div className="bg-[#0e0e15] border border-gray-900 rounded-2xl p-5 space-y-4">
                <div className="border-b border-gray-950 pb-2">
                  <span className="bg-purple-950 text-purple-400 border border-purple-900/40 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                    🏆 CERTIFICATION AUTHORITY LAYER
                  </span>
                  <h4 className="text-sm font-black text-white mt-1.5 flex items-center gap-1.5">
                    <Award className="text-yellow-500 animate-pulse" size={16} /> Hub de Certification Professionnelle
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-sans">Valider vos acquis pour être référencé en haut des listes régionales avec badges exclusifs.</p>
                </div>

                {certificationExamStatus === 'idle' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-[9px] text-zinc-500 uppercase font-black block">Choisissez votre accréditation :</span>
                      
                      {[
                        { type: 'expert', label: '🎓 Certified Expert', desc: 'Individuel — Intégration Fiko Brain & FAQ sémantiques', price: '99 900 FCFA / an' },
                        { type: 'agency', label: '🏦 Certified Agency', desc: 'Agences — Growth hacking, campagnes & CRM', price: '199 900 FCFA / an' },
                        { type: 'trainer', label: '🎤 Certified Trainer', desc: 'Coachs — Formations d\'équipes commerciales physiques', price: '99 900 FCFA / an' }
                      ].map((c) => (
                        <button
                          key={c.type}
                          onClick={() => setCertType(c.type as any)}
                          className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition cursor-pointer ${certType === c.type ? 'bg-purple-950/20 border-purple-800 text-white' : 'bg-black/40 border-zinc-900 text-gray-400 hover:text-white hover:bg-zinc-950'}`}
                        >
                          <div className="space-y-0.5">
                            <span className="text-xs font-black block">{c.label}</span>
                            <span className="text-[10px] text-zinc-500 block leading-snug">{c.desc}</span>
                          </div>
                          <span className="text-[9px] font-mono font-black text-zinc-400 shrink-0 bg-zinc-900 px-2 py-0.5 rounded">{c.price}</span>
                        </button>
                      ))}
                    </div>

                    <div className="bg-[#111] p-3 rounded-xl border border-zinc-900 text-[10px] text-yellow-500 font-sans space-y-1">
                      <p><strong>💡 Examen Théorique Requis :</strong></p>
                      <p className="text-gray-400 leading-relaxed">Score minimum de 80% requis sur 3 questions sémantiques basées sur l'index de connaissances. Renouvellement à 49 900 FCFA/an.</p>
                    </div>

                    <button
                      onClick={() => {
                        setCertificationExamStatus('taking');
                        setExamStep(0);
                        setSelectedAnswers({});
                        setExamScore(0);
                      }}
                      className="w-full bg-purple-700 hover:bg-purple-800 text-white font-black uppercase text-xs py-3 rounded-xl transition shadow-[0_4px_10px_rgba(147,51,234,0.3)] cursor-pointer"
                    >
                      Démarrer l'examen théorique
                    </button>
                  </div>
                )}

                {certificationExamStatus === 'taking' && (
                  <div className="space-y-4">
                    {/* Active Question Simulator */}
                    {[
                      {
                        q: "1. Comment configurer Fiko Closer pour désamorcer les barrières de paiements Mobile Money (Wave, Orange Money) ?",
                        opt: [
                          "Insister lourdement sur le virement bancaire standard.",
                          "Envoyer un message de relance court combiné à un lien pré-rempli Wave à l'épaule.",
                          "Attendre patiemment 7 jours sans relance."
                        ],
                        correct: 1
                      },
                      {
                        q: "2. Pourquoi le 'Data Moat' de fiko_network enrichit-il toutes les PME partenaires ?",
                        opt: [
                          "Chaque objection résolue enrichit anonymement la base de connaissances sémantiques globale.",
                          "Elle permet d'inspecter l'infrastructure informatique de son voisin.",
                          "Parce qu'elle offre un crédit gratuit de 20 000 FCFA sur Wave."
                        ],
                        correct: 0
                      },
                      {
                        q: "3. Quel est l'impact d'un excellent score de confiance (Fiko Trust Score) ?",
                        opt: [
                          "Aucun, il s'agit d'une métrique de décoration.",
                          "Il propulse l'agence en tête d'annuaire et qualifie plus d'opportunités d'affaires automatiques.",
                          "Il remplace l'abonnement SaaS de Fiko."
                        ],
                        correct: 1
                      }
                    ].map((quiz, qIdx) => {
                      if (examStep !== qIdx) return null;
                      return (
                        <div key={qIdx} className="space-y-3">
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                            <span>QUESTION INTERACTIVE {qIdx + 1}/3</span>
                            <span className="text-purple-400 font-bold">Certification active</span>
                          </div>
                          
                          <p className="text-xs text-white font-bold leading-relaxed">{quiz.q}</p>

                          <div className="space-y-2">
                            {quiz.opt.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
                                }}
                                className={`w-full p-3 rounded-xl border text-left text-xs transition cursor-pointer font-sans ${selectedAnswers[qIdx] === oIdx ? 'bg-purple-950 border-purple-700 text-white font-heavy' : 'bg-black/60 border-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              disabled={selectedAnswers[qIdx] === undefined}
                              onClick={() => {
                                let points = examScore;
                                if (selectedAnswers[qIdx] === quiz.correct) {
                                  points += 1;
                                }
                                setExamScore(points);

                                if (qIdx < 2) {
                                  setExamStep(prev => prev + 1);
                                } else {
                                  // Finish quiz
                                  if (points >= 2) {
                                    setCertificationExamStatus('passed');
                                  } else {
                                    setCertificationExamStatus('failed');
                                  }
                                }
                              }}
                              className="w-full bg-purple-750 hover:bg-purple-800 disabled:opacity-40 text-white font-black text-xs py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
                            >
                              {qIdx === 2 ? "Soumettre mes Réponses" : "Question Suivante"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {certificationExamStatus === 'passed' && (
                  <div className="space-y-4 text-center py-6">
                    <div className="h-14 w-14 bg-emerald-950 rounded-full flex items-center justify-center mx-auto text-[#25D366] border border-[#25D366]/40 animate-bounce">
                      🏆
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-black text-white uppercase font-sans">Examen Réussi avec Succès !</h5>
                      <p className="text-xs text-[#25D366] font-mono">{examScore}/3 Réponses Correctes ({(examScore/3*100).toFixed(0)}%)</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-sans px-2">Vous êtes officiellement accrédité Fiko ! Votre badge apparaîtra sur votre profil de l'annuaire d'Afrique de l'Ouest sous 2h.</p>
                    </div>

                    <div className="bg-[#111] p-3 rounded-xl border border-[#25D366]/20 font-mono text-[9px] text-[#25D366] max-w-xs mx-auto">
                      🛡️ SIGNATURE CRYPTOGRAPHIQUE : FIKO-CERT-2026-X9B2
                    </div>

                    <button
                      onClick={() => setCertificationExamStatus('idle')}
                      className="bg-zinc-900 border border-zinc-800 hover:text-white text-zinc-400 font-extrabold text-[10px] uppercase px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Terminer & Fermer
                    </button>
                  </div>
                )}

                {certificationExamStatus === 'failed' && (
                  <div className="space-y-4 text-center py-6">
                    <div className="h-12 w-12 bg-red-950 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-900/40">
                      ✕
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-black text-white uppercase">Score Insuffisant</h5>
                      <p className="text-xs text-red-400 font-mono">{examScore}/3 Réponses Correctes ({(examScore/3*100).toFixed(0)}%)</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-sans px-2">Vous devez obtenir a minima 2 réponses correctes (80% d'exactitude) pour recevoir l'accréditation Fiko Connect.</p>
                    </div>

                    <button
                      onClick={() => setCertificationExamStatus('idle')}
                      className="bg-purple-700 hover:bg-purple-800 text-white font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer font-sans"
                    >
                      Réessayer l'examen
                    </button>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* Economic values box for marketplace */}
          <div className="bg-gradient-to-r from-purple-950/20 via-black to-purple-950/20 border border-purple-900/40 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-purple-400 font-black text-[9px] uppercase font-mono block">💰 LE MODÈLE ÉCONOMIQUE DE L'ÉCOSYSTÈME</span>
              <p className="text-xs text-white">Nous dépassons les frontières du SaaS traditionnel (MRR uniquement).</p>
              <p className="text-[11px] text-gray-450 leading-relaxed">Notre expansion couple l'abonnement mensuel de l'IA à des Commissions Marketplace de recommandation, des programmes de Certification, et des cours de Fiko University.</p>
            </div>
            <div className="flex gap-2">
              <div className="bg-black/60 border border-zinc-900 p-2.5 rounded-lg text-center min-w-28">
                <span className="text-[8px] text-gray-500 uppercase block font-mono">Commissions</span>
                <span className="text-xs font-mono text-emerald-400 font-extrabold">+15% par transaction</span>
              </div>
              <div className="bg-black/60 border border-zinc-900 p-2.5 rounded-lg text-center min-w-28">
                <span className="text-[8px] text-gray-500 uppercase block font-mono">Certification</span>
                <span className="text-xs font-mono text-white font-extrabold">99 900 FCFA / an</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* MODAL : PARTNER APPLICATION SIMULATOR */}
      {showInvitePartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-2xl relative space-y-4">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <Handshake className="text-purple-400" size={18} /> Rejoindre le Réseau de Partenaires Certifiés FIKO
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Devenez intégrateur ou agence de support accréditée FIKO en Côte d'Ivoire, au Sénégal ou au Cameroun, et exploitez notre marque pour doper vos acquisitions de services auprès des PME d'Afrique de l'Ouest.
            </p>
            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-extrabold uppercase">Nom de votre agence ou Freelance</label>
                <input type="text" placeholder="Ex: Diop Tech Solutions" className="w-full bg-black border border-zinc-900 p-2.5 rounded-xl text-white outline-none focus:border-purple-650 font-sans" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-extrabold uppercase">Ville & Pays</label>
                  <input type="text" placeholder="Ex: Cotonou, Bénin 🇧🇯" className="w-full bg-black border border-zinc-900 p-2.5 rounded-xl text-white outline-none focus:border-purple-650 font-sans" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-extrabold uppercase">Spécialité Principale</label>
                  <select className="w-full bg-black border border-zinc-900 p-2 text-white outline-none focus:border-purple-650 font-sans">
                    <option value="integrateur">Intégrateur CRM & Fiko Brain</option>
                    <option value="agency">Agence Marketing & Ads</option>
                    <option value="expert_ia">Spécialiste sémantique & IA</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowInvitePartnerModal(false)}
                className="flex-1 bg-zinc-900 text-zinc-400 hover:text-white p-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  alert("Votre demande d'accréditation partenaire a été soumise au conseil de Fiko Africa Network ! Vous recevrez une invitation par WhatsApp sous 24 heures.");
                  setShowInvitePartnerModal(false);
                }}
                className="flex-1 bg-purple-700 hover:bg-purple-800 text-white p-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-purple-900/30 cursor-pointer"
              >
                Soumettre ma demande
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER TAB 7: FIKO BOARD & STRATEGIC PLANNING WORKSPACE (Priority 1, 2, 3, & 4) */}
      {activeTab === 'investor' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          
          {/* Executive Overview Header */}
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E10600]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="bg-[#E10600]/10 text-fiko-red border border-[#E10600]/20 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                  💎 EXPERT WORKSPACE : REVENUE OPERATING SYSTEM (ROS)
                </span>
                <h3 className="text-xl font-black text-white mt-1.5 flex items-center gap-2">
                  <Trophy className="text-[#E10600]" size={20} /> Fiko OS Command Board & SaaS Metrics
                </h3>
                <p className="text-xs text-gray-400 mt-1">Gérer la transition stratégique de Fiko : d'un produit logiciel à un empire commercial piloté par les données (Data-Moat).</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-zinc-950 text-gray-300 border border-zinc-850 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1">
                  <TrendingUp className="text-[#25D366]" size={14} /> KCG Executive Status : Approved ✓
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: PRIORITÉ 3 — INVESTOR MODE & SAAS COCKPIT */}
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl space-y-6">
            {(() => {
              const avgArpuBase = 44265;
              const avgArpuAddon = (fikoInsightsAddonPercent / 100) * 29900;
              const totalArpuWithAddons = avgArpuBase + avgArpuAddon;
              const computedMRR = Math.round(projectedClientsCount * totalArpuWithAddons);
              const computedARR = computedMRR * 12;
              const dynamicLTV = Math.round(totalArpuWithAddons / (Math.max(0.5, boardChurn) / 100));
              const ltvToCacRatio = (dynamicLTV / (boardCac || 1)).toFixed(1);
              const paybackPeriodMonths = (boardCac / (totalArpuWithAddons * 0.90)).toFixed(1);
              const totalRuleOf40Score = ruleOf40Growth + ruleOf40Ebitda;
              const expansionRevenueMRR = Math.round(projectedClientsCount * avgArpuAddon);

              return (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-900 pb-4 gap-4">
                    <div>
                      <span className="bg-blue-950 text-blue-400 border border-blue-900/50 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                        📈 SAAS EXECUTIVE COCKPIT & VENTURE KPIS
                      </span>
                      <h4 className="text-base font-black text-white mt-1">Simulateur Stratégique d'Investissement Fiko OS</h4>
                      <p className="text-[11px] text-gray-400">Pour lever des fonds ou planifier le Chiffre d'Affaires. Ajustez tous les leviers ci-dessous pour stress-tester la profitabilité de l'écosystème Fiko.</p>
                    </div>
                    <div className="bg-black border border-zinc-900 px-4 py-2.5 rounded-xl text-right shrink-0">
                      <span className="text-[9px] text-gray-500 uppercase block font-black font-mono">ARR ANNUEL PROJETÉ (Fiko OS)</span>
                      <span className="text-lg font-mono font-black text-[#25D366]">
                        {computedARR.toLocaleString()} FCFA/an
                      </span>
                    </div>
                  </div>

                  {/* Simulated Live KPIs — Grid of 10 metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900 space-y-1">
                      <span className="text-[9px] text-gray-500 uppercase font-bold block">MRR (Mensuel)</span>
                      <p className="text-base font-mono font-black text-white">
                        {computedMRR.toLocaleString()} F
                      </p>
                      <div className="text-[9px] text-gray-400 font-mono italic">Sur {projectedClientsCount} PMEs actives</div>
                    </div>

                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900 space-y-1">
                      <span className="text-[9px] text-gray-500 uppercase font-bold block">ARR (Annuel)</span>
                      <p className="text-base font-mono font-black text-white">
                        {computedARR.toLocaleString()} F
                      </p>
                      <div className="text-[9px] text-[#25D366] font-mono">Run-rate valorisé</div>
                    </div>

                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900 space-y-1">
                      <span className="text-[9px] text-gray-500 uppercase font-bold block">Coût d'Acquisition (CAC)</span>
                      <p className="text-base font-mono font-black text-amber-500">
                        {boardCac.toLocaleString()} F
                      </p>
                      <div className="text-[9px] text-gray-500 font-mono">Délai : {paybackPeriodMonths} mois</div>
                    </div>

                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900 space-y-1">
                      <span className="text-[9px] text-gray-500 uppercase font-bold block">Customer Lifetime Value</span>
                      <p className="text-base font-mono font-black text-fiko-red">
                        {dynamicLTV.toLocaleString()} F
                      </p>
                      <div className="text-[9px] text-gray-500 font-mono">Par PME connectée</div>
                    </div>

                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900 space-y-1">
                      <span className="text-[9px] text-gray-500 uppercase font-bold block">LTV / CAC Ratio</span>
                      <p className="text-base font-mono font-black text-emerald-400">
                        {ltvToCacRatio}x
                      </p>
                      <div className="text-[9px] text-emerald-400/80 font-black">Cible de classe mondiale &gt; 3x</div>
                    </div>

                    {/* Additional Advanced Venture Capital metrics requested */}
                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900 space-y-1">
                      <span className="text-[9px] text-indigo-400 uppercase font-bold block">Net Retention (NRR)</span>
                      <p className="text-base font-mono font-black text-indigo-300 font-mono">
                        {boardNrr} %
                      </p>
                      <div className="text-[9px] text-indigo-400 font-mono italic">Expansion mensuelle</div>
                    </div>

                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900 space-y-1">
                      <span className="text-[9px] text-purple-400 uppercase font-bold block">Expansion (Insights)</span>
                      <p className="text-base font-mono font-black text-purple-300">
                        {expansionRevenueMRR.toLocaleString()} F
                      </p>
                      <div className="text-[9px] text-gray-500 font-mono">Adoption: {fikoInsightsAddonPercent}%</div>
                    </div>

                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900 space-y-1">
                      <span className="text-[9px] text-red-400 uppercase font-bold block">Churn Rate (Mensuel)</span>
                      <p className="text-base font-mono font-black text-red-300 font-mono">
                        {boardChurn.toFixed(1)} %
                      </p>
                      <div className="text-[9px] text-gray-400 font-mono">Cible &lt; 3%</div>
                    </div>

                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900 space-y-1">
                      <span className="text-[9px] text-gray-500 uppercase font-bold block">Satisfaction NPS</span>
                      <p className="text-base font-mono font-black text-amber-400">
                        {boardNps} <span className="text-[10px] text-zinc-600 font-sans">/100</span>
                      </p>
                      <div className="text-[9px] text-gray-400 font-mono">Qualité onboarding</div>
                    </div>

                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900 space-y-1">
                      <span className="text-[9px] text-emerald-400 uppercase font-bold block">Rule of 40 (SaaS Elite)</span>
                      <p className={`text-base font-mono font-black ${totalRuleOf40Score >= 40 ? 'text-[#25D366]' : 'text-amber-400'}`}>
                        {totalRuleOf40Score} %
                      </p>
                      <div className="text-[9px] text-emerald-400/80 font-black">Score d'excellence</div>
                    </div>
                  </div>

                  {/* Interactive Sliders for stress-testing */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-950/40 p-5 rounded-xl border border-zinc-900/60 text-xs">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-gray-300 font-bold">Attrition Mensuelle (Churn) :</label>
                        <span className="text-white font-mono font-black">{boardChurn} %</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="10" 
                        step="0.1" 
                        value={boardChurn} 
                        onChange={(e) => setBoardChurn(parseFloat(e.target.value))}
                        className="w-full accent-[#E10600] h-1.5 bg-black rounded"
                      />
                      <span className="text-[9px] text-gray-500 block leading-tight">Idéalement visé sous les 3% pour sécuriser l'effet de levier KCG.</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-gray-300 font-bold">CAC (Coût d'Acquisition) :</label>
                        <span className="text-white font-mono font-black">{boardCac.toLocaleString()} FCFA</span>
                      </div>
                      <input 
                        type="range" 
                        min="5000" 
                        max="50000" 
                        step="1000" 
                        value={boardCac} 
                        onChange={(e) => setBoardCac(parseInt(e.target.value))}
                        className="w-full accent-blue-500 h-1.5 bg-black rounded"
                      />
                      <span className="text-[9px] text-gray-500 block leading-tight">Coût publicitaire Facebook/Instagram ou affiliation par nouveau client.</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-gray-300 font-bold">NPS (Net Promoter Score) :</label>
                        <span className="text-white font-mono font-black">{boardNps} / 100</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="100" 
                        step="1" 
                        value={boardNps} 
                        onChange={(e) => setBoardNps(parseInt(e.target.value))}
                        className="w-full accent-orange-500 h-1.5 bg-black rounded"
                      />
                      <span className="text-[9px] text-gray-500 block leading-tight">Rétention et recommandation : Fiko OS excelle par le support local Abidjan.</span>
                    </div>

                    {/* Rule of 40 parameters */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-gray-300 font-bold">Taux de Croissance Annuelle :</label>
                        <span className="text-indigo-400 font-mono font-black">+{ruleOf40Growth} %</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="150" 
                        value={ruleOf40Growth} 
                        onChange={(e) => setRuleOf40Growth(parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1.5 bg-black rounded"
                      />
                      <span className="text-[9px] text-gray-500 block leading-tight">L'expansion géographique (CIV + Sénégal + Cameroun) accélère ce metric.</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-gray-300 font-bold">Marge opérationnelle EBITDA :</label>
                        <span className="text-emerald-400 font-mono font-black">{ruleOf40Ebitda} %</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="70" 
                        value={ruleOf40Ebitda} 
                        onChange={(e) => setRuleOf40Ebitda(parseInt(e.target.value))}
                        className="w-full accent-emerald-500 h-1.5 bg-black rounded"
                      />
                      <span className="text-[9px] text-gray-500 block leading-tight">Reflet de l'efficacité d'infrastructure et de la masse salariale d'Abidjan.</span>
                    </div>

                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-xs">
                        <label className="text-gray-300 font-bold">Upsell Fiko Insights (Module) :</label>
                        <span className="text-purple-450 font-mono font-black">{fikoInsightsAddonPercent} %</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5" 
                        value={fikoInsightsAddonPercent} 
                        onChange={(e) => setFikoInsightsAddonPercent(parseInt(e.target.value))}
                        className="w-full accent-purple-500 h-1.5 bg-black rounded"
                      />
                      <span className="text-[9px] text-gray-500 block leading-tight">Taux d'adoption du module premium de benchmark sectoriel (+29 900 F/mois).</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Section 2: PRIORITÉ 2 — CUSTOMER SUCCESS COHORT HEALTH & REACTIVATOR */}
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-900 pb-4 gap-4">
              <div>
                <span className="bg-amber-950 text-amber-400 border border-amber-900/40 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                  🏥 CUSTOMER SUCCESS ASSURANCE
                </span>
                <h4 className="text-base font-black text-white mt-1">Fiko Cohorts Health Score & Alarme de Churn</h4>
                <p className="text-xs text-gray-400">Évaluation fine de l'usage. Un score inférieur à 40 déclenche la mission d'urgence sémantique.</p>
              </div>
              <div className="shrink-0 flex gap-1 bg-black p-1 border border-zinc-900 rounded-xl">
                <button 
                  onClick={() => setHealthScores(prev => ({ ...prev, assur: 32 }))}
                  className="px-2.5 py-1 text-[8px] uppercase font-black tracking-wider text-red-400 bg-red-950/20 rounded hover:bg-red-950/40"
                >
                  Simuler Alerte Churn
                </button>
              </div>
            </div>

            {/* Vertical Cohort List */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { key: 'ecommerce', label: '🛍️ E-Commerce', desc: 'Integration Shopify/Pay', score: healthScores.ecommerce },
                { key: 'immo', label: '🏢 Immobilier', desc: 'Relances des fiches', score: healthScores.immo },
                { key: 'formation', label: '🎓 Formation', desc: 'Gestion de planning', score: healthScores.formation },
                { key: 'assur', label: '🛡️ Assurances', desc: 'Capture de devis', score: healthScores.assur },
                { key: 'resto', label: '🍔 Restauration', desc: 'Prise de commande', score: healthScores.resto },
              ].map((c) => {
                const isUnderDanger = c.score < 40;
                return (
                  <div 
                    key={c.key} 
                    className={`bg-black/60 p-4 border rounded-xl flex flex-col justify-between space-y-3 transition duration-150 ${
                      isUnderDanger 
                        ? 'border-red-900/60 shadow-[0_0_15px_rgba(239,68,68,0.1)] relative' 
                        : 'border-zinc-900/60'
                    }`}
                  >
                    {isUnderDanger && (
                      <span className="absolute -top-2 left-3 bg-red-600 text-white font-black text-[7px] uppercase tracking-wider px-2 py-0.5 rounded">
                        ⚠️ ALERTE DANGER
                      </span>
                    )}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <strong className="text-xs font-black text-white block">{c.label}</strong>
                        <span className={`text-xs font-mono font-bold ${isUnderDanger ? 'text-red-500 font-extrabold animate-pulse' : 'text-emerald-400'}`}>
                          {c.score} <span className="text-[9px] text-[#444]">/100</span>
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500">{c.desc}</p>
                    </div>

                    {/* Miniature score bar */}
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${isUnderDanger ? 'bg-red-500' : c.score < 75 ? 'bg-amber-400' : 'bg-emerald-400'}`} 
                        style={{ width: `${c.score}%` }}
                      ></div>
                    </div>

                    <div className="pt-1.5 flex justify-between items-center">
                      <span className="text-[8px] text-gray-500">Ajuster santé :</span>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => setHealthScores(prev => ({ ...prev, [c.key]: Math.max(10, c.score - 10) }))}
                          className="bg-zinc-950 hover:bg-zinc-900 text-gray-400 font-bold px-1.5 rounded text-[10px]"
                        >
                          -
                        </button>
                        <button 
                          onClick={() => setHealthScores(prev => ({ ...prev, [c.key]: Math.min(100, c.score + 10) }))}
                          className="bg-zinc-950 hover:bg-zinc-900 text-gray-400 font-bold px-1.5 rounded text-[10px]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Campaign Terminal Trigger (Action for cold cohorts) */}
            {(healthScores.ecommerce < 40 || healthScores.immo < 40 || healthScores.formation < 40 || healthScores.assur < 40 || healthScores.resto < 40) && (
              <div className="bg-[#0f0d0d] border border-red-900/40 p-5 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-950 text-red-500 border border-red-900 text-[8px] font-black uppercase px-2 py-0.5 rounded animate-pulse">
                      CHURN ENGINE DETECTED COLD CUSTOMERS
                    </span>
                    <p className="text-xs text-gray-500 font-mono">SEGMENT : ASSURANCES ({healthScores.assur}/100)</p>
                  </div>
                  <h5 className="text-sm font-black text-white">Lancer une campagne de réengagement sémantique WhatsApp</h5>
                  <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                    Fiko va composer un package de suivi ultra-personnalisé à destination des cabinets froids qualifiés pour les ramener vers l'intégration Fiko Pay & fiko_memory.
                  </p>
                </div>

                <div className="shrink-0 w-full lg:w-auto">
                  <button 
                    onClick={triggerReactivationCampaign}
                    disabled={reactivatorRunning}
                    className="w-full lg:w-auto bg-[#E10600] text-white font-black px-6 py-3 rounded-xl text-xs hover:scale-[1.03] transition flex items-center justify-center gap-2 shadow-lg shadow-red-950/50"
                  >
                    {reactivatorRunning ? 'Réengagement en cours...' : 'Frapper et Réactiver par IA ⚡'}
                  </button>
                </div>
              </div>
            )}

            {/* Reactivation Terminal Console Screen */}
            {reactivationLogs.length > 0 && (
              <div className="bg-black border border-zinc-900 rounded-xl p-4 font-mono text-[10px] space-y-1.5 text-zinc-400 max-h-48 overflow-y-auto animate-in fade-in duration-300">
                <div className="flex justify-between border-b border-zinc-900 pb-1.5 text-zinc-500 font-black tracking-wider uppercase">
                  <span>Console Fiko Customer Activation OS</span>
                  <span className="text-[#E10600]">Live Tracking</span>
                </div>
                {reactivationLogs.map((log, idx) => (
                  <p key={idx} className={`${log.includes('SYSTEM') ? 'text-blue-400' : log.includes('Succès') ? 'text-emerald-400 font-bold' : 'text-zinc-300'}`}>
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: PRIORITÉ 1 — FIKO LAUNCH PROGRAM (Track 50 Clients in 30 Days) */}
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-900 pb-4 gap-2">
              <div>
                <span className="bg-purple-950 text-purple-400 border border-purple-900/40 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                  🚀 FIKO LAUNCH PROGRAM
                </span>
                <h4 className="text-base font-black text-white mt-1">Abonnements Initiaux : Cohorte Fondatrice (Objectif 50)</h4>
                <p className="text-xs text-gray-400">Suivi strict de l'onboarding pour identifier les objections et affiner l'IA.</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-black text-white font-mono">{launchOnboardProgress} / 50</span>
                <p className="text-[9px] text-[#25D366] font-bold">Entreprises connectées</p>
              </div>
            </div>

            {/* aggregate launch progress bar */}
            <div className="space-y-2">
              <div className="w-full bg-black border border-zinc-900/60 p-1.5 rounded-xl">
                <div className="bg-zinc-950 h-5 rounded-lg overflow-hidden relative flex items-center justify-center">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#E10600] to-[#E10650] transition-all duration-1000"
                    style={{ width: `${(launchOnboardProgress / 50) * 100}%` }}
                  ></div>
                  <span className="relative z-10 text-[10px] font-mono font-black text-white drop-shadow-md">
                    PROGRÈS GLOBAL : {Math.round((launchOnboardProgress / 50) * 100)}% DU LANCEMENT OFFICIEL REUSSI
                  </span>
                </div>
              </div>
            </div>

            {/* Cohorte details list */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { label: '🛒 E-commerce', current: 16, target: 20, desc: 'Boutiques cosmétiques & mode', status: '80% Onboardé' },
                { label: '🏢 Immobilier', current: 8, target: 10, desc: 'Agences Côte-d\'Ivoire', status: '80% Onboardé' },
                { label: '🎓 Formation', current: 7, target: 10, desc: 'Coaches et écoles professionnelles', status: '70% Onboardé' },
                { label: '🛡️ Assurance', current: 3, target: 5, desc: 'Cabinets et courtiers Abidjan', status: '60% Onboardé' },
                { label: '🍔 Restaurants', current: 4, target: 5, desc: 'Lounge et fast-food Plateau', status: '80% Onboardé' },
              ].map((cohort, idx) => (
                <div key={idx} className="bg-black/40 border border-zinc-900 hover:border-zinc-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <h5 className="text-xs font-black text-white">{cohort.label}</h5>
                    <p className="text-[10px] text-gray-500 mt-1 lines-clamp-2 min-h-[30px]">{cohort.desc}</p>
                    <div className="bg-zinc-950 border border-zinc-900 text-center text-[10px] py-1 rounded font-mono text-zinc-300 mt-3 font-semibold">
                      {cohort.current} de {cohort.target} Clients (Live)
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (cohort.current < cohort.target) {
                        setLaunchOnboardProgress(prev => Math.min(50, prev + 1));
                        alert(`Onboarding réussi d'une entreprise supplémentaire pour le segment ${cohort.label}!`);
                      }
                    }}
                    disabled={cohort.current === cohort.target}
                    className="w-full bg-[#E10600]/10 hover:bg-[#E10600]/20 border border-[#E10600]/20 hover:border-[#E10600]/40 text-white font-extrabold py-1.5 rounded text-[9px] uppercase transition tracking-wider shrink-0 disabled:opacity-40"
                  >
                    Simuler Onboarding
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: PRIORITÉ 4 — FIKO DATA MOAT PLAYBOOKS (Secret Sémantique Sells Formulas) */}
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl space-y-6">
            <div>
              <span className="bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                🧱 THE DATA MOAT (PROPRIÉTAIRE)
              </span>
              <h4 className="text-base font-black text-white mt-1.5 flex items-center gap-2">
                <Layers className="text-[#25D366]" size={16} /> Industry Sector Playbooks sémantiques 
              </h4>
              <p className="text-xs text-gray-400">Le véritable avantage concurrentiel : Fiko apprend quelles relances, objections et heures convertissent le mieux par secteur vertical en Côte-d'Ivoire.</p>
            </div>

            {/* Playbook selectors */}
            <div className="flex overflow-x-auto gap-2 bg-black/60 p-1 border border-zinc-900 rounded-xl">
              {[
                { id: 'ecommerce', label: '🛒 E-commerce & Retail' },
                { id: 'immo', label: '🏢 Immobilier' },
                { id: 'assur', label: '🛡️ Assurances' },
                { id: 'formation', label: '🎓 Formation & Coaching' },
                { id: 'resto', label: '🍔 Restaurants & Alimentation' }
              ].map((p) => (
                <button 
                  key={p.id}
                  onClick={() => setSelectedPlaybookSector(p.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-black transition whitespace-nowrap cursor-pointer ${selectedPlaybookSector === p.id ? 'bg-[#25D366] text-black border-none' : 'text-gray-400 hover:text-white hover:bg-zinc-950'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Curated Sector playbook visualization */}
            {selectedPlaybookSector && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-black p-6 rounded-2xl border border-zinc-900 animate-in zoom-in-95 duration-200">
                
                {/* Sector Objections and Responses */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                    <AlertCircle className="text-amber-400 shrink-0" size={16} />
                    <strong className="text-xs font-black text-white uppercase font-sans">Top Objections d'Afrique de l'Ouest</strong>
                  </div>
                  <div className="space-y-3.5">
                    {playbookData[selectedPlaybookSector].objections.map((obj, idx) => (
                      <div key={idx} className="space-y-1 bg-zinc-950 p-3 rounded-lg border border-zinc-900 text-xs">
                        <cite className="text-[#E10650] font-black not-italic block">« {obj.q} »</cite>
                        <p className="text-gray-400 text-xs leading-relaxed mt-1">{obj.r}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Closing Winning Scripts */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                    <CheckCircle className="text-emerald-400 shrink-0" size={16} />
                    <strong className="text-xs font-black text-white uppercase font-sans">Automated AI Winning Message Copies</strong>
                  </div>
                  <div className="space-y-3.5">
                    {playbookData[selectedPlaybookSector].scripts.map((script, idx) => (
                      <div key={idx} className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 text-xs text-gray-300 relative group">
                        <div className="text-[8px] uppercase font-mono font-bold text-gray-500 mb-1">GÉNÉRATEUR COPIE {idx+1}</div>
                        <p className="font-mono text-zinc-300 italic">"{script}"</p>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(script);
                            alert("Copie sémantique copiée dans le presse-papier !");
                          }}
                          className="absolute right-2 top-2 bg-zinc-900 px-2 py-1 rounded text-[8px] text-zinc-400 hover:text-white border border-zinc-800 transition"
                        >
                          Copier
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Behavioral Patterns Data */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                    <Activity className="text-[#25D366] shrink-0" size={16} />
                    <strong className="text-xs font-black text-white uppercase font-sans">Comportement & Performance Metrics</strong>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-500 uppercase font-black block">HEURES DE CONVERSION MAXIMUMS (SÉNÉGAL/CIV)</span>
                      <p className="text-xs text-white leading-relaxed font-semibold">{playbookData[selectedPlaybookSector].times}</p>
                    </div>

                    <div className="space-y-1.5 border-t border-zinc-900 pt-3">
                      <span className="text-[9px] text-gray-500 uppercase font-black block">BENCHMARK DE CONVERSION FIKO OS</span>
                      <div className="flex items-baseline gap-2">
                        <strong className="text-xl font-mono text-[#25D366] font-black">{playbookData[selectedPlaybookSector].conversion}</strong>
                        <span className="text-[9px] text-zinc-500 font-extrabold uppercase">Taux de closing moyen</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Évalue 2.2x fois supérieur à la moyenne des conversions manuelles de community managers d'Abidjan.</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Section 5: NEW LEVEL — FIKO NETWORK & COLLECTIVE INTELLIGENCE */}
          <div className="bg-[#0a0a0f] border border-gray-900 p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-900 pb-4 gap-2">
              <div>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/50 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                  🌍 THE NETWORK LAYER (FIKO NETWORK 2026-2027)
                </span>
                <h4 className="text-base font-black text-white mt-1.5 flex items-center gap-2">
                  <Globe className="text-[#25D366] animate-pulse" size={18} /> fiko_network : L'avantage concurrentiel absolu
                </h4>
                <p className="text-xs text-gray-400">Chaque conversation, objection reçue et paiement validé en Afrique de l'Ouest enrichit notre base de connaissances sectorielle anonymisée.</p>
              </div>
              <span className="bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1 shrink-0">
                🚀 Data Moat Africain : Actif ✓
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Module 1: Benchmark Anonyme */}
              <div className="bg-black/60 border border-zinc-900 rounded-xl p-5 space-y-4">
                <div className="border-b border-zinc-900 pb-3">
                  <span className="text-[9px] text-gray-500 uppercase font-black block">MODULE 1</span>
                  <h5 className="text-sm font-bold text-white">Analyse comparative sectorielle (Benchmarks)</h5>
                  <p className="text-[11px] text-gray-400 mt-0.5">Comparez les performances d'une PME type face aux moyennes consolidées de Fiko.</p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Conv benchmark */}
                  <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-4 space-y-3">
                    <p className="font-extrabold text-white text-xs uppercase tracking-wider flex justify-between">
                      <span>📊 Taux de Conversion de Closing</span>
                      <span className="text-emerald-400">Secteur : {selectedPlaybookSector === 'ecommerce' ? 'E-Commerce' : selectedPlaybookSector === 'immo' ? 'Immobilier' : selectedPlaybookSector === 'assur' ? 'Assurances' : selectedPlaybookSector === 'formation' ? 'Formation' : 'Restauration'}</span>
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-black p-2.5 rounded-lg border border-zinc-900">
                        <span className="text-[9px] text-gray-400 uppercase font-medium block">Votre PME</span>
                        <strong className="text-sm font-mono text-white">17 %</strong>
                      </div>
                      <div className="bg-black p-2.5 rounded-lg border border-zinc-900">
                        <span className="text-[9px] text-[#25D366] uppercase font-bold block">Moyenne Fiko</span>
                        <strong className="text-sm font-mono text-[#25D366]">11 %</strong>
                      </div>
                      <div className="bg-black p-2.5 rounded-lg border border-[#25D366]/30">
                        <span className="text-[9px] text-yellow-500 uppercase font-bold block">Top 10% Fiko</span>
                        <strong className="text-sm font-mono text-yellow-500">23 %</strong>
                      </div>
                    </div>
                  </div>

                  {/* Resptime benchmark */}
                  <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-4 space-y-3">
                    <p className="font-extrabold text-white text-xs uppercase tracking-wider">⏱️ Temps de Réponse Moyen (WhatsApp)</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-black p-2.5 rounded-lg border border-zinc-900">
                        <span className="text-[9px] text-gray-400 uppercase font-medium block">Manuel Humain</span>
                        <strong className="text-sm font-mono text-red-500">14 min</strong>
                      </div>
                      <div className="bg-black p-2.5 rounded-lg border border-zinc-900">
                        <span className="text-[9px] text-gray-400 uppercase font-medium block">Moyenne Fiko</span>
                        <strong className="text-sm font-mono text-white">4 min</strong>
                      </div>
                      <div className="bg-black p-2.5 rounded-lg border border-[#25D366]/30">
                        <span className="text-[9px] text-[#25D366] uppercase font-bold block">Top Performers / IA</span>
                        <strong className="text-sm font-mono text-[#25D366]">12 sec</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module 2: Intelligence Collective */}
              <div className="bg-black/60 border border-zinc-900 rounded-xl p-5 space-y-4">
                <div className="border-b border-zinc-900 pb-3">
                  <span className="text-[9px] text-gray-400 uppercase font-black block">MODULE 2</span>
                  <h5 className="text-sm font-bold text-white text-purple-400 font-sans">Collective intelligence sharing (Data Moat)</h5>
                  <p className="text-[11px] text-gray-400 mt-0.5">Chaque objection apprivoisée par l'un de nos clients est transformée en recommandation sémantique et redistribuée à tout l'écosystème.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-2">
                    <strong className="text-[#25D366] font-extrabold block uppercase tracking-wide text-[10px]">💡 CONNAISSANCES COLLECTIVES RE-PARTAGÉES (LIVE)</strong>
                    <div className="space-y-2.5 text-xs text-gray-300">
                      <div className="flex gap-2 items-start">
                        <span className="text-[#25D366] pt-0.5">✓</span>
                        <p><strong>Top Objections traitées :</strong> Solution anti-désistement Wave/Orange Money pré-remplie validée réinjectée à 500+ bots actifs.</p>
                      </div>
                      <div className="flex gap-2 items-start border-t border-zinc-900/60 pt-2">
                        <span className="text-[#25D366] pt-0.5">✓</span>
                        <p><strong>Top Relance Gagnante :</strong> Le message humoristique de H-2 réduit de 80% l'absentéisme en Côte d'Ivoire.</p>
                      </div>
                      <div className="flex gap-2 items-start border-t border-zinc-900/60 pt-2">
                        <span className="text-[#25D366] pt-0.5">✓</span>
                        <p><strong>Meilleur Horaire :</strong> Dimanche soir (18h-22h) capture 3x plus d'attention en e-commerce.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-950/20 border border-purple-900/40 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-purple-400 font-extrabold block text-[10px] uppercase">⚡ FIKO INSIGHTS ADD-ON AVAILABLE</span>
                      <p className="text-[11px] text-gray-305 leading-snug">Vendez l'accès aux benchmarks et rapports de tendances exclusifs.</p>
                    </div>
                    <span className="bg-purple-900/40 text-purple-300 font-mono font-black border border-purple-800 text-[10px] px-2.5 py-1 rounded shrink-0">
                      29 900 FCFA / mois
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 6. IMMERSIVE BRAND MATRIX ROADMAP FOR CONTINENTAL REACH */}
      <div className="bg-gradient-to-r from-purple-950/20 via-black to-blue-950/20 border border-purple-900/30 p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-1/2 transform -translate-x-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center animate-in duration-1000">
          <div className="space-y-2">
            <span className="bg-purple-950 border border-purple-900 text-purple-400 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
              Vision d'Avenir : Matrix Voice Core
            </span>
            <h3 className="text-2xl font-black text-white font-sans">⚡ Prochaine Etape : Fiko Voice AI WhatsApp</h3>
            <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
              Nous concevons la formule sans compromis à <strong>499 000 FCFA / mois</strong> pour les leaders (KCG, Banques, Compagnies de Transport). Elle déploiera des serveurs vocaux IA capables de parler et de s'entretenir avec vos clients sous forme de synthèse vocale fluide en nouchi et wolof vernaculaire, ainsi qu'un agent technique humain VIP pour le monitoring.
            </p>
          </div>
          <div className="bg-black/60 border border-purple-900/60 p-4 rounded-xl text-center shrink-0 w-full md:w-auto font-mono text-xs text-purple-400 flex items-center gap-3">
            <Server size={24} className="text-purple-400 animate-pulse" />
            <div className="text-left font-sans">
              <p className="text-white font-extrabold text-[10px] uppercase">Fiko Voice Synthesis v3</p>
              <p className="text-[10px] text-purple-500 font-bold uppercase tracking-wide">R&D Active Côte d'Ivoire 🇨🇮</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
