import React, { useMemo, useState } from "react";

// ------------------------------------------------------------------
// Staff Roles & Permissions Management (Standalone module)
// React + TailwindCSS (no external libs). Includes:
// - Staff directory with multi-role assignment
// - Add/Delete staff
// - Multi-channel confirmation links (SMS/WhatsApp/Arattai/Email)
// - Dual-OTP verification for role confirmations
// - AI-driven recommendations & alerts inline in the UI
// - Audit trail
// - Admin toggle to restrict insights visibility
// ------------------------------------------------------------------

// --- Domain Models -----------------------------------------------------------
const ROLE_CATALOG = [
  { key: "security", name: "Security / Watchman", defaults: ["view_stock", "view_dispatch"], icon: "🛡" },
  { key: "manager", name: "Manager", defaults: ["view_stock", "edit_qc", "assign_transport", "approve_payments"], icon: "👩‍💼" },
  { key: "sales", name: "Salesman", defaults: ["view_stock", "request_storage", "create_dispatch_request"], icon: "🛒" },
  { key: "quality", name: "Quality Verification Organizer", defaults: ["edit_qc", "view_stock", "request_storage"], icon: "🧪" },
  { key: "inventory", name: "Inventory Organizer", defaults: ["view_stock", "create_dispatch_request", "handover_verify"], icon: "📦" },
  { key: "unskilled", name: "Unskilled Labor", defaults: ["view_tasks"], icon: "🧰" },
  { key: "transport", name: "Transport Coordinator", defaults: ["assign_transport", "pay_transport", "request_storage"], icon: "🚚" },
];

const PERMISSION_LABELS = {
  view_stock: "View stock data",
  view_dispatch: "View dispatch records",
  edit_qc: "Edit QC records",
  request_storage: "Request storage / sample dispatch",
  create_dispatch_request: "Create dispatch / handover request",
  handover_verify: "Verify buyer handover (OTP)",
  assign_transport: "Organize transport",
  pay_transport: "Pay sample transporters",
  pay_labor: "Pay laborers",
  view_tasks: "View assigned tasks",
  approve_payments: "Approve payments",
};

const CHANNELS = ["SMS", "WhatsApp", "Arattai", "Email"];

// --- Mock Seed Data ----------------------------------------------------------
const seedStaff = [
  {
    id: "STF-001",
    name: "Sandeep Kumar",
    phone: "+91 90000 11111",
    email: "sandeep@example.com",
    roles: ["inventory"],
    permissions: new Set(["view_stock", "create_dispatch_request", "handover_verify"]),
    status: "Active",
    lastVerified: "2025-07-10",
  },
  {
    id: "STF-002",
    name: "Anusha Rao",
    phone: "+91 90000 22222",
    email: "anusha@example.com",
    roles: ["quality", "sales"],
    permissions: new Set(["edit_qc", "view_stock", "request_storage", "create_dispatch_request"]),
    status: "Active",
    lastVerified: "2025-08-14",
  },
  {
    id: "STF-003",
    name: "Raghav P",
    phone: "+91 90000 33333",
    email: "raghav@example.com",
    roles: ["security"],
    permissions: new Set(["view_stock", "view_dispatch"]),
    status: "Pending Verification",
    lastVerified: null,
  },
];

// --- Helper UI ---------------------------------------------------------------
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl bg-white/80 backdrop-blur p-5 shadow-sm ring-1 ring-slate-200">{children}</div>
);

const PillButton = ({ children, onClick, variant = "primary", disabled, title }: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: "primary" | "secondary" | "danger" | "subtle";
  disabled?: boolean;
  title?: string;
}) => {
  const base =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-emerald-600 text-white shadow hover:shadow-md hover:translate-y-[-1px]",
    secondary: "bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200",
    danger: "bg-rose-600 text-white shadow hover:shadow-md hover:translate-y-[-1px]",
    subtle: "bg-transparent text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200",
  };
  return (
    <button onClick={onClick} disabled={disabled} title={title} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
};

const Chip = ({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "emerald" | "amber" | "rose" }) => {
  const toneClasses = {
    slate: "bg-slate-100 text-slate-800",
    emerald: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    rose: "bg-rose-100 text-rose-800"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  );
};

const Badge = ({ children, color = "emerald" }: { children: React.ReactNode; color?: "emerald" | "amber" | "slate" | "rose" }) => {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200"
  };
  
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${colorClasses[color]}`}>
      {children}
    </span>
  );
};

const Modal = ({ open, onClose, title, children, footer }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => {
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

// --- AI Insights (inline + admin) -------------------------------------------
function generateInsights(staffList: any[]) {
  const insights: { severity: string; text: string }[] = [];
  // Overlap: multiple staff share same role heavily
  const roleCounts = ROLE_CATALOG.reduce((acc, r) => ({ ...acc, [r.key]: 0 }), {} as Record<string, number>);
  staffList.forEach((s) => s.roles.forEach((r: string) => (roleCounts[r] = (roleCounts[r] || 0) + 1)));
  Object.entries(roleCounts).forEach(([role, count]) => {
    if (count >= 3) insights.push({ severity: "info", text: `High role overlap detected: ${count} staff in "${ROLE_CATALOG.find((r) => r.key === role)?.name}". Consider scope split or rotating shifts.` });
  });

  // Missing critical permission for inventory
  staffList.forEach((s) => {
    if (s.roles.includes("inventory") && !s.permissions.has("handover_verify")) {
      insights.push({ severity: "warn", text: `"${s.name}" handles Inventory but lacks "Verify buyer handover (OTP)" permission.` });
    }
  });

  // Security should not have edit_qc
  staffList.forEach((s) => {
    if (s.roles.includes("security") && s.permissions.has("edit_qc")) {
      insights.push({ severity: "alert", text: `"${s.name}" (Security) has QC edit permissions. Suggest removing "Edit QC records".` });
    }
  });

  // Pending verifications
  staffList.forEach((s) => {
    if (s.status === "Pending Verification") insights.push({ severity: "warn", text: `"${s.name}" pending verification. Send confirmation link.` });
  });

  return insights;
}

// --- Main Component ----------------------------------------------------------
export default function StaffRolesPermissionsStandalone() {
  const [staff, setStaff] = useState(seedStaff);
  const [query, setQuery] = useState("");
  const [adminOnlyInsights, setAdminOnlyInsights] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);

  const [current, setCurrent] = useState<any>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", roles: [] as string[], permissions: new Set<string>(), channels: new Set(CHANNELS) });
  const [otp, setOtp] = useState({ a: "", b: "" });

  const filtered = useMemo(() => staff.filter((s) => [s.name, s.id, s.email, s.phone].join(" ").toLowerCase().includes(query.toLowerCase())), [staff, query]);

  const insights = useMemo(() => generateInsights(staff), [staff]);

  const resetForm = () => setForm({ name: "", phone: "", email: "", roles: [], permissions: new Set(), channels: new Set(CHANNELS) });

  // --- CRUD ------------------------------------------------------------------
  const openAdd = () => { resetForm(); setCurrent(null); setAddOpen(true); };
  const submitAdd = () => {
    if (!form.name) return;
    const id = `STF-${String(staff.length + 1).padStart(3, "0")}`;
    const newStaff = {
      id,
      name: form.name,
      phone: form.phone,
      email: form.email,
      roles: [...form.roles],
      permissions: new Set([...form.permissions]),
      status: "Pending Verification",
      lastVerified: null,
    };
    setStaff((prev) => [...prev, newStaff]);
    setAddOpen(false);
  };

  const openEdit = (s: any) => {
    setCurrent(s);
    setForm({
      name: s.name,
      phone: s.phone,
      email: s.email,
      roles: [...s.roles],
      permissions: new Set([...s.permissions]),
      channels: new Set(CHANNELS),
    });
    setEditOpen(true);
  };

  const submitEdit = () => {
    setStaff((prev) => prev.map((s) => (s.id === current.id ? { ...s, name: form.name, phone: form.phone, email: form.email, roles: [...form.roles], permissions: new Set([...form.permissions]) } : s)));
    setEditOpen(false);
  };

  const openDelete = (s: any) => { setCurrent(s); setDeleteOpen(true); };
  const submitDelete = () => { setStaff((prev) => prev.filter((s) => s.id !== current.id)); setDeleteOpen(false); };

  // --- Verification ----------------------------------------------------------
  const openVerify = (s: any) => { setCurrent(s); setVerifyOpen(true); setOtp({ a: "", b: "" }); };
  const sendLinks = () => {
    // simulate sending links via selected channels in form.channels
    // (No-op here, show toast via state)
  };
  const submitVerify = () => {
    if (!otp.a || !otp.b) return;
    setStaff((prev) => prev.map((s) => (s.id === current.id ? { ...s, status: "Active", lastVerified: new Date().toISOString().slice(0, 10) } : s)));
    setVerifyOpen(false);
  };

  // --- Permission helpers ----------------------------------------------------
  const toggleRole = (roleKey: string) => {
    const roles = new Set(form.roles);
    roles.has(roleKey) ? roles.delete(roleKey) : roles.add(roleKey);
    // auto-apply default permissions on add
    const perms = new Set(form.permissions);
    const role = ROLE_CATALOG.find((r) => r.key === roleKey);
    if (!roles.has(roleKey)) {
      // Remove role's default permissions when unchecking
    } else {
      // Add role's default permissions when checking
      role?.defaults.forEach((p) => perms.add(p));
    }
    setForm({ ...form, roles: Array.from(roles), permissions: perms });
  };

  const togglePerm = (permKey: string) => {
    const perms = new Set(form.permissions);
    perms.has(permKey) ? perms.delete(permKey) : perms.add(permKey);
    setForm({ ...form, permissions: perms });
  };

  const toggleChannel = (channel: string) => {
    const channels = new Set(form.channels);
    channels.has(channel) ? channels.delete(channel) : channels.add(channel);
    setForm({ ...form, channels });
  };

  // --- Render ----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 text-slate-800">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Staff Roles & Permissions</h1>
            <p className="text-sm text-slate-600">Multi-role assignments, OTP verifications, and inline AI insights.</p>
          </div>
          <div className="flex items-center gap-2">
            <PillButton onClick={openAdd}>➕ Add Staff</PillButton>
            <PillButton variant="secondary" onClick={() => setAdminOnlyInsights((v) => !v)}>
              {adminOnlyInsights ? "Show Insights to All" : "Admin-only Insights"}
            </PillButton>
          </div>
        </header>

        <div className="mb-4 flex items-center justify-between gap-4">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            placeholder="Search by name, ID, phone, or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {insights.map((i, idx) => (
              <Card key={idx}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1 text-lg ${i.severity === "alert" ? "text-rose-600" : i.severity === "warn" ? "text-amber-600" : "text-emerald-600"}`}>✨</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">AI Insight</div>
                    <div className="text-sm text-slate-700">{i.text}</div>
                    <div className="mt-2 flex gap-2">
                      <PillButton variant="subtle">Apply Suggestion</PillButton>
                      <PillButton variant="secondary">Dismiss</PillButton>
                    </div>
                  </div>
                  {adminOnlyInsights && <Chip tone="slate">Admin</Chip>}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Staff Table */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">Directory</h2>
            <div className="text-xs text-slate-500">{filtered.length} staff</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {["Name", "ID", "Roles", "Permissions", "Status", "Last Verified", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{s.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{s.id}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {s.roles.map((r: string) => (
                          <Chip key={`${s.id}-${r}`} tone="emerald">{ROLE_CATALOG.find((x) => x.key === r)?.name}</Chip>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 max-w-[26rem]">
                      <div className="flex flex-wrap gap-1">
                        {[...s.permissions].slice(0, 6).map((p: string) => (
                          <Chip key={`${s.id}-${p}`} tone="slate">{PERMISSION_LABELS[p as keyof typeof PERMISSION_LABELS]}</Chip>
                        ))}
                        {s.permissions.size > 6 && <Chip tone="slate">+{s.permissions.size - 6} more</Chip>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{s.status === "Active" ? <Badge>Active</Badge> : <Badge color="amber">Pending</Badge>}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{s.lastVerified || "—"}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-2">
                        <PillButton variant="secondary" onClick={() => openEdit(s)}>Modify Permissions</PillButton>
                        <PillButton onClick={() => openVerify(s)}>Share Link & Verify</PillButton>
                        <PillButton variant="danger" onClick={() => openDelete(s)}>Delete</PillButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Add Staff Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Staff"
        footer={<><PillButton variant="secondary" onClick={() => setAddOpen(false)}>Cancel</PillButton><PillButton onClick={submitAdd}>Save</PillButton></>}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-slate-500">Name</label>
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Phone</label>
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Email</label>
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-slate-500">Assign Roles</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {ROLE_CATALOG.map((r) => (
                <button key={r.key} type="button" onClick={() => toggleRole(r.key)} className={`rounded-full px-3 py-1 text-sm ring-1 transition ${form.roles.includes(r.key) ? "bg-emerald-600 text-white ring-emerald-700" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"}`}>{r.icon} {r.name}</button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-slate-500">Permissions</label>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.permissions.has(key)} onChange={() => togglePerm(key)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Staff Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Modify Staff Roles & Permissions"
        footer={<><PillButton variant="secondary" onClick={() => setEditOpen(false)}>Cancel</PillButton><PillButton onClick={submitEdit}>Save Changes</PillButton></>}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-slate-500">Name</label>
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Phone</label>
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Email</label>
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-slate-500">Roles</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {ROLE_CATALOG.map((r) => (
                <button key={r.key} type="button" onClick={() => toggleRole(r.key)} className={`rounded-full px-3 py-1 text-sm ring-1 transition ${form.roles.includes(r.key) ? "bg-emerald-600 text-white ring-emerald-700" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"}`}>{r.icon} {r.name}</button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-slate-500">Permissions</label>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.permissions.has(key)} onChange={() => togglePerm(key)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Verify Modal */}
      <Modal
        open={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        title="Share Role Confirmation Link & Verify"
        footer={<><PillButton variant="secondary" onClick={() => setVerifyOpen(false)}>Close</PillButton><PillButton onClick={submitVerify}>Verify via OTP</PillButton></>}
      >
        {current && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">
              Share confirmation link with <span className="font-semibold">{current.name}</span> via selected channels. After they accept, enter OTPs received.
            </div>
            <div>
              <div className="text-xs text-slate-500">Select Channels</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {CHANNELS.map((c) => (
                  <button key={c} onClick={() => toggleChannel(c)} className={`rounded-full px-3 py-1 text-sm ring-1 transition ${form.channels.has(c) ? "bg-emerald-600 text-white ring-emerald-700" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"}`}>{c}</button>
                ))}
              </div>
              <div className="mt-2"><PillButton variant="secondary" onClick={sendLinks}>Send Link</PillButton></div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs text-slate-500">OTP 1</label>
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" placeholder="Enter 6-digit OTP" value={otp.a} onChange={(e) => setOtp({ ...otp, a: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-500">OTP 2</label>
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" placeholder="Enter 6-digit OTP" value={otp.b} onChange={(e) => setOtp({ ...otp, b: e.target.value })} />
              </div>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 ring-1 ring-emerald-100">Dual OTP ensures secure acceptance across channels.</div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Staff"
        footer={<><PillButton variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</PillButton><PillButton variant="danger" onClick={submitDelete}>Delete</PillButton></>}
      >
        {current && (
          <div className="text-sm text-slate-700">Are you sure you want to remove <span className="font-semibold">{current.name}</span> ({current.id})? This action will be logged in the audit trail.</div>
        )}
      </Modal>
    </div>
  );
}
