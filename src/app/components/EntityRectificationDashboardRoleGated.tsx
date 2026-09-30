import React, { useMemo, useState } from "react";

// -------------------------------------------------------------
// Entity Rectification & Control Dashboard (Single-file React)
// Styling: TailwindCSS only (no external UI libs required)
// Added: ROLE-BASED GATING using shareholding + privileged roles
// -------------------------------------------------------------

// --- Governance Policy (Expert defaults) ----------------------
// You can later fetch these from DB per-entity, but for now these
// encode expert-grade defaults used across legal entity types.
const PRIVILEGED_ROLES = [
  "Managing Partner",
  "Director",
  "Karta",
  "Company Secretary",
  "CFO",
  "Trustee",
  "Secretary",
  "Chairman",
];

const POLICY = {
  minShareToInitiate: 10, // % — unless privileged role
  minShareToApprove: 10, // % — unless privileged role
  minApprovers: 2, // dual-OTP (except Individual proprietor)
  minCombinedApprovalShare: 20, // % combined approvers — unless privileged
};

// Action taxonomy for fine-grained checks
const ACTIONS = {
  PROPOSE_CHANGE: "PROPOSE_CHANGE",
  FINALIZE_CHANGE: "FINALIZE_CHANGE",
  APPROVE_CHANGE: "APPROVE_CHANGE",
};

// --- Helper Components -------------------------------------------------------
const Chip = ({ children, tone = "slate" }) => {
  const toneClasses = {
    slate: "bg-slate-100 text-slate-800",
    emerald: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    rose: "bg-rose-100 text-rose-800",
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone] || toneClasses.slate}`}>
      {children}
    </span>
  );
};

const Badge = ({ children, color = "emerald" }) => {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
  };
  
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${colorClasses[color] || colorClasses.emerald}`}>
      {children}
    </span>
  );
};

const Section = ({ title, children, actions }) => (
  <div className="rounded-2xl bg-white/80 backdrop-blur p-5 shadow-sm ring-1 ring-slate-200">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <div className="flex gap-2">{actions}</div>
    </div>
    {children}
  </div>
);

const PillButton = ({ children, onClick, variant = "primary", disabled, title }) => {
  const base =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-emerald-600 text-white shadow hover:shadow-md hover:translate-y-[-1px]",
    secondary:
      "bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200",
    danger:
      "bg-rose-600 text-white shadow hover:shadow-md hover:translate-y-[-1px]",
    subtle:
      "bg-transparent text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200",
  };
  return (
    <button onClick={onClick} disabled={disabled} title={title} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
};

const ProgressBar = ({ value, max = 3 }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full rounded-full bg-slate-100">
      <div
        className="h-2 rounded-full bg-emerald-500 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">✕</button>
        </div>
        <div className="space-y-4">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
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
    roles: [
      { role: "Managing Partner", person: "Anita Rao", share: 40, rectification: "Finalize", audit: "Approve", otp: true },
      { role: "Partner", person: "Vikram", share: 35, rectification: "Propose", audit: "Review", otp: true },
      { role: "Partner", person: "Leela", share: 25, rectification: "Propose", audit: "Review", otp: true },
      { role: "Auditor", person: "Ext. Auditor", share: 0, rectification: "Suggest", audit: "Audit Trail", otp: false },
    ],
    history: [
      { number: 1, date: "2025-06-18", by: "Managing Partner", approvers: ["Vikram", "Leela"], status: "Approved" },
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
    roles: [
      { role: "Karta", person: "Ravindra", share: 51, rectification: "Finalize", audit: "Approve", otp: true },
      { role: "Member", person: "Shreya", share: 25, rectification: "Request", audit: "Review", otp: true },
      { role: "Member", person: "Rohan", share: 24, rectification: "Request", audit: "Review", otp: true },
      { role: "Auditor", person: "Ext. Auditor", share: 0, rectification: "Suggest", audit: "Audit Trail", otp: false },
    ],
    history: [
      { number: 1, date: "2024-09-07", by: "Karta", approvers: ["Ravindra", "Shreya"], status: "Approved" },
      { number: 2, date: "2025-05-29", by: "Member A", approvers: ["Ravindra", "Shreya"], status: "Approved" },
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
    roles: [
      { role: "Director", person: "A. Menon", share: 45, rectification: "Finalize", audit: "Approve", otp: true },
      { role: "Company Secretary", person: "CS Sharma", share: 0, rectification: "Rectify Ops", audit: "Compliance", otp: true },
      { role: "CFO", person: "N. Iyer", share: 0, rectification: "Rectify Financials", audit: "Approve Financials", otp: true },
      { role: "Auditor", person: "Ext. Auditor", share: 0, rectification: "Suggest", audit: "Audit Trail", otp: false },
    ],
    history: [
      { number: 1, date: "2023-12-10", by: "Director", approvers: ["A. Menon", "CS Sharma"], status: "Approved" },
      { number: 2, date: "2024-06-02", by: "CS", approvers: ["A. Menon", "N. Iyer"], status: "Approved" },
      { number: 3, date: "2025-03-11", by: "CFO", approvers: ["A. Menon", "Director B"], status: "Approved" },
    ],
  },
];

// --- Permission Logic --------------------------------------------------------
const isPrivilegedRole = (roleName) => PRIVILEGED_ROLES.includes(roleName);

const canInitiate = (r) => {
  if (!r) return false;
  return isPrivilegedRole(r.role) || (r.share ?? 0) >= POLICY.minShareToInitiate;
};

const canApprove = (r) => {
  if (!r || !r.otp) return false;
  return isPrivilegedRole(r.role) || (r.share ?? 0) >= POLICY.minShareToApprove;
};

const roleEffectiveRights = (r) => {
  const rights = [];
  if (canInitiate(r)) rights.push("Initiate");
  if (canApprove(r)) rights.push("Approve");
  if (r.rectification?.toLowerCase().includes("finalize") || isPrivilegedRole(r.role)) rights.push("Finalize");
  return rights.join(", ");
};

// --- Main Component ----------------------------------------------------------
export default function EntityRectificationDashboardRoleGated() {
  const [entities, setEntities] = useState(initialEntities);
  const [selectedId, setSelectedId] = useState(initialEntities[0].id);
  const [tab, setTab] = useState("profile");
  const [viewMode, setViewMode] = useState("management"); // management | auditor | public

  // Current user (choose your role for gating preview)
  const [currentRoleName, setCurrentRoleName] = useState("Managing Partner");

  // OTP Modal state
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpData, setOtpData] = useState({ details: "", otp1: "", otp2: "", approver1: "", approver2: "" });
  const [kycOpen, setKycOpen] = useState(false);

  const selected = useMemo(() => {
    const found = entities.find((e) => e.id === selectedId);
    return found || entities[0];
  }, [entities, selectedId]);
  const changeLimitReached = selected.changeAttempts >= 3;

  const masked = (value) => (viewMode === "public" ? "••••••" : value);

  const currentRole = useMemo(() => selected.roles.find((r) => r.role === currentRoleName) || selected.roles[0], [selected, currentRoleName]);

  const eligibleApprovers = selected.roles.filter((r) => canApprove(r));

  const addHistory = (entityId, entry) => {
    setEntities((prev) =>
      prev.map((e) => (e.id === entityId ? { ...e, history: [...e.history, entry] } : e))
    );
  };

  const incrementChange = (entityId) => {
    setEntities((prev) =>
      prev.map((e) => (e.id === entityId ? { ...e, changeAttempts: Math.min(3, e.changeAttempts + 1) } : e))
    );
  };

  const approverShare = (name) => selected.roles.find((r) => r.person === name || r.role === name)?.share ?? 0;

  const combinedApprovalShareValid = () => {
    // If either approver is privileged, bypass combined share check
    const a1 = selected.roles.find((r) => r.person === otpData.approver1 || r.role === otpData.approver1);
    const a2 = selected.roles.find((r) => r.person === otpData.approver2 || r.role === otpData.approver2);
    if (!a1 || !a2) return false;
    if (isPrivilegedRole(a1.role) || isPrivilegedRole(a2.role)) return true;
    const total = (a1.share ?? 0) + (a2.share ?? 0);
    return total >= POLICY.minCombinedApprovalShare;
  };

  const handleRequestChange = () => {
    setOtpData({ details: "", otp1: "", otp2: "", approver1: "", approver2: "" });
    setOtpOpen(true);
  };

  const handleOtpSubmit = () => {
    // Validation: 
    if (!otpData.details || !otpData.otp1 || !otpData.otp2 || !otpData.approver1 || !otpData.approver2) return;
    if (otpData.approver1 === otpData.approver2) return; // distinct approvers required

    // Verify each approver eligibility
    const a1 = selected.roles.find((r) => r.person === otpData.approver1 || r.role === otpData.approver1);
    const a2 = selected.roles.find((r) => r.person === otpData.approver2 || r.role === otpData.approver2);
    if (!canApprove(a1) || !canApprove(a2)) return;
    if (!combinedApprovalShareValid()) return;

    const nextNo = (selected.history[selected.history.length - 1]?.number || 0) + 1;

    addHistory(selected.id, {
      number: nextNo,
      date: new Date().toISOString().slice(0, 10),
      by: currentRole?.role || "Change Initiator",
      approvers: [otpData.approver1, otpData.approver2],
      status: "Approved",
    });

    incrementChange(selected.id);
    setOtpOpen(false);
  };

  const handleInitiateKyc = () => setKycOpen(true);

  const StatusBadge = ({ status }) => {
    const map = {
      Active: { color: "emerald", text: "Active" },
      Locked: { color: "rose", text: "Locked" },
      "Under Rectification": { color: "amber", text: "Under Rectification" },
    };
    const cfg = map[status] || map.Active;
    return <Badge color={cfg.color}>{cfg.text}</Badge>;
  };

  const gating = {
    canInitiate: canInitiate(currentRole),
    initiateReason: !canInitiate(currentRole)
      ? `Requires privileged role or ≥${POLICY.minShareToInitiate}% share`
      : "",
    canRequestFurther: !changeLimitReached,
  };

  // --- Render ----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 text-slate-800">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Entity Rectification & Control Dashboard</h1>
            <p className="text-sm text-slate-600">Post-registration governance with dual-OTP approvals, audit logs, and role-based gating.</p>
          </div>
          <div className="flex items-center gap-2">
            <PillButton variant={viewMode === "management" ? "primary" : "secondary"} onClick={() => setViewMode("management")}>Management View</PillButton>
            <PillButton variant={viewMode === "auditor" ? "primary" : "secondary"} onClick={() => setViewMode("auditor")}>Auditor View</PillButton>
            <PillButton variant={viewMode === "public" ? "primary" : "secondary"} onClick={() => setViewMode("public")}>Public View</PillButton>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Sidebar: Entities */}
          <aside className="lg:col-span-3">
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">Registered Commission Agents</h2>
              <div className="space-y-2">
                {entities.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedId(e.id)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      selectedId === e.id
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{e.name}</div>
                        <div className="text-xs text-slate-600">{e.type} • {e.scale}</div>
                      </div>
                      <StatusBadge status={e.status} />
                    </div>
                    <div className="mt-2 text-xs text-slate-500">ID: {e.id}</div>
                  </button>
                ))}
              </div>

              {/* Current Role Selector (for gating preview) */}
              <div className="mt-4 rounded-xl border border-slate-200 p-3">
                <div className="text-xs font-semibold text-slate-600">Acting As (Role-based Gating)</div>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  value={currentRoleName}
                  onChange={(e) => setCurrentRoleName(e.target.value)}
                >
                  {selected.roles.map((r) => (
                    <option key={`${r.role}-${r.person}`} value={r.role}>{r.role} {r.person ? `— ${r.person}` : ""}</option>
                  ))}
                </select>
                <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                  <span>Shareholding: <span className="font-medium">{currentRole?.share}%</span></span>
                  {isPrivilegedRole(currentRole?.role) && <Chip tone="emerald">Privileged</Chip>}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Panel */}
          <main className="lg:col-span-9 space-y-6">
            {/* Entity Overview */}
            <Section
              title="Entity Overview"
              actions={
                <>
                  {changeLimitReached ? (
                    <PillButton variant="danger" onClick={handleInitiateKyc}>Initiate Re-KYC & Verification</PillButton>
                  ) : (
                    <PillButton onClick={handleRequestChange} disabled={!gating.canInitiate || !gating.canRequestFurther} title={!gating.canInitiate ? gating.initiateReason : undefined}>
                      Request Structural Change {(!gating.canInitiate || !gating.canRequestFurther) && "🔒"}
                    </PillButton>
                  )}
                </>
              }
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm text-slate-600">Immutable Entity ID</div>
                  <div className="flex items-center gap-2">
                    <Chip tone="slate">{selected.id}</Chip>
                    <StatusBadge status={selected.status} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500">Entity Type</div>
                    <div className="font-medium">{selected.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Scale Category</div>
                    <div className="font-medium">{selected.scale}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Registration Date</div>
                    <div className="font-medium">{masked(selected.registrationDate)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Last Verification</div>
                    <div className="font-medium">{masked(selected.lastVerificationDate)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-slate-600">Change Attempts Used</div>
                  <div className="font-semibold">{selected.changeAttempts} / 3</div>
                </div>
                <ProgressBar value={selected.changeAttempts} />
                {changeLimitReached && (
                  <div className="mt-2 text-sm text-rose-600">
                    ⚠ Change limit reached. Future changes require full KYC re-verification and app-appointed verifier review.
                  </div>
                )}
              </div>
            </Section>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { key: "profile", label: "Profile & Compliance" },
                { key: "rectification", label: "Data Rectification Requests" },
                { key: "authorized", label: "Authorized Changes" },
                { key: "audit", label: "Audit History" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition whitespace-nowrap ${
                    tab === t.key
                      ? "bg-emerald-600 text-white ring-emerald-700"
                      : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            {tab === "profile" && (
              <Section title="Permissions & Control Matrix">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        {["Role", "Name", "Share %", "Data Rectification Rights", "Audit Control", "OTP Required", "Effective Rights"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selected.roles.map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">
                            <div className="flex items-center gap-2">
                              {r.role} {isPrivilegedRole(r.role) && <Chip tone="emerald">Privileged</Chip>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{r.person || "—"}</td>
                          <td className="px-4 py-3 text-sm">{r.share}%</td>
                          <td className="px-4 py-3 text-sm">{r.rectification}</td>
                          <td className="px-4 py-3 text-sm">{r.audit}</td>
                          <td className="px-4 py-3 text-sm">{r.otp ? <Badge>Required</Badge> : <Chip tone="slate">No</Chip>}</td>
                          <td className="px-4 py-3 text-sm">{roleEffectiveRights(r)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  Gating policy: Initiate ≥{POLICY.minShareToInitiate}% share or privileged role. Approve requires OTP and ≥{POLICY.minShareToApprove}% share or privileged role. Two distinct approvers with combined ≥{POLICY.minCombinedApprovalShare}% unless one is privileged.
                </div>
              </Section>
            )}

            {tab === "rectification" && (
              <Section
                title="Propose a Data Rectification"
                actions={<PillButton onClick={handleRequestChange} disabled={!gating.canInitiate || changeLimitReached} title={!gating.canInitiate ? gating.initiateReason : undefined}>Propose & Authorize (OTP) {!gating.canInitiate && "🔒"}</PillButton>}
              >
                <div className="mb-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-slate-200 flex items-center gap-2">
                  <span>Acting as: <span className="font-medium">{currentRole?.role}</span> {currentRole?.person ? `(${currentRole.person})` : ""} • Share: <span className="font-medium">{currentRole?.share}%</span></span>
                  {isPrivilegedRole(currentRole?.role) && <Chip tone="emerald">Privileged</Chip>}
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-slate-500">Sensitive Field</label>
                    <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" placeholder="e.g., Registered Address" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Proposed Change</label>
                    <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" placeholder="New Address" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-500">Justification (for audit)</label>
                    <textarea className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" rows={3} placeholder="Legal/compliance justification, supporting docs reference" />
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 ring-1 ring-emerald-100">
                  Dual-approval rule enforced. Button is locked if initiating role lacks required share/privilege.
                </div>
              </Section>
            )}

            {tab === "authorized" && (
              <Section title="Authorized Changes">
                <div className="grid gap-3">
                  {selected.history.filter((h) => h.status === "Approved").map((h) => (
                    <div key={h.number} className="grid grid-cols-1 gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 md:grid-cols-5">
                      <div className="font-semibold">Change #{h.number}</div>
                      <div className="text-sm">Date: {h.date}</div>
                      <div className="text-sm">Initiated By: {h.by}</div>
                      <div className="text-sm md:col-span-2">Approvers: {h.approvers.join(", ")}</div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {tab === "audit" && (
              <Section title="Audit History">
                <ol className="relative ml-2 border-l border-slate-200">
                  {selected.history.map((h) => (
                    <li key={h.number} className="ml-6 mb-6">
                      <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border border-white bg-emerald-500" />
                      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">Change #{h.number} • {h.status}</div>
                          <div className="text-xs text-slate-500">{h.date}</div>
                        </div>
                        <div className="mt-1 text-sm text-slate-700">By: {h.by}</div>
                        <div className="text-xs text-slate-600">Approvers: {h.approvers.join(", ")}</div>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-2 text-xs text-slate-500">All corrections are logged with timestamp, approvers, and OTP verification status. Gating rules applied at initiation and approval.</div>
              </Section>
            )}
          </main>
        </div>
      </div>

      {/* OTP Modal */}
      <Modal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        title="Authorize Change – Dual OTP Required"
        footer={
          <>
            <PillButton variant="secondary" onClick={() => setOtpOpen(false)}>Cancel</PillButton>
            <PillButton onClick={handleOtpSubmit} disabled={!combinedApprovalShareValid()} title={!combinedApprovalShareValid() ? `Need combined ≥${POLICY.minCombinedApprovalShare}% unless a privileged approver is included` : undefined}>Verify & Record Change</PillButton>
          </>
        }
      >
        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-slate-200 flex items-center gap-2">
          <span>Initiator: <span className="font-medium">{currentRole?.role}</span> {currentRole?.person ? `(${currentRole.person})` : ""} • Share: <span className="font-medium">{currentRole?.share}%</span></span>
          {isPrivilegedRole(currentRole?.role) && <Chip tone="emerald">Privileged</Chip>}
        </div>
        <div>
          <label className="text-xs text-slate-500">Describe the proposed change</label>
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            rows={3}
            placeholder="e.g., Update registered address; attach board resolution no. …"
            value={otpData.details}
            onChange={(e) => setOtpData({ ...otpData, details: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-slate-500">Approver 1 (pick eligible)</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              value={otpData.approver1}
              onChange={(e) => setOtpData({ ...otpData, approver1: e.target.value })}
            >
              <option value="">Select approver</option>
              {eligibleApprovers.map((r) => (
                <option key={`a1-${r.role}-${r.person}`} value={r.person || r.role}>
                  {r.role}{r.person ? ` — ${r.person}` : ""} • {r.share}% {isPrivilegedRole(r.role) ? "(Privileged)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">Approver 2 (pick eligible)</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              value={otpData.approver2}
              onChange={(e) => setOtpData({ ...otpData, approver2: e.target.value })}
            >
              <option value="">Select approver</option>
              {eligibleApprovers.map((r) => (
                <option key={`a2-${r.role}-${r.person}`} value={r.person || r.role}>
                  {r.role}{r.person ? ` — ${r.person}` : ""} • {r.share}% {isPrivilegedRole(r.role) ? "(Privileged)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">OTP for Approver 1</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="Enter 6-digit OTP"
              value={otpData.otp1}
              onChange={(e) => setOtpData({ ...otpData, otp1: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">OTP for Approver 2</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="Enter 6-digit OTP"
              value={otpData.otp2}
              onChange={(e) => setOtpData({ ...otpData, otp2: e.target.value })}
            />
          </div>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 ring-1 ring-emerald-100">
          Requirement: Two distinct eligible approvers. Combined share ≥{POLICY.minCombinedApprovalShare}% unless one is privileged.
        </div>
      </Modal>

      {/* KYC Modal */}
      <Modal
        open={kycOpen}
        onClose={() => setKycOpen(false)}
        title="Full KYC Re-verification Required"
        footer={
          <>
            <PillButton variant="secondary" onClick={() => setKycOpen(false)}>Close</PillButton>
            <PillButton onClick={() => setKycOpen(false)}>Submit Verification Request</PillButton>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-slate-500">Assign Verification Officer</label>
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" placeholder="Officer Name" />
          </div>
          <div>
            <label className="text-xs text-slate-500">Schedule Interview</label>
            <input type="datetime-local" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-slate-500">Upload KYC Documents (PDF/Images)</label>
            <div className="mt-1 flex w-full items-center justify-between rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
              <span>Drag & drop files here or click to upload</span>
              <PillButton variant="subtle">Browse</PillButton>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-700 ring-1 ring-amber-100">
          Change limit reached (3/3). Further structural changes are locked until re-verification completes.
        </div>
      </Modal>
    </div>
  );
}
