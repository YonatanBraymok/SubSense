# CSV Export Functionality

This document explains the CSV export feature implemented for the SubSense subscription management application.

## Overview

The CSV export functionality allows users to download their subscription data in CSV format, respecting current filters, sorting, and search parameters. The export includes all visible columns and properly handles special characters, dates, and decimal values.

## Architecture

### 1. CSV Utility (`src/lib/csv.ts`)

A type-safe utility library that handles:
- **CSV Field Escaping**: Properly escapes commas, quotes, and newlines according to RFC 4180
- **Date Formatting**: Configurable date formatting (ISO 8601 or readable MM/DD/YYYY)
- **Decimal Handling**: Safe formatting for Prisma Decimal objects and numbers
- **Column Definition**: Flexible column configuration with custom formatters

**Key Functions:**
- `escapeCSVField(value: string)`: Escapes special characters
- `buildCSV<T>(data, columns, options)`: Builds CSV content from data
- `formatCostForCSV(cost: unknown)`: Safely formats cost values
- `formatDateForCSV(date: Date, format)`: Formats dates consistently

### 2. API Endpoint (`/api/subscriptions/export.csv`)

**Route**: `GET /api/subscriptions/export.csv`

**Features:**
- Reads current URL parameters (filter/sort/search)
- Uses the same query helper as the list page for consistency
- Returns CSV with proper HTTP headers
- Generates filename with current date (e.g., `subsense-20240818.csv`)

**Response Headers:**
```http
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="subsense-20240818.csv"
Cache-Control: no-cache
```

### 3. Export Button Component

A client component that:
- Composes the export URL with current search parameters
- Triggers browser download
- Shows loading state during export
- Handles errors gracefully

## MIME Headers and Browser Download Behavior

### Content-Type: `text/csv; charset=utf-8`
- **Purpose**: Tells the browser this is CSV data
- **Effect**: Browser recognizes the file type and may open it in a spreadsheet application
- **Charset**: Ensures proper UTF-8 encoding for international characters

### Content-Disposition: `attachment; filename="subsense-20240818.csv"`
- **Purpose**: Instructs the browser to download the file instead of displaying it
- **Filename**: Suggests a default filename for the download
- **Browser Behavior**: 
  - Chrome/Firefox: Downloads to default downloads folder
  - Safari: May prompt user for save location
  - Mobile: Downloads to device's default location

### Why These Headers Matter
1. **File Association**: Browsers can open CSV files directly in spreadsheet apps
2. **Download Behavior**: Ensures consistent download experience across browsers
3. **Filename Preservation**: User gets a meaningful filename with date
4. **Encoding**: UTF-8 ensures special characters display correctly

## Testing

### Unit Tests

Run the CSV utility tests:
```bash
npm test -- src/lib/csv.test.ts
```

**Test Coverage:**
- Field escaping (commas, quotes, newlines)
- Date formatting (ISO vs readable)
- Cost formatting (Prisma Decimal handling)
- CSV building (headers, data rows, special characters)
- Filename generation

### Manual Testing Steps

1. **Navigate to Subscriptions Page**
   - Go to `/subscriptions`
   - Ensure you have some subscription data

2. **Apply Filters and Sorting**
   - Change billing cycle filter (ALL/MONTHLY/YEARLY)
   - Sort by different columns (Next Renewal, Created)
   - Change sort direction (asc/desc)

3. **Export CSV**
   - Click the "Export CSV" button
   - Verify download starts automatically
   - Check filename format: `subsense-YYYYMMDD.csv`

4. **Verify CSV Content**
   - Open the downloaded CSV file
   - Check that headers are correct
   - Verify data matches current filtered view
   - Confirm special characters are properly escaped
   - Check date formatting (should be MM/DD/YYYY)

5. **Test Edge Cases**
   - Export with no subscriptions (should get headers only)
   - Export with subscriptions containing commas/quotes in names
   - Export with different currency values

### Expected CSV Format

```csv
Name,Cost,Currency,Billing Cycle,Next Renewal,Created At
Netflix,15.99,USD,MONTHLY,02/15/2024,01/01/2024
Spotify,9.99,USD,MONTHLY,02/20/2024,01/05/2024
"Service, with ""quotes""",19.99,USD,MONTHLY,02/15/2024,01/01/2024
```

## Implementation Details

### Query Reuse
The export endpoint uses the same `getUserSubscriptions` helper function as the list page, ensuring:
- **Consistency**: Same filtering, sorting, and data structure
- **Maintainability**: Single source of truth for subscription queries
- **Performance**: Leverages existing database query optimization

### Type Safety
- **No `any` types**: All functions use strict TypeScript types
- **Generic CSV builder**: Works with any data structure
- **Column definitions**: Type-safe column configuration

### Error Handling
- **Authentication**: Proper user verification
- **User lookup**: Fallback to email-based user resolution
- **Graceful failures**: Clear error messages and fallbacks

## Next Steps

### Potential Enhancements
1. **Additional Export Formats**: Excel (.xlsx), JSON, PDF
2. **Export Scheduling**: Automated exports via email
3. **Column Selection**: User-configurable export columns
4. **Bulk Operations**: Export multiple filtered views
5. **Export History**: Track and manage export requests

### Performance Optimizations
1. **Streaming**: Handle large datasets with streaming responses
2. **Caching**: Cache export results for repeated requests
3. **Background Processing**: Queue exports for large datasets
4. **Compression**: Gzip CSV responses for faster downloads

### User Experience Improvements
1. **Progress Indicators**: Show export progress for large datasets
2. **Preview**: Show CSV preview before download
3. **Template Downloads**: Provide CSV templates for data import
4. **Export Settings**: Remember user preferences

## Troubleshooting

### Common Issues

1. **Download Not Starting**
   - Check browser popup blockers
   - Verify authentication is working
   - Check browser console for errors

2. **CSV Formatting Issues**
   - Ensure proper Content-Type header
   - Check for BOM (Byte Order Mark) issues
   - Verify UTF-8 encoding

3. **Data Mismatch**
   - Confirm query parameters are being passed correctly
   - Check that filters are applied consistently
   - Verify user permissions

4. **Performance Issues**
   - Monitor database query performance
   - Consider pagination for large datasets
   - Implement request timeouts

### Debug Mode
Enable debug logging by setting environment variable:
```bash
DEBUG=subsense:export
```

## Conclusion

The CSV export functionality provides a robust, type-safe way for users to download their subscription data. The implementation follows best practices for:
- **Security**: Proper authentication and authorization
- **Performance**: Efficient database queries and response handling
- **User Experience**: Consistent behavior with current filters
- **Maintainability**: Clean separation of concerns and reusable components

The feature is ready for production use and provides a solid foundation for future export enhancements. 