// src/app/subscriptions/export-button.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface ExportButtonProps {
  currentParams: {
    sort: "nextRenewal" | "createdAt";
    dir: "asc" | "desc";
    cycle: "ALL" | "MONTHLY" | "YEARLY";
  };
}

export default function ExportButton({ currentParams }: ExportButtonProps) {
  const searchParams = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Build export URL with current search parameters
      const params = new URLSearchParams();
      
      // Add current filter/sort params
      params.set('sort', currentParams.sort);
      params.set('dir', currentParams.dir);
      params.set('cycle', currentParams.cycle);
      
      // Add any additional search params that might exist
      const additionalParams = ['search', 'page']; // Add more if needed
      additionalParams.forEach(param => {
        const value = searchParams.get(param);
        if (value) params.set(param, value);
      });
      
      const exportUrl = `/api/subscriptions/export.csv?${params.toString()}`;
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = exportUrl;
      link.download = ''; // Let the server set the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isExporting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Exporting...
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </>
      )}
    </button>
  );
} 