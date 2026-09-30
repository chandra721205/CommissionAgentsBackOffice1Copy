import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  Users,
  Lock,
  Unlock,
  Brain,
  Clock,
  Activity,
  Target,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Zap,
  Eye,
  EyeOff,
  UserX,
  UserCheck,
  BarChart3,
  Bell,
  RefreshCw,
  Settings,
  ChevronRight,
} from "lucide-react";

// ============================================================================
// ADVANCED AI INSIGHTS ENGINE FOR STAFF MANAGEMENT
// Expert-Proposed Detection & Optimization System
// ============================================================================

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  status: "active" | "inactive" | "pending";
  confirmationStatus: "confirmed" | "pending" | "expired";
  joinDate: string;
  lastActive: string;
  notes: string;
  avatar: string;
  accessLogs?: AccessLog[];
  roleChangeHistory?: RoleChange[];
  permissionLevel?: number; // 1-10 risk score
}

export interface AccessLog {
  timestamp: string;
  action: string;
  resource: string;
  outcome: "success" | "denied" | "suspicious";
}

export interface RoleChange {
  timestamp: string;
  previousRoles: string[];
  newRoles: string[];
  changedBy: string;
  reason: string;
}

export interface AIInsight {
  id: string;
  category: 
    | "conflict"
    | "inactive"
    | "access-anomaly"
    | "optimization"
    | "over-permission"
    | "multi-role"
    | "role-change"
    | "communication";
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  staffId?: string;
  staffName?: string;
  recommendation: string;
  action: string;
  metrics?: {
    riskScore?: number;
    confidenceLevel?: number;
    affectedStaff?: number;
    potentialSavings?: number;
  };
  timestamp: string;
  autoResolve?: boolean;
}

// --- RISK SCORING THRESHOLDS ------------------------------------------------
const RISK_THRESHOLDS = {
  CRITICAL: 8,
  HIGH: 6,
  MEDIUM: 4,
  LOW: 2,
};

// --- ROLE RISK WEIGHTS ------------------------------------------------------
const ROLE_RISK_WEIGHTS: Record<string, number> = {
  "manager": 8,
  "transport-payment-coordinator": 9,
  "quality-verification-organizer": 6,
  "inventory-organizer": 7,
  "security-watchman": 3,
  "salesman": 4,
  "sample-delivery-coordinator": 4,
  "unskilled-labor": 1,
  "custom": 5,
};

// --- CONFLICTING ROLE PAIRS -------------------------------------------------
const CONFLICTING_ROLE_PAIRS = [
  { roles: ["manager", "unskilled-labor"], reason: "Vastly different responsibility levels" },
  { roles: ["transport-payment-coordinator", "security-watchman"], reason: "Financial + Security access violates segregation" },
  { roles: ["manager", "sample-delivery-coordinator"], reason: "Approval conflict with operational execution" },
  { roles: ["quality-verification-organizer", "salesman"], reason: "Quality oversight conflicts with sales incentives" },
];

// --- COMPLEMENTARY ROLE PAIRS -----------------------------------------------
const COMPLEMENTARY_ROLE_PAIRS = [
  { roles: ["inventory-organizer", "sample-delivery-coordinator"], synergy: 0.85 },
  { roles: ["quality-verification-organizer", "inventory-organizer"], synergy: 0.75 },
  { roles: ["salesman", "quality-verification-organizer"], synergy: 0.65 },
];

// --- AI INSIGHTS GENERATOR --------------------------------------------------
export const generateAdvancedAIInsights = (
  staff: StaffMember[],
  confirmationStats?: { sms: number; whatsapp: number; email: number; arattai: number }
): AIInsight[] => {
  const insights: AIInsight[] = [];
  const now = new Date();

  // =========================================================================
  // 1. CONFLICT DETECTION
  // =========================================================================
  
  // Role Conflicts
  staff.forEach(member => {
    CONFLICTING_ROLE_PAIRS.forEach(({ roles: conflictRoles, reason }) => {
      if (conflictRoles.every(role => member.roles.includes(role))) {
        insights.push({
          id: `conflict-${member.id}-${conflictRoles.join("-")}`,
          category: "conflict",
          severity: "critical",
          title: "🚨 Critical Role Conflict Detected",
          description: `${member.name} holds conflicting roles: ${conflictRoles.map(r => r.replace(/-/g, " ").toUpperCase()).join(" + ")}. ${reason}.`,
          staffId: member.id,
          staffName: member.name,
          recommendation: "Immediately remove one of the conflicting roles to ensure proper segregation of duties.",
          action: "Remove Role",
          metrics: {
            riskScore: 9,
            confidenceLevel: 95,
          },
          timestamp: now.toISOString(),
        });
      }
    });
  });

  // Excessive Privilege Detection
  staff.forEach(member => {
    const riskScore = member.roles.reduce((sum, roleId) => sum + (ROLE_RISK_WEIGHTS[roleId] || 0), 0);
    const highRiskRoles = member.roles.filter(roleId => (ROLE_RISK_WEIGHTS[roleId] || 0) >= 6);

    if (highRiskRoles.length >= 3) {
      insights.push({
        id: `excessive-privilege-${member.id}`,
        category: "over-permission",
        severity: "high",
        title: "⚠️ Excessive Privilege Assignment",
        description: `${member.name} has ${highRiskRoles.length} high-risk roles (${highRiskRoles.join(", ")}). Combined risk score: ${riskScore}/10. Potential for fraud or abuse.`,
        staffId: member.id,
        staffName: member.name,
        recommendation: "Distribute high-risk roles across multiple staff members to reduce single-point failure risk.",
        action: "Redistribute Roles",
        metrics: {
          riskScore,
          confidenceLevel: 88,
        },
        timestamp: now.toISOString(),
      });
    }
  });

  // Redundant Roles
  staff.forEach(member => {
    if (member.roles.includes("inventory-organizer") && 
        member.roles.includes("sample-delivery-coordinator") && 
        member.roles.length === 2) {
      insights.push({
        id: `redundant-${member.id}`,
        category: "optimization",
        severity: "low",
        title: "💡 Redundant Role Combination Detected",
        description: `${member.name} has complementary roles (Inventory + Sample Delivery). Consider creating unified "Warehouse Operations" role.`,
        staffId: member.id,
        staffName: member.name,
        recommendation: "Create custom consolidated role to reduce complexity while maintaining coverage.",
        action: "Consolidate Roles",
        metrics: {
          riskScore: 2,
          confidenceLevel: 72,
          potentialSavings: 15,
        },
        timestamp: now.toISOString(),
      });
    }
  });

  // =========================================================================
  // 2. INACTIVE OR UNCONFIRMED STAFF
  // =========================================================================
  
  // Unconfirmed Staff
  const unconfirmedStaff = staff.filter(s => s.confirmationStatus === "pending");
  if (unconfirmedStaff.length > 0) {
    unconfirmedStaff.forEach(member => {
      const daysSinceJoin = Math.floor(
        (now.getTime() - new Date(member.joinDate).getTime()) / (1000 * 60 * 60 * 24)
      );

      insights.push({
        id: `unconfirmed-${member.id}`,
        category: "inactive",
        severity: daysSinceJoin > 7 ? "high" : "medium",
        title: "📩 Role Confirmation Pending",
        description: `${member.name} has not confirmed roles via SMS/Email/WhatsApp for ${daysSinceJoin} days. Link may be expired.`,
        staffId: member.id,
        staffName: member.name,
        recommendation: daysSinceJoin > 7 
          ? "Resend confirmation link urgently and escalate to admin if no response within 24h."
          : "Send reminder notification via preferred channel.",
        action: daysSinceJoin > 7 ? "Escalate to Admin" : "Resend Link",
        metrics: {
          riskScore: daysSinceJoin > 7 ? 6 : 4,
          confidenceLevel: 100,
        },
        timestamp: now.toISOString(),
      });
    });
  }

  // Dormant Critical Staff
  const dormantCritical = staff.filter(s => {
    if (s.status !== "active") {
      const hasCriticalRole = s.roles.some(roleId => 
        (ROLE_RISK_WEIGHTS[roleId] || 0) >= 6
      );
      return hasCriticalRole;
    }
    return false;
  });

  dormantCritical.forEach(member => {
    const criticalRoles = member.roles
      .filter(roleId => (ROLE_RISK_WEIGHTS[roleId] || 0) >= 6)
      .join(", ");

    insights.push({
      id: `dormant-critical-${member.id}`,
      category: "inactive",
      severity: "critical",
      title: "🚨 Inactive Staff with Critical Roles",
      description: `${member.name} is INACTIVE but still holds critical roles: ${criticalRoles}. Last active: ${member.lastActive}.`,
      staffId: member.id,
      staffName: member.name,
      recommendation: "Immediately revoke roles and reassign to active staff. Audit recent access logs for suspicious activity.",
      action: "Revoke & Reassign",
      metrics: {
        riskScore: 9,
        confidenceLevel: 100,
      },
      timestamp: now.toISOString(),
    });
  });

  // =========================================================================
  // 3. ACCESS PATTERN ANOMALIES
  // =========================================================================
  
  staff.forEach(member => {
    if (member.accessLogs && member.accessLogs.length > 0) {
      // Unusual access times
      const nightAccessCount = member.accessLogs.filter(log => {
        const hour = new Date(log.timestamp).getHours();
        return hour >= 22 || hour <= 5;
      }).length;

      if (nightAccessCount > 5) {
        insights.push({
          id: `night-access-${member.id}`,
          category: "access-anomaly",
          severity: "high",
          title: "🌙 Unusual Access Time Pattern",
          description: `${member.name} accessed system ${nightAccessCount} times between 10 PM - 5 AM. Deviates from normal working hours.`,
          staffId: member.id,
          staffName: member.name,
          recommendation: "Investigate reason for off-hours access. Verify legitimacy with staff member and manager.",
          action: "Investigate Activity",
          metrics: {
            riskScore: 7,
            confidenceLevel: 82,
          },
          timestamp: now.toISOString(),
        });
      }

      // Failed access attempts
      const deniedCount = member.accessLogs.filter(log => log.outcome === "denied").length;
      if (deniedCount > 10) {
        insights.push({
          id: `failed-access-${member.id}`,
          category: "access-anomaly",
          severity: "critical",
          title: "🔒 Excessive Failed Access Attempts",
          description: `${member.name} has ${deniedCount} denied access attempts. Possible unauthorized access attempt or role misconfiguration.`,
          staffId: member.id,
          staffName: member.name,
          recommendation: "Review permissions immediately. If intentional unauthorized access, initiate security review and potential role suspension.",
          action: "Security Review",
          metrics: {
            riskScore: 8,
            confidenceLevel: 90,
          },
          timestamp: now.toISOString(),
        });
      }

      // Suspicious activity
      const suspiciousCount = member.accessLogs.filter(log => log.outcome === "suspicious").length;
      if (suspiciousCount > 0) {
        insights.push({
          id: `suspicious-${member.id}`,
          category: "access-anomaly",
          severity: "critical",
          title: "⚠️ Suspicious Activity Detected",
          description: `${member.name} triggered ${suspiciousCount} suspicious activity alert(s). AI detected anomalous behavior patterns.`,
          staffId: member.id,
          staffName: member.name,
          recommendation: "Immediate security audit required. Review all recent transactions and consider temporary role suspension pending investigation.",
          action: "Emergency Audit",
          metrics: {
            riskScore: 10,
            confidenceLevel: 95,
          },
          timestamp: now.toISOString(),
        });
      }
    }
  });

  // =========================================================================
  // 4. ROLE DISTRIBUTION OPTIMIZATION
  // =========================================================================
  
  // Count roles
  const roleCounts: Record<string, number> = {};
  staff.forEach(s => {
    s.roles.forEach(role => {
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
  });

  // Over-concentration
  Object.entries(roleCounts).forEach(([roleId, count]) => {
    const percentage = (count / staff.length) * 100;
    if (percentage > 40) {
      insights.push({
        id: `concentration-${roleId}`,
        category: "optimization",
        severity: "medium",
        title: "📊 Role Over-Concentration",
        description: `${percentage.toFixed(0)}% of staff have "${roleId}" role. Lack of diversity may create operational bottlenecks.`,
        recommendation: "Diversify skill distribution through cross-training programs. Target 20-30% distribution per role.",
        action: "Launch Training",
        metrics: {
          riskScore: 5,
          confidenceLevel: 85,
          affectedStaff: count,
        },
        timestamp: now.toISOString(),
      });
    }
  });

  // Under-coverage
  const essentialRoles = ["security-watchman", "manager", "quality-verification-organizer"];
  essentialRoles.forEach(roleId => {
    const count = roleCounts[roleId] || 0;
    if (count < 2) {
      insights.push({
        id: `under-coverage-${roleId}`,
        category: "optimization",
        severity: "high",
        title: "⚠️ Critical Role Under-Coverage",
        description: `Only ${count} staff member(s) assigned to "${roleId}". Single point of failure risk.`,
        recommendation: `Recruit or train additional staff for ${roleId} role. Minimum recommended: 2 staff for redundancy.`,
        action: "Hire/Train Staff",
        metrics: {
          riskScore: 7,
          confidenceLevel: 100,
        },
        timestamp: now.toISOString(),
      });
    }
  });

  // Cross-training opportunities
  const singleRoleStaff = staff.filter(s => s.roles.length === 1 && s.status === "active");
  if (singleRoleStaff.length > 3) {
    insights.push({
      id: "cross-training-opportunity",
      category: "optimization",
      severity: "low",
      title: "🎯 Cross-Training Opportunity Detected",
      description: `${singleRoleStaff.length} active staff have only 1 role. Cross-training can improve operational flexibility.`,
      recommendation: "Implement cross-training program. Suggest complementary role pairings based on AI analysis.",
      action: "Design Training Program",
      metrics: {
        riskScore: 2,
        confidenceLevel: 78,
        affectedStaff: singleRoleStaff.length,
        potentialSavings: 25,
      },
      timestamp: now.toISOString(),
    });
  }

  // =========================================================================
  // 5. OVER-PERMISSION WARNINGS
  // =========================================================================
  
  staff.forEach(member => {
    const riskScore = member.roles.reduce((sum, roleId) => sum + (ROLE_RISK_WEIGHTS[roleId] || 0), 0);
    
    if (riskScore > 15) {
      insights.push({
        id: `over-permission-${member.id}`,
        category: "over-permission",
        severity: "critical",
        title: "🔓 Excessive Permission Level",
        description: `${member.name}'s combined permission score (${riskScore}/10) exceeds safe threshold. Risk of privilege abuse.`,
        staffId: member.id,
        staffName: member.name,
        recommendation: "Implement least-privilege principle. Remove unnecessary roles and apply granular permission controls.",
        action: "Tighten Permissions",
        metrics: {
          riskScore: Math.min(riskScore, 10),
          confidenceLevel: 92,
        },
        timestamp: now.toISOString(),
      });
    }
  });

  // =========================================================================
  // 6. MULTI-ROLE CONFIRMATION INSIGHTS
  // =========================================================================
  
  const multiRoleStaff = staff.filter(s => s.roles.length >= 2);
  multiRoleStaff.forEach(member => {
    // Check for proper segregation
    const hasSegregationIssue = CONFLICTING_ROLE_PAIRS.some(({ roles: conflictRoles }) =>
      conflictRoles.every(role => member.roles.includes(role))
    );

    if (hasSegregationIssue && member.confirmationStatus === "confirmed") {
      insights.push({
        id: `multi-role-segregation-${member.id}`,
        category: "multi-role",
        severity: "high",
        title: "⚖️ Segregation of Duties Violation",
        description: `${member.name} confirmed ${member.roles.length} roles including conflicting pairs. Confirmed at ${member.lastActive}.`,
        staffId: member.id,
        staffName: member.name,
        recommendation: "Audit role confirmation process. Require additional management approval for multi-role assignments.",
        action: "Request Re-Approval",
        metrics: {
          riskScore: 8,
          confidenceLevel: 88,
        },
        timestamp: now.toISOString(),
      });
    }

    // Positive multi-role insight
    const hasComplementaryRoles = COMPLEMENTARY_ROLE_PAIRS.some(({ roles: compRoles }) =>
      compRoles.every(role => member.roles.includes(role))
    );

    if (hasComplementaryRoles && member.confirmationStatus === "confirmed" && member.status === "active") {
      insights.push({
        id: `multi-role-positive-${member.id}`,
        category: "multi-role",
        severity: "info",
        title: "✅ Optimal Multi-Role Assignment",
        description: `${member.name} has complementary role combination. Efficiency gain estimated at +20%.`,
        staffId: member.id,
        staffName: member.name,
        recommendation: "Monitor performance metrics. Use as template for future multi-role assignments.",
        action: "Track Performance",
        metrics: {
          riskScore: 1,
          confidenceLevel: 75,
          potentialSavings: 20,
        },
        timestamp: now.toISOString(),
      });
    }
  });

  // =========================================================================
  // 7. ANOMALY ALERTS IN ROLE CHANGES
  // =========================================================================
  
  staff.forEach(member => {
    if (member.roleChangeHistory && member.roleChangeHistory.length > 0) {
      // Frequent changes
      const recentChanges = member.roleChangeHistory.filter(change => {
        const changeDate = new Date(change.timestamp);
        const daysSince = (now.getTime() - changeDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSince <= 30;
      });

      if (recentChanges.length >= 3) {
        insights.push({
          id: `frequent-changes-${member.id}`,
          category: "role-change",
          severity: "high",
          title: "🔄 Frequent Role Changes Detected",
          description: `${member.name} had ${recentChanges.length} role changes in last 30 days. Possible instability or privilege escalation attempt.`,
          staffId: member.id,
          staffName: member.name,
          recommendation: "Review change justifications with administrators. Implement change freeze and audit recent activity.",
          action: "Audit Changes",
          metrics: {
            riskScore: 7,
            confidenceLevel: 85,
          },
          timestamp: now.toISOString(),
        });
      }

      // Sudden privilege expansion
      const latestChange = member.roleChangeHistory[member.roleChangeHistory.length - 1];
      if (latestChange) {
        const prevRiskScore = latestChange.previousRoles.reduce(
          (sum, roleId) => sum + (ROLE_RISK_WEIGHTS[roleId] || 0), 0
        );
        const newRiskScore = latestChange.newRoles.reduce(
          (sum, roleId) => sum + (ROLE_RISK_WEIGHTS[roleId] || 0), 0
        );

        if (newRiskScore - prevRiskScore >= 5) {
          insights.push({
            id: `privilege-escalation-${member.id}`,
            category: "role-change",
            severity: "critical",
            title: "⬆️ Sudden Privilege Escalation",
            description: `${member.name}'s permission level jumped from ${prevRiskScore} to ${newRiskScore}. Changed by: ${latestChange.changedBy}.`,
            staffId: member.id,
            staffName: member.name,
            recommendation: "Verify legitimacy with approving authority. If unauthorized, immediately revert changes and investigate.",
            action: "Emergency Review",
            metrics: {
              riskScore: 9,
              confidenceLevel: 95,
            },
            timestamp: now.toISOString(),
          });
        }
      }
    }
  });

  // =========================================================================
  // 8. COMMUNICATION CHANNEL EFFECTIVENESS
  // =========================================================================
  
  if (confirmationStats) {
    const total = confirmationStats.sms + confirmationStats.whatsapp + 
                  confirmationStats.email + confirmationStats.arattai;
    
    if (total > 0) {
      const channelData = [
        { name: "SMS", count: confirmationStats.sms },
        { name: "WhatsApp", count: confirmationStats.whatsapp },
        { name: "Email", count: confirmationStats.email },
        { name: "Arattai", count: confirmationStats.arattai },
      ].sort((a, b) => b.count - a.count);

      const mostEffective = channelData[0];
      const leastEffective = channelData[channelData.length - 1];

      insights.push({
        id: "channel-effectiveness",
        category: "communication",
        severity: "info",
        title: "📊 Channel Effectiveness Analysis",
        description: `${mostEffective.name} is most effective (${((mostEffective.count/total)*100).toFixed(0)}% confirmations). ${leastEffective.name} is least effective (${((leastEffective.count/total)*100).toFixed(0)}%).`,
        recommendation: `Prioritize ${mostEffective.name} for time-sensitive confirmations. Consider phasing out ${leastEffective.name} if consistently underperforming.`,
        action: "Optimize Channels",
        metrics: {
          riskScore: 1,
          confidenceLevel: 88,
          potentialSavings: 10,
        },
        timestamp: now.toISOString(),
      });

      // Reminder frequency optimization
      const pendingStaff = staff.filter(s => s.confirmationStatus === "pending");
      if (pendingStaff.length > 0) {
        insights.push({
          id: "reminder-optimization",
          category: "communication",
          severity: "medium",
          title: "🔔 Reminder Frequency Optimization",
          description: `${pendingStaff.length} staff pending confirmation. AI suggests adaptive reminder schedule based on user behavior.`,
          recommendation: "Implement smart reminder system: Day 1 (SMS), Day 3 (WhatsApp), Day 7 (Email + SMS), Day 14 (Escalate).",
          action: "Enable Smart Reminders",
          metrics: {
            riskScore: 4,
            confidenceLevel: 80,
            affectedStaff: pendingStaff.length,
          },
          timestamp: now.toISOString(),
        });
      }
    }
  }

  // =========================================================================
  // SORT BY SEVERITY
  // =========================================================================
  
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  insights.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return insights;
};

// --- UI COMPONENT -----------------------------------------------------------
export const AdvancedAIInsightsPanel = ({ 
  staff, 
  confirmationStats 
}: { 
  staff: StaffMember[];
  confirmationStats?: { sms: number; whatsapp: number; email: number; arattai: number };
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const insights = useMemo(
    () => generateAdvancedAIInsights(staff, confirmationStats),
    [staff, confirmationStats]
  );

  const categories = [
    { id: "conflict", label: "Conflicts", icon: AlertTriangle, color: "red" },
    { id: "inactive", label: "Inactive", icon: UserX, color: "amber" },
    { id: "access-anomaly", label: "Access", icon: Eye, color: "rose" },
    { id: "optimization", label: "Optimize", icon: Target, color: "blue" },
    { id: "over-permission", label: "Permissions", icon: Lock, color: "orange" },
    { id: "multi-role", label: "Multi-Role", icon: Users, color: "purple" },
    { id: "role-change", label: "Changes", icon: RefreshCw, color: "indigo" },
    { id: "communication", label: "Channels", icon: MessageSquare, color: "teal" },
  ];

  const filteredInsights = selectedCategory
    ? insights.filter(i => i.category === selectedCategory)
    : insights;

  const severityConfig = {
    critical: { color: "rose", icon: XCircle, bg: "bg-rose-50", border: "border-rose-300", text: "text-rose-900" },
    high: { color: "orange", icon: AlertTriangle, bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-900" },
    medium: { color: "amber", icon: AlertCircle, bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-900" },
    low: { color: "blue", icon: Info, bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-900" },
    info: { color: "emerald", icon: CheckCircle, bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-900" },
  };

  const getCategoryCount = (categoryId: string) => 
    insights.filter(i => i.category === categoryId).length;

  const criticalCount = insights.filter(i => i.severity === "critical").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Advanced AI Insights</h3>
            <p className="text-xs text-slate-600">Expert-grade detection & optimization</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              autoRefresh
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${autoRefresh ? "animate-spin" : ""}`} />
            Auto
          </button>
          {criticalCount > 0 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-100 border border-rose-300">
              <AlertTriangle className="w-3 h-3 text-rose-700" />
              <span className="text-xs font-bold text-rose-900">{criticalCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            selectedCategory === null
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          All ({insights.length})
        </button>
        {categories.map(({ id, label, icon: Icon, color }) => {
          const count = getCategoryCount(id);
          if (count === 0) return null;

          return (
            <button
              key={id}
              onClick={() => setSelectedCategory(selectedCategory === id ? null : id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === id
                  ? `bg-${color}-500 text-white`
                  : `bg-${color}-50 text-${color}-700 hover:bg-${color}-100`
              }`}
            >
              <Icon className="w-3 h-3" />
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Insights List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        <AnimatePresence>
          {filteredInsights.map((insight) => {
            const config = severityConfig[insight.severity];
            const Icon = config.icon;

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl border-2 ${config.bg} ${config.border}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-${config.color}-400 to-${config.color}-600 flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm ${config.text}`}>
                          {insight.title}
                        </h4>
                        {insight.staffName && (
                          <p className="text-xs text-slate-600 mt-0.5">
                            Staff: {insight.staffName} ({insight.staffId})
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${config.bg} ${config.text}`}>
                          {insight.severity}
                        </span>
                        {insight.metrics?.riskScore && (
                          <span className="text-xs font-mono text-slate-600">
                            Risk: {insight.metrics.riskScore}/10
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 mb-3">{insight.description}</p>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 mb-3">
                      <p className="text-xs font-medium text-slate-700 mb-1">
                        💡 Recommendation:
                      </p>
                      <p className="text-xs text-slate-600">{insight.recommendation}</p>
                    </div>

                    {insight.metrics && (
                      <div className="flex flex-wrap gap-3 mb-3 text-xs">
                        {insight.metrics.confidenceLevel && (
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-600">
                              Confidence: {insight.metrics.confidenceLevel}%
                            </span>
                          </div>
                        )}
                        {insight.metrics.affectedStaff && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-600">
                              Affected: {insight.metrics.affectedStaff} staff
                            </span>
                          </div>
                        )}
                        {insight.metrics.potentialSavings && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600">
                              Savings: {insight.metrics.potentialSavings}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button className="flex-1 h-9 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                        {insight.action}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button className="h-9 px-4 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredInsights.length === 0 && (
          <div className="py-12 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="font-semibold text-slate-900">All Clear!</h4>
            <p className="text-sm text-slate-600 mt-1">
              {selectedCategory 
                ? "No insights in this category"
                : "No issues detected across all categories"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAIInsightsPanel;
