import React, { useMemo, useState } from "react";

// -------------------------------------------------------------
// Entity Rectification & Control Dashboard V3 (TRADIE Edition)
// Self-contained with custom components (no external UI libs)
// TRADIE color palette + Multi-language + Blockchain + AI
// Responsive: Mobile (360×800) → Web (1440×1024)
// -------------------------------------------------------------

// --- Helper Components -------------------------------------------------------
const Chip = ({ children, tone = "slate" }) => {
  const tones = {
    slate: "bg-slate-100 text-slate-800",
    emerald: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    rose: "bg-rose-100 text-rose-800",
    violet: "bg-violet-100 text-violet-800",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
};

const Badge = ({ children, color = "emerald" }) => {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    gold: "bg-gradient-to-r from-[#D4AF37]/20 to-amber-100 text-amber-800 ring-amber-300",
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${colors[color] || colors.emerald}`}>
      {children}
    </span>
  );
};

const Section = ({ title, children, actions, gradient = false }) => (
  <div className="rounded-[20px] bg-white/80 backdrop-blur-sm p-5 shadow-lg ring-1 ring-slate-200 overflow-hidden">
    {gradient && <div className="h-2 -mt-5 -mx-5 mb-3 bg-gradient-to-r from-[#F7FAFC] via-[#D9F2FF] to-[#D4AF37]" />}
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
    </div>
    {children}
  </div>
);

const PillButton = ({ children, onClick, variant = "primary", disabled, icon }) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95";
  const variants = {
    primary: "bg-gradient-to-r from-[#27AE60] to-[#A5D6A7] text-white shadow-lg hover:shadow-xl",
    gold: "bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-slate-900 shadow-lg hover:shadow-xl",
    secondary: "bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200",
    danger: "bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-lg hover:shadow-xl",
    subtle: "bg-transparent text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};

const ProgressBar = ({ value, max = 3 }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct >= 100 ? "bg-rose-500" : pct >= 66 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="w-full rounded-full bg-slate-100 overflow-hidden">
      <div
        className={`h-3 rounded-full ${color} transition-all duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-[20px] bg-white p-6 shadow-2xl ring-1 ring-slate-200 animate-in slide-in-from-bottom-4 duration-300">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2 flex-wrap">{footer}</div>}
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    {label && <label className="block text-xs text-slate-500 mb-1">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
    />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 3, voice = false, onVoiceToggle, voiceActive = false }) => (
  <div>
    {label && <label className="block text-xs text-slate-500 mb-1">{label}</label>}
    <div className="relative">
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all resize-none ${voice ? 'pr-12' : ''}`}
      />
      {voice && (
        <button
          type="button"
          onClick={onVoiceToggle}
          className={`absolute top-2 right-2 rounded-full p-2 transition-all ${voiceActive ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          aria-label="Voice input"
        >
          🎤
        </button>
      )}
    </div>
    {voiceActive && (
      <div className="mt-2 flex items-center gap-2 text-sm text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
        Recording...
      </div>
    )}
  </div>
);

const LanguageToggle = ({ language, onChange }) => {
  const langs = ['EN', 'HI', 'TE'];
  return (
    <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
      {langs.map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            language === lang 
              ? 'bg-gradient-to-r from-[#F4D03F] to-[#F39C12] text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          🌐 {lang}
        </button>
      ))}
    </div>
  );
};

const ViewModeToggle = ({ mode, onChange }) => {
  const modes = [
    { key: 'management', icon: '👥', label: 'Management' },
    { key: 'auditor', icon: '🛡️', label: 'Auditor' },
    { key: 'public', icon: '👁️', label: 'Public' },
  ];
  return (
    <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            mode === m.key 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          title={m.label}
        >
          {m.icon}
        </button>
      ))}
    </div>
  );
};

// --- Mock Data ---------------------------------------------------------------
const initialEntities = [
  {
    id: "ENT-PSR-001",
    name: "PSR & Co",
    type: "Partnership",
    scale: "MSME",
    status: "Active",
    registrationDate: "2024-04-12",
    lastVerificationDate: "2025-03-05",
    changeAttempts: 1,
    blockchainHash: "0x7a3f9c84...b2e5d7",
    roles: [
      { role: "Managing Partner", share: 40, rectification: "Finalize", audit: "Approve", otp: true },
      { role: "Partner", share: 35, rectification: "Propose", audit: "Review", otp: true },
      { role: "Auditor", share: 0, rectification: "Suggest", audit: "Audit Trail", otp: false },
    ],
    history: [
      {
        number: 1,
        date: "2025-06-18",
        by: "Managing Partner",
        approvers: ["Partner A", "Partner B"],
        status: "Approved",
      },
    ],
  },
  {
    id: "ENT-RSN-002",
    name: "Ravindra & Sons",
    type: "Family Enterprise",
    scale: "Small",
    status: "Active",
    registrationDate: "2023-11-03",
    lastVerificationDate: "2025-01-22",
    changeAttempts: 2,
    blockchainHash: "0x9b4e7d12...c3f6a8",
    roles: [
      { role: "Karta", share: 51, rectification: "Finalize", audit: "Approve", otp: true },
      { role: "Member", share: 25, rectification: "Request", audit: "Review", otp: true },
      { role: "Auditor", share: 0, rectification: "Suggest", audit: "Audit Trail", otp: false },
    ],
    history: [
      {
        number: 1,
        date: "2024-09-07",
        by: "Karta",
        approvers: ["Karta", "Member A"],
        status: "Approved",
      },
      {
        number: 2,
        date: "2025-05-29",
        by: "Member A",
        approvers: ["Karta", "Member A"],
        status: "Approved",
      },
    ],
  },
  {
    id: "ENT-KAT-003",
    name: "Kakatiya Traders Pvt. Ltd.",
    type: "Private Limited Company",
    scale: "Medium",
    status: "Active",
    registrationDate: "2022-08-19",
    lastVerificationDate: "2024-12-14",
    changeAttempts: 3,
    blockchainHash: "0x2c7d8e45...a1b9f3",
    roles: [
      { role: "Director", share: 45, rectification: "Finalize", audit: "Approve", otp: true },
      { role: "Company Secretary", share: 0, rectification: "Rectify Ops", audit: "Compliance", otp: true },
      { role: "CFO", share: 0, rectification: "Rectify Financials", audit: "Approve Financials", otp: true },
      { role: "Auditor", share: 0, rectification: "Suggest", audit: "Audit Trail", otp: false },
    ],
    history: [
      {
        number: 1,
        date: "2023-12-10",
        by: "Director",
        approvers: ["Director A", "CS"],
        status: "Approved",
      },
      {
        number: 2,
        date: "2024-06-02",
        by: "CS",
        approvers: ["Director A", "CFO"],
        status: "Approved",
      },
      {
        number: 3,
        date: "2025-03-11",
        by: "CFO",
        approvers: ["Director A", "Director B"],
        status: "Approved",
      },
    ],
  },
];

// --- Translations ------------------------------------------------------------
const translations = {
  EN: {
    title: "Entity Rectification & Control Dashboard",
    subtitle: "Post-registration governance with dual-OTP approvals and audit-ready logs",
    registeredAgents: "Registered Commission Agents",
    entityOverview: "Entity Overview",
    immutableID: "Immutable Entity ID",
    entityType: "Entity Type",
    scaleCategory: "Scale Category",
    registrationDate: "Registration Date",
    lastVerification: "Last Verification",
    changeLimit: "⚠ Change limit reached. Future changes require full KYC re-verification and app-appointed verifier review.",
    changeTracker: "Change Attempts Used",
    requestChange: "Request Structural Change",
    initiateKYC: "Initiate Re-KYC & Verification",
    profile: "Profile & Compliance",
    rectification: "Data Rectification Requests",
    authorized: "Authorized Changes",
    audit: "Audit History",
    permissions: "Permissions & Control Matrix",
    role: "Role",
    share: "Share %",
    rectificationRights: "Data Rectification Rights",
    auditControl: "Audit Control",
    otpRequired: "OTP Required",
    required: "Required",
    no: "No",
    blockchainVerification: "Blockchain Verification",
    aiInsight: "AI Insight",
    fastTrack: "Your entity qualifies for fast-track compliance (2-day audit).",
    changesRemaining: "structural change(s) remaining before KYC re-verification required.",
  },
  HI: {
    title: "इकाई सुधार और नियंत्रण डैशबोर्ड",
    subtitle: "पंजीकरण के बाद दोहरे-ओटीपी अनुमोदन और लेखा परीक्षा लॉग के साथ शासन",
    registeredAgents: "पंजीकृत कमीशन एजेंट",
    entityOverview: "इकाई अवलोकन",
    immutableID: "अपरिवर्तनीय इकाई आईडी",
    entityType: "इकाई प्रकार",
    scaleCategory: "पैमाने की श्रेणी",
    registrationDate: "पंजीकरण तिथि",
    lastVerification: "अंतिम सत्यापन",
    changeLimit: "⚠ परिवर्तन सीमा पूर्ण। आगे के परिवर्तनों के लिए पूर्ण केवाईसी पुनः सत्यापन आवश्यक है।",
    changeTracker: "उपयोग किए गए परिवर्तन प्रयास",
    requestChange: "संरचनात्मक परिवर्तन का अनुरोध करें",
    initiateKYC: "पुनः केवाईसी और सत्यापन शुरू करें",
    profile: "प्रोफ़ाइल और अनुपालन",
    rectification: "डेटा सुधार अनुरोध",
    authorized: "अधिकृत परिवर्तन",
    audit: "लेखा परीक्षा इतिहास",
    permissions: "अनुमतियाँ और नियंत्रण मैट्रिक्स",
    role: "भूमिका",
    share: "शेयर %",
    rectificationRights: "डेटा सुधार अधिकार",
    auditControl: "लेखा परीक्षा नियंत्रण",
    otpRequired: "ओटीपी आवश्यक",
    required: "आवश्यक",
    no: "नहीं",
    blockchainVerification: "ब्लॉकचेन सत्यापन",
    aiInsight: "एआई अंतर्दृष्टि",
    fastTrack: "आपकी इकाई तेज़-ट्रैक अनुपालन (2-दिन लेखा परीक्षा) के लिए योग्य है।",
    changesRemaining: "केवाईसी पुनः सत्यापन से पहले संरचनात्मक परिवर्तन शेष।",
  },
  TE: {
    title: "ఎంటిటీ రెక్టిఫికేషన్ & కంట్రోల్ డాష్‌బోర్డ్",
    subtitle: "నమోదు తర్వాత ద్వంద్వ-OTP ఆమోదాలు మరియు ఆడిట్-రెడీ లాగ్‌లతో పాలన",
    registeredAgents: "నమోదు చేసుకున్న కమిషన్ ఏజెంట్లు",
    entityOverview: "ఎంటిటీ అవలోకనం",
    immutableID: "మార్చలేని ఎంటిటీ ID",
    entityType: "ఎంటిటీ రకం",
    scaleCategory: "స్కేల్ వర్గం",
    registrationDate: "నమోదు ���ేదీ",
    lastVerification: "చివరి ధృవీకరణ",
    changeLimit: "⚠ మార్పు పరిమితి చేరుకుంది। తదుపరి మార్పులకు పూర్తి KYC పునః ధృవీకరణ అవసరం।",
    changeTracker: "ఉపయోగించిన మార్పు ప్రయత్నాలు",
    requestChange: "నిర్మాణాత్మక మార్పును అభ్యర్థించండి",
    initiateKYC: "పునః KYC & ధృవీకరణను ప్రారంభించండి",
    profile: "ప్రొఫైల్ & సమ్మతి",
    rectification: "డేటా రెక్టిఫికేషన్ అభ్యర్థనలు",
    authorized: "అధికారిక మార్పులు",
    audit: "ఆడిట్ చరిత్ర",
    permissions: "అనుమతులు & నియంత్రణ మాట్రిక్స్",
    role: "పాత్ర",
    share: "వాటా %",
    rectificationRights: "డేటా రెక్టిఫికేషన్ హక్కులు",
    auditControl: "ఆడిట్ నియంత్రణ",
    otpRequired: "OTP అవసరం",
    required: "అవసరం",
    no: "కాదు",
    blockchainVerification: "బ్లాక్‌చెయిన్ ధృవీకరణ",
    aiInsight: "AI అంతర్దృష్టి",
    fastTrack: "మీ ఎంటిటీ ఫాస్ట్-ట్రాక్ సమ్మతికి అర్హత పొందింది (2-రోజుల ఆడిట్)।",
    changesRemaining: "KYC పునః ధృవీకరణకు ముందు నిర్మాణాత్మక మార్పు(లు) మిగిలి ఉన్నాయి।",
  },
};

// --- Main Component ----------------------------------------------------------
export default function EntityRectificationDashboardV3() {
  const [entities, setEntities] = useState(initialEntities);
  const [selectedId, setSelectedId] = useState(initialEntities[0].id);
  const [tab, setTab] = useState("profile");
  const [viewMode, setViewMode] = useState("management");
  const [language, setLanguage] = useState("EN");

  // Modal states
  const [otpOpen, setOtpOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  // OTP form data
  const [otpData, setOtpData] = useState({ 
    details: "", 
    otp1: "", 
    otp2: "", 
    approver1: "", 
    approver2: "" 
  });

  // Voice input state
  const [voiceActive, setVoiceActive] = useState(false);

  const selected = useMemo(() => entities.find((e) => e.id === selectedId)!, [entities, selectedId]);
  const changeLimitReached = selected.changeAttempts >= 3;
  const changesRemaining = 3 - selected.changeAttempts;
  const t = translations[language];

  const masked = (value) => (viewMode === "public" ? "••••••" : value);

  const addHistory = (entityId, entry) => {
    setEntities((prev) =>
      prev.map((e) =>
        e.id === entityId
          ? { ...e, history: [...e.history, entry] }
          : e
      )
    );
  };

  const incrementChange = (entityId) => {
    setEntities((prev) =>
      prev.map((e) =>
        e.id === entityId ? { ...e, changeAttempts: Math.min(3, e.changeAttempts + 1) } : e
      )
    );
  };

  const handleRequestChange = () => {
    setOtpData({ details: "", otp1: "", otp2: "", approver1: "", approver2: "" });
    setOtpOpen(true);
  };

  const handleOtpSubmit = () => {
    if (!otpData.details || !otpData.otp1 || !otpData.otp2 || !otpData.approver1 || !otpData.approver2) return;

    const nextNo = (selected.history[selected.history.length - 1]?.number || 0) + 1;

    addHistory(selected.id, {
      number: nextNo,
      date: new Date().toISOString().slice(0, 10),
      by: "Change Initiator",
      approvers: [otpData.approver1, otpData.approver2],
      status: "Approved",
    });

    incrementChange(selected.id);
    setOtpOpen(false);
  };

  const StatusBadge = ({ status }) => {
    const map = {
      Active: { color: "emerald", text: "Active", icon: "✓" },
      Locked: { color: "rose", text: "Locked", icon: "🔒" },
      "Under Rectification": { color: "amber", text: "Under Rectification", icon: "⚠" },
    };
    const cfg = map[status] || map.Active;
    return <Badge color={cfg.color}>{cfg.icon} {cfg.text}</Badge>;
  };

  // --- Render ----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-6 lg:p-8 text-slate-800">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">{t.title}</h1>
            <p className="text-sm text-slate-600 mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <LanguageToggle language={language} onChange={setLanguage} />
            <ViewModeToggle mode={viewMode} onChange={setViewMode} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Sidebar: Entities */}
          <aside className="lg:col-span-3">
            <Section title={t.registeredAgents} gradient>
              <div className="space-y-2">
                {entities.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedId(e.id)}
                    className={`w-full rounded-xl border p-3 text-left transition-all hover:scale-[1.02] ${
                      selectedId === e.id
                        ? "border-[#D4AF37] bg-gradient-to-br from-[#F7FAFC] to-[#D9F2FF] shadow-md"
                        : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{e.name}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{e.type} • {e.scale}</div>
                      </div>
                      <StatusBadge status={e.status} />
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Chip tone="slate">{e.id}</Chip>
                      {e.changeAttempts >= 2 && (
                        <Chip tone="amber">{e.changeAttempts}/3</Chip>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Section>
          </aside>

          {/* Main Panel */}
          <main className="lg:col-span-9 space-y-6">
            {/* Entity Overview */}
            <Section
              title={t.entityOverview}
              gradient
              actions={
                <>
                  {changeLimitReached ? (
                    <PillButton variant="danger" onClick={() => setKycOpen(true)} icon="⚠">
                      {t.initiateKYC}
                    </PillButton>
                  ) : (
                    <PillButton variant="gold" onClick={handleRequestChange} icon="⚙️">
                      {t.requestChange}
                    </PillButton>
                  )}
                </>
              }
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">{t.immutableID}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setQrOpen(true)}
                        className="group"
                      >
                        <Chip tone="slate">
                          🔒 {selected.id} 🔗
                        </Chip>
                      </button>
                      <StatusBadge status={selected.status} />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500 mb-1">{t.entityType}</div>
                    <div className="font-medium text-slate-900">{masked(selected.type)}</div>
                  </div>
                </div>

                {/* Right Column - Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="text-xs text-slate-500 mb-1">{t.scaleCategory}</div>
                    <div className="font-medium text-slate-900">{masked(selected.scale)}</div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                    <div className="text-xs text-slate-500 mb-1">{t.registrationDate}</div>
                    <div className="font-medium text-slate-900 text-xs">{masked(selected.registrationDate)}</div>
                  </div>
                  <div className="col-span-2 p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="text-xs text-slate-500 mb-1">{t.lastVerification}</div>
                    <div className="font-medium text-slate-900 text-xs">{masked(selected.lastVerificationDate)}</div>
                  </div>
                </div>
              </div>

              {/* Change Progress */}
              <div className="mt-6 space-y-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-slate-600">{t.changeTracker}</div>
                  <div className="font-bold">
                    <span className="text-2xl text-[#D4AF37]">{selected.changeAttempts}</span>
                    <span className="text-slate-600"> / 3</span>
                  </div>
                </div>
                <ProgressBar value={selected.changeAttempts} />
                {changeLimitReached ? (
                  <div className="text-sm text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    {t.changeLimit}
                  </div>
                ) : (
                  <div className="text-xs text-slate-600">
                    {changesRemaining} {t.changesRemaining}
                  </div>
                )}
              </div>

              {/* AI Insight */}
              {viewMode !== "public" && (
                <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-white">
                      🧠
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-violet-900 mb-1">
                        <strong>{t.aiInsight}:</strong> {selected.scale} Category Entity
                      </p>
                      <p className="text-xs text-violet-700">
                        {t.fastTrack} {changesRemaining} {t.changesRemaining}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Section>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { key: "profile", label: t.profile, icon: "👤" },
                { key: "rectification", label: t.rectification, icon: "✏️" },
                { key: "authorized", label: t.authorized, icon: "✅" },
                { key: "audit", label: t.audit, icon: "📋" },
              ].map((tb) => (
                <button
                  key={tb.key}
                  onClick={() => setTab(tb.key)}
                  className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-all ${
                    tab === tb.key
                      ? "bg-gradient-to-r from-[#27AE60] to-[#A5D6A7] text-white ring-emerald-700 shadow-lg"
                      : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300"
                  }`}
                >
                  <span className="mr-1">{tb.icon}</span>
                  {tb.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            {tab === "profile" && (
              <Section title={t.permissions} gradient>
                <div className="overflow-x-auto -mx-5 px-5">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        {[t.role, t.share, t.rectificationRights, t.auditControl, t.otpRequired].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {selected.roles.map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">{r.role}</td>
                          <td className="px-4 py-3 text-sm">
                            {r.share > 0 ? <Badge color="gold">{r.share}%</Badge> : <span className="text-slate-400">—</span>}
                          </td>
                          <td className="px-4 py-3 text-sm">{r.rectification}</td>
                          <td className="px-4 py-3 text-sm">{r.audit}</td>
                          <td className="px-4 py-3 text-sm">
                            {r.otp ? <Badge color="emerald">{t.required}</Badge> : <Chip tone="slate">{t.no}</Chip>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  <strong>Note:</strong> Minimum two-member approval with OTP is enforced for all entities except individually managed businesses.
                </div>
              </Section>
            )}

            {tab === "rectification" && (
              <Section
                title={`${t.rectification}`}
                gradient
                actions={
                  <PillButton onClick={handleRequestChange} disabled={changeLimitReached} variant="primary">
                    Propose & Authorize (OTP)
                  </PillButton>
                }
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input label="Sensitive Field" placeholder="e.g., Registered Address" />
                  <Input label="Proposed Change" placeholder="New Address" />
                  <div className="md:col-span-2">
                    <Textarea
                      label="Justification (for audit)"
                      placeholder="Legal/compliance justification, supporting docs reference"
                      rows={3}
                      voice={true}
                      voiceActive={voiceActive}
                      onVoiceToggle={() => setVoiceActive(!voiceActive)}
                    />
                  </div>
                </div>
              </Section>
            )}

            {tab === "authorized" && (
              <Section title={t.authorized} gradient>
                <div className="space-y-3">
                  {selected.history.filter((h) => h.status === "Approved").map((h) => (
                    <div key={h.number} className="grid grid-cols-1 gap-2 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 md:grid-cols-5 hover:shadow-md transition-shadow">
                      <div className="font-semibold text-slate-900">Change #{h.number}</div>
                      <div className="text-sm text-slate-700">📅 {masked(h.date)}</div>
                      <div className="text-sm text-slate-700">👤 {masked(h.by)}</div>
                      <div className="text-sm text-slate-700 md:col-span-2">
                        ✓ {h.approvers.map(a => masked(a)).join(", ")}
                      </div>
                    </div>
                  ))}
                  {selected.history.filter((h) => h.status === "Approved").length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      No authorized changes yet
                    </div>
                  )}
                </div>
              </Section>
            )}

            {tab === "audit" && (
              <Section title={t.audit} gradient>
                <ol className="relative ml-2 border-l-2 border-slate-200">
                  {selected.history.map((h) => (
                    <li key={h.number} className="ml-6 mb-6 last:mb-0">
                      <span className="absolute -left-2 mt-1.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow" />
                      <div className="rounded-xl bg-white p-4 shadow-md ring-1 ring-slate-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <div className="font-semibold text-slate-900">
                            Change #{h.number} • {h.status}
                          </div>
                          <div className="text-xs text-slate-500">📅 {masked(h.date)}</div>
                        </div>
                        <div className="text-sm text-slate-700 mb-1">👤 By: {masked(h.by)}</div>
                        <div className="text-xs text-slate-600">
                          ✓ Approvers: {h.approvers.map(a => masked(a)).join(", ")}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 text-xs text-slate-500 text-center p-3 bg-slate-50 rounded-lg">
                  All corrections are logged with timestamp, approvers, and OTP verification status.
                </div>
              </Section>
            )}
          </main>
        </div>
      </div>

      {/* OTP Modal */}
      <Modal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        title="🔐 Authorize Change – Dual OTP Required"
        footer={
          <>
            <PillButton variant="secondary" onClick={() => setOtpOpen(false)}>
              Cancel
            </PillButton>
            <PillButton variant="primary" onClick={handleOtpSubmit}>
              Verify & Record Change
            </PillButton>
          </>
        }
      >
        <Textarea
          label="Describe the proposed change"
          value={otpData.details}
          onChange={(e) => setOtpData({ ...otpData, details: e.target.value })}
          placeholder="e.g., Update registered address; attach board resolution no. …"
          rows={3}
          voice={true}
          voiceActive={voiceActive}
          onVoiceToggle={() => setVoiceActive(!voiceActive)}
        />
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Approver 1 (Name/Role)"
            value={otpData.approver1}
            onChange={(e) => setOtpData({ ...otpData, approver1: e.target.value })}
            placeholder="e.g., Managing Partner"
          />
          <Input
            label="Approver 2 (Name/Role)"
            value={otpData.approver2}
            onChange={(e) => setOtpData({ ...otpData, approver2: e.target.value })}
            placeholder="e.g., Partner"
          />
          <Input
            label="OTP for Approver 1"
            value={otpData.otp1}
            onChange={(e) => setOtpData({ ...otpData, otp1: e.target.value })}
            placeholder="Enter 6-digit OTP"
          />
          <Input
            label="OTP for Approver 2"
            value={otpData.otp2}
            onChange={(e) => setOtpData({ ...otpData, otp2: e.target.value })}
            placeholder="Enter 6-digit OTP"
          />
        </div>
        
        <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 ring-1 ring-emerald-200">
          ✓ Dual-approval rule: Minimum two members must approve via OTP. Individuals are exempt (single OTP).
        </div>
      </Modal>

      {/* KYC Re-verification Modal */}
      <Modal
        open={kycOpen}
        onClose={() => setKycOpen(false)}
        title="⚠ Full KYC Re-verification Required"
        footer={
          <>
            <PillButton variant="secondary" onClick={() => setKycOpen(false)}>
              Close
            </PillButton>
            <PillButton variant="danger" onClick={() => setKycOpen(false)}>
              Submit Verification Request
            </PillButton>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Assign Verification Officer" placeholder="Officer Name" />
          <Input label="Schedule Interview" type="datetime-local" />
          <div className="md:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Upload KYC Documents (PDF/Images)</label>
            <div className="flex w-full items-center justify-between rounded-xl border-2 border-dashed border-slate-300 p-6 text-sm text-slate-600 hover:border-[#D4AF37] transition-colors cursor-pointer">
              <span>📎 Drag & drop files here or click to upload</span>
              <PillButton variant="subtle">Browse</PillButton>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-700 ring-1 ring-amber-200">
          ⚠ Change limit reached (3/3). Further structural changes are locked until re-verification completes.
        </div>
      </Modal>

      {/* Blockchain QR Modal */}
      <Modal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        title="🔗 Blockchain Verification"
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center border-2 border-slate-300">
              <div className="text-6xl">📱</div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-800">
              <strong>Entity ID:</strong> {selected.id}
            </p>
            <p className="text-xs text-slate-600">Blockchain Hash:</p>
            <code className="block text-xs bg-slate-100 px-3 py-2 rounded text-slate-700 font-mono">
              {selected.blockchainHash}
            </code>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Badge color="emerald">✓ Polygon Locked</Badge>
              <Badge color="blue">🔒 Immutable</Badge>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
