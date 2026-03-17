import { API_BASE_URL } from "@/lib/constants";

export type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  headers?: HeadersInit;
};

export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "HttpError";

    this.statusCode = statusCode;
  }
}

async function parseJsonOrText(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function sendRequest<T>(
  path: string,
  options: RequestOptions = {},
  token?: string,

): Promise<T> {
  const headers = mergeHeaders(options.headers);
  const body = options.body === undefined ? undefined : JSON.stringify(options.body);

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {

    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body,
    cache: "no-store",
  });

  const payload = await parseJsonOrText(response);

  if (response.ok) {
    return payload as T;
  }

  const errorMessage = extractMessageFromPayload(payload) ?? `Request failed `;
  throw new HttpError(errorMessage, response.status);
}

function extractMessageFromPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return typeof payload === "string" && payload.trim() ? payload : null;
  }

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.message)) {
    return record.message.join(", ");
  }

  if (typeof record.message === "string") {
    return record.message;
  }

  if (typeof record.error === "string") {
    return record.error;
  }

  return null;
}

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function isAuthError(error: unknown): error is HttpError {
  return error instanceof HttpError && error.statusCode === 401;
}

function mergeHeaders(base?: HeadersInit): Record<string, string> {
  const standard = { Accept: "application/json" };

  if (!base) return standard;
  if (base instanceof Headers) {
    const out: Record<string, string> = { ...standard };
    base.forEach((value, key) => {
      out[key] = value;
    });
    return out;
  }

  if (Array.isArray(base)) {
    return base.reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, { ...standard });
  }

  return { ...standard, ...base };
}
