import assert from "node:assert/strict";
import { describe, it, beforeEach, mock } from "node:test";

import {
  logSecurityEvent,
  detectSuspiciousPattern,
  logXSSAttempt,
  type SecurityEventType,
} from "./security-logger";

describe("Security Logger", () => {
  let consoleWarnMock: ReturnType<typeof mock.fn>;
  let originalEnv: string | undefined;

  beforeEach(() => {
    // Mock console.warn
    consoleWarnMock = mock.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.console as any).warn = consoleWarnMock;
    
    // Store original NODE_ENV
    originalEnv = process.env.NODE_ENV;
  });

  describe("logSecurityEvent", () => {
    it("logs event with timestamp and environment in development", () => {
      process.env.NODE_ENV = "development";
      
      logSecurityEvent("rate_limit_check", { action: "test", ip: "127.0.0.1" });

      assert.equal(consoleWarnMock.mock.calls.length, 1);
      const call = consoleWarnMock.mock.calls[0];
      assert.equal(call.arguments[0], "[SECURITY]");
      assert.equal(call.arguments[1], "rate_limit_check");
      
      const logEntry = call.arguments[2];
      assert.ok(logEntry.timestamp);
      assert.equal(logEntry.event, "rate_limit_check");
      assert.equal(logEntry.environment, "development");
      assert.equal(logEntry.action, "test");
      assert.equal(logEntry.ip, "127.0.0.1");
    });

    it("logs event as JSON in production", () => {
      process.env.NODE_ENV = "production";
      
      logSecurityEvent("rate_limit_exceeded", { action: "test", count: 5 });

      assert.equal(consoleWarnMock.mock.calls.length, 1);
      const call = consoleWarnMock.mock.calls[0];
      assert.equal(call.arguments[0], "[SECURITY]");
      
      const jsonString = call.arguments[1];
      const parsed = JSON.parse(jsonString);
      assert.ok(parsed.timestamp);
      assert.equal(parsed.event, "rate_limit_exceeded");
      assert.equal(parsed.environment, "production");
      assert.equal(parsed.action, "test");
      assert.equal(parsed.count, 5);
      
      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });

    it("handles all security event types", () => {
      const eventTypes: SecurityEventType[] = [
        "rate_limit_check",
        "rate_limit_exceeded",
        "rate_limit_error",
        "bot_detected",
        "validation_failed",
        "suspicious_activity",
        "xss_attempt",
      ];

      for (const eventType of eventTypes) {
        consoleWarnMock.mock.resetCalls();
        logSecurityEvent(eventType, { test: true });
        assert.equal(consoleWarnMock.mock.calls.length, 1);
      }
    });
  });

  describe("detectSuspiciousPattern", () => {
    it("detects script tags (case insensitive)", () => {
      assert.equal(detectSuspiciousPattern("<script>alert('xss')</script>"), true);
      assert.equal(detectSuspiciousPattern("<SCRIPT>alert('xss')</SCRIPT>"), true);
      assert.equal(detectSuspiciousPattern("Hello <script>world"), true);
    });

    it("detects javascript: protocol", () => {
      assert.equal(detectSuspiciousPattern("javascript:alert('xss')"), true);
      assert.equal(detectSuspiciousPattern("JAVASCRIPT:alert('xss')"), true);
    });

    it("detects onerror attribute", () => {
      assert.equal(detectSuspiciousPattern('<img onerror="alert(1)">'), true);
      assert.equal(detectSuspiciousPattern('<img ONERROR="alert(1)">'), true);
    });

    it("detects onload attribute", () => {
      assert.equal(detectSuspiciousPattern('<body onload="alert(1)">'), true);
      assert.equal(detectSuspiciousPattern('<body ONLOAD="alert(1)">'), true);
    });

    it("detects iframe tags", () => {
      assert.equal(detectSuspiciousPattern("<iframe src='evil.com'></iframe>"), true);
      assert.equal(detectSuspiciousPattern("<IFRAME src='evil.com'></IFRAME>"), true);
    });

    it("detects eval function", () => {
      assert.equal(detectSuspiciousPattern("eval('malicious code')"), true);
      assert.equal(detectSuspiciousPattern("eval(someVariable)"), true);
    });

    it("detects alert function", () => {
      assert.equal(detectSuspiciousPattern("alert('xss')"), true);
      assert.equal(detectSuspiciousPattern("alert(1)"), true);
    });

    it("returns false for safe text", () => {
      assert.equal(detectSuspiciousPattern("Hello, this is a normal message"), false);
      assert.equal(detectSuspiciousPattern("Email: test@example.com"), false);
      assert.equal(detectSuspiciousPattern("Phone: +54 299 123-4567"), false);
      assert.equal(detectSuspiciousPattern("Consulta sobre productos"), false);
    });

    it("returns false for empty string", () => {
      assert.equal(detectSuspiciousPattern(""), false);
    });
  });

  describe("logXSSAttempt", () => {
    it("logs XSS attempt with truncated value", () => {
      const longValue = "a".repeat(200);
      const field = "mensaje";
      const context = "contact_form";

      logXSSAttempt(field, longValue, context);

      assert.equal(consoleWarnMock.mock.calls.length, 1);
      const call = consoleWarnMock.mock.calls[0];
      assert.equal(call.arguments[1], "xss_attempt");
      
      const logEntry = call.arguments[2];
      assert.equal(logEntry.field, field);
      assert.equal(logEntry.value.length, 100); // Truncated to 100 chars
      assert.equal(logEntry.context, context);
      assert.equal(logEntry.severity, "high");
    });

    it("logs XSS attempt with suspicious pattern", () => {
      const suspiciousValue = "<script>alert('xss')</script>";
      const field = "nombre";
      const context = "contact_form";

      logXSSAttempt(field, suspiciousValue, context);

      assert.equal(consoleWarnMock.mock.calls.length, 1);
      const call = consoleWarnMock.mock.calls[0];
      const logEntry = call.arguments[2];
      
      assert.equal(logEntry.field, field);
      assert.equal(logEntry.value, suspiciousValue); // Not truncated (under 100 chars)
      assert.equal(logEntry.context, context);
      assert.equal(logEntry.severity, "high");
    });
  });
});
