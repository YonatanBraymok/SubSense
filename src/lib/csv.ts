// src/lib/csv.ts
import type { SubscriptionRow } from "@/types/subscription";

export interface CSVColumn<T> {
  header: string;
  key: keyof T;
  formatter?: (value: T[keyof T]) => string;
}

export interface CSVOptions {
  includeHeaders?: boolean;
  dateFormat?: "iso" | "readable";
}

/**
 * Escapes a CSV field value according to RFC 4180
 * - Wraps in quotes if contains comma, quote, or newline
 * - Escapes internal quotes by doubling them
 */
export function escapeCSVField(value: string): string {
  const needsQuoting = value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r');
  
  if (!needsQuoting) {
    return value;
  }
  
  // Escape internal quotes by doubling them
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Formats a date according to the specified format
 */
export function formatDateForCSV(date: Date, format: "iso" | "readable" = "iso"): string {
  if (format === "iso") {
    return date.toISOString();
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Formats a decimal cost value safely for CSV
 */
export function formatCostForCSV(cost: unknown): string {
  // Handle Prisma Decimal or number
  if (cost && typeof cost === 'object' && 'toFixed' in cost && typeof (cost as { toFixed: (n: number) => string }).toFixed === 'function') {
    return (cost as { toFixed: (n: number) => string }).toFixed(2);
  }
  if (typeof cost === 'number') {
    return cost.toFixed(2);
  }
  return String(cost || '0.00');
}

/**
 * Builds CSV content from an array of objects with specified columns
 */
export function buildCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: CSVColumn<T>[],
  options: CSVOptions = {}
): string {
  const { includeHeaders = true, dateFormat = "iso" } = options;
  
  const lines: string[] = [];
  
  // Add headers if requested
  if (includeHeaders) {
    const headerRow = columns.map(col => escapeCSVField(col.header));
    lines.push(headerRow.join(','));
  }
  
  // Add data rows
  for (const row of data) {
    const values = columns.map(col => {
      const rawValue = row[col.key];
      let formattedValue: string;
      
      if (col.formatter) {
        formattedValue = col.formatter(rawValue);
      } else if (rawValue instanceof Date) {
        formattedValue = formatDateForCSV(rawValue, dateFormat);
      } else if (col.key === 'cost') {
        formattedValue = formatCostForCSV(rawValue);
      } else {
        formattedValue = String(rawValue || '');
      }
      
      return escapeCSVField(formattedValue);
    });
    
    lines.push(values.join(','));
  }
  
  return lines.join('\n');
}

/**
 * Predefined columns for subscription exports
 */
export const SUBSCRIPTION_CSV_COLUMNS: CSVColumn<SubscriptionRow>[] = [
  { header: 'Name', key: 'name' },
  { header: 'Cost', key: 'cost', formatter: formatCostForCSV },
  { header: 'Currency', key: 'currency' },
  { header: 'Billing Cycle', key: 'billingCycle' },
  { header: 'Next Renewal', key: 'nextRenewal', formatter: (date) => formatDateForCSV(date as Date, 'readable') },
  { header: 'Created At', key: 'createdAt', formatter: (date) => formatDateForCSV(date as Date, 'readable') },
];

/**
 * Generates a filename with current date
 */
export function generateExportFilename(prefix: string = 'subsense'): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  return `${prefix}-${dateStr}.csv`;
} 