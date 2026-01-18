"use client";

import { classifyError, ErrorType } from "@/lib/errors/types";
import {
  NetworkError,
  DatabaseError,
  NotFoundError,
  GenericError,
} from "@/components/errors";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductosError({ error, reset }: ErrorBoundaryProps) {
  const errorType = classifyError(error);

  switch (errorType) {
    case ErrorType.NETWORK:
      return <NetworkError onRetry={reset} />;

    case ErrorType.DATABASE:
      return <DatabaseError onRetry={reset} />;

    case ErrorType.NOT_FOUND:
      return (
        <NotFoundError message="Los productos que buscás no están disponibles" />
      );

    case ErrorType.VALIDATION:
    case ErrorType.UNKNOWN:
    default:
      return <GenericError onRetry={reset} error={error} />;
  }
}
