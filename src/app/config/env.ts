// ==========================================
// Environment Configuration
// Browser-safe environment variable access
// ==========================================

/**
 * Get environment variable with fallback
 * Works in both Vite and browser environments
 */
function getEnv(key: string, fallback: string = ''): string {
  // Try Vite environment variables (import.meta.env)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const viteKey = `VITE_${key}`;
    const value = import.meta.env[viteKey];
    if (value !== undefined) return String(value);
  }

  // Try window globals (for runtime config)
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    const value = (window as any).__ENV__[key];
    if (value !== undefined) return String(value);
  }

  // Return fallback
  return fallback;
}

// ==========================================
// Configuration Object
// ==========================================

export const config = {
  // API Configuration
  apiUrl: getEnv('API_URL', '/api'),
  apiTimeout: parseInt(getEnv('API_TIMEOUT', '30000'), 10),

  // Feature Flags
  enableAI: getEnv('ENABLE_AI', 'true') === 'true',
  enableSupabase: getEnv('ENABLE_SUPABASE', 'false') === 'true',

  // Environment Info
  isDevelopment: getEnv('MODE', 'development') === 'development',
  isProduction: getEnv('MODE', 'development') === 'production',

  // Application Settings
  appName: 'TRADIE',
  appVersion: '4.0.0',

  // OTP Settings
  otpExpiryMinutes: 5,
  otpMaxAttempts: 3,

  // Payment Settings
  maxFileUploadSize: 5 * 1024 * 1024, // 5MB

  // Overdue Thresholds
  overdueWarningDays: 1,
  overdueSevereDays: 7,

  // AI Score Thresholds
  aiVerifiedThreshold: 90,
  aiSuspiciousThreshold: 70,
  aiHighRiskThreshold: 50,

  // Modification Warning
  modificationWarningCount: 3, // 3+ modifications in 30 days triggers flag
} as const;

// ==========================================
// Type-safe config access
// ==========================================

export type Config = typeof config;

// ==========================================
// Development helper
// ==========================================

if (config.isDevelopment) {
  console.log('📝 TRADIE Configuration:', {
    apiUrl: config.apiUrl,
    enableAI: config.enableAI,
    enableSupabase: config.enableSupabase,
    version: config.appVersion,
  });
}

export default config;
