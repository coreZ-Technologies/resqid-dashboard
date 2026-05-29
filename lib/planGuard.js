// =============================================================================
// lib/plan-utils.js — RESQID
// Single source of truth for plan → module access.
// Must match backend PLAN_IDS + PLAN_MODULES exactly.
// =============================================================================

export const PLANS = {
  // ── Single Modules ──────────────────────────────────────────────────────────
  module_emergency: {
    name: "Emergency ID",
    modules: ["emergency"],
  },
  module_attendance: {
    name: "Smart Attendance",
    modules: ["attendance"],
  },
  module_timetable: {
    name: "Timetable",
    modules: ["timetable"],
  },
  module_parent_communication: {
    name: "Parent Communication",
    modules: ["parent_communication"],
  },

  // ── Bundles ─────────────────────────────────────────────────────────────────
  bundle_safety: {
    name: "Safety Bundle",
    modules: ["emergency", "attendance"],
  },
  bundle_ops: {
    name: "Operations Bundle",
    modules: ["attendance", "timetable"],
  },
  bundle_connect: {
    name: "Connect Bundle",
    modules: ["attendance", "parent_communication"],
  },

  // ── Complete ────────────────────────────────────────────────────────────────
  resqid_complete: {
    name: "RESQID Complete",
    modules: ["emergency", "attendance", "timetable", "parent_communication"],
  },

  // ── Legacy (keep for backward compatibility) ────────────────────────────────
  basic: {
    name: "Basic",
    modules: ["emergency"],
  },
  starter: {
    name: "Starter",
    modules: ["emergency", "attendance"],
  },
  standard: {
    name: "Standard",
    modules: ["emergency", "attendance", "timetable"],
  },
  growth: {
    name: "Growth",
    modules: ["emergency", "attendance", "timetable", "parent_communication"],
  },
  professional: {
    name: "Professional",
    modules: ["emergency", "attendance", "timetable", "parent_communication"],
  },
  enterprise: {
    name: "Enterprise",
    modules: ["emergency", "attendance", "timetable", "parent_communication"],
  },
};

/**
 * Check if a plan includes a given module.
 * @param {string} planId  - e.g. 'bundle_safety'
 * @param {string} moduleId - e.g. 'timetable'
 * @returns {boolean}
 */
export function isModuleAllowed(planId, moduleId) {
  if (!moduleId) return true; // No module requirement = always allowed
  const plan = PLANS[planId];
  if (!plan) return false;
  return plan.modules.includes(moduleId);
}

/**
 * Get all allowed module IDs for a plan.
 * @param {string} planId
 * @returns {string[]}
 */
export function getAllowedModules(planId) {
  return PLANS[planId]?.modules ?? [];
}

/**
 * Get plan display name.
 * @param {string} planId
 * @returns {string}
 */
export function getPlanName(planId) {
  return PLANS[planId]?.name ?? "Unknown";
}
