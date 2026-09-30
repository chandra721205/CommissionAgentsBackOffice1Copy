import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AdvancedAIInsightsPanel, generateAdvancedAIInsights, type StaffMember as AIStaffMember } from "./AdvancedAIInsightsEngine";
import { 
  Users, Search, Plus, Trash2, Shield, CheckCircle, XCircle, 
  AlertTriangle, Edit, Mail, MessageSquare, Phone, Send, 
  Filter, ArrowUpDown, Settings, Eye, Download, FileText,
  UserPlus, UserMinus, Lock, Unlock, Brain, TrendingUp,
  Clock, ChevronDown, ChevronRight, X, Check, Sparkles
} from "lucide-react";

// ============================================================================
// COMPREHENSIVE STAFF ROLES & PERMISSIONS MANAGEMENT
// Production-Grade Module with AI Insights, Bulk Operations, 2FA
// ============================================================================

// --- ROLE DEFINITIONS -------------------------------------------------------
const AVAILABLE_ROLES = [
  { 
    id: "security-watchman", 
    name: "🛡️ Security/Watchman", 
    category: "Security",
    description: "Premises security, stock safety monitoring",
    color: "slate",
    permissions: ["view-stock", "report-incidents", "monitor-cctv"]
  },
  { 
    id: "manager", 
    name: "👔 Manager", 
    category: "Management",
    description: "Overall operations management",
    color: "purple",
    permissions: ["view-all", "edit-all", "approve-payments", "manage-staff", "generate-reports"]
  },
  { 
    id: "salesman", 
    name: "💼 Salesman", 
    category: "Commercial",
    description: "Buyer relations, deal closure",
    color: "blue",
    permissions: ["view-buyers", "edit-buyers", "create-invoices", "view-inventory"]
  },
  { 
    id: "quality-verification-organizer", 
    name: "✅ Quality Verification Organizer", 
    category: "Quality",
    description: "Quality sampling coordination, testing oversight",
    color: "teal",
    permissions: ["approve-samples", "reject-produce", "view-quality-reports", "schedule-tests"]
  },
  { 
    id: "inventory-organizer", 
    name: "📦 Inventory Organizer", 
    category: "Inventory",
    description: "Stock management, dispatch authorization",
    color: "orange",
    permissions: ["view-inventory", "edit-inventory", "authorize-dispatch", "track-arrivals"]
  },
  { 
    id: "sample-delivery-coordinator", 
    name: "🚚 Sample Delivery Coordinator", 
    category: "Logistics",
    description: "Sample transport management",
    color: "indigo",
    permissions: ["schedule-delivery", "track-samples", "manage-transporters"]
  },
  { 
    id: "transport-payment-coordinator", 
    name: "💰 Transport Payment Coordinator", 
    category: "Finance",
    description: "Transport & labor payment processing",
    color: "amber",
    permissions: ["process-payments", "approve-expenses", "view-ledgers"]
  },
  { 
    id: "unskilled-labor", 
    name: "🔨 Unskilled Labor", 
    category: "Labor",
    description: "Loading, unloading, cleaning",
    color: "lime",
    permissions: ["view-tasks", "mark-complete"]
  },
  { 
    id: "custom", 
    name: "⚙️ Others (Custom)", 
    category: "Custom",
    description: "Custom role with configurable permissions",
    color: "gray",
    permissions: []
  },
];

// --- PERMISSION CATALOG -----------------------------------------------------
const ALL_PERMISSIONS = {
  "Stock & Inventory": [
    { id: "view-stock", label: "View Stock Levels", risk: "low" },
    { id: "edit-inventory", label: "Edit Inventory Records", risk: "medium" },
    { id: "authorize-dispatch", label: "Authorize Dispatch (OTP)", risk: "high" },
    { id: "track-arrivals", label: "Track Produce Arrivals", risk: "low" },
  ],
  "Quality Control": [
    { id: "approve-samples", label: "Approve Quality Samples", risk: "high" },
    { id: "reject-produce", label: "Reject Non-Compliant Produce", risk: "high" },
    { id: "view-quality-reports", label: "View Quality Reports", risk: "low" },
    { id: "schedule-tests", label: "Schedule Quality Tests", risk: "medium" },
  ],
  "Financial": [
    { id: "process-payments", label: "Process Payments", risk: "critical" },
    { id: "approve-expenses", label: "Approve Expenses", risk: "high" },
    { id: "view-ledgers", label: "View Financial Ledgers", risk: "medium" },
    { id: "create-invoices", label: "Create Invoices", risk: "medium" },
  ],
  "Buyer Management": [
    { id: "view-buyers", label: "View Buyer Database", risk: "low" },
    { id: "edit-buyers", label: "Edit Buyer Records", risk: "medium" },
    { id: "delete-buyers", label: "Delete Buyer Records", risk: "critical" },
  ],
  "Staff & Admin": [
    { id: "view-all", label: "View All Data", risk: "medium" },
    { id: "edit-all", label: "Edit All Data", risk: "critical" },
    { id: "manage-staff", label: "Manage Staff", risk: "critical" },
    { id: "generate-reports", label: "Generate Reports", risk: "low" },
  ],
  "Operations": [
    { id: "monitor-cctv", label: "Monitor CCTV", risk: "low" },
    { id: "report-incidents", label: "Report Incidents", risk: "low" },
    { id: "schedule-delivery", label: "Schedule Deliveries", risk: "medium" },
    { id: "track-samples", label: "Track Sample Transport", risk: "low" },
    { id: "manage-transporters", label: "Manage Transporters", risk: "medium" },
    { id: "view-tasks", label: "View Assigned Tasks", risk: "low" },
    { id: "mark-complete", label: "Mark Tasks Complete", risk: "low" },
  ],
};

// --- MOCK STAFF DATA --------------------------------------------------------
const initialStaffData = [
  {
    id: "STF-001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@tradie.in",
    phone: "+91-98765-43210",
    roles: ["manager", "quality-verification-organizer"],
    status: "active",
    confirmationStatus: "confirmed",
    joinDate: "2024-01-15",
    lastActive: "2025-10-29 09:45",
    notes: "Senior manager with 10 years experience",
    avatar: "RK",
  },
  {
    id: "STF-002",
    name: "Priya Sharma",
    email: "priya.sharma@tradie.in",
    phone: "+91-98765-43211",
    roles: ["salesman", "inventory-organizer"],
    status: "active",
    confirmationStatus: "confirmed",
    joinDate: "2024-03-20",
    lastActive: "2025-10-29 10:15",
    notes: "Top sales performer Q3 2024",
    avatar: "PS",
  },
  {
    id: "STF-003",
    name: "Mohammed Ali",
    email: "mohammed.ali@tradie.in",
    phone: "+91-98765-43212",
    roles: ["security-watchman"],
    status: "active",
    confirmationStatus: "pending",
    joinDate: "2025-10-25",
    lastActive: "2025-10-28 22:30",
    notes: "Night shift security, link sent via SMS",
    avatar: "MA",
  },
  {
    id: "STF-004",
    name: "Lakshmi Devi",
    email: "lakshmi.devi@tradie.in",
    phone: "+91-98765-43213",
    roles: ["transport-payment-coordinator"],
    status: "active",
    confirmationStatus: "confirmed",
    joinDate: "2024-06-10",
    lastActive: "2025-10-29 11:00",
    notes: "Handles all transport payments",
    avatar: "LD",
  },
  {
    id: "STF-005",
    name: "Suresh Patel",
    email: "suresh.patel@tradie.in",
    phone: "+91-98765-43214",
    roles: ["unskilled-labor"],
    status: "inactive",
    confirmationStatus: "confirmed",
    joinDate: "2024-02-01",
    lastActive: "2025-09-15 17:00",
    notes: "On extended leave for medical reasons",
    avatar: "SP",
  },
];

// --- AI INSIGHTS GENERATOR --------------------------------------------------
const generateAIInsights = (staff: typeof initialStaffData) => {
  const insights = [];

  // Check for conflicting role combinations
  staff.forEach(member => {
    if (member.roles.includes("manager") && member.roles.includes("unskilled-labor")) {
      insights.push({
        id: `conflict-${member.id}`,
        type: "conflict",
        severity: "high",
        title: "⚠️ Role Conflict Detected",
        description: `${member.name} has conflicting roles: Manager + Unskilled Labor. This may cause permission issues.`,
        staffId: member.id,
        action: "Review Roles",
      });
    }

    if (member.roles.includes("transport-payment-coordinator") && member.roles.includes("security-watchman")) {
      insights.push({
        id: `security-risk-${member.id}`,
        type: "security",
        severity: "critical",
        title: "🚨 Security Risk",
        description: `${member.name} has financial + security access. Recommend segregation of duties.`,
        staffId: member.id,
        action: "Remove Role",
      });
    }
  });

  // Check for pending confirmations
  const pendingCount = staff.filter(s => s.confirmationStatus === "pending").length;
  if (pendingCount > 0) {
    insights.push({
      id: "pending-confirmations",
      type: "warning",
      severity: "medium",
      title: "📩 Pending Role Confirmations",
      description: `${pendingCount} staff member(s) have not confirmed their roles via SMS/Email/WhatsApp.`,
      action: "Resend Links",
    });
  }

  // Check for inactive staff with critical roles
  const inactiveCritical = staff.filter(s => 
    s.status === "inactive" && 
    (s.roles.includes("manager") || s.roles.includes("transport-payment-coordinator"))
  );
  if (inactiveCritical.length > 0) {
    insights.push({
      id: "inactive-critical",
      type: "optimization",
      severity: "high",
      title: "⚡ Reassign Critical Roles",
      description: `${inactiveCritical.length} inactive staff still assigned to critical roles (Manager, Payment Coordinator).`,
      action: "Reassign Now",
    });
  }

  // Optimization: Single-role staff
  const singleRoleStaff = staff.filter(s => s.roles.length === 1 && s.status === "active");
  if (singleRoleStaff.length > 3) {
    insights.push({
      id: "cross-training",
      type: "optimization",
      severity: "low",
      title: "🎯 Cross-Training Opportunity",
      description: `${singleRoleStaff.length} staff have only 1 role. Consider cross-training for operational flexibility.`,
      action: "Suggest Roles",
    });
  }

  // Role distribution analysis
  const roleCounts: Record<string, number> = {};
  staff.forEach(s => {
    s.roles.forEach(role => {
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
  });

  const mostCommonRole = Object.entries(roleCounts).sort(([,a], [,b]) => b - a)[0];
  if (mostCommonRole && mostCommonRole[1] > staff.length * 0.4) {
    const roleName = AVAILABLE_ROLES.find(r => r.id === mostCommonRole[0])?.name || mostCommonRole[0];
    insights.push({
      id: "role-concentration",
      type: "info",
      severity: "low",
      title: "📊 Role Distribution Alert",
      description: `40%+ staff have "${roleName}" role. Consider diversifying skill distribution.`,
      action: "View Analytics",
    });
  }

  return insights;
};

// --- HELPER COMPONENTS ------------------------------------------------------
const RoleBadge = ({ roleId }: { roleId: string }) => {
  const role = AVAILABLE_ROLES.find(r => r.id === roleId);
  if (!role) return null;

  const colorMap: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 ring-slate-300",
    purple: "bg-purple-100 text-purple-700 ring-purple-300",
    blue: "bg-blue-100 text-blue-700 ring-blue-300",
    teal: "bg-teal-100 text-teal-700 ring-teal-300",
    orange: "bg-orange-100 text-orange-700 ring-orange-300",
    indigo: "bg-indigo-100 text-indigo-700 ring-indigo-300",
    amber: "bg-amber-100 text-amber-700 ring-amber-300",
    lime: "bg-lime-100 text-lime-700 ring-lime-300",
    gray: "bg-gray-100 text-gray-700 ring-gray-300",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${colorMap[role.color]}`}>
      {role.name}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    active: { icon: <CheckCircle className="w-3 h-3" />, text: "Active", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
    inactive: { icon: <XCircle className="w-3 h-3" />, text: "Inactive", className: "bg-rose-50 text-rose-700 ring-rose-200" },
    pending: { icon: <Clock className="w-3 h-3" />, text: "Pending", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  };

  const { icon, text, className } = config[status as keyof typeof config] || config.inactive;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${className}`}>
      {icon}
      {text}
    </span>
  );
};

const ConfirmationBadge = ({ status }: { status: string }) => {
  const config = {
    confirmed: { icon: "✓", text: "Confirmed", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
    pending: { icon: "⏱", text: "Pending Link", className: "bg-amber-50 text-amber-700 ring-amber-200" },
    expired: { icon: "✗", text: "Link Expired", className: "bg-rose-50 text-rose-700 ring-rose-200" },
  };

  const { icon, text, className } = config[status as keyof typeof config] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>
      {icon} {text}
    </span>
  );
};

const Modal = ({ open, onClose, title, children, size = "2xl", actions }: any) => {
  if (!open) return null;

  const sizeMap = {
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
  };

  return (
    <AnimatePresence>
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
          className={`relative z-10 w-full ${sizeMap[size]} max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
          {actions && (
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex justify-end gap-3">{actions}</div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Button = ({ children, onClick, variant = "primary", disabled, className = "", icon }: any) => {
  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40",
    secondary: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
    danger: "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30",
    ghost: "text-slate-700 hover:bg-slate-100",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {icon}
      {children}
    </motion.button>
  );
};

// --- MAIN COMPONENT ---------------------------------------------------------
export default function StaffRolesPermissionsComplete() {
  const [staff, setStaff] = useState(initialStaffData);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "joinDate" | "status">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modals
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [showRoleManagementModal, setShowRoleManagementModal] = useState(false);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);

  // Form state
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roles: [] as string[],
    customRole: "",
    notes: "",
    sendConfirmation: false,
    confirmationChannels: [] as string[],
  });

  const [bulkRoles, setBulkRoles] = useState<string[]>([]);
  const [otp, setOtp] = useState("");
  const [pendingAction, setPendingAction] = useState<any>(null);

  // AI Insights (Basic + Advanced)
  const basicAIInsights = useMemo(() => generateAIInsights(staff), [staff]);
  const advancedAIInsights = useMemo(() => {
    // Add mock access logs and role change history for demo
    const enrichedStaff: AIStaffMember[] = staff.map(s => ({
      ...s,
      accessLogs: s.id === "STF-003" ? [
        { timestamp: "2025-10-29T02:30:00Z", action: "view-stock", resource: "inventory", outcome: "success" },
        { timestamp: "2025-10-29T03:15:00Z", action: "edit-inventory", resource: "stock-001", outcome: "denied" },
      ] as any[] : [],
      roleChangeHistory: s.id === "STF-001" ? [
        {
          timestamp: "2025-10-20T10:00:00Z",
          previousRoles: ["quality-verification-organizer"],
          newRoles: ["manager", "quality-verification-organizer"],
          changedBy: "Admin",
          reason: "Promotion",
        },
      ] : [],
    }));
    
    return generateAdvancedAIInsights(enrichedStaff, {
      sms: 5,
      whatsapp: 8,
      email: 3,
      arattai: 2,
    });
  }, [staff]);

  // Filtered & Sorted Staff
  const filteredStaff = useMemo(() => {
    let result = staff.filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = filterRole === "all" || s.roles.includes(filterRole);
      const matchesStatus = filterStatus === "all" || s.status === filterStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") comparison = a.name.localeCompare(b.name);
      else if (sortBy === "joinDate") comparison = a.joinDate.localeCompare(b.joinDate);
      else if (sortBy === "status") comparison = a.status.localeCompare(b.status);

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [staff, searchQuery, filterRole, filterStatus, sortBy, sortOrder]);

  // Auto-generate permissions based on selected roles
  const getPermissionsForRoles = (roles: string[]) => {
    const permissions = new Set<string>();
    roles.forEach(roleId => {
      const role = AVAILABLE_ROLES.find(r => r.id === roleId);
      if (role) {
        role.permissions.forEach(perm => permissions.add(perm));
      }
    });
    return Array.from(permissions);
  };

  // Detect permission conflicts
  const detectConflicts = (roles: string[]) => {
    const conflicts = [];
    if (roles.includes("manager") && roles.includes("unskilled-labor")) {
      conflicts.push("Manager and Unskilled Labor roles conflict");
    }
    if (roles.includes("transport-payment-coordinator") && roles.includes("security-watchman")) {
      conflicts.push("Financial + Security access violates segregation of duties");
    }
    return conflicts;
  };

  // Handle Add Staff
  const handleAddStaff = () => {
    if (!formData.name || !formData.phone || formData.roles.length === 0) return;

    const conflicts = detectConflicts(formData.roles);
    if (conflicts.length > 0 && !confirm(`⚠️ Role conflicts detected:\n${conflicts.join("\n")}\n\nContinue anyway?`)) {
      return;
    }

    const newStaff = {
      id: `STF-${String(staff.length + 1).padStart(3, "0")}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      roles: formData.customRole ? [...formData.roles, "custom"] : formData.roles,
      status: "active" as const,
      confirmationStatus: formData.sendConfirmation ? ("pending" as const) : ("confirmed" as const),
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString(),
      notes: formData.notes,
      avatar: formData.name.split(" ").map(n => n[0]).join("").toUpperCase(),
    };

    setStaff([...staff, newStaff]);
    setShowAddStaffModal(false);
    resetForm();

    if (formData.sendConfirmation) {
      // Simulate sending confirmation link
      alert(`✓ Confirmation link sent to ${formData.name} via ${formData.confirmationChannels.join(", ")}`);
    }
  };

  // Handle Edit Staff
  const handleEditStaff = () => {
    if (!editingStaff) return;

    const conflicts = detectConflicts(formData.roles);
    if (conflicts.length > 0 && !confirm(`⚠️ Role conflicts detected:\n${conflicts.join("\n")}\n\nContinue anyway?`)) {
      return;
    }

    setStaff(prev => prev.map(s => 
      s.id === editingStaff.id 
        ? { 
            ...s, 
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            roles: formData.roles,
            notes: formData.notes,
          }
        : s
    ));

    setShowEditStaffModal(false);
    setEditingStaff(null);
    resetForm();
  };

  // Handle Delete (with 2FA)
  const handleDeleteStaff = (ids: string[]) => {
    const hasCriticalRoles = staff.some(s => 
      ids.includes(s.id) && 
      (s.roles.includes("manager") || s.roles.includes("transport-payment-coordinator"))
    );

    if (hasCriticalRoles) {
      setPendingAction({ type: "delete", ids });
      setShow2FAModal(true);
    } else {
      if (confirm(`Delete ${ids.length} staff member(s)?`)) {
        setStaff(prev => prev.filter(s => !ids.includes(s.id)));
        setSelectedStaff([]);
      }
    }
  };

  // Handle Bulk Role Assignment
  const handleBulkAssign = () => {
    if (selectedStaff.length === 0 || bulkRoles.length === 0) return;

    const conflicts = selectedStaff.some(id => {
      const member = staff.find(s => s.id === id);
      return member && detectConflicts([...member.roles, ...bulkRoles]).length > 0;
    });

    if (conflicts && !confirm("⚠️ Some assignments will create role conflicts. Continue?")) {
      return;
    }

    setStaff(prev => prev.map(s => 
      selectedStaff.includes(s.id)
        ? { ...s, roles: [...new Set([...s.roles, ...bulkRoles])] }
        : s
    ));

    setShowBulkAssignModal(false);
    setSelectedStaff([]);
    setBulkRoles([]);
  };

  // Handle 2FA Verification
  const handle2FA = () => {
    if (otp === "123456") { // Mock OTP
      if (pendingAction?.type === "delete") {
        setStaff(prev => prev.filter(s => !pendingAction.ids.includes(s.id)));
        setSelectedStaff([]);
      }
      setShow2FAModal(false);
      setPendingAction(null);
      setOtp("");
    } else {
      alert("❌ Invalid OTP. Try: 123456");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      roles: [],
      customRole: "",
      notes: "",
      sendConfirmation: false,
      confirmationChannels: [],
    });
  };

  const openEditModal = (member: any) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      roles: member.roles,
      customRole: "",
      notes: member.notes,
      sendConfirmation: false,
      confirmationChannels: [],
    });
    setShowEditStaffModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
                <Users className="w-8 h-8 text-emerald-600" />
                Staff Roles & Permissions
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Comprehensive staff management with AI-powered insights & role-based access control
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowAddStaffModal(true)} icon={<Plus className="w-4 h-4" />}>
                Add Staff
              </Button>
              {selectedStaff.length > 0 && (
                <>
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowBulkAssignModal(true)}
                    icon={<UserPlus className="w-4 h-4" />}
                  >
                    Bulk Assign ({selectedStaff.length})
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeleteStaff(selectedStaff)}
                    icon={<Trash2 className="w-4 h-4" />}
                  >
                    Delete ({selectedStaff.length})
                  </Button>
                </>
              )}
              <Button variant="secondary" onClick={() => setShowRoleManagementModal(true)} icon={<Settings className="w-4 h-4" />}>
                Manage Roles
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <main className="lg:col-span-8 space-y-6">
            {/* Search & Filters */}
            <div className="rounded-2xl bg-white/80 backdrop-blur p-5 shadow-sm ring-1 ring-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, phone, or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="all">All Roles</option>
                    {AVAILABLE_ROLES.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Showing <strong>{filteredStaff.length}</strong> of <strong>{staff.length}</strong> staff members
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Sort by:</span>
                  <button
                    onClick={() => {
                      if (sortBy === "name") setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      else { setSortBy("name"); setSortOrder("asc"); }
                    }}
                    className={`text-xs px-2 py-1 rounded ${sortBy === "name" ? "bg-emerald-100 text-emerald-700" : "text-slate-600 hover:bg-slate-100"}`}
                  >
                    Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => {
                      if (sortBy === "joinDate") setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      else { setSortBy("joinDate"); setSortOrder("asc"); }
                    }}
                    className={`text-xs px-2 py-1 rounded ${sortBy === "joinDate" ? "bg-emerald-100 text-emerald-700" : "text-slate-600 hover:bg-slate-100"}`}
                  >
                    Join Date {sortBy === "joinDate" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => {
                      if (sortBy === "status") setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      else { setSortBy("status"); setSortOrder("asc"); }
                    }}
                    className={`text-xs px-2 py-1 rounded ${sortBy === "status" ? "bg-emerald-100 text-emerald-700" : "text-slate-600 hover:bg-slate-100"}`}
                  >
                    Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </div>
              </div>
            </div>

            {/* Staff Table */}
            <div className="rounded-2xl bg-white/80 backdrop-blur shadow-sm ring-1 ring-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedStaff.length === filteredStaff.length && filteredStaff.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStaff(filteredStaff.map(s => s.id));
                            } else {
                              setSelectedStaff([]);
                            }
                          }}
                          className="rounded border-slate-300"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Staff Member</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Assigned Roles</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Confirmation</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStaff.map((member) => (
                      <motion.tr
                        key={member.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedStaff.includes(member.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStaff([...selectedStaff, member.id]);
                              } else {
                                setSelectedStaff(selectedStaff.filter(id => id !== member.id));
                              }
                            }}
                            className="rounded border-slate-300"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white">
                              {member.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{member.name}</p>
                              <p className="text-xs text-slate-500">{member.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <p className="text-slate-900">{member.email}</p>
                            <p className="text-slate-500">{member.phone}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {member.roles.map(roleId => (
                              <RoleBadge key={roleId} roleId={roleId} />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={member.status} />
                        </td>
                        <td className="px-4 py-4">
                          <ConfirmationBadge status={member.confirmationStatus} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(member)}
                              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
                              title="Edit Staff"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStaff([member.id])}
                              className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Staff"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStaff.length === 0 && (
                <div className="py-12 text-center">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900">No staff members found</h3>
                  <p className="mt-1 text-sm text-slate-600">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </main>

          {/* AI Insights Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-6 space-y-4">
              {/* Stats Card */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium opacity-90">Total Staff</h3>
                  <Users className="w-5 h-5 opacity-75" />
                </div>
                <p className="text-4xl font-bold mb-4">{staff.length}</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur text-center">
                    <div className="text-xs opacity-90">Active</div>
                    <div className="font-bold">{staff.filter(s => s.status === "active").length}</div>
                  </div>
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur text-center">
                    <div className="text-xs opacity-90">Inactive</div>
                    <div className="font-bold">{staff.filter(s => s.status === "inactive").length}</div>
                  </div>
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur text-center">
                    <div className="text-xs opacity-90">Pending</div>
                    <div className="font-bold">{staff.filter(s => s.confirmationStatus === "pending").length}</div>
                  </div>
                </div>
              </div>

              {/* Advanced AI Insights */}
              <div className="rounded-2xl bg-white/80 backdrop-blur p-5 shadow-sm ring-1 ring-slate-200">
                <AdvancedAIInsightsPanel
                  staff={staff.map(s => ({
                    ...s,
                    accessLogs: s.id === "STF-003" ? [
                      { timestamp: "2025-10-29T02:30:00Z", action: "view-stock", resource: "inventory", outcome: "success" },
                      { timestamp: "2025-10-29T03:15:00Z", action: "edit-inventory", resource: "stock-001", outcome: "denied" },
                    ] as any[] : [],
                    roleChangeHistory: s.id === "STF-001" ? [
                      {
                        timestamp: "2025-10-20T10:00:00Z",
                        previousRoles: ["quality-verification-organizer"],
                        newRoles: ["manager", "quality-verification-organizer"],
                        changedBy: "Admin",
                        reason: "Promotion",
                      },
                    ] : [],
                  }))}
                  confirmationStats={{
                    sms: 5,
                    whatsapp: 8,
                    email: 3,
                    arattai: 2,
                  }}
                />
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl bg-white/80 backdrop-blur p-5 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    View Audit Log
                  </button>
                  <button className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Staff List (CSV)
                  </button>
                  <button className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Role Analytics
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Add Staff Modal */}
      <Modal
        open={showAddStaffModal}
        onClose={() => { setShowAddStaffModal(false); resetForm(); }}
        title="➕ Add New Staff Member"
        size="4xl"
        actions={
          <>
            <Button variant="secondary" onClick={() => { setShowAddStaffModal(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAddStaff} disabled={!formData.name || !formData.phone || formData.roles.length === 0}>
              Add Staff
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="+91-98765-43210"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="email@tradie.in"
                />
              </div>
            </div>
          </div>

          {/* Role Assignment */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">
              Assign Roles <span className="text-rose-500">*</span>
            </h4>
            <div className="space-y-3">
              {Object.entries(
                AVAILABLE_ROLES.reduce((acc, role) => {
                  if (!acc[role.category]) acc[role.category] = [];
                  acc[role.category].push(role);
                  return acc;
                }, {} as Record<string, typeof AVAILABLE_ROLES>)
              ).map(([category, roles]) => (
                <div key={category}>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    {category}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => {
                      const isSelected = formData.roles.includes(role.id);
                      return (
                        <button
                          key={role.id}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              roles: isSelected
                                ? formData.roles.filter((r) => r !== role.id)
                                : [...formData.roles, role.id],
                            });
                          }}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                            isSelected
                              ? "bg-emerald-500 text-white ring-2 ring-emerald-600 shadow-md"
                              : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-emerald-300"
                          }`}
                        >
                          {isSelected && "✓ "}{role.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {formData.roles.includes("custom") && (
              <div className="mt-4">
                <label className="mb-2 block text-xs font-medium text-slate-700">
                  Custom Role Name
                </label>
                <input
                  type="text"
                  value={formData.customRole}
                  onChange={(e) => setFormData({ ...formData, customRole: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g., Lab Technician"
                />
              </div>
            )}
          </div>

          {/* Auto-Generated Permissions */}
          {formData.roles.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Auto-Generated Permissions
              </h4>
              <div className="flex flex-wrap gap-2">
                {getPermissionsForRoles(formData.roles).map(perm => (
                  <span key={perm} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    {perm}
                  </span>
                ))}
              </div>

              {/* Conflict Detection */}
              {detectConflicts(formData.roles).map((conflict, idx) => (
                <div key={idx} className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
                  <p className="flex items-center gap-2 text-xs font-medium text-rose-800">
                    <AlertTriangle className="w-4 h-4" />
                    {conflict}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Confirmation Link */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <input
                type="checkbox"
                checked={formData.sendConfirmation}
                onChange={(e) => setFormData({ ...formData, sendConfirmation: e.target.checked })}
                className="rounded border-slate-300"
              />
              Send role confirmation link
            </label>

            {formData.sendConfirmation && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-slate-600">Select communication channels:</p>
                <div className="flex flex-wrap gap-2">
                  {["SMS", "WhatsApp", "Email", "Arattai"].map(channel => (
                    <button
                      key={channel}
                      onClick={() => {
                        const ch = channel.toLowerCase();
                        setFormData({
                          ...formData,
                          confirmationChannels: formData.confirmationChannels.includes(ch)
                            ? formData.confirmationChannels.filter(c => c !== ch)
                            : [...formData.confirmationChannels, ch]
                        });
                      }}
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                        formData.confirmationChannels.includes(channel.toLowerCase())
                          ? "bg-emerald-500 text-white"
                          : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-emerald-300"
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Any additional remarks or restrictions..."
            />
          </div>
        </div>
      </Modal>

      {/* Edit Staff Modal (Similar structure to Add) */}
      <Modal
        open={showEditStaffModal}
        onClose={() => { setShowEditStaffModal(false); setEditingStaff(null); resetForm(); }}
        title="✏️ Edit Staff Member"
        size="4xl"
        actions={
          <>
            <Button variant="secondary" onClick={() => { setShowEditStaffModal(false); setEditingStaff(null); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEditStaff}>
              Save Changes
            </Button>
          </>
        }
      >
        {/* Same content as Add modal */}
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Assign Roles *</h4>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ROLES.map((role) => {
                const isSelected = formData.roles.includes(role.id);
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        roles: isSelected
                          ? formData.roles.filter((r) => r !== role.id)
                          : [...formData.roles, role.id],
                      });
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-emerald-500 text-white ring-2 ring-emerald-600 shadow-md"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-emerald-300"
                    }`}
                  >
                    {isSelected && "✓ "}{role.name}
                  </button>
                );
              })}
            </div>
          </div>

          {formData.roles.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="mb-2 text-sm font-semibold text-slate-900">Permissions Preview</h4>
              <div className="flex flex-wrap gap-2">
                {getPermissionsForRoles(formData.roles).map(perm => (
                  <span key={perm} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      </Modal>

      {/* Bulk Assign Modal */}
      <Modal
        open={showBulkAssignModal}
        onClose={() => { setShowBulkAssignModal(false); setBulkRoles([]); }}
        title="👥 Bulk Role Assignment"
        size="xl"
        actions={
          <>
            <Button variant="secondary" onClick={() => { setShowBulkAssignModal(false); setBulkRoles([]); }}>
              Cancel
            </Button>
            <Button onClick={handleBulkAssign} disabled={bulkRoles.length === 0}>
              Assign to {selectedStaff.length} Staff
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Assign roles to <strong>{selectedStaff.length}</strong> selected staff member(s)
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="mb-2 text-sm font-semibold text-slate-900">Selected Staff:</h4>
            <div className="flex flex-wrap gap-2">
              {staff.filter(s => selectedStaff.includes(s.id)).map(s => (
                <span key={s.id} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Select Roles to Assign</h4>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ROLES.map((role) => {
                const isSelected = bulkRoles.includes(role.id);
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setBulkRoles(isSelected
                        ? bulkRoles.filter((r) => r !== role.id)
                        : [...bulkRoles, role.id]
                      );
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-emerald-500 text-white ring-2 ring-emerald-600 shadow-md"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-emerald-300"
                    }`}
                  >
                    {isSelected && "✓ "}{role.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>

      {/* Role Management Modal */}
      <Modal
        open={showRoleManagementModal}
        onClose={() => setShowRoleManagementModal(false)}
        title="⚙️ Role Management"
        size="6xl"
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            Manage available roles, permissions, and role assignments
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AVAILABLE_ROLES.map(role => (
              <div key={role.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{role.name}</h4>
                    <p className="mt-1 text-xs text-slate-600">{role.description}</p>
                  </div>
                  <span className="ml-2 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    {staff.filter(s => s.roles.includes(role.id)).length} assigned
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium text-slate-700">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map(perm => (
                      <span key={perm} className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
                    Edit Role
                  </button>
                  <button className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Button icon={<Plus className="w-4 h-4" />}>
            Create Custom Role
          </Button>
        </div>
      </Modal>

      {/* 2FA Modal */}
      <Modal
        open={show2FAModal}
        onClose={() => { setShow2FAModal(false); setPendingAction(null); setOtp(""); }}
        title="🔐 Two-Factor Authentication Required"
        size="lg"
        actions={
          <>
            <Button variant="secondary" onClick={() => { setShow2FAModal(false); setPendingAction(null); setOtp(""); }}>
              Cancel
            </Button>
            <Button onClick={handle2FA} disabled={otp.length !== 6}>
              Verify & Proceed
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-900">
              <Shield className="inline w-4 h-4 mr-1" />
              This action affects staff with critical roles and requires 2FA verification.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Enter 6-Digit OTP Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl border-2 border-slate-200 px-6 py-4 text-center text-2xl font-bold tracking-widest focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              placeholder="000000"
            />
          </div>

          <p className="text-xs text-slate-600 text-center">
            OTP sent to your registered mobile/email. Use <strong>123456</strong> for demo.
          </p>
        </div>
      </Modal>
    </div>
  );
}
