import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// We tell TypeScript that 'inputs' is an array of 'ClassValue' types
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}