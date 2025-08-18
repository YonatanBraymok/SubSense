// src/lib/csv.test.ts
import { describe, it, expect } from 'vitest';
import { 
  escapeCSVField, 
  formatDateForCSV, 
  formatCostForCSV, 
  buildCSV,
  SUBSCRIPTION_CSV_COLUMNS,
  generateExportFilename 
} from './csv';
import type { SubscriptionRow } from '@/types/subscription';

describe('CSV Utilities', () => {
  describe('escapeCSVField', () => {
    it('should not quote simple values', () => {
      expect(escapeCSVField('simple')).toBe('simple');
      expect(escapeCSVField('123')).toBe('123');
      expect(escapeCSVField('')).toBe('');
    });

    it('should quote values with commas', () => {
      expect(escapeCSVField('value,with,comma')).toBe('"value,with,comma"');
    });

    it('should quote values with quotes', () => {
      expect(escapeCSVField('value"with"quotes')).toBe('"value""with""quotes"');
    });

    it('should quote values with newlines', () => {
      expect(escapeCSVField('value\nwith\nnewline')).toBe('"value\nwith\nnewline"');
    });

    it('should handle mixed special characters', () => {
      expect(escapeCSVField('value,with"quotes\nand newlines')).toBe('"value,with""quotes\nand newlines"');
    });
  });

  describe('formatDateForCSV', () => {
    const testDate = new Date('2024-01-15T10:30:00Z');

    it('should format as ISO by default', () => {
      const result = formatDateForCSV(testDate);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should format as readable when specified', () => {
      const result = formatDateForCSV(testDate, 'readable');
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });

  describe('formatCostForCSV', () => {
    it('should handle Prisma Decimal objects', () => {
      const mockDecimal = { toFixed: (_n: number) => '19.99' };
      expect(formatCostForCSV(mockDecimal)).toBe('19.99');
    });

    it('should handle numbers', () => {
      expect(formatCostForCSV(25.50)).toBe('25.50');
      expect(formatCostForCSV(0)).toBe('0.00');
    });

    it('should handle falsy values', () => {
      expect(formatCostForCSV(null)).toBe('0.00');
      expect(formatCostForCSV(undefined)).toBe('0.00');
      expect(formatCostForCSV('')).toBe('0.00');
    });
  });

  describe('buildCSV', () => {
    const mockData: SubscriptionRow[] = [
      {
        id: '1',
        name: 'Netflix',
        cost: { toFixed: () => '15.99' } as { toFixed: (n: number) => string },
        currency: 'USD',
        billingCycle: 'MONTHLY',
        nextRenewal: new Date('2024-02-15'),
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        name: 'Spotify',
        cost: { toFixed: () => '9.99' } as { toFixed: (n: number) => string },
        currency: 'USD',
        billingCycle: 'MONTHLY',
        nextRenewal: new Date('2024-02-20'),
        createdAt: new Date('2024-01-05'),
      },
    ];

    it('should build CSV with headers by default', () => {
      const result = buildCSV(mockData, SUBSCRIPTION_CSV_COLUMNS);
      const lines = result.split('\n');
      
      expect(lines).toHaveLength(3); // 2 data rows + 1 header
      expect(lines[0]).toContain('Name,Cost,Currency,Billing Cycle,Next Renewal,Created At');
    });

    it('should build CSV without headers when specified', () => {
      const result = buildCSV(mockData, SUBSCRIPTION_CSV_COLUMNS, { includeHeaders: false });
      const lines = result.split('\n');
      
      expect(lines).toHaveLength(2); // 2 data rows, no header
      expect(lines[0]).not.toContain('Name,Cost,Currency');
    });

    it('should handle empty data', () => {
      const result = buildCSV([], SUBSCRIPTION_CSV_COLUMNS);
      expect(result).toBe('Name,Cost,Currency,Billing Cycle,Next Renewal,Created At');
    });

    it('should escape special characters in data', () => {
      const dataWithSpecialChars: SubscriptionRow[] = [
        {
          id: '1',
          name: 'Service, with "quotes"',
          cost: { toFixed: () => '19.99' } as { toFixed: (n: number) => string },
          currency: 'USD',
          billingCycle: 'MONTHLY',
          nextRenewal: new Date('2024-02-15'),
          createdAt: new Date('2024-01-01'),
        },
      ];
      
      const result = buildCSV(dataWithSpecialChars, SUBSCRIPTION_CSV_COLUMNS);
      expect(result).toContain('"Service, with ""quotes"""');
    });
  });

  describe('generateExportFilename', () => {
    it('should generate filename with default prefix', () => {
      const filename = generateExportFilename();
      expect(filename).toMatch(/^subsense-\d{8}\.csv$/);
    });

    it('should generate filename with custom prefix', () => {
      const filename = generateExportFilename('custom');
      expect(filename).toMatch(/^custom-\d{8}\.csv$/);
    });

    it('should include current date in YYYYMMDD format', () => {
      const now = new Date();
      const expectedDate = now.toISOString().slice(0, 10).replace(/-/g, '');
      const filename = generateExportFilename();
      expect(filename).toContain(expectedDate);
    });
  });
}); 