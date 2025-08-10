/**
 * Generates a timestamp-based unique ID
 */
export function generateTimestampId(prefix?: string): string {
  const timestamp = Date.now();
  return prefix ? `${prefix}-${timestamp}` : timestamp.toString();
}

/**
 * Generates a unique name with timestamp suffix
 */
export function generateTimestampName(baseName: string): string {
  return `${baseName}-${Date.now()}`;
}
