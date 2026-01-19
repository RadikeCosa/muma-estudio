import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  validateNombre,
  validateEmail,
  validateTelefono,
  validateMensaje,
  sanitizeText,
  validateContactForm,
  VALIDATION_LIMITS,
} from "./validation";

describe("validateNombre", () => {
  it("accepts valid names", () => {
    const result = validateNombre("Juan Pérez");
    assert.equal(result.isValid, true);
    assert.equal(result.error, undefined);
  });

  it("rejects names that are too short", () => {
    const result = validateNombre("J");
    assert.equal(result.isValid, false);
    assert.equal(
      result.error,
      `El nombre debe tener al menos ${VALIDATION_LIMITS.nombre.min} caracteres`
    );
  });

  it("rejects names that are too long", () => {
    const result = validateNombre("a".repeat(51));
    assert.equal(result.isValid, false);
    assert.equal(
      result.error,
      `El nombre no puede tener más de ${VALIDATION_LIMITS.nombre.max} caracteres`
    );
  });

  it("rejects names with invalid characters", () => {
    const result = validateNombre("Juan123");
    assert.equal(result.isValid, false);
    assert.equal(result.error, "El nombre solo puede contener letras y espacios");
  });
});

describe("validateEmail", () => {
  it("accepts valid email addresses", () => {
    const result = validateEmail("juan@example.com");
    assert.equal(result.isValid, true);
    assert.equal(result.error, undefined);
  });

  it("rejects invalid email formats", () => {
    const result1 = validateEmail("invalid");
    assert.equal(result1.isValid, false);
    assert.equal(result1.error, "Por favor, ingresá un email válido");

    const result2 = validateEmail("invalid@");
    assert.equal(result2.isValid, false);
    assert.equal(result2.error, "Por favor, ingresá un email válido");
  });
});

describe("validateTelefono", () => {
  it("accepts valid phone numbers", () => {
    const result = validateTelefono("+54 9 11 1234-5678");
    assert.equal(result.isValid, true);
    assert.equal(result.error, undefined);
  });

  it("accepts empty/undefined telefono (optional field)", () => {
    const result1 = validateTelefono("");
    assert.equal(result1.isValid, true);

    const result2 = validateTelefono(undefined);
    assert.equal(result2.isValid, true);
  });

  it("rejects invalid phone numbers", () => {
    const result1 = validateTelefono("123"); // too short
    assert.equal(result1.isValid, false);
    assert.ok(result1.error?.includes("entre"));

    const result2 = validateTelefono("abc123456789"); // invalid chars
    assert.equal(result2.isValid, false);
    assert.equal(result2.error, "Por favor, ingresá un teléfono válido");
  });
});

describe("validateMensaje", () => {
  it("accepts valid messages", () => {
    const result = validateMensaje("Este es un mensaje válido para consulta");
    assert.equal(result.isValid, true);
    assert.equal(result.error, undefined);
  });

  it("rejects messages that are too short", () => {
    const result = validateMensaje("Hola");
    assert.equal(result.isValid, false);
    assert.equal(
      result.error,
      `El mensaje debe tener al menos ${VALIDATION_LIMITS.mensaje.min} caracteres`
    );
  });

  it("rejects messages that are too long", () => {
    const result = validateMensaje("a".repeat(501));
    assert.equal(result.isValid, false);
    assert.equal(
      result.error,
      `El mensaje no puede tener más de ${VALIDATION_LIMITS.mensaje.max} caracteres`
    );
  });
});

describe("sanitizeText", () => {
  it("removes HTML tags", () => {
    const result = sanitizeText("<script>alert('xss')</script>Hola");
    assert.equal(result, "alert(xss)Hola");
  });

  it("removes dangerous characters", () => {
    const result = sanitizeText('Test <>"\'');
    assert.equal(result, "Test");
  });

  it("limits text to 1000 characters", () => {
    const longText = "a".repeat(1500);
    const result = sanitizeText(longText);
    assert.equal(result.length, 1000);
  });
});

describe("validateContactForm", () => {
  it("validates complete form with valid data", () => {
    const result = validateContactForm({
      nombre: "Juan Pérez",
      email: "juan@example.com",
      telefono: "+54 9 11 1234-5678",
      mensaje: "Me interesa consultar sobre productos textiles",
    });
    
    assert.equal(result.isValid, true);
    assert.deepEqual(result.errors, {});
  });

  it("returns multiple errors for invalid data", () => {
    const result = validateContactForm({
      nombre: "J",
      email: "invalid",
      telefono: "123",
      mensaje: "Hola",
    });
    
    assert.equal(result.isValid, false);
    assert.ok(result.errors.nombre);
    assert.ok(result.errors.email);
    assert.ok(result.errors.telefono);
    assert.ok(result.errors.mensaje);
  });
});
