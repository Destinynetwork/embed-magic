// Lightweight auth event logger
export function logAuthEvent(
  eventType: string,
  userId?: string | null,
  metadata?: Record<string, unknown>
) {
  console.log(`[AuthLogger] ${eventType}`, { userId, ...metadata });
}
