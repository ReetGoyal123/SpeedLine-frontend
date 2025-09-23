import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTrainTypeColor(type: string): string {
  switch (type) {
    case "Express":
      return "bg-red-500 border-red-600 text-white";
    case "Freight":
      return "bg-green-500 border-green-600 text-white";
    case "Local":
      return "bg-blue-500 border-blue-600 text-white";
    case "High-Speed":
      return "bg-purple-500 border-purple-600 text-white";
    default:
      return "bg-gray-500 border-gray-600 text-white";
  }
}

export function getDisruptionSeverityColor(severity: string): string {
  switch (severity) {
    case "low":
      return "bg-yellow-100 border-yellow-300 text-yellow-800";
    case "medium":
      return "bg-orange-100 border-orange-300 text-orange-800";
    case "high":
      return "bg-red-100 border-red-300 text-red-800";
    default:
      return "bg-gray-100 border-gray-300 text-gray-800";
  }
}

export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString();
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export function calculatePosition(positionM: number, lengthKm: number): number {
  return Math.min(100, Math.max(0, (positionM / (lengthKm * 1000)) * 100));
}