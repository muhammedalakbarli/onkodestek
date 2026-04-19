import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("az-AZ", {
    style: "currency",
    currency: "AZN",
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function calcProgress(collected: number | string, goal: number | string): number {
  const c = typeof collected === "string" ? parseFloat(collected) : collected;
  const g = typeof goal === "string" ? parseFloat(goal) : goal;
  if (g === 0) return 0;
  return Math.min(Math.round((c / g) * 100), 100);
}
