import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toISOStringOrNull(date: Date | string | number | null | undefined): string | null {
  if (!date) return null;
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return d.toISOString();
  } catch {
    return null;
  }
}
