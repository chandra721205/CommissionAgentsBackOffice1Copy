import React, { useMemo } from "react";
import { AlertTriangle, CheckCircle, Clock, Shield, TrendingUp, Users, Activity, MessageSquare } from "lucide-react";

// ============================================================================
// STAFF AI INSIGHTS ENGINE
// Comprehensive detection system for role assignment and permission anomalies
// ============================================================================

export interface StaffMember {
  id: string;
  name: string;
  roles: string[];
  permissions: {
    view: boolean;
    edit: boolean;
    suggest: boolean;
    rectify: boolean;
  };
  assignedDate: string;
  status: "active" | "inactive" | "pending";
  confirmationStatus: "confirmed" | "pending";
  lastLoginDate?: string;
  accessLogs?: Array<{
    timestamp: string;
    action: string;
    authorized: boolean;
  }>;
  roleChangeHistory?: Array<{
    date: string;
    from: string[];
    to: string[];
    reason: string;
  }>;
  village: string;
  riskRanking: number;
}

export interface ConfirmationStats {
  sentDate: string;
  channels: string[];
  responseTime?: number; // in hours
  confirmed: boolean;
}

export interface AIInsight {
  id: string;
  category: "role-conflict" | "excess-privilege" | "unconfirmed-role" | "dormant-staff" | "access-anomaly" | "frequent-changes" | "distribution" | "communication";
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  affectedStaff: string[];
  riskScore: number; // 1-10
  recommendation: string;
  confidence: number; // 0-100%
  detectedAt: string;
}

// ============================================================================
// ROLE CONFLICT DETECTION
// ============================================================================

const CONFLICTING_ROLE_PAIRS = [
  {
    role1: "security-watchman",
    role2: "inventory-organizer",
    reason: "Security monitoring conflicts with inventory access",
    riskLevel: 8,
  },
  {
    role1: "security-watchman",
    role2: "manager",
    reason: "Security should not have management override powers",
    riskLevel: 9,
  },
  {
    role1: "unskilled-labor",
    role2: "manager",
    reason: "Labor role conflicts with management responsibilities",
    riskLevel: 10,
  },
  {
    role1: "salesman",
    role2: "quality-verifier",
    reason: "Sales conflict of interest with quality verification",
    riskLevel: 7,
  },
  {
    role1: "transport-organizer",
    role2: "sample-mover",
    reason: "Payment approver should not be executor (segregation of duties)",
    riskLevel: 6,
  },
];

const COMPLEMENTARY_ROLE_PAIRS = [
  {
    role1: "inventory-organizer",
    role2: "sample-mover",
    benefit: "Optimizes arrival-to-dispatch workflow",
    efficiencyGain: 15,
  },
  {
    role1: "quality-verifier",
    role2: "sample-mover",
    benefit: "Streamlines sampling and verification",
    efficiencyGain: 12,
  },
];

function detectRoleConflicts(staff: StaffMember[]): AIInsight[] {
  const insights: AIInsight[] = [];

  staff.forEach(member => {
    // Check for conflicting roles
    for (const conflict of CONFLICTING_ROLE_PAIRS) {
      if (member.roles.includes(conflict.role1) && member.roles.includes(conflict.role2)) {
        insights.push({
          id: `role-conflict-${member.id}`,
          category: "role-conflict",
          severity: conflict.riskLevel >= 9 ? "critical" : conflict.riskLevel >= 7 ? "high" : "medium",
          title: `Critical Role Conflict Detected`,
          description: `${member.name} has conflicting roles: ${conflict.role1} + ${conflict.role2}. ${conflict.reason}`,
          affectedStaff: [member.id],
          riskScore: conflict.riskLevel,
          recommendation: `Immediate role separation required. Remove one of the conflicting roles and reassign.`,
          confidence: 95,
          detectedAt: new Date().toISOString(),
        });
      }
    }

    // Check for redundant/excessive roles (>3)
    if (member.roles.length > 3) {
      const totalRisk = member.roles.length * 2; // Risk increases with role count
      insights.push({
        id: `excess-roles-${member.id}`,
        category: "role-conflict",
        severity: member.roles.length > 4 ? "high" : "medium",
        title: `Excessive Role Assignment (${member.roles.length} roles)`,
        description: `${member.name} assigned ${member.roles.length} roles, increasing operational complexity and potential conflicts.`,
        affectedStaff: [member.id],
        riskScore: Math.min(totalRisk, 10),
        recommendation: `Review necessity of all roles. Consider splitting responsibilities across multiple staff members.`,
        confidence: 88,
        detectedAt: new Date().toISOString(),
      });
    }

    // Check for optimal complementary pairs
    for (const pair of COMPLEMENTARY_ROLE_PAIRS) {
      if (member.roles.includes(pair.role1) && member.roles.includes(pair.role2)) {
        insights.push({
          id: `optimal-pair-${member.id}`,
          category: "role-conflict",
          severity: "info",
          title: `Optimal Role Combination Detected`,
          description: `${member.name} has complementary roles: ${pair.role1} + ${pair.role2}. ${pair.benefit} (Efficiency: +${pair.efficiencyGain}%)`,
          affectedStaff: [member.id],
          riskScore: 2,
          recommendation: `Maintain current assignment. Consider cross-training other staff for similar pairings.`,
          confidence: 92,
          detectedAt: new Date().toISOString(),
        });
      }
    }
  });

  return insights;
}

// ============================================================================
// EXCESS PRIVILEGE DETECTION
// ============================================================================

const HIGH_RISK_ROLES = [
  "manager",
  "inventory-organizer",
  "quality-verifier",
  "salesman",
];

const ROLE_RISK_SCORES: Record<string, number> = {
  "manager": 8,
  "inventory-organizer": 7,
  "quality-verifier": 6,
  "salesman": 5,
  "transport-organizer": 5,
  "sample-mover": 4,
  "custom": 3,
  "security-watchman": 2,
  "unskilled-labor": 1,
};

function detectExcessPrivileges(staff: StaffMember[]): AIInsight[] {
  const insights: AIInsight[] = [];

  staff.forEach(member => {
    // Calculate total risk score
    const totalRisk = member.roles.reduce((sum, roleId) => {
      return sum + (ROLE_RISK_SCORES[roleId] || 0);
    }, 0);

    // Flag if combined risk exceeds threshold
    if (totalRisk > 15) {
      insights.push({
        id: `excess-privilege-${member.id}`,
        category: "excess-privilege",
        severity: totalRisk > 20 ? "critical" : "high",
        title: `Excessive Privilege Level Detected`,
        description: `${member.name} has combined risk score of ${totalRisk}/10 (threshold: 15). Multiple high-risk roles assigned.`,
        affectedStaff: [member.id],
        riskScore: Math.min(Math.floor(totalRisk / 2), 10),
        recommendation: `Apply principle of least privilege. Segment roles across multiple staff or remove non-essential high-risk roles.`,
        confidence: 93,
        detectedAt: new Date().toISOString(),
      });
    }

    // Check for unnecessary permissions
    if (member.permissions.rectify && !member.roles.includes("manager")) {
      insights.push({
        id: `unnecessary-rectify-${member.id}`,
        category: "excess-privilege",
        severity: "medium",
        title: `Rectify Permission Without Manager Role`,
        description: `${member.name} has 'Rectify' permission but is not a Manager. This permission should be restricted.`,
        affectedStaff: [member.id],
        riskScore: 6,
        recommendation: `Remove 'Rectify' permission or elevate to Manager role with 2FA.`,
        confidence: 90,
        detectedAt: new Date().toISOString(),
      });
    }

    // Flag if too many high-risk roles
    const highRiskCount = member.roles.filter(r => HIGH_RISK_ROLES.includes(r)).length;
    if (highRiskCount >= 3) {
      insights.push({
        id: `multi-high-risk-${member.id}`,
        category: "excess-privilege",
        severity: "high",
        title: `Multiple High-Risk Roles (${highRiskCount})`,
        description: `${member.name} holds ${highRiskCount} high-risk roles simultaneously, increasing fraud and abuse potential.`,
        affectedStaff: [member.id],
        riskScore: 8,
        recommendation: `Immediate segregation of duties required. Distribute high-risk roles across different staff members.`,
        confidence: 95,
        detectedAt: new Date().toISOString(),
      });
    }
  });

  return insights;
}

// ============================================================================
// UNCONFIRMED ROLE DETECTION
// ============================================================================

function detectUnconfirmedRoles(
  staff: StaffMember[],
  confirmationStats: Map<string, ConfirmationStats>
): AIInsight[] {
  const insights: AIInsight[] = [];
  const now = new Date();

  staff.forEach(member => {
    if (member.confirmationStatus === "pending") {
      const stats = confirmationStats.get(member.id);
      if (stats) {
        const sentDate = new Date(stats.sentDate);
        const hoursSinceSent = (now.getTime() - sentDate.getTime()) / (1000 * 60 * 60);

        let severity: "critical" | "high" | "medium" | "low" = "low";
        let recommendation = "";

        if (hoursSinceSent > 168) { // 7 days
          severity = "critical";
          recommendation = "Escalate to admin. Consider role deactivation or resend with phone call follow-up.";
        } else if (hoursSinceSent > 72) { // 3 days
          severity = "high";
          recommendation = "Send urgent reminder via all channels. Contact staff directly.";
        } else if (hoursSinceSent > 24) { // 1 day
          severity = "medium";
          recommendation = "Resend confirmation link via preferred channel.";
        } else {
          severity = "low";
          recommendation = "Monitor. Standard confirmation time is 24 hours.";
        }

        insights.push({
          id: `unconfirmed-${member.id}`,
          category: "unconfirmed-role",
          severity,
          title: `Role Confirmation Pending (${Math.floor(hoursSinceSent)}h)`,
          description: `${member.name} has not confirmed assigned roles via ${stats.channels.join(", ")}. Assignment risk until confirmed.`,
          affectedStaff: [member.id],
          riskScore: Math.min(Math.floor(hoursSinceSent / 24) + 3, 10),
          recommendation,
          confidence: 97,
          detectedAt: new Date().toISOString(),
        });
      }
    }

    // Check for inactive staff with critical roles
    if (member.status === "inactive" && member.roles.some(r => HIGH_RISK_ROLES.includes(r))) {
      insights.push({
        id: `inactive-critical-${member.id}`,
        category: "unconfirmed-role",
        severity: "critical",
        title: `Inactive Staff Holding Critical Roles`,
        description: `${member.name} is marked inactive but still holds critical roles: ${member.roles.filter(r => HIGH_RISK_ROLES.includes(r)).join(", ")}`,
        affectedStaff: [member.id],
        riskScore: 9,
        recommendation: `Immediate role revocation required. Reassign critical roles to active staff.`,
        confidence: 100,
        detectedAt: new Date().toISOString(),
      });
    }
  });

  return insights;
}

// ============================================================================
// DORMANT STAFF MONITORING
// ============================================================================

function detectDormantStaff(staff: StaffMember[]): AIInsight[] {
  const insights: AIInsight[] = [];
  const now = new Date();

  staff.forEach(member => {
    if (member.status === "active" && member.lastLoginDate) {
      const lastLogin = new Date(member.lastLoginDate);
      const daysSinceLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceLogin > 30) {
        const hasCriticalRoles = member.roles.some(r => HIGH_RISK_ROLES.includes(r));
        
        insights.push({
          id: `dormant-${member.id}`,
          category: "dormant-staff",
          severity: hasCriticalRoles ? "high" : daysSinceLogin > 60 ? "medium" : "low",
          title: `Dormant Staff Account (${Math.floor(daysSinceLogin)} days)`,
          description: `${member.name} has not logged in for ${Math.floor(daysSinceLogin)} days but account remains active${hasCriticalRoles ? " with critical role access" : ""}.`,
          affectedStaff: [member.id],
          riskScore: hasCriticalRoles ? 8 : Math.min(Math.floor(daysSinceLogin / 10), 6),
          recommendation: hasCriticalRoles 
            ? `Immediate review required. Deactivate roles or confirm staff status.`
            : `Contact staff to verify status. Consider temporary deactivation.`,
          confidence: 94,
          detectedAt: new Date().toISOString(),
        });
      }
    }

    // Check for never-logged-in staff (assigned >7 days ago)
    if (member.status === "active" && !member.lastLoginDate && member.confirmationStatus === "confirmed") {
      const assignedDate = new Date(member.assignedDate);
      const daysSinceAssignment = (now.getTime() - assignedDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceAssignment > 7) {
        insights.push({
          id: `never-logged-${member.id}`,
          category: "dormant-staff",
          severity: "medium",
          title: `Staff Never Accessed System`,
          description: `${member.name} confirmed roles ${Math.floor(daysSinceAssignment)} days ago but has never logged in.`,
          affectedStaff: [member.id],
          riskScore: 5,
          recommendation: `Verify staff training completion. Provide login assistance or consider role reassignment.`,
          confidence: 90,
          detectedAt: new Date().toISOString(),
        });
      }
    }
  });

  return insights;
}

// ============================================================================
// ACCESS BEHAVIOR ANOMALIES
// ============================================================================

function detectAccessAnomalies(staff: StaffMember[]): AIInsight[] {
  const insights: AIInsight[] = [];

  staff.forEach(member => {
    if (!member.accessLogs || member.accessLogs.length === 0) return;

    // Detect unusual access times (outside 6 AM - 8 PM)
    const unusualTimeAccess = member.accessLogs.filter(log => {
      const hour = new Date(log.timestamp).getHours();
      return hour < 6 || hour > 20;
    });

    if (unusualTimeAccess.length > 5) {
      insights.push({
        id: `unusual-time-${member.id}`,
        category: "access-anomaly",
        severity: "high",
        title: `Unusual Access Time Pattern`,
        description: `${member.name} accessed system ${unusualTimeAccess.length} times outside normal hours (6 AM - 8 PM).`,
        affectedStaff: [member.id],
        riskScore: 7,
        recommendation: `Audit access logs. Verify if legitimate business need or investigate potential unauthorized access.`,
        confidence: 88,
        detectedAt: new Date().toISOString(),
      });
    }

    // Detect unauthorized action attempts
    const unauthorizedAttempts = member.accessLogs.filter(log => !log.authorized);
    if (unauthorizedAttempts.length > 10) {
      insights.push({
        id: `unauthorized-attempts-${member.id}`,
        category: "access-anomaly",
        severity: "critical",
        title: `Excessive Unauthorized Access Attempts`,
        description: `${member.name} has ${unauthorizedAttempts.length} denied access attempts, suggesting potential role scope violation.`,
        affectedStaff: [member.id],
        riskScore: 9,
        recommendation: `Immediate security audit required. Review role permissions and provide training on authorized actions.`,
        confidence: 96,
        detectedAt: new Date().toISOString(),
      });
    }

    // Detect suspicious activity patterns (high volume in short time)
    const recentLogs = member.accessLogs.filter(log => {
      const logTime = new Date(log.timestamp);
      const now = new Date();
      const hoursDiff = (now.getTime() - logTime.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 1;
    });

    if (recentLogs.length > 50) {
      insights.push({
        id: `high-volume-${member.id}`,
        category: "access-anomaly",
        severity: "medium",
        title: `Suspicious High-Volume Activity`,
        description: `${member.name} performed ${recentLogs.length} actions in the last hour, suggesting automated access or data scraping.`,
        affectedStaff: [member.id],
        riskScore: 6,
        recommendation: `Monitor closely. Verify if legitimate bulk operation or investigate for bot activity.`,
        confidence: 82,
        detectedAt: new Date().toISOString(),
      });
    }
  });

  return insights;
}

// ============================================================================
// FREQUENT ROLE CHANGES
// ============================================================================

function detectFrequentRoleChanges(staff: StaffMember[]): AIInsight[] {
  const insights: AIInsight[] = [];

  staff.forEach(member => {
    if (!member.roleChangeHistory || member.roleChangeHistory.length === 0) return;

    // Check for changes in last 30 days
    const recentChanges = member.roleChangeHistory.filter(change => {
      const changeDate = new Date(change.date);
      const now = new Date();
      const daysDiff = (now.getTime() - changeDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    });

    if (recentChanges.length >= 3) {
      insights.push({
        id: `frequent-changes-${member.id}`,
        category: "frequent-changes",
        severity: recentChanges.length >= 5 ? "high" : "medium",
        title: `Frequent Role Changes (${recentChanges.length} in 30 days)`,
        description: `${member.name} has undergone ${recentChanges.length} role changes in the last month, suggesting instability or security concern.`,
        affectedStaff: [member.id],
        riskScore: Math.min(recentChanges.length + 4, 10),
        recommendation: `Review change justifications. Consider role freeze until stable assignment identified.`,
        confidence: 91,
        detectedAt: new Date().toISOString(),
      });
    }

    // Detect privilege escalation pattern
    const lastChange = recentChanges[recentChanges.length - 1];
    if (lastChange) {
      const fromRisk = lastChange.from.reduce((sum, r) => sum + (ROLE_RISK_SCORES[r] || 0), 0);
      const toRisk = lastChange.to.reduce((sum, r) => sum + (ROLE_RISK_SCORES[r] || 0), 0);

      if (toRisk > fromRisk + 5) {
        insights.push({
          id: `privilege-escalation-${member.id}`,
          category: "frequent-changes",
          severity: "high",
          title: `Sudden Privilege Escalation Detected`,
          description: `${member.name}'s role risk jumped from ${fromRisk} to ${toRisk} in recent change. Reason: ${lastChange.reason}`,
          affectedStaff: [member.id],
          riskScore: 8,
          recommendation: `Verify authorization for privilege escalation. Ensure proper approval and 2FA enforcement.`,
          confidence: 94,
          detectedAt: new Date().toISOString(),
        });
      }
    }
  });

  return insights;
}

// ============================================================================
// ROLE DISTRIBUTION OPTIMIZATION
// ============================================================================

function detectRoleDistribution(staff: StaffMember[]): AIInsight[] {
  const insights: AIInsight[] = [];

  // Count role distribution
  const roleCount: Record<string, number> = {};
  const activeStaff = staff.filter(s => s.status === "active");

  activeStaff.forEach(member => {
    member.roles.forEach(roleId => {
      roleCount[roleId] = (roleCount[roleId] || 0) + 1;
    });
  });

  // Check for over-concentration (>40% of staff in one role)
  Object.entries(roleCount).forEach(([roleId, count]) => {
    const percentage = (count / activeStaff.length) * 100;

    if (percentage > 40) {
      insights.push({
        id: `over-concentration-${roleId}`,
        category: "distribution",
        severity: "medium",
        title: `Role Over-Concentration (${Math.round(percentage)}%)`,
        description: `${count} of ${activeStaff.length} staff (${Math.round(percentage)}%) assigned '${roleId}' role. Risk of single-point failure.`,
        affectedStaff: activeStaff.filter(s => s.roles.includes(roleId)).map(s => s.id),
        riskScore: 6,
        recommendation: `Diversify role distribution. Cross-train staff for other critical roles.`,
        confidence: 89,
        detectedAt: new Date().toISOString(),
      });
    }

    // Check for under-coverage (critical roles with <2 staff)
    if (HIGH_RISK_ROLES.includes(roleId) && count < 2) {
      insights.push({
        id: `under-coverage-${roleId}`,
        category: "distribution",
        severity: "high",
        title: `Critical Role Under-Coverage`,
        description: `Only ${count} staff member assigned to critical role '${roleId}'. No backup in case of absence.`,
        affectedStaff: activeStaff.filter(s => s.roles.includes(roleId)).map(s => s.id),
        riskScore: 7,
        recommendation: `Hire or train additional staff for this critical role to ensure operational continuity.`,
        confidence: 96,
        detectedAt: new Date().toISOString(),
      });
    }
  });

  // Check for single-role staff (potential for optimization)
  const singleRoleStaff = activeStaff.filter(s => s.roles.length === 1);
  if (singleRoleStaff.length > activeStaff.length * 0.5) {
    insights.push({
      id: `cross-training-opportunity`,
      category: "distribution",
      severity: "info",
      title: `Cross-Training Opportunity`,
      description: `${singleRoleStaff.length} staff have only one role assigned. Potential for cross-training to improve flexibility.`,
      affectedStaff: singleRoleStaff.map(s => s.id),
      riskScore: 3,
      recommendation: `Identify complementary role pairs and launch cross-training program. Potential cost savings: 15-25%.`,
      confidence: 85,
      detectedAt: new Date().toISOString(),
    });
  }

  return insights;
}

// ============================================================================
// COMMUNICATION CHANNEL EFFECTIVENESS
// ============================================================================

function detectCommunicationEffectiveness(
  staff: StaffMember[],
  confirmationStats: Map<string, ConfirmationStats>
): AIInsight[] {
  const insights: AIInsight[] = [];

  // Analyze channel performance
  const channelStats: Record<string, { total: number; confirmed: number; avgResponseTime: number }> = {};

  staff.forEach(member => {
    const stats = confirmationStats.get(member.id);
    if (stats) {
      stats.channels.forEach(channel => {
        if (!channelStats[channel]) {
          channelStats[channel] = { total: 0, confirmed: 0, avgResponseTime: 0 };
        }
        channelStats[channel].total++;
        if (stats.confirmed) {
          channelStats[channel].confirmed++;
          if (stats.responseTime) {
            channelStats[channel].avgResponseTime += stats.responseTime;
          }
        }
      });
    }
  });

  // Calculate averages
  Object.entries(channelStats).forEach(([channel, stats]) => {
    if (stats.confirmed > 0) {
      stats.avgResponseTime = stats.avgResponseTime / stats.confirmed;
    }
  });

  // Find best and worst channels
  const channelPerformance = Object.entries(channelStats).map(([channel, stats]) => ({
    channel,
    confirmRate: stats.total > 0 ? (stats.confirmed / stats.total) * 100 : 0,
    avgResponseTime: stats.avgResponseTime,
  }));

  const bestChannel = channelPerformance.reduce((best, curr) => 
    curr.confirmRate > best.confirmRate ? curr : best
  , channelPerformance[0]);

  const worstChannel = channelPerformance.reduce((worst, curr) => 
    curr.confirmRate < worst.confirmRate ? curr : worst
  , channelPerformance[0]);

  if (channelPerformance.length > 0) {
    insights.push({
      id: `channel-analysis`,
      category: "communication",
      severity: "info",
      title: `Communication Channel Effectiveness Analysis`,
      description: `Best: ${bestChannel.channel} (${Math.round(bestChannel.confirmRate)}% confirm rate). Worst: ${worstChannel.channel} (${Math.round(worstChannel.confirmRate)}% confirm rate).`,
      affectedStaff: [],
      riskScore: 2,
      recommendation: `Prioritize ${bestChannel.channel} for critical confirmations. Consider deprecating ${worstChannel.channel} if consistently low.`,
      confidence: 87,
      detectedAt: new Date().toISOString(),
    });
  }

  // Detect staff with failed confirmations across all channels
  const multiChannelFailures = staff.filter(member => {
    const stats = confirmationStats.get(member.id);
    return stats && !stats.confirmed && stats.channels.length >= 3;
  });

  if (multiChannelFailures.length > 0) {
    insights.push({
      id: `multi-channel-failure`,
      category: "communication",
      severity: "medium",
      title: `Multi-Channel Confirmation Failures`,
      description: `${multiChannelFailures.length} staff failed to confirm via 3+ channels, suggesting contact info issues or staff disengagement.`,
      affectedStaff: multiChannelFailures.map(s => s.id),
      riskScore: 5,
      recommendation: `Direct phone call follow-up required. Verify contact information accuracy.`,
      confidence: 92,
      detectedAt: new Date().toISOString(),
    });
  }

  // Suggest optimal reminder schedule
  const pendingStaff = staff.filter(s => s.confirmationStatus === "pending");
  if (pendingStaff.length > 3) {
    insights.push({
      id: `reminder-schedule`,
      category: "communication",
      severity: "low",
      title: `Reminder Frequency Optimization`,
      description: `${pendingStaff.length} staff with pending confirmations. Adaptive reminder schedule recommended.`,
      affectedStaff: pendingStaff.map(s => s.id),
      riskScore: 3,
      recommendation: `Day 1: ${bestChannel.channel}, Day 3: Multi-channel, Day 7: Phone call + all channels.`,
      confidence: 84,
      detectedAt: new Date().toISOString(),
    });
  }

  return insights;
}

// ============================================================================
// MAIN AI INSIGHTS GENERATOR
// ============================================================================

export function generateComprehensiveAIInsights(
  staff: StaffMember[],
  confirmationStats: Map<string, ConfirmationStats>
): AIInsight[] {
  const allInsights: AIInsight[] = [];

  // Run all detection algorithms
  allInsights.push(...detectRoleConflicts(staff));
  allInsights.push(...detectExcessPrivileges(staff));
  allInsights.push(...detectUnconfirmedRoles(staff, confirmationStats));
  allInsights.push(...detectDormantStaff(staff));
  allInsights.push(...detectAccessAnomalies(staff));
  allInsights.push(...detectFrequentRoleChanges(staff));
  allInsights.push(...detectRoleDistribution(staff));
  allInsights.push(...detectCommunicationEffectiveness(staff, confirmationStats));

  // Sort by severity and risk score
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  allInsights.sort((a, b) => {
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) return severityDiff;
    return b.riskScore - a.riskScore;
  });

  return allInsights;
}

// ============================================================================
// INSIGHTS DISPLAY COMPONENT
// ============================================================================

interface AIInsightCardProps {
  insight: AIInsight;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight }) => {
  const severityColors = {
    critical: "bg-red-50 border-red-300 text-red-900",
    high: "bg-orange-50 border-orange-300 text-orange-900",
    medium: "bg-yellow-50 border-yellow-300 text-yellow-900",
    low: "bg-blue-50 border-blue-300 text-blue-900",
    info: "bg-purple-50 border-purple-300 text-purple-900",
  };

  const categoryIcons = {
    "role-conflict": <AlertTriangle className="w-5 h-5" />,
    "excess-privilege": <Shield className="w-5 h-5" />,
    "unconfirmed-role": <Clock className="w-5 h-5" />,
    "dormant-staff": <Users className="w-5 h-5" />,
    "access-anomaly": <Activity className="w-5 h-5" />,
    "frequent-changes": <TrendingUp className="w-5 h-5" />,
    "distribution": <CheckCircle className="w-5 h-5" />,
    "communication": <MessageSquare className="w-5 h-5" />,
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${severityColors[insight.severity]}`}>
      <div className="flex items-start gap-3 mb-2">
        <div className="flex-shrink-0">
          {categoryIcons[insight.category]}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase">
              {insight.category.replace("-", " ")}
            </span>
            <span className="text-xs font-bold">
              RISK: {insight.riskScore}/10
            </span>
          </div>
          <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
          <p className="text-xs mb-2">{insight.description}</p>
          <div className="flex items-center justify-between text-xs">
            <span>Confidence: {insight.confidence}%</span>
            {insight.affectedStaff.length > 0 && (
              <span>Affected: {insight.affectedStaff.length} staff</span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-300">
        <p className="text-xs font-medium">
          <strong>Action:</strong> {insight.recommendation}
        </p>
      </div>
    </div>
  );
};
