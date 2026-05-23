import { PLANS } from './constants'

/**
 * Check if a school's plan includes a given module
 * @param {string} planId - e.g. 'basic'
 * @param {string} moduleId - e.g. 'attendance'
 * @returns {boolean}
 */
export function isModuleAllowed(planId, moduleId) {
  const plan = PLANS[planId]
  if (!plan) return false
  return plan.modules.includes(moduleId)
}

/**
 * Get all allowed modules for a plan
 * @param {string} planId
 * @returns {string[]}
 */
export function getAllowedModules(planId) {
  return PLANS[planId]?.modules ?? []
}

/**
 * Get plan display name
 * @param {string} planId
 * @returns {string}
 */
export function getPlanName(planId) {
  return PLANS[planId]?.name ?? 'Unknown'
}
