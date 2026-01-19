import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach, mock } from "node:test";
import { checkServerRateLimit } from "./rate-limit-server";

describe("Rate Limit Server", () => {
  let originalFetch: typeof global.fetch;
  let consoleWarnMock: ReturnType<typeof mock.fn>;

  beforeEach(() => {
    // Save original fetch
    originalFetch = global.fetch;
    
    // Mock console.warn
    consoleWarnMock = mock.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.console as any).warn = consoleWarnMock;
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
  });

  describe("checkServerRateLimit", () => {
    it("returns allowed: true when API returns 200", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.fetch = mock.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ allowed: true }),
      })) as any;

      const result = await checkServerRateLimit("whatsapp");

      assert.deepEqual(result, { allowed: true });
      assert.equal((global.fetch as ReturnType<typeof mock.fn>).mock.calls.length, 1);
      const call = (global.fetch as ReturnType<typeof mock.fn>).mock.calls[0];
      assert.equal(call.arguments[0], "/api/rate-limit");
      assert.deepEqual(call.arguments[1], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "whatsapp" }),
      });
    });

    it("returns allowed: false with resetIn when API returns 429", async () => {
      const mockResponse = {
        allowed: false,
        resetIn: 5000,
        message: "Rate limit exceeded. Try again in 5 seconds.",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.fetch = mock.fn(async () => ({
        ok: false,
        status: 429,
        json: async () => mockResponse,
      })) as any;

      const result = await checkServerRateLimit("contact");

      assert.deepEqual(result, {
        allowed: false,
        resetIn: 5000,
        message: "Rate limit exceeded. Try again in 5 seconds.",
      });
    });

    it("fails open (allows action) on API error response", async () => {
      const errorData = { error: "Something went wrong" };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.fetch = mock.fn(async () => ({
        ok: false,
        status: 500,
        json: async () => errorData,
      })) as any;

      const result = await checkServerRateLimit("whatsapp");

      assert.deepEqual(result, { allowed: true });
      assert.equal(consoleWarnMock.mock.calls.length, 1);
    });

    it("fails open (allows action) on network error", async () => {
      const networkError = new Error("Network failure");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.fetch = mock.fn(async () => {
        throw networkError;
      }) as any;

      const result = await checkServerRateLimit("contact");

      assert.deepEqual(result, { allowed: true });
      assert.equal(consoleWarnMock.mock.calls.length, 1);
    });

    it("fails open (allows action) on JSON parse error", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.fetch = mock.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      })) as any;

      const result = await checkServerRateLimit("whatsapp");

      assert.deepEqual(result, { allowed: true });
      assert.equal(consoleWarnMock.mock.calls.length, 1);
    });

    it("sends correct action type for whatsapp", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.fetch = mock.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ allowed: true }),
      })) as any;

      await checkServerRateLimit("whatsapp");

      const call = (global.fetch as ReturnType<typeof mock.fn>).mock.calls[0];
      assert.equal(call.arguments[1].body, JSON.stringify({ action: "whatsapp" }));
    });

    it("sends correct action type for contact", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.fetch = mock.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ allowed: true }),
      })) as any;

      await checkServerRateLimit("contact");

      const call = (global.fetch as ReturnType<typeof mock.fn>).mock.calls[0];
      assert.equal(call.arguments[1].body, JSON.stringify({ action: "contact" }));
    });
  });
});
