import React, { useState } from "react";
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
} from "lucide-react";

// ============================================================================
// TRADIE v1 COMMISSION AGENT STAFF MANAGEMENT PROTOTYPE
// 8 Screens - Mobile-First (375px) - Gold Shimmer Aesthetic
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
  fonts: {
    h1: "32px",
    h2: "24px",
    h3: "20px",
    body: "16px",
    small: "14px",
    xs: "12px",
  },
  shadows: {
    sm: "0 2px 4px rgba(0,0,0,0.08)",
    md: "0 4px 8px rgba(0,0,0,0.12)",
    lg: "0 8px 16px rgba(0,0,0,0.16)",
    gold: "0 4px 12px rgba(244, 208, 63, 0.3)",
  },
};

// --- STAFF ROLES ------------------------------------------------------------
const STAFF_ROLES = [
  { id: "security", name: "Security/Watchman", desc: "Stock safety monitoring", icon: "🛡️" },
  { id: "manager", name: "Manager", desc: "Overall operations", icon: "👔" },
  { id: "salesman", name: "Salesman", desc: "Buyer relations", icon: "💼" },
  { id: "quality", name: "Quality Verifier Organizer", desc: "Quality checks", icon: "✅" },
  { id: "inventory", name: "Inventory Organizer", desc: "Arrivals/Dispatch/OTP handoff", icon: "📦" },
  { id: "labor", name: "Unskilled Labor", desc: "Loading/Unloading", icon: "🔨" },
  { id: "sample-mover", name: "Sample Mover", desc: "Storage-Market transfers", icon: "🚚" },
  { id: "transport", name: "Transport Organizer", desc: "Sample payments/Laborers", icon: "💰" },
  { id: "custom", name: "Other/Custom", desc: "Custom role", icon: "⚙️" },
];

// --- PERMISSIONS ------------------------------------------------------------
const PERMISSIONS = [
  { id: "view", name: "View", desc: "Full/Role-limited viewing", icon: <Eye className="w-4 h-4" /> },
  { id: "suggest", name: "Suggest", desc: "Flag issues", icon: <AlertTriangle className="w-4 h-4" /> },
  { id: "rectify", name: "Rectify", desc: "Edit with OTP", icon: <Edit className="w-4 h-4" /> },
  { id: "delete", name: "Delete", desc: "Remove records", icon: <Trash2 className="w-4 h-4" /> },
];

// --- LANGUAGES --------------------------------------------------------------
const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "te", label: "తె" },
];

// --- HELPER COMPONENTS ------------------------------------------------------
// IMPORTANT: These must be React.memo to prevent recreation on parent re-renders

// Gold Shimmer Button
const GoldButton = React.memo(({ children, onClick, variant = "primary", disabled, icon, className = "" }: any) => {
  const variants = {
    primary: `bg-gradient-to-r from-[${TOKENS.colors.gold}] to-[${TOKENS.colors.goldDark}] text-white shadow-[${TOKENS.shadows.gold}]`,
    secondary: `bg-white text-[${TOKENS.colors.gold}] border-2 border-[${TOKENS.colors.gold}]`,
    danger: `bg-white text-[${TOKENS.colors.red}] border-2 border-[${TOKENS.colors.red}]`,
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-[${TOKENS.radius.sm}] h-[48px] px-6 font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant as keyof typeof variants]} ${className}`}
      style={{
        background: variant === "primary" ? `linear-gradient(135deg, ${TOKENS.colors.gold} 0%, ${TOKENS.colors.goldDark} 100%)` : undefined,
      }}
    >
      {icon}
      {children}
    </motion.button>
  );
});

GoldButton.displayName = "GoldButton";

// Input with Voice Mic
const VoiceInput = React.memo(({ label, value, onChange, placeholder, type = "text", error }: any) => {
  const [listening, setListening] = useState(false);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleMicClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setListening(prev => !prev);
  }, []);

  return (
    <div className="w-full">
      {label && <label className="block mb-2 text-sm font-medium">{label}</label>}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full h-12 pl-4 pr-12 rounded-lg border-2 ${
            error ? "border-red-500" : "border-gray-300"
          } focus:border-[${TOKENS.colors.gold}] focus:outline-none transition-colors`}
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

// Role Dropdown
const RoleDropdown = React.memo(({ selected, onSelect, multiSelect }: any) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = React.useMemo(() => 
    STAFF_ROLES.filter(role =>
      role.name.toLowerCase().includes(search.toLowerCase())
    ), [search]
  );

  const isSelected = React.useCallback((roleId: string) => {
    if (multiSelect) {
      return selected.includes(roleId);
    }
    return selected === roleId;
  }, [selected, multiSelect]);

  const handleSelect = React.useCallback((roleId: string) => {
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

  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  return (
    <div className="relative w-full">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        className="w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-between"
      >
        <span className="text-left">
          {multiSelect ? (
            selected.length > 0 ? (
              <span className="text-sm">
                {selected.length} role{selected.length > 1 ? "s" : ""} selected
              </span>
            ) : (
              <span className="text-gray-400">Select roles...</span>
            )
          ) : selected ? (
            STAFF_ROLES.find(r => r.id === selected)?.name
          ) : (
            <span className="text-gray-400">Select role...</span>
          )}
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden"
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
            <div className="overflow-y-auto max-h-64">
              {filtered.map((role) => (
                <motion.button
                  key={role.id}
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
                  </div>
                </motion.button>
              ))}
            </div>
            {multiSelect && (
              <div className="p-2 border-t">
                <button
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

// Role Badge
const RoleBadge = React.memo(({ roleId }: any) => {
  const role = STAFF_ROLES.find(r => r.id === roleId);
  if (!role) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#F4D03F] to-[#F39C12] text-white rounded-full text-xs font-medium"
    >
      <span>{role.icon}</span>
      <span>{role.name}</span>
    </motion.div>
  );
});

RoleBadge.displayName = "RoleBadge";

// AI Insight Card
const AIInsightCard = React.memo(({ title, description, severity = "low" }: any) => {
  const severityColors = {
    low: "bg-blue-50 border-blue-200",
    medium: "bg-amber-50 border-amber-200",
    high: "bg-red-50 border-red-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-lg border-2 ${severityColors[severity]}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm mb-1">Grok: {title}</p>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
    </motion.div>
  );
});

AIInsightCard.displayName = "AIInsightCard";

// Permission Toggle
const PermissionToggle = React.memo(({ permission, enabled, onChange }: any) => {
  const handleClick = React.useCallback(() => {
    onChange(!enabled);
  }, [enabled, onChange]);

  return (
    <motion.button
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

// OTP Input
const OTPInput = React.memo(({ value, onChange }: any) => {
  const inputs = new Array(6).fill(0);

  const handleChange = React.useCallback((idx: number, newValue: string) => {
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
      {inputs.map((_, idx) => (
        <motion.input
          key={`otp-${idx}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          type="text"
          maxLength={1}
          value={value[idx] || ""}
          onChange={(e) => handleChange(idx, e.target.value)}
          className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#F4D03F] focus:outline-none"
        />
      ))}
    </div>
  );
});

OTPInput.displayName = "OTPInput";

// --- MAIN COMPONENT ---------------------------------------------------------
export default function StaffManagementPrototype() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [language, setLanguage] = useState("en");

  // Form State
  const [staffName, setStaffName] = useState("");
  const [staffPhoto, setStaffPhoto] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffWhatsApp, setStaffWhatsApp] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState({
    view: true,
    suggest: false,
    rectify: false,
    delete: false,
  });
  const [shareChannel, setShareChannel] = useState("");
  const [otp, setOtp] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVillage, setFilterVillage] = useState("all");

  // Mock Data
  const [staffList, setStaffList] = useState([
    {
      id: "STF-001",
      name: "Ramesh Kumar",
      photo: "RK",
      roles: ["inventory", "sample-mover"],
      status: "active",
      assignedDate: "2025-10-15",
      village: "Village A",
    },
    {
      id: "STF-002",
      name: "Priya Sharma",
      photo: "PS",
      roles: ["quality"],
      status: "active",
      assignedDate: "2025-10-20",
      village: "Village B",
    },
  ]);

  const [aiInsights, setAiInsights] = useState([
    {
      id: 1,
      title: "5 Producers Need Credit",
      description: "Village Filter—Alert High-Risk Advances",
      severity: "high",
    },
    {
      id: 2,
      title: "Pending Closes: ₹5K",
      description: "Rank 8/10—Partial Debit Suggest",
      severity: "medium",
    },
    {
      id: 3,
      title: "Multi-Role Staff Efficiency +20%",
      description: "Monitor Overload",
      severity: "low",
    },
  ]);

  // Screen Transitions
  const goToScreen = (screen: number) => {
    setCurrentScreen(screen);
  };

  // Screen Components
  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return <Screen1AddStaff />;
      case 2:
        return <Screen2RoleAssignment />;
      case 3:
        return <Screen3PermissionsEdit />;
      case 4:
        return <Screen4ConfirmationLink />;
      case 5:
        return <Screen5AIInsights />;
      case 6:
        return <Screen6ViewAssigned />;
      case 7:
        return <Screen7DeleteRevoke />;
      case 8:
        return <Screen8Operations />;
      default:
        return <Screen1AddStaff />;
    }
  };

  // --- SCREEN 1: ADD STAFF --------------------------------------------------
  const Screen1AddStaff = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <h1 className="text-[32px] font-bold text-gray-900">Add New Staff</h1>

      <VoiceInput
        label="Staff Name"
        value={staffName}
        onChange={setStaffName}
        placeholder="Enter full name..."
      />

      {/* Photo Upload */}
      <div>
        <label className="block mb-2 text-sm font-medium">Photo</label>
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300"
          >
            {staffPhoto ? (
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                {staffPhoto}
              </div>
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </motion.button>
          <div className="flex-1">
            <button className="text-sm text-[#F4D03F] font-medium">Upload Photo</button>
            <p className="text-xs text-gray-500 mt-1">Or use voice to describe</p>
          </div>
        </div>
      </div>

      <VoiceInput
        label="Phone Number"
        value={staffPhone}
        onChange={setStaffPhone}
        placeholder="+91-98765-43210"
        type="tel"
      />

      <VoiceInput
        label="Email Address"
        value={staffEmail}
        onChange={setStaffEmail}
        placeholder="staff@example.com"
        type="email"
      />

      <VoiceInput
        label="WhatsApp Number"
        value={staffWhatsApp}
        onChange={setStaffWhatsApp}
        placeholder="+91-98765-43210"
        type="tel"
      />

      <div className="pt-4">
        <GoldButton
          onClick={() => goToScreen(2)}
          icon={<Plus className="w-5 h-5" />}
          className="w-full"
        >
          Add Staff
        </GoldButton>
      </div>
    </motion.div>
  );

  // --- SCREEN 2: ROLE ASSIGNMENT --------------------------------------------
  const Screen2RoleAssignment = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => goToScreen(1)}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[32px] font-bold text-gray-900">Assign Roles</h1>
      </div>

      <p className="text-sm text-gray-600">Multi-Select OK</p>

      <RoleDropdown
        selected={selectedRoles}
        onSelect={setSelectedRoles}
        multiSelect={true}
      />

      {selectedRoles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <p className="text-sm font-medium">Selected Roles:</p>
          <div className="flex flex-wrap gap-2">
            {selectedRoles.map((roleId) => (
              <RoleBadge key={roleId} roleId={roleId} />
            ))}
          </div>
        </motion.div>
      )}

      {selectedRoles.length >= 2 && (
        <AIInsightCard
          title="Multi-Role Assigned—Risk Low"
          description={`${selectedRoles.length} roles assigned. Efficiency +15%. Monitor workload.`}
          severity="low"
        />
      )}

      {selectedRoles.includes("inventory") && selectedRoles.includes("sample-mover") && (
        <AIInsightCard
          title="Suggested: Inventory + Sample for Efficiency"
          description="These roles complement each other well. Recommended combination."
          severity="low"
        />
      )}

      <div className="pt-4">
        <GoldButton
          onClick={() => goToScreen(3)}
          disabled={selectedRoles.length === 0}
          className="w-full"
        >
          Assign Roles
        </GoldButton>
      </div>
    </motion.div>
  );

  // --- SCREEN 3: PERMISSIONS EDIT -------------------------------------------
  const Screen3PermissionsEdit = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => goToScreen(2)}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[24px] font-bold text-gray-900">Edit Permissions</h1>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium mb-2">For: {staffName || "New Staff"}</p>
        <div className="flex flex-wrap gap-2">
          {selectedRoles.map((roleId) => (
            <RoleBadge key={roleId} roleId={roleId} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {PERMISSIONS.map((permission) => (
          <PermissionToggle
            key={permission.id}
            permission={permission}
            enabled={permissions[permission.id as keyof typeof permissions]}
            onChange={(enabled: boolean) =>
              setPermissions({ ...permissions, [permission.id]: enabled })
            }
          />
        ))}
      </div>

      {selectedRoles.includes("labor") && permissions.view && (
        <AIInsightCard
          title="Unskilled Labor—Limit to View"
          description="Fraud Risk Low. Recommend view-only access for this role."
          severity="low"
        />
      )}

      <div className="pt-4">
        <GoldButton
          onClick={() => goToScreen(4)}
          icon={<Check className="w-5 h-5" />}
          className="w-full"
        >
          Save Permissions
        </GoldButton>
      </div>
    </motion.div>
  );

  // --- SCREEN 4: CONFIRMATION LINK ------------------------------------------
  const Screen4ConfirmationLink = () => {
    const [linkGenerated, setLinkGenerated] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateLink = () => {
      setLinkGenerated(true);
    };

    const copyLink = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <button onClick={() => goToScreen(3)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[24px] font-bold text-gray-900">Confirmation</h1>
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
          <p className="font-semibold mb-2">Confirm Multi-Role Assignment</p>
          <p className="text-sm text-gray-600">
            {staffName} will be assigned {selectedRoles.length} role(s)
          </p>
        </div>

        {!linkGenerated ? (
          <GoldButton
            onClick={generateLink}
            icon={<QrCode className="w-5 h-5" />}
            className="w-full"
          >
            Generate Confirmation Link
          </GoldButton>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* QR Code */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-300 flex flex-col items-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-40 h-40 bg-gradient-to-br from-[#F4D03F] to-[#F39C12] rounded-lg flex items-center justify-center mb-4"
              >
                <QrCode className="w-32 h-32 text-white" />
              </motion.div>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <p className="text-xs font-mono">https://tradie.in/confirm/abc123</p>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={copyLink}
                  className="text-[#F4D03F]"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>

            {/* Share Options */}
            <div>
              <p className="text-sm font-medium mb-3">Share via:</p>
              <div className="grid grid-cols-2 gap-3">
                {["SMS", "WhatsApp", "Arattai", "Email"].map((channel) => (
                  <motion.button
                    key={channel}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShareChannel(channel);
                      setTimeout(() => setShareChannel(""), 2000);
                    }}
                    className={`h-12 rounded-lg border-2 font-medium text-sm transition-all ${
                      shareChannel === channel
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-gray-300 text-gray-700"
                    }`}
                  >
                    {shareChannel === channel ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" /> Sent!
                      </span>
                    ) : (
                      channel
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* OTP Entry */}
            <div className="pt-4">
              <p className="text-sm font-medium mb-3 text-center">Enter 6-Digit OTP</p>
              <OTPInput value={otp} onChange={setOtp} />
            </div>

            <GoldButton
              onClick={() => goToScreen(5)}
              disabled={otp.length !== 6}
              icon={<Send className="w-5 h-5" />}
              className="w-full"
            >
              Send & Verify OTP
            </GoldButton>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // --- SCREEN 5: AI INSIGHTS DASHBOARD --------------------------------------
  const Screen5AIInsights = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => goToScreen(4)}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[32px] font-bold text-gray-900">Staff Insights</h1>
      </div>

      {/* Success Message */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-4 bg-green-50 border-2 border-green-400 rounded-lg flex items-center gap-3"
      >
        <CheckCircle className="w-6 h-6 text-green-600" />
        <div>
          <p className="font-semibold text-green-900">Staff Confirmed!</p>
          <p className="text-sm text-green-700">OTP verified via {shareChannel || "SMS"}</p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2">
        <select
          value={filterVillage}
          onChange={(e) => setFilterVillage(e.target.value)}
          className="flex-1 h-10 px-3 rounded-lg border-2 border-gray-300 text-sm"
        >
          <option value="all">All Villages</option>
          <option value="village-a">Village A</option>
          <option value="village-b">Village B</option>
          <option value="village-c">Village C</option>
        </select>
        <button className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center">
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* AI Insights */}
      <div className="space-y-3">
        {aiInsights.map((insight) => (
          <AIInsightCard
            key={insight.id}
            title={insight.title}
            description={insight.description}
            severity={insight.severity as any}
          />
        ))}
      </div>

      <div className="pt-4">
        <GoldButton
          onClick={() => goToScreen(6)}
          icon={<TrendingUp className="w-5 h-5" />}
          className="w-full"
        >
          Browse Alerts
        </GoldButton>
      </div>
    </motion.div>
  );

  // --- SCREEN 6: VIEW ASSIGNED STAFF ----------------------------------------
  const Screen6ViewAssigned = () => {
    const filteredStaff = staffList.filter(
      (staff) =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterVillage === "all" || staff.village.toLowerCase().includes(filterVillage))
    );

    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <button onClick={() => goToScreen(5)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[24px] font-bold text-gray-900">Assigned Staff</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff..."
            className="w-full h-12 pl-10 pr-4 rounded-lg border-2 border-gray-300 focus:border-[#F4D03F] focus:outline-none"
          />
        </div>

        {/* Staff Cards */}
        <div className="space-y-3">
          {filteredStaff.map((staff) => (
            <motion.div
              key={staff.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {staff.photo}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{staff.name}</p>
                  <p className="text-xs text-gray-500">{staff.id}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  staff.status === "active" ? "bg-green-500" : "bg-gray-400"
                }`} />
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {staff.roles.map((roleId) => (
                  <RoleBadge key={roleId} roleId={roleId} />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>Assigned: {staff.assignedDate}</span>
                <span>{staff.village}</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 h-10 rounded-lg border-2 border-gray-300 font-medium text-sm flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => goToScreen(7)}
                  className="flex-1 h-10 rounded-lg border-2 border-red-300 text-red-600 font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              <AIInsightCard
                title="Risk Ranking—Low"
                description="Performance excellent. No issues detected."
                severity="low"
              />
            </motion.div>
          ))}
        </div>

        <div className="pt-4">
          <GoldButton
            onClick={() => goToScreen(8)}
            icon={<Users className="w-5 h-5" />}
            className="w-full"
          >
            Staff Operations
          </GoldButton>
        </div>
      </motion.div>
    );
  };

  // --- SCREEN 7: DELETE/REVOKE STAFF ----------------------------------------
  const Screen7DeleteRevoke = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => goToScreen(6)}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[24px] font-bold text-red-600">Revoke Roles</h1>
      </div>

      <div className="p-4 bg-red-50 border-2 border-red-400 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <p className="font-semibold text-red-900">Warning: Irreversible Action</p>
        </div>
        <p className="text-sm text-red-700">
          You are about to revoke roles for {staffList[0]?.name}. This action cannot be undone.
        </p>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Reason for Revocation</label>
        <div className="relative">
          <select
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            className="w-full h-12 px-4 pr-12 rounded-lg border-2 border-gray-300 appearance-none"
          >
            <option value="">Select reason...</option>
            <option value="overlap">Role Overlap</option>
            <option value="performance">Poor Performance</option>
            <option value="misconduct">Misconduct</option>
            <option value="other">Other</option>
          </select>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
          >
            <Mic className="w-4 h-4 text-gray-600" />
          </motion.button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-3 text-center">Enter OTP to Confirm</p>
        <OTPInput value={otp} onChange={setOtp} />
      </div>

      <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-lg">
        <p className="text-sm text-amber-900">
          <strong>Note:</strong> This action will be logged and visible to Manager/Auditor.
        </p>
      </div>

      <div className="space-y-3 pt-4">
        <GoldButton
          variant="danger"
          onClick={() => {
            // Simulate deletion
            setTimeout(() => goToScreen(8), 1000);
          }}
          disabled={!deleteReason || otp.length !== 6}
          icon={<Trash2 className="w-5 h-5" />}
          className="w-full"
        >
          Confirm Delete
        </GoldButton>

        <button
          onClick={() => goToScreen(6)}
          className="w-full h-12 rounded-lg border-2 border-gray-300 font-medium"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );

  // --- SCREEN 8: STAFF OPERATIONS OVERVIEW ----------------------------------
  const Screen8Operations = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => goToScreen(6)}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[24px] font-bold text-gray-900">Staff Operations</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
          <p className="text-2xl font-bold text-blue-900">{staffList.length}</p>
          <p className="text-xs text-blue-700">Active Staff</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200">
          <p className="text-2xl font-bold text-green-900">3</p>
          <p className="text-xs text-green-700">Pending Requests</p>
        </div>
      </div>

      {/* Operations */}
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F4D03F] to-[#F39C12] flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Storage Sample Requests</p>
              <p className="text-xs text-gray-500">3 pending approvals</p>
            </div>
          </div>
          <GoldButton variant="secondary" className="w-full h-10 text-sm">
            Request Storage
          </GoldButton>
        </div>

        <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Transport Deliveries</p>
              <p className="text-xs text-gray-500">2 deliveries scheduled</p>
            </div>
          </div>
          <button className="w-full h-10 rounded-lg bg-white border-2 border-gray-300 font-medium text-sm">
            View Schedule
          </button>
        </div>

        <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Transport Payments</p>
              <p className="text-xs text-gray-500">₹1,200 pending</p>
            </div>
          </div>
          <GoldButton className="w-full h-10 text-sm">
            Pay Transport
          </GoldButton>
        </div>
      </div>

      <AIInsightCard
        title="Organize Transport for 3 Samples"
        description="Pay ₹200 Labor. Urgent: Dispatch by EOD."
        severity="medium"
      />

      <div className="pt-4 space-y-3">
        <GoldButton
          onClick={() => goToScreen(1)}
          icon={<Plus className="w-5 h-5" />}
          className="w-full"
        >
          Add New Staff
        </GoldButton>

        <button
          onClick={() => goToScreen(6)}
          className="w-full h-12 rounded-lg border-2 border-gray-300 font-medium"
        >
          Back to Staff List
        </button>
      </div>
    </motion.div>
  );

  // --- MAIN RENDER ----------------------------------------------------------
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#F7FAFC] to-[#ECF0F1] p-4"
      style={{ maxWidth: "375px", margin: "0 auto" }}
    >
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F4D03F] to-[#F39C12] flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">TRADIE v1</h2>
            <p className="text-xs text-gray-600">Staff Management</p>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex gap-1 bg-white rounded-lg p-1 border-2 border-gray-200">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                language === lang.code
                  ? "bg-gradient-to-r from-[#F4D03F] to-[#F39C12] text-white"
                  : "text-gray-600"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </header>

      {/* Screen Progress */}
      <div className="mb-6 flex justify-center gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <motion.div
            key={num}
            animate={{
              scale: currentScreen === num ? 1.2 : 1,
              backgroundColor:
                currentScreen === num
                  ? TOKENS.colors.gold
                  : currentScreen > num
                  ? TOKENS.colors.green
                  : TOKENS.colors.grayLight,
            }}
            className="w-8 h-1 rounded-full"
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="bg-white rounded-2xl p-6 shadow-lg">
        <AnimatePresence mode="wait">{renderScreen()}</AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Screen {currentScreen} of 8 • TRADIE Staff Management Prototype
        </p>
      </footer>
    </div>
  );
}
