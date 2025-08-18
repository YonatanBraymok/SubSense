// src/app/api/subscriptions/export.csv/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'auth';
import { getUserSubscriptions } from '@/lib/queries';
import { buildCSV, SUBSCRIPTION_CSV_COLUMNS, generateExportFilename } from '@/lib/csv';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    let userId: string | undefined = session.user.id;

    // Fallback to email lookup if no direct ID
    if (!userId && session.user.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      userId = user?.id;
    }

    if (!userId) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Parse query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const sort = (searchParams.get('sort') ?? 'nextRenewal') as 'nextRenewal' | 'createdAt';
    const dir = (searchParams.get('dir') ?? 'asc') as 'asc' | 'desc';
    const cycle = (searchParams.get('cycle') ?? 'ALL') as 'ALL' | 'MONTHLY' | 'YEARLY';

    // Use the same query helper as the list page to ensure consistency
    const subscriptions = await getUserSubscriptions(userId, {
      cycle,
      sort,
      dir,
    });

    // Build CSV content
    const csvContent = buildCSV(subscriptions, SUBSCRIPTION_CSV_COLUMNS, {
      includeHeaders: true,
      dateFormat: 'readable',
    });

    // Generate filename with current date
    const filename = generateExportFilename();

    // Return CSV response with proper headers
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 