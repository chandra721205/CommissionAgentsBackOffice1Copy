import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Mic,
  ChevronDown,
  Check,
  X,
  QrCode,
  Send,
  AlertTriangle,
  TrendingUp,
  Users,
  Shield,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  Camera,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Globe,
  Sparkles,
  Package,
  Truck,
  DollarSign,
  Bell,
  FileText,
  MapPin,
  Calendar,
  Activity,
  BarChart3,
  Zap,
  Target,
} from "lucide-react";

// ============================================================================
// TRADIE v1 ENHANCED STAFF MANAGEMENT - 6 SCREENS
// Regulatory Compliance + Workflow Integration + AI Insights
// Mobile-First (375px) - Gold Shimmer Aesthetic - Expert CS/CA/Advocate Design
// ============================================================================

// --- DESIGN TOKENS ----------------------------------------------------------
const TOKENS = {
  colors: {
    gold: "#F4D03F",
    goldDark: "#F39C12",
    green: "#27AE60",
    red: "#E74C3C",
    white: "#FFFFFF",
    black: "#1A1A1A",
    gray: "#95A5A6",
    grayLight: "#ECF0F1",
    grayDark: "#7F8C8D",
    ivory: "#F7FAFC",
    blue: "#3498DB",
    yellow: "#F1C40F",
    orange: "#E67E22",
    purple: "#9B59B6",
  },
  spacing: {
    xs: "8px",
    sm: "16px",
    md: "24px",
    lg: "32px",
    xl: "48px",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
  },
};

// --- ENHANCED STAFF ROLES (From PDF Analysis) -------------------------------
const ENHANCED_ROLES = [
  {
    id: "security-watchman",
    name: "Security/Watchman",
    desc: "Stock safety monitoring + QR compliance scans",
    icon: "🛡️",
    permissions: {
      regulatory: ["qr-scan-yard", "compliance-check"],
      storage: ["stock-safety-monitor"],
      access: "view-only",
    },
    riskLevel: 2,
  },
  {
    id: "manager",
    name: "Manager",
    desc: "Overall operations oversight + 2FA full access",
    icon: "👔",
    permissions: {
      regulatory: ["all-tier-access", "tax-flag-review"],
      workflow: ["approve-all", "audit-trail-access"],
      access: "full-2fa",
    },
    riskLevel: 8,
  },
  {
    id: "salesman",
    name: "Salesman",
    desc: "Buyer relations + Bill entry with OTP",
    icon: "💼",
    permissions: {
      regulatory: ["bill-entry-otp"],
      workflow: ["bid-management"],
      access: "edit-otp",
    },
    riskLevel: 5,
  },
  {
    id: "quality-verifier",
    name: "Quality Verifier Organizer",
    desc: "Quality checks + KYC tier verification",
    icon: "✅",
    permissions: {
      regulatory: ["kyc-tier-verify", "inspection-approve"],
      workflow: ["sampling-verification", "quality-checks"],
      access: "edit-otp",
    },
    riskLevel: 6,
  },
  {
    id: "inventory-organizer",
    name: "Inventory Organizer",
    desc: "Arrivals/Dispatch + OTP handoff to buyers",
    icon: "📦",
    permissions: {
      regulatory: ["tokenization", "dispatch-otp"],
      workflow: ["arrival-register", "sales-dispatch-otp"],
      access: "edit-otp",
    },
    riskLevel: 7,
  },
  {
    id: "unskilled-labor",
    name: "Unskilled Labor",
    desc: "Loading/Unloading + Stock safety during dispatch",
    icon: "🔨",
    permissions: {
      storage: ["loading-unloading", "dispatch-safety"],
      access: "view-only",
    },
    riskLevel: 1,
  },
  {
    id: "sample-mover",
    name: "Sample Mover",
    desc: "Storage-Market transfers + Delivery requests + Post-trade transfers",
    icon: "🚚",
    permissions: {
      storage: ["delivery-request", "transfer-manage", "post-trade-transfer"],
      workflow: ["storage-market-request", "payment-collection"],
      access: "edit",
    },
    riskLevel: 4,
  },
  {
    id: "transport-organizer",
    name: "Transport Organizer",
    desc: "Sample payments + Laborer payments",
    icon: "💰",
    permissions: {
      workflow: ["labor-payment", "sample-payment", "transport-permits"],
      access: "edit-otp",
    },
    riskLevel: 5,
  },
  {
    id: "custom",
    name: "Other/Custom",
    desc: "Custom role definition",
    icon: "⚙️",
    permissions: {
      access: "custom-define",
    },
    riskLevel: 3,
  },
];

// --- ENHANCED PERMISSIONS (View/Edit/Suggest/Rectify) ----------------------
const ENHANCED_PERMISSIONS = [
  {
    id: "view",
    name: "View",
    desc: "Full/Role-limited viewing (least privilege)",
    icon: <Eye className="w-4 h-4" />,
    color: "#3498DB",
  },
  {
    id: "edit",
    name: "Edit",
    desc: "Modify with OTP authorization",
    icon: <Edit className="w-4 h-4" />,
    color: "#F39C12",
  },
  {
    id: "suggest",
    name: "Suggest",
    desc: "Flag issues for review",
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "#F1C40F",
  },
  {
    id: "rectify",
    name: "Rectify",
    desc: "Correct with 2FA + audit log",
    icon: <CheckCircle className="w-4 h-4" />,
    color: "#27AE60",
  },
];

// --- COMMUNICATION CHANNELS -------------------------------------------------
const COMMUNICATION_CHANNELS = [
  { id: "sms", name: "SMS", icon: "📱", color: "#3498DB" },
  { id: "whatsapp", name: "WhatsApp", icon: "💬", color: "#25D366" },
  { id: "email", name: "Email", icon: "📧", color: "#E74C3C" },
  { id: "arattai", name: "Arattai (Voice)", icon: "🎙️", color: "#9B59B6" },
];

// --- REGULATORY TIERS -------------------------------------------------------
const REGULATORY_TIERS = [
  { id: "yard", name: "Yard Level", icon: "🏪", color: "#27AE60" },
  { id: "district", name: "District Level", icon: "🏛️", color: "#3498DB" },
  { id: "state", name: "State Level", icon: "🏢", color: "#F39C12" },
  { id: "central", name: "Central Level", icon: "🏛️", color: "#E74C3C" },
];

// --- DELETE REASONS ---------------------------------------------------------
const DELETE_REASONS = [
  "Role Overlap/Redundancy",
  "Performance Issues",
  "Compliance Violation",
  "Staff Resignation",
  "Role Restructuring",
  "Security Concern",
  "Other",
];

// --- VILLAGES (Mock Data) ---------------------------------------------------
const VILLAGES = ["All Villages", "Village A", "Village B", "Village C", "Village D"];

// ============================================================================
// HELPER COMPONENTS (Memoized for Input Focus Stability)
// ============================================================================

// Enhanced Gold Shimmer Square Button with Pulse Animation
const GoldButton = React.memo(({ children, onClick, variant = "primary", disabled, icon, className = "" }: any) => {
  return (
    <motion.button
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        boxShadow: variant === "primary" && !disabled ? "0 8px 24px rgba(244, 208, 63, 0.5)" : undefined,
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      animate={variant === "primary" && !disabled ? {
        boxShadow: [
          "0 4px 12px rgba(244, 208, 63, 0.3)",
          "0 6px 20px rgba(244, 208, 63, 0.45)",
          "0 4px 12px rgba(244, 208, 63, 0.3)",
        ],
      } : undefined}
      transition={variant === "primary" ? {
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
        scale: { type: "spring", stiffness: 300, damping: 20 }
      } : { type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative flex items-center justify-center gap-2 rounded-lg h-12 px-6 font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${className}`}
      style={{
        background: variant === "primary" ? `linear-gradient(135deg, ${TOKENS.colors.gold} 0%, ${TOKENS.colors.goldDark} 100%)` : 
                   variant === "danger" ? `linear-gradient(135deg, ${TOKENS.colors.red} 0%, #C0392B 100%)` :
                   variant === "secondary" ? TOKENS.colors.white : undefined,
        color: variant === "primary" ? TOKENS.colors.white :
               variant === "danger" ? TOKENS.colors.white :
               variant === "secondary" ? TOKENS.colors.gold : TOKENS.colors.white,
        border: variant === "secondary" ? `2px solid ${TOKENS.colors.gold}` : 
                variant === "danger" ? "none" : undefined,
        boxShadow: variant === "primary" ? "0 4px 12px rgba(244, 208, 63, 0.3)" : 
                   variant === "danger" ? "0 4px 12px rgba(231, 76, 60, 0.3)" : 
                   variant === "secondary" ? "0 2px 8px rgba(244, 208, 63, 0.15)" : undefined,
      }}
    >
      {/* Shimmer effect for primary buttons */}
      {variant === "primary" && !disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          animate={{
            x: ["-100%", "200%"],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "linear",
          }}
          style={{
            width: "50%",
          }}
        />
      )}
      
      {/* Icon with glow effect */}
      {icon && (
        <motion.div
          animate={variant === "primary" && !disabled ? {
            filter: [
              "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))",
              "drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))",
              "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))",
            ],
          } : undefined}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          {icon}
        </motion.div>
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
});

GoldButton.displayName = "GoldButton";

// Voice Input Component
const VoiceInput = React.memo(({ label, value, onChange, placeholder, type = "text", error, icon }: any) => {
  const [listening, setListening] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleMicClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setListening(prev => !prev);
  }, []);

  return (
    <div className="w-full">
      {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full h-12 ${icon ? 'pl-10' : 'pl-4'} pr-12 rounded-lg border-2 ${
            error ? "border-red-500" : "border-gray-300"
          } focus:border-[#F4D03F] focus:outline-none transition-colors`}
        />
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={handleMicClick}
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center ${
            listening ? "bg-red-500" : "bg-gray-200"
          } transition-colors`}
        >
          <Mic className={`w-4 h-4 ${listening ? "text-white" : "text-gray-600"}`} />
        </motion.button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

VoiceInput.displayName = "VoiceInput";

// Role Multi-Select Dropdown
const RoleDropdown = React.memo(({ selected, onSelect, multiSelect = true }: any) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => 
    ENHANCED_ROLES.filter(role =>
      role.name.toLowerCase().includes(search.toLowerCase())
    ), [search]
  );

  const isSelected = useCallback((roleId: string) => {
    if (multiSelect) {
      return selected.includes(roleId);
    }
    return selected === roleId;
  }, [selected, multiSelect]);

  const handleSelect = useCallback((roleId: string) => {
    if (multiSelect) {
      if (isSelected(roleId)) {
        onSelect(selected.filter((id: string) => id !== roleId));
      } else {
        onSelect([...selected, roleId]);
      }
    } else {
      onSelect(roleId);
      setOpen(false);
    }
  }, [multiSelect, isSelected, onSelect, selected]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const selectedRoles = multiSelect ? ENHANCED_ROLES.filter(r => selected.includes(r.id)) : [ENHANCED_ROLES.find(r => r.id === selected)].filter(Boolean);

  return (
    <div className="relative w-full">
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        className="w-full min-h-16 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-between"
      >
        <div className="text-left flex-1">
          {selectedRoles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedRoles.map(role => (
                <span key={role.id} className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#F4D03F] to-[#F39C12] text-white rounded-md text-xs font-medium">
                  <span>{role.icon}</span>
                  <span>{role.name}</span>
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">Select roles...</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden"
          >
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search roles..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-100 focus:outline-none"
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-80">
              {filtered.map((role) => (
                <motion.button
                  key={role.id}
                  type="button"
                  whileHover={{ backgroundColor: "#F7FAFC" }}
                  onClick={() => handleSelect(role.id)}
                  className="w-full px-4 py-3 flex items-start gap-3 border-b border-gray-100 text-left"
                >
                  <span className="text-2xl">{role.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{role.name}</p>
                      {isSelected(role.id) && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{role.desc}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">Risk: {role.riskLevel}/10</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            {multiSelect && (
              <div className="p-2 border-t">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full h-10 bg-gray-100 rounded-lg font-medium text-sm"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

RoleDropdown.displayName = "RoleDropdown";

// Permission Toggle Card
const PermissionToggle = React.memo(({ permission, enabled, onChange }: any) => {
  const handleClick = useCallback(() => {
    onChange(!enabled);
  }, [enabled, onChange]);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`p-4 rounded-lg border-2 transition-all ${
        enabled
          ? "bg-green-50 border-green-400"
          : "bg-gray-50 border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {permission.icon}
          <span className="font-medium text-sm">{permission.name}</span>
        </div>
        <motion.div
          animate={{ rotate: enabled ? 0 : 180 }}
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            enabled ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {enabled ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <X className="w-4 h-4 text-white" />
          )}
        </motion.div>
      </div>
      <p className="text-xs text-gray-600 text-left">{permission.desc}</p>
    </motion.button>
  );
});

PermissionToggle.displayName = "PermissionToggle";

// Enhanced OTP Input Component with Pulse Rings
const OTPInput = React.memo(({ value, onChange }: any) => {
  const inputs = new Array(6).fill(0);

  const handleChange = useCallback((idx: number, newValue: string) => {
    const valueArray = value.split("");
    valueArray[idx] = newValue;
    onChange(valueArray.join(""));
    
    if (newValue && idx < 5) {
      const nextInput = document.querySelectorAll('input[type="text"]')[idx + 1] as HTMLInputElement;
      nextInput?.focus();
    }
  }, [value, onChange]);

  return (
    <div className="flex gap-2 justify-center">
      {inputs.map((_, idx) => {
        const isFilled = value[idx];
        return (
          <motion.div
            key={`otp-container-${idx}`}
            className="relative"
          >
            {/* Pulse ring animation when filled */}
            {isFilled && (
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-green-400"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            )}
            
            <motion.input
              key={`otp-${idx}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                borderColor: isFilled ? "#27AE60" : "#D1D5DB",
                backgroundColor: isFilled ? "#F0FDF4" : "#FFFFFF",
              }}
              transition={{ 
                delay: idx * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              type="text"
              maxLength={1}
              value={value[idx] || ""}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="relative w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-[#F4D03F] focus:outline-none transition-all"
              style={{
                boxShadow: isFilled 
                  ? "0 4px 12px rgba(39, 174, 96, 0.2)" 
                  : "0 2px 4px rgba(0, 0, 0, 0.05)",
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
});

OTPInput.displayName = "OTPInput";

// Enhanced AI Insight Card with Gradient Shimmer
const AIInsightCard = React.memo(({ insight }: any) => {
  const severityColors = {
    critical: "bg-gradient-to-br from-red-50 to-pink-50 border-red-300",
    high: "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300",
    medium: "bg-gradient-to-br from-yellow-50 to-lime-50 border-yellow-300",
    low: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300",
    info: "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-300",
  };

  const severityIcons = {
    critical: <AlertTriangle className="w-5 h-5 text-red-600" />,
    high: <TrendingUp className="w-5 h-5 text-orange-600" />,
    medium: <Activity className="w-5 h-5 text-yellow-600" />,
    low: <CheckCircle className="w-5 h-5 text-blue-600" />,
    info: <Sparkles className="w-5 h-5 text-purple-600" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative p-4 rounded-lg border-2 ${severityColors[insight.severity as keyof typeof severityColors]} overflow-hidden`}
      style={{
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        animate={{
          x: ["-100%", "200%"],
          opacity: [0, 0.2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "linear",
        }}
        style={{
          width: "50%",
        }}
      />
      
      <div className="relative flex items-start gap-3">
        <motion.div 
          className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center"
          animate={{
            boxShadow: [
              "0 0 0px rgba(168, 85, 247, 0)",
              "0 0 20px rgba(168, 85, 247, 0.6)",
              "0 0 0px rgba(168, 85, 247, 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {severityIcons[insight.severity as keyof typeof severityIcons]}
            </motion.div>
            <span className="text-xs font-semibold uppercase text-gray-500">
              {insight.category}
            </span>
          </div>
          <p className="font-semibold text-sm mb-1">Grok: {insight.title}</p>
          <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-500">Risk: <strong>{insight.risk}/10</strong></span>
            {insight.affected && <span className="text-gray-500">Affected: <strong>{insight.affected}</strong></span>}
          </div>
          {insight.action && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-700">Action: {insight.action}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

AIInsightCard.displayName = "AIInsightCard";

// Enhanced QR Code Display with Shimmer Animation
const QRDisplay = React.memo(({ staffId, onCopy }: any) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="flex flex-col items-center gap-4"
    >
      <motion.div 
        className="relative w-48 h-48 bg-white border-4 rounded-lg flex items-center justify-center overflow-hidden"
        animate={{
          borderColor: ["#D1D5DB", "#F4D03F", "#D1D5DB"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Shimmer effect on QR code */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          animate={{
            x: ["-100%", "200%"],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "linear",
          }}
          style={{
            width: "50%",
          }}
        />
        
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <QrCode className="w-32 h-32 text-gray-600" />
        </motion.div>
      </motion.div>
      
      <motion.p 
        className="text-sm text-gray-600 px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Staff ID: <strong className="text-[#F4D03F]">{staffId}</strong>
      </motion.p>
      
      <GoldButton
        onClick={onCopy}
        icon={<Copy className="w-4 h-4" />}
      >
        Copy Link
      </GoldButton>
    </motion.div>
  );
});

QRDisplay.displayName = "QRDisplay";

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function EnhancedStaffManagement() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [language, setLanguage] = useState("en");

  // Form State
  const [staffName, setStaffName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [staffPhoto, setStaffPhoto] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffWhatsApp, setStaffWhatsApp] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedVillage, setSelectedVillage] = useState("All Villages");
  const [permissions, setPermissions] = useState({
    view: true,
    edit: false,
    suggest: false,
    rectify: false,
  });
  const [shareChannels, setShareChannels] = useState<string[]>([]);
  const [otp, setOtp] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [justification, setJustification] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Mock Staff Data
  const [staffList, setStaffList] = useState([
    {
      id: "STF-2025-001",
      name: "Ramesh Kumar",
      photo: "RK",
      roles: ["security-watchman", "inventory-organizer"],
      village: "Village A",
      assignedDate: "2025-10-15",
      status: "active",
      riskRanking: 4,
      confirmationStatus: "confirmed",
      regulatoryAccess: ["yard", "district"],
    },
    {
      id: "STF-2025-002",
      name: "Priya Sharma",
      photo: "PS",
      roles: ["quality-verifier"],
      village: "Village B",
      assignedDate: "2025-10-20",
      status: "active",
      riskRanking: 6,
      confirmationStatus: "pending",
      regulatoryAccess: ["yard"],
    },
    {
      id: "STF-2025-003",
      name: "Suresh Patel",
      photo: "SP",
      roles: ["salesman", "transport-organizer"],
      village: "Village A",
      assignedDate: "2025-10-18",
      status: "inactive",
      riskRanking: 5,
      confirmationStatus: "confirmed",
      regulatoryAccess: ["yard", "district"],
    },
  ]);

  // Enhanced AI Insights (From PDF Analysis)
  const aiInsights = useMemo(() => [
    {
      id: 1,
      category: "regulatory",
      title: "Pending Tax 1% - Alert Central if >7 Days",
      description: "5 producers flagged for tax compliance review. District supervisor notified.",
      severity: "high",
      risk: 8,
      affected: "5 producers",
      action: "Flag to State/Central Authority",
    },
    {
      id: 2,
      category: "bill-auth",
      title: "Repeat Cancellations - Rate Drop -0.5",
      description: "Buyer 'ABC Corp' has 3 cancellations in 30 days. Rating reduced from 4.5 to 4.0.",
      severity: "medium",
      risk: 6,
      affected: "1 buyer",
      action: "Suggest Review & Warning",
    },
    {
      id: 3,
      category: "workflow",
      title: "Credit Requests: 5 Producers (Village A) - High-Risk Alert",
      description: "Village Filter shows concentration of credit requests. Monitor advance limits.",
      severity: "high",
      risk: 8,
      affected: "5 producers",
      action: "Review Credit Limits",
    },
    {
      id: 4,
      category: "storage",
      title: "Pending Closes: ₹5K - Partial Debit Suggest",
      description: "Rank 8/10 storage facility has pending payment. Suggest partial debit settlement.",
      severity: "medium",
      risk: 7,
      affected: "1 facility",
      action: "Initiate Payment Recovery",
    },
    {
      id: 5,
      category: "role-conflict",
      title: "Multi-Role Efficiency +15% - Low Risk",
      description: "Staff with Inventory + Sample Mover roles showing optimal performance.",
      severity: "info",
      risk: 2,
      affected: "3 staff",
      action: "Recommend Cross-Training",
    },
    {
      id: 6,
      category: "kyc",
      title: "KYC Tier 2 Verification Pending - 4 Buyers",
      description: "Quality Verifier needs to complete tier verification for upgraded buyers.",
      severity: "medium",
      risk: 5,
      affected: "4 buyers",
      action: "Assign to Quality Team",
    },
    {
      id: 7,
      category: "access",
      title: "Unusual Access Pattern - Watchman @ 2 AM",
      description: "Security/Watchman accessed inventory system outside normal hours.",
      severity: "critical",
      risk: 9,
      affected: "1 staff",
      action: "Emergency Audit Required",
    },
    {
      id: 8,
      category: "compliance",
      title: "QR Scan Compliance: 98% (Yard Level)",
      description: "Yard-level regulatory QR scans showing excellent compliance.",
      severity: "info",
      risk: 1,
      affected: "All yard staff",
      action: "Maintain Standards",
    },
  ], []);

  // Auto-generate Staff ID
  const generateStaffId = useCallback(() => {
    const year = new Date().getFullYear();
    const count = staffList.length + 1;
    return `STF-${year}-${String(count).padStart(3, '0')}`;
  }, [staffList.length]);

  // Screen Navigation
  const goToScreen = useCallback((screen: number) => {
    if (screen === 2 && !staffName) {
      alert("Please enter staff name first");
      return;
    }
    if (screen === 3 && selectedRoles.length === 0) {
      alert("Please select at least one role");
      return;
    }
    setCurrentScreen(screen);
    if (screen === 2 && !staffId) {
      setStaffId(generateStaffId());
    }
  }, [staffName, selectedRoles, staffId, generateStaffId]);

  // Filtered Insights
  const filteredInsights = useMemo(() => {
    if (filterCategory === "all") return aiInsights;
    return aiInsights.filter(insight => insight.category === filterCategory);
  }, [aiInsights, filterCategory]);

  // ============================================================================
  // SCREEN RENDERERS
  // ============================================================================

  // Screen 1: Add Staff
  const renderAddStaff = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Add Staff</h1>
        <button
          onClick={() => setLanguage(language === "en" ? "hi" : "en")}
          className="p-2 rounded-lg bg-gray-100"
        >
          <Globe className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <VoiceInput
          label="Staff Name *"
          value={staffName}
          onChange={setStaffName}
          placeholder="Enter full name"
          icon={<Users className="w-4 h-4" />}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Staff ID (Auto)</label>
            <div className="h-12 px-4 rounded-lg border-2 border-gray-300 bg-gray-50 flex items-center text-sm text-gray-600">
              {staffId || generateStaffId()}
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Photo</label>
            <button className="w-full h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50">
              <Camera className="w-4 h-4" />
              <span className="text-sm">Upload</span>
            </button>
          </div>
        </div>

        <VoiceInput
          label="Phone Number *"
          value={staffPhone}
          onChange={setStaffPhone}
          placeholder="+91-XXXXX-XXXXX"
          type="tel"
          icon={<Bell className="w-4 h-4" />}
        />

        <VoiceInput
          label="Email Address"
          value={staffEmail}
          onChange={setStaffEmail}
          placeholder="staff@example.com"
          type="email"
          icon={<FileText className="w-4 h-4" />}
        />

        <VoiceInput
          label="WhatsApp Number"
          value={staffWhatsApp}
          onChange={setStaffWhatsApp}
          placeholder="+91-XXXXX-XXXXX"
          type="tel"
          icon={<Send className="w-4 h-4" />}
        />

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Village</label>
          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            className="w-full h-12 px-4 rounded-lg border-2 border-gray-300 focus:border-[#F4D03F] focus:outline-none"
          >
            {VILLAGES.map(village => (
              <option key={village} value={village}>{village}</option>
            ))}
          </select>
        </div>
      </div>

      <GoldButton
        onClick={() => goToScreen(2)}
        icon={<Plus className="w-5 h-5" />}
        className="w-full"
      >
        Continue to Role Assignment
      </GoldButton>
    </div>
  );

  // Screen 2: Multi-Role Assignment
  const renderRoleAssignment = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setCurrentScreen(1)} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Assign Roles</h1>
      </div>

      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <p className="text-sm">
          <strong>Staff:</strong> {staffName} ({staffId})
        </p>
        <p className="text-sm text-gray-600">Village: {selectedVillage}</p>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Roles (Multi-Select Enabled) *
        </label>
        <RoleDropdown
          selected={selectedRoles}
          onSelect={setSelectedRoles}
          multiSelect={true}
        />
      </div>

      {selectedRoles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg shadow-lg"
          style={{
            boxShadow: "0 4px 16px rgba(39, 174, 96, 0.15)",
          }}
        >
          <p className="text-sm font-medium mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-600" />
            Selected Roles Summary:
          </p>
          <div className="space-y-2">
            {selectedRoles.map((roleId, index) => {
              const role = ENHANCED_ROLES.find(r => r.id === roleId);
              return (
                <motion.div
                  key={roleId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  className="flex items-center justify-between p-2 bg-white rounded-lg"
                  style={{
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <motion.span
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(244, 208, 63, 0)",
                        "0 0 8px rgba(244, 208, 63, 0.6)",
                        "0 0 0px rgba(244, 208, 63, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex items-center gap-2 font-medium"
                  >
                    <span className="text-xl">{role?.icon}</span>
                    <span className="text-sm">{role?.name}</span>
                  </motion.span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                    Risk: {role?.riskLevel}/10
                  </span>
                </motion.div>
              );
            })}
            <div className="pt-2 border-t border-green-300">
              <span className="text-xs text-gray-600">
                Combined Risk: <strong>
                  {selectedRoles.reduce((sum, id) => {
                    const role = ENHANCED_ROLES.find(r => r.id === id);
                    return sum + (role?.riskLevel || 0);
                  }, 0)}
                </strong>/100
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {selectedRoles.length > 1 && (
        <AIInsightCard
          insight={{
            category: "suggestion",
            title: "Multi-Role Assignment Detected",
            description: "AI suggests optimal workflow: Inventory + Sample Mover for ops efficiency +15%.",
            severity: "info",
            risk: 2,
            action: "Proceed with confirmation",
          }}
        />
      )}

      <GoldButton
        onClick={() => goToScreen(3)}
        icon={<CheckCircle className="w-5 h-5" />}
        className="w-full"
        disabled={selectedRoles.length === 0}
      >
        Continue to Permissions
      </GoldButton>
    </div>
  );

  // Screen 3: Permissions Edit
  const renderPermissionsEdit = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setCurrentScreen(2)} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Edit Permissions</h1>
      </div>

      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <p className="text-sm">
          <strong>{staffName}</strong> ({staffId})
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedRoles.map(roleId => {
            const role = ENHANCED_ROLES.find(r => r.id === roleId);
            return (
              <span key={roleId} className="text-xs px-2 py-1 bg-white rounded-md">
                {role?.icon} {role?.name}
              </span>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Assign Permissions (Role-Bound)</p>
        <div className="grid gap-3">
          {ENHANCED_PERMISSIONS.map(permission => (
            <PermissionToggle
              key={permission.id}
              permission={permission}
              enabled={permissions[permission.id as keyof typeof permissions]}
              onChange={(enabled: boolean) => setPermissions(prev => ({ ...prev, [permission.id]: enabled }))}
            />
          ))}
        </div>
      </div>

      <AIInsightCard
        insight={{
          category: "rbac",
          title: "Least Privilege Applied",
          description: "Watchman role: View-only stock access recommended (Safety Risk Low).",
          severity: "info",
          risk: 2,
          action: "Maintain current settings",
        }}
      />

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Justification for Assignment</label>
        <textarea
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          placeholder="Reason for role and permission assignment..."
          className="w-full h-24 p-3 rounded-lg border-2 border-gray-300 focus:border-[#F4D03F] focus:outline-none"
        />
      </div>

      <GoldButton
        onClick={() => goToScreen(4)}
        icon={<Send className="w-5 h-5" />}
        className="w-full"
      >
        Continue to Confirmation
      </GoldButton>
    </div>
  );

  // Screen 4: Confirmation Link Share
  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setCurrentScreen(3)} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Confirm Assignment</h1>
      </div>

      <div className="p-4 bg-gradient-to-r from-[#F4D03F] to-[#F39C12] text-white rounded-lg">
        <p className="text-sm opacity-90">Staff Member</p>
        <p className="font-bold text-lg">{staffName}</p>
        <p className="text-sm opacity-90 mt-1">{staffId}</p>
      </div>

      <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
        <QRDisplay
          staffId={staffId}
          onCopy={() => {
            navigator.clipboard.writeText(`https://tradie.app/confirm/${staffId}`);
            alert("Link copied!");
          }}
        />
      </div>

      <div>
        <label className="block mb-3 text-sm font-medium text-gray-700">
          Share Confirmation Link via:
        </label>
        <div className="grid grid-cols-2 gap-3">
          {COMMUNICATION_CHANNELS.map(channel => (
            <motion.button
              key={channel.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (shareChannels.includes(channel.id)) {
                  setShareChannels(shareChannels.filter(c => c !== channel.id));
                } else {
                  setShareChannels([...shareChannels, channel.id]);
                }
              }}
              className={`p-3 rounded-lg border-2 transition-all ${
                shareChannels.includes(channel.id)
                  ? "border-green-400 bg-green-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{channel.icon}</span>
                  <span className="text-sm font-medium">{channel.name}</span>
                </div>
                {shareChannels.includes(channel.id) && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-3 text-sm font-medium text-gray-700">
          OTP Verification (6-Digit)
        </label>
        <OTPInput value={otp} onChange={setOtp} />
      </div>

      <GoldButton
        onClick={() => {
          if (otp.length !== 6) {
            alert("Please enter 6-digit OTP");
            return;
          }
          // Success animation
          setCurrentScreen(5);
          setOtp("");
        }}
        icon={<CheckCircle className="w-5 h-5" />}
        className="w-full"
        disabled={shareChannels.length === 0}
      >
        Send & Verify OTP
      </GoldButton>
    </div>
  );

  // Screen 5: AI Insights Dashboard
  const renderAIInsights = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">AI Insights</h1>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium">Grok AI</span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCategory("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            filterCategory === "all" ? "bg-gradient-to-r from-[#F4D03F] to-[#F39C12] text-white" : "bg-gray-100"
          }`}
        >
          All ({aiInsights.length})
        </button>
        <button
          onClick={() => setFilterCategory("regulatory")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            filterCategory === "regulatory" ? "bg-red-100 text-red-700" : "bg-gray-100"
          }`}
        >
          Regulatory
        </button>
        <button
          onClick={() => setFilterCategory("workflow")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            filterCategory === "workflow" ? "bg-orange-100 text-orange-700" : "bg-gray-100"
          }`}
        >
          Workflow
        </button>
        <button
          onClick={() => setFilterCategory("storage")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            filterCategory === "storage" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100"
          }`}
        >
          Storage
        </button>
      </div>

      <div className="space-y-3">
        {filteredInsights.map(insight => (
          <AIInsightCard key={insight.id} insight={insight} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <GoldButton
          onClick={() => setCurrentScreen(1)}
          variant="secondary"
          icon={<Plus className="w-5 h-5" />}
        >
          Add New Staff
        </GoldButton>
        <GoldButton
          onClick={() => setCurrentScreen(6)}
          icon={<Users className="w-5 h-5" />}
        >
          View All Staff
        </GoldButton>
      </div>
    </div>
  );

  // Screen 6: Delete/Revoke Staff
  const renderDeleteRevoke = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setCurrentScreen(5)} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Staff Management</h1>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, or village..."
            className="w-full h-12 pl-10 pr-4 rounded-lg border-2 border-gray-300 focus:border-[#F4D03F] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        {staffList
          .filter(staff =>
            staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.village.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(staff => (
            <motion.div
              key={staff.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-lg border-2 ${
                staff.status === "active" ? "border-green-300 bg-green-50" :
                "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                    {staff.photo}
                  </div>
                  <div>
                    <p className="font-semibold">{staff.name}</p>
                    <p className="text-xs text-gray-600">{staff.id}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  staff.status === "active" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"
                }`}>
                  {staff.status.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {staff.roles.map(roleId => {
                  const role = ENHANCED_ROLES.find(r => r.id === roleId);
                  return (
                    <span key={roleId} className="text-xs px-2 py-1 bg-white rounded-md">
                      {role?.icon} {role?.name}
                    </span>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{staff.village}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{staff.assignedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span>Risk: {staff.riskRanking}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  {staff.confirmationStatus === "confirmed" ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <Clock className="w-3 h-3 text-orange-600" />
                  )}
                  <span>{staff.confirmationStatus}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 h-10 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex-1 h-10 rounded-lg bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Revoke
                </button>
              </div>
            </motion.div>
          ))}
      </div>

      <GoldButton
        onClick={() => setCurrentScreen(1)}
        icon={<Plus className="w-5 h-5" />}
        className="w-full"
      >
        Add New Staff Member
      </GoldButton>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7FAFC] to-[#D9F2FF] p-4">
      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            {currentScreen === 1 && renderAddStaff()}
            {currentScreen === 2 && renderRoleAssignment()}
            {currentScreen === 3 && renderPermissionsEdit()}
            {currentScreen === 4 && renderConfirmation()}
            {currentScreen === 5 && renderAIInsights()}
            {currentScreen === 6 && renderDeleteRevoke()}
          </motion.div>
        </AnimatePresence>

        {/* Screen Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3, 4, 5, 6].map(screen => (
            <button
              key={screen}
              onClick={() => setCurrentScreen(screen)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentScreen === screen
                  ? "w-8 bg-gradient-to-r from-[#F4D03F] to-[#F39C12]"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Documentation Link */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            TRADIE v1 Enhanced Staff Management
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Regulatory Compliance • Workflow Integration • AI Insights
          </p>
        </div>
      </div>
    </div>
  );
}
