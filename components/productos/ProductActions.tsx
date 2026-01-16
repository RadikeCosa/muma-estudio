"use client";

import { useState } from "react";
import { Producto, Variacion } from "@/lib/types";
import { VariationSelector } from "./VariationSelector";
import { WhatsAppButton } from "./WhatsAppButton";

interface ProductActionsProps {
  producto: Producto;
  variaciones: Variacion[];
}

/**
 * ProductActions - Wrapper Client Component
 *
 * Conecta VariationSelector con WhatsAppButton mediante state compartido
 *
 * @param producto - Información del producto
 * @param variaciones - Lista de variaciones disponibles
 */
export function ProductActions({ producto, variaciones }: ProductActionsProps) {
  const [variacionSeleccionada, setVariacionSeleccionada] =
    useState<Variacion | null>(null);

  return (
    <div
      className="
      flex flex-col gap-8
      p-8 rounded-2xl
      border-2 border-border/50
      bg-white
      shadow-lg
    "
    >
      {/* Selector de variaciones */}
      <VariationSelector
        variaciones={variaciones}
        onVariacionChange={setVariacionSeleccionada}
      />

      {/* Botón de WhatsApp */}
      <WhatsAppButton
        producto={producto}
        variacion={variacionSeleccionada || undefined}
      />
    </div>
  );
}
