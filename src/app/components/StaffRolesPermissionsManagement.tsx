import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

// ============================================================================
// Staff Roles & Permissions Management - Production Grade
// Multi-role assignments, multi-channel verification, OTP, AI insights
// ============================================================================

// --- Role Taxonomy ----------------------------------------------------------
const STAFF_ROLES = {
  SECURITY: [
    { id: "security-watchman", label: "🛡️ Security/Watchman", color: "slate" },
    { id: "cctv-monitor", label: "📹 CCTV Monitor", color: "slate" },
  ],
  MANAGEMENT: [
    { id: "facility-manager", label: "👔 Facility Manager", color: "purple" },
    { id: "operations-supervisor", label: "📊 Operations Supervisor", color: "purple" },
    { id: "department-head", label: "🎯 Department Head", color: "purple" },
  ],
  COMMERCIAL: [
    { id: "sales-executive", label: "💼 Sales Executive", color: "blue" },
    { id: "tele-caller", label: "📞 Tele-caller", color: "blue" },
    { id: "relationship-manager", label: "🤝 Relationship Manager", color: "blue" },
  ],
  QUALITY: [
    { id: "quality-inspector", label: "🔬 Quality Inspector", color: "teal" },
    { id: "quality-verification-organizer", label: "✅ Quality Verification Organizer", color: "teal" },
    { id: "documentation-officer", label: "📝 Documentation Officer", color: "teal" },
  ],
  INVENTORY: [
    { id: "inventory-organizer", label: "📦 Inventory Organizer", color: "orange" },
    { id: "transport-coordinator", label: "🚚 Transport Coordinator", color: "orange" },
    { id: "loading-supervisor", label: "📍 Loading Supervisor", color: "orange" },
    { id: "storage-manager", label: "🏪 Storage Manager", color: "orange" },
  ],
  FINANCE: [
    { id: "accounts-assistant", label: "💰 Accounts Assistant", color: "gold" },
    { id: "billing-clerk", label: "🧾 Billing Clerk", color: "gold" },
    { id: "admin-assistant", label: "📋 Admin Assistant", color: "gold" },
  ],
  LABOR: [
    { id: "skilled-labor", label: "👷 Skilled Labor", color: "lime" },
    { id: "unskilled-labor", label: "🔨 Unskilled Labor", color: "lime" },
    { id: "lab-technician", label: "🧪 Lab Technician", color: "lime" },
  ],
  CUSTOM: [
    { id: "custom-role", label: "⚙️ Others (Custom)", color: "gray" },
  ],
};

const ALL_ROLES = Object.values(STAFF_ROLES).flat();

// --- Permissions ------------------------------------------------------------
const PERMISSIONS = {
  ACCESS: [
    { id: "dashboard-view", label: "Dashboard View", levels: ["Read-only", "Full"] },
    { id: "producer-records", label: "Producer Records", levels: ["View", "Edit", "Delete"] },
    { id: "buyer-database", label: "Buyer Database", levels: ["View", "Edit", "Delete"] },
    { id: "transaction-history", label: "Transaction History", levels: ["View", "Export"] },
    { id: "financial-reports", label: "Financial Reports", levels: ["View", "Download"] },
  ],
  OPERATIONS: [
    { id: "initiate-weighment", label: "Initiate Weighment", type: "boolean" },
    { id: "approve-quality-samples", label: "Approve Quality Samples", type: "boolean" },
    { id: "authorize-dispatch", label: "Authorize Dispatch (OTP)", type: "boolean" },
    { id: "receive-payments", label: "Receive Payments", type: "boolean" },
    { id: "issue-invoices", label: "Issue Invoices", type: "boolean" },
    { id: "manage-storage", label: "Manage Storage Allocations", type: "boolean" },
  ],
  ADMIN: [
    { id: "add-edit-staff", label: "Add/Edit Staff", type: "boolean" },
    { id: "assign-roles", label: "Assign Roles", type: "boolean" },
    { id: "approve-leave", label: "Approve Leave Requests", type: "boolean" },
    { id: "generate-reports", label: "Generate Reports", type: "boolean" },
    { id: "configure-settings", label: "Configure Settings", type: "boolean" },
  ],
  FINANCIAL: [
    { id: "process-payments", label: "Process Payments (Transport/Labor)", type: "boolean" },
    { id: "view-ledgers", label: "View Ledgers", type: "boolean" },
    { id: "approve-bills", label: "Approve Bills", type: "boolean" },
    { id: "manage-advances", label: "Manage Advances", type: "boolean" },
  ],
};

// --- Mock Staff Data --------------------------------------------------------
const initialStaff = [
  {
    id: "STF-001",
    name: "Rajesh Kumar",
    employeeId: "EMP-2024-001",
    phone: "+91-98765-43210",
    email: "rajesh.kumar@tradie.in",
    avatar: "RK",
    designation: "Facility Manager",
    department: "Operations",
    roles: ["facility-manager", "operations-supervisor"],
    status: "active",
    joinDate: "2024-01-15",
    verificationChannels: ["sms", "whatsapp", "email"],
    lastVerified: "2025-10-28",
    shift: "Day",
    location: "Warehouse A",
  },
  {
    id: "STF-002",
    name: "Priya Sharma",
    employeeId: "EMP-2024-002",
    phone: "+91-98765-43211",
    email: "priya.sharma@tradie.in",
    avatar: "PS",
    designation: "Quality Inspector",
    department: "Quality",
    roles: ["quality-inspector", "quality-verification-organizer"],
    status: "active",
    joinDate: "2024-02-20",
    verificationChannels: ["whatsapp", "email"],
    lastVerified: "2025-10-27",
    shift: "Day",
    location: "Warehouse A",
  },
  {
    id: "STF-003",
    name: "Mohammed Ali",
    employeeId: "EMP-2024-003",
    phone: "+91-98765-43212",
    email: "mohammed.ali@tradie.in",
    avatar: "MA",
    designation: "Security Watchman",
    department: "Security",
    roles: ["security-watchman"],
    status: "pending",
    joinDate: "2025-10-25",
    verificationChannels: ["sms", "whatsapp"],
    lastVerified: null,
    shift: "Night",
    location: "Warehouse A",
  },
  {
    id: "STF-004",
    name: "Lakshmi Devi",
    employeeId: "EMP-2024-004",
    phone: "+91-98765-43213",
    email: "lakshmi.devi@tradie.in",
    avatar: "LD",
    designation: "Inventory Organizer",
    department: "Inventory",
    roles: ["inventory-organizer", "storage-manager"],
    status: "active",
    joinDate: "2024-03-10",
    verificationChannels: ["sms", "email", "arattai"],
    lastVerified: "2025-10-26",
    shift: "Day",
    location: "Warehouse B",
  },
  {
    id: "STF-005",
    name: "Suresh Patel",
    employeeId: "EMP-2024-005",
    phone: "+91-98765-43214",
    email: "suresh.patel@tradie.in",
    avatar: "SP",
    designation: "Accounts Assistant",
    department: "Finance",
    roles: ["accounts-assistant", "billing-clerk"],
    status: "active",
    joinDate: "2024-01-25",
    verificationChannels: ["sms", "whatsapp", "email"],
    lastVerified: "2025-10-29",
    shift: "Day",
    location: "Office",
  },
];

// --- AI Insights ------------------------------------------------------------
const AI_INSIGHTS = [
  {
    id: "ins-1",
    type: "optimization",
    severity: "medium",
    title: "3 staff members hold overlapping roles",
    description: "Consider consolidating Inventory Organizer and Storage Manager roles to reduce complexity.",
    action: "Review & Consolidate",
  },
  {
    id: "ins-2",
    type: "security",
    severity: "high",
    title: "Security gap: Night shift coverage",
    description: "Only 1 security staff assigned to night shift. Recommend hiring +1 watchman.",
    action: "Hire Staff",
  },
  {
    id: "ins-3",
    type: "compliance",
    severity: "low",
    title: "KYC verification due for 1 inactive staff",
    description: "Staff ID STF-003 requires OTP verification to activate account.",
    action: "Send Reminder",
  },
  {
    id: "ins-4",
    type: "efficiency",
    severity: "medium",
    title: "Cross-training opportunity",
    description: "Train 2 Sales Executives for Quality Inspection to reduce bottleneck during peak hours.",
    action: "Schedule Training",
  },
];

// --- Helper Components ------------------------------------------------------
const RoleBadge = ({ roleId }: { roleId: string }) => {
  const role = ALL_ROLES.find((r) => r.id === roleId);
  if (!role) return null;

  const colorMap: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 ring-slate-300",
    purple: "bg-purple-100 text-purple-700 ring-purple-300",
    blue: "bg-blue-100 text-blue-700 ring-blue-300",
    teal: "bg-teal-100 text-teal-700 ring-teal-300",
    orange: "bg-orange-100 text-orange-700 ring-orange-300",
    gold: "bg-amber-100 text-amber-700 ring-amber-300",
    lime: "bg-lime-100 text-lime-700 ring-lime-300",
    gray: "bg-gray-100 text-gray-700 ring-gray-300",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${colorMap[role.color]}`}>
      {role.label}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap = {
    active: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", label: "🟢 Active", icon: "🟢" },
    pending: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", label: "🟡 Pending Verification", icon: "🟡" },
    inactive: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200", label: "🔴 Inactive", icon: "🔴" },
  };

  const config = statusMap[status as keyof typeof statusMap] || statusMap.inactive;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}>
      {config.label}
    </span>
  );
};

const ChannelIcon = ({ channel }: { channel: string }) => {
  const icons: Record<string, string> = {
    sms: "📱",
    whatsapp: "💬",
    email: "📧",
    arattai: "🗨️",
  };
  return <span className="text-base">{icons[channel] || "📩"}</span>;
};

const PillButton = ({ children, onClick, variant = "primary", disabled, className = "" }: any) => {
  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02]",
    secondary: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300",
    danger: "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40",
    subtle: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

const Modal = ({ open, onClose, title, children, footer, size = "2xl" }: any) => {
  if (!open) return null;

  const sizeMap = {
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative z-10 w-full ${sizeMap[size as keyof typeof sizeMap]} max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-xl font-bold text-slate-800">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
            {footer && (
              <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                <div className="flex justify-end gap-3">{footer}</div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main Component ---------------------------------------------------------
export default function StaffRolesPermissionsManagement() {
  const [staff, setStaff] = useState(initialStaff);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"management" | "auditor" | "public">("management");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [insights, setInsights] = useState(AI_INSIGHTS);

  // Add Staff Form State
  const [newStaff, setNewStaff] = useState({
    name: "",
    phone: "",
    email: "",
    designation: "",
    department: "",
    roles: [] as string[],
    channels: [] as string[],
    shift: "Day",
    location: "Warehouse A",
  });

  // OTP State
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpChannels, setOtpChannels] = useState<string[]>([]);

  // Verification Link State
  const [verificationProgress, setVerificationProgress] = useState<Record<string, boolean>>({});

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery);

      const matchesDepartment = filterDepartment === "all" || s.department === filterDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [staff, searchQuery, filterDepartment]);

  // Masked data for public view
  const mask = (value: string) => (viewMode === "public" ? "••••••" : value);

  // Handle Add Staff
  const handleAddStaff = () => {
    const id = `STF-${String(staff.length + 1).padStart(3, "0")}`;
    const empId = `EMP-2024-${String(staff.length + 1).padStart(3, "0")}`;

    const staffMember = {
      id,
      employeeId: empId,
      name: newStaff.name,
      phone: newStaff.phone,
      email: newStaff.email,
      avatar: newStaff.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      designation: newStaff.designation,
      department: newStaff.department,
      roles: newStaff.roles,
      status: "pending" as const,
      joinDate: new Date().toISOString().split("T")[0],
      verificationChannels: newStaff.channels,
      lastVerified: null,
      shift: newStaff.shift,
      location: newStaff.location,
    };

    setStaff([...staff, staffMember]);
    setShowAddStaffModal(false);

    // Reset form
    setNewStaff({
      name: "",
      phone: "",
      email: "",
      designation: "",
      department: "",
      roles: [],
      channels: [],
      shift: "Day",
      location: "Warehouse A",
    });

    // Auto-open verification modal
    setSelectedStaff(id);
    setShowVerificationModal(true);
  };

  // Handle Send Verification Link
  const handleSendVerificationLink = () => {
    if (!selectedStaff) return;

    const staffMember = staff.find((s) => s.id === selectedStaff);
    if (!staffMember) return;

    // Simulate sending to each channel
    const progress: Record<string, boolean> = {};
    staffMember.verificationChannels.forEach((channel) => {
      progress[channel] = false;
    });
    setVerificationProgress(progress);

    // Simulate async sending
    staffMember.verificationChannels.forEach((channel, idx) => {
      setTimeout(() => {
        setVerificationProgress((prev) => ({ ...prev, [channel]: true }));
      }, (idx + 1) * 800);
    });

    // After all sent, show OTP modal
    setTimeout(() => {
      setOtpSent(true);
      setOtpChannels(staffMember.verificationChannels);
    }, staffMember.verificationChannels.length * 800 + 500);
  };

  // Handle OTP Verification
  const handleVerifyOTP = () => {
    if (otpCode.length !== 6) return;

    // Update staff status
    setStaff((prev) =>
      prev.map((s) =>
        s.id === selectedStaff
          ? { ...s, status: "active", lastVerified: new Date().toISOString().split("T")[0] }
          : s
      )
    );

    // Close modals
    setShowVerificationModal(false);
    setShowOTPModal(false);
    setOtpCode("");
    setOtpSent(false);
    setVerificationProgress({});
  };

  // Handle Delete Staff
  const handleDeleteStaff = (id: string) => {
    if (confirm("Are you sure you want to remove this staff member? This action requires OTP verification.")) {
      // In production, show OTP modal first
      setStaff((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Dismiss Insight
  const dismissInsight = (id: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Staff Directory & Active Roles
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Multi-role management with OTP verification & AI-powered insights
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <PillButton
                variant={viewMode === "management" ? "primary" : "secondary"}
                onClick={() => setViewMode("management")}
              >
                Management
              </PillButton>
              <PillButton
                variant={viewMode === "auditor" ? "primary" : "secondary"}
                onClick={() => setViewMode("auditor")}
              >
                Auditor
              </PillButton>
              <PillButton
                variant={viewMode === "public" ? "primary" : "secondary"}
                onClick={() => setViewMode("public")}
              >
                Public
              </PillButton>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <PillButton onClick={() => setShowAddStaffModal(true)}>
              ➕ Add New Staff
            </PillButton>
            <PillButton variant="secondary">📤 Bulk Upload</PillButton>
            <PillButton variant="secondary">📊 Workforce Analytics</PillButton>
            <PillButton variant="secondary">📄 Export Staff Report</PillButton>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Content */}
          <main className="lg:col-span-8 space-y-6">
            {/* Search & Filters */}
            <div className="rounded-2xl bg-white/80 backdrop-blur p-5 shadow-sm ring-1 ring-slate-200">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-700">
                    Search Staff
                  </label>
                  <input
                    type="text"
                    placeholder="Name, ID, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-700">
                    Filter by Department
                  </label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="all">All Departments</option>
                    <option value="Operations">Operations</option>
                    <option value="Quality">Quality</option>
                    <option value="Security">Security</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredStaff.map((staffMember) => (
                <motion.div
                  key={staffMember.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group rounded-2xl bg-white/80 backdrop-blur p-5 shadow-sm ring-1 ring-slate-200 hover:shadow-lg hover:ring-emerald-200 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white shadow-lg">
                        {staffMember.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {staffMember.name}
                        </h3>
                        <p className="text-xs text-slate-500">{staffMember.employeeId}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{staffMember.designation}</p>
                      </div>
                    </div>

                    <StatusBadge status={staffMember.status} />
                  </div>

                  {/* Roles */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {staffMember.roles.map((roleId) => (
                      <RoleBadge key={roleId} roleId={roleId} />
                    ))}
                  </div>

                  {/* Contact & Channels */}
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="font-medium">Phone:</span>
                      <span>{mask(staffMember.phone)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="font-medium">Channels:</span>
                      <div className="flex gap-1">
                        {staffMember.verificationChannels.map((ch) => (
                          <ChannelIcon key={ch} channel={ch} />
                        ))}
                      </div>
                    </div>
                    {staffMember.lastVerified && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="font-medium">Last Verified:</span>
                        <span>{staffMember.lastVerified}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                    {staffMember.status === "pending" && (
                      <button
                        onClick={() => {
                          setSelectedStaff(staffMember.id);
                          setShowVerificationModal(true);
                        }}
                        className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-all"
                      >
                        📩 Send Verification Link
                      </button>
                    )}
                    {staffMember.status === "active" && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedStaff(staffMember.id);
                            setShowPermissionsModal(true);
                          }}
                          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staffMember.id)}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredStaff.length === 0 && (
              <div className="rounded-2xl bg-white/80 p-12 text-center shadow-sm ring-1 ring-slate-200">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-semibold text-slate-900">No staff members found</h3>
                <p className="mt-1 text-sm text-slate-600">Try adjusting your search or filters</p>
              </div>
            )}
          </main>

          {/* AI Insights Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-6 space-y-4">
              {/* Stats */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-xl">
                <h3 className="text-sm font-medium opacity-90">Total Staff</h3>
                <p className="mt-1 text-4xl font-bold">{staff.length}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur">
                    <div className="text-xs opacity-90">Active</div>
                    <div className="font-bold">{staff.filter((s) => s.status === "active").length}</div>
                  </div>
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur">
                    <div className="text-xs opacity-90">Pending</div>
                    <div className="font-bold">{staff.filter((s) => s.status === "pending").length}</div>
                  </div>
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur">
                    <div className="text-xs opacity-90">Roles</div>
                    <div className="font-bold">{ALL_ROLES.length}</div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="rounded-2xl bg-white/80 backdrop-blur p-5 shadow-sm ring-1 ring-slate-200">
                <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <span className="text-xl">✨</span>
                  AI Compliance Insights
                </h3>

                <div className="mt-4 space-y-3">
                  {insights.map((insight) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`rounded-xl border p-3 ${
                        insight.severity === "high"
                          ? "border-rose-200 bg-rose-50"
                          : insight.severity === "medium"
                          ? "border-amber-200 bg-amber-50"
                          : "border-emerald-200 bg-emerald-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900">{insight.title}</h4>
                          <p className="mt-1 text-xs text-slate-600">{insight.description}</p>
                        </div>
                        <button
                          onClick={() => dismissInsight(insight.id)}
                          className="ml-2 text-slate-400 hover:text-slate-600"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                          {insight.action}
                        </button>
                        <button
                          onClick={() => dismissInsight(insight.id)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-white/50"
                        >
                          Dismiss
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Add Staff Modal */}
      <Modal
        open={showAddStaffModal}
        onClose={() => setShowAddStaffModal(false)}
        title="➕ Add New Staff Member"
        size="4xl"
        footer={
          <>
            <PillButton variant="secondary" onClick={() => setShowAddStaffModal(false)}>
              Cancel
            </PillButton>
            <PillButton
              onClick={handleAddStaff}
              disabled={!newStaff.name || !newStaff.phone || newStaff.roles.length === 0}
            >
              Save & Send Verification
            </PillButton>
          </>
        }
      >
        <div className="space-y-6">
          {/* Step 1: Basic Details */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Basic Details</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g., Rajesh Kumar"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="+91-98765-43210"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="email@tradie.in"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">Designation</label>
                <input
                  type="text"
                  value={newStaff.designation}
                  onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g., Quality Inspector"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">Department</label>
                <select
                  value={newStaff.department}
                  onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Select Department</option>
                  <option value="Operations">Operations</option>
                  <option value="Quality">Quality</option>
                  <option value="Security">Security</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Finance">Finance</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">Work Shift</label>
                <select
                  value={newStaff.shift}
                  onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                  <option value="Rotating">Rotating</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Role Assignment */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">
              Assign Roles <span className="text-rose-500">*</span>
            </h4>
            <div className="space-y-3">
              {Object.entries(STAFF_ROLES).map(([category, roles]) => (
                <div key={category}>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    {category.replace("_", " ")}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => {
                      const isSelected = newStaff.roles.includes(role.id);
                      return (
                        <button
                          key={role.id}
                          onClick={() => {
                            setNewStaff({
                              ...newStaff,
                              roles: isSelected
                                ? newStaff.roles.filter((r) => r !== role.id)
                                : [...newStaff.roles, role.id],
                            });
                          }}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                            isSelected
                              ? "bg-emerald-500 text-white ring-2 ring-emerald-600 shadow-md"
                              : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-emerald-300"
                          }`}
                        >
                          {isSelected && "✓ "}{role.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Notification Channels */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Verification Channels</h4>
            <div className="flex flex-wrap gap-3">
              {["sms", "whatsapp", "email", "arattai"].map((channel) => {
                const isSelected = newStaff.channels.includes(channel);
                return (
                  <button
                    key={channel}
                    onClick={() => {
                      setNewStaff({
                        ...newStaff,
                        channels: isSelected
                          ? newStaff.channels.filter((c) => c !== channel)
                          : [...newStaff.channels, channel],
                      });
                    }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-emerald-500 text-white ring-2 ring-emerald-600 shadow-md"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-emerald-300"
                    }`}
                  >
                    <ChannelIcon channel={channel} />
                    <span className="capitalize">{channel}</span>
                    {isSelected && <span className="ml-1">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>

      {/* Verification Modal */}
      <Modal
        open={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false);
          setVerificationProgress({});
          setOtpSent(false);
        }}
        title="📩 Send Role Confirmation Link"
        footer={
          !otpSent ? (
            <>
              <PillButton variant="secondary" onClick={() => setShowVerificationModal(false)}>
                Cancel
              </PillButton>
              <PillButton onClick={handleSendVerificationLink}>
                Send Verification Link
              </PillButton>
            </>
          ) : (
            <>
              <PillButton variant="secondary" onClick={() => setShowOTPModal(true)}>
                Enter OTP
              </PillButton>
            </>
          )
        }
      >
        {selectedStaff && (
          <div className="space-y-6">
            {(() => {
              const staffMember = staff.find((s) => s.id === selectedStaff);
              if (!staffMember) return null;

              return (
                <>
                  <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white">
                        {staffMember.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{staffMember.name}</h4>
                        <p className="text-sm text-slate-600">{staffMember.employeeId}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {staffMember.roles.map((roleId) => (
                        <RoleBadge key={roleId} roleId={roleId} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-slate-900">
                      Sending verification link via:
                    </h4>
                    <div className="space-y-2">
                      {staffMember.verificationChannels.map((channel) => (
                        <div
                          key={channel}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3"
                        >
                          <div className="flex items-center gap-3">
                            <ChannelIcon channel={channel} />
                            <span className="text-sm font-medium capitalize text-slate-700">
                              {channel}
                            </span>
                          </div>
                          {verificationProgress[channel] !== undefined && (
                            <div>
                              {verificationProgress[channel] ? (
                                <span className="text-sm text-emerald-600">✓ Sent</span>
                              ) : (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {otpSent && (
                    <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                      <p className="text-sm font-medium text-emerald-800">
                        ✓ Verification links sent successfully!
                      </p>
                      <p className="mt-1 text-xs text-emerald-700">
                        Staff will receive a 6-digit OTP. Click "Enter OTP" to complete verification.
                      </p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </Modal>

      {/* OTP Modal */}
      <Modal
        open={showOTPModal}
        onClose={() => {
          setShowOTPModal(false);
          setOtpCode("");
        }}
        title="🔐 Enter OTP Verification Code"
        footer={
          <>
            <PillButton variant="secondary" onClick={() => setShowOTPModal(false)}>
              Cancel
            </PillButton>
            <PillButton onClick={handleVerifyOTP} disabled={otpCode.length !== 6}>
              Verify & Activate
            </PillButton>
          </>
        }
      >
        <div className="space-y-6">
          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-sm text-slate-700">
              Enter the 6-digit OTP code sent to the staff member via:
            </p>
            <div className="mt-2 flex gap-2">
              {otpChannels.map((channel) => (
                <div key={channel} className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs ring-1 ring-slate-200">
                  <ChannelIcon channel={channel} />
                  <span className="capitalize">{channel}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              6-Digit OTP Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl border-2 border-slate-200 px-6 py-4 text-center text-2xl font-bold tracking-widest focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              placeholder="000000"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <p className="text-sm text-amber-800">
              ⏱️ Code valid for 10 minutes
            </p>
            <button className="text-sm font-medium text-amber-700 hover:text-amber-900">
              Resend OTP
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
