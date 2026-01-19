/**
 * Server-Side Rate Limit Utility
 * 
 * Client-side utility to check rate limits via the API route.
 * Implements fail-open strategy for resilience.
 */

/** Response structure from rate limit API */
export interface RateLimitResponse {
  allowed: boolean;
  resetIn?: number;
  message?: string;
}

/**
 * Checks server-side rate limit for an action
 * 
 * @param action - Action type to check ("whatsapp" | "contact")
 * @returns Promise with rate limit response
 * 
 * @example
 * const result = await checkServerRateLimit("whatsapp");
 * if (!result.allowed) {
 *   console.log(`Rate limited. Try again in ${result.resetIn}ms`);
 * }
 */
export async function checkServerRateLimit(
  action: "whatsapp" | "contact"
): Promise<RateLimitResponse> {
  try {
    const response = await fetch("/api/rate-limit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action }),
    });

    const data = await response.json();

    // Handle rate limit exceeded (429)
    if (response.status === 429) {
      return {
        allowed: false,
        resetIn: data.resetIn,
        message: data.message,
      };
    }

    // Handle successful response
    if (response.ok) {
      return {
        allowed: data.allowed,
      };
    }

    // Handle other errors - fail open
    console.warn("Rate limit check failed, allowing action:", data);
    return { allowed: true };
  } catch (error) {
    // Network or other errors - fail open (allow the action)
    console.warn("Rate limit check error, allowing action:", error);
    return { allowed: true };
  }
}
