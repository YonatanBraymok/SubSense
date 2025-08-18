// src/components/dashboard/subscriptions-preview.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Calendar, DollarSign, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";
import type { SubscriptionRow } from "@/types/subscription";
// Simple date and money formatting for client components
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatMoney = (cost: unknown, currency: string) => {
  const amount = typeof cost === 'object' && cost && 'toFixed' in cost && typeof (cost as { toFixed: (n: number) => string }).toFixed === 'function' 
    ? (cost as { toFixed: (n: number) => string }).toFixed(2) 
    : cost;
  return `${currency} ${amount}`;
};

interface SubscriptionsPreviewProps {
  subscriptions: SubscriptionRow[];
  isLoading?: boolean;
  className?: string;
}

export function SubscriptionsPreview({
  subscriptions,
  isLoading = false,
  className = "",
}: SubscriptionsPreviewProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No subscriptions yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your recurring expenses by adding your first subscription.
            </p>
            <Link href="/subscriptions">
              <Button>
                <TrendingUp className="h-4 w-4 mr-2" />
                Add Subscription
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const previewSubscriptions = subscriptions.slice(0, 5);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recent Subscriptions
        </CardTitle>
        <Link href="/subscriptions">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {previewSubscriptions.map((subscription, index) => (
            <motion.div
              key={subscription.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{subscription.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {subscription.billingCycle}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {formatMoney(subscription.cost, subscription.currency)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(subscription.nextRenewal)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {subscriptions.length > 5 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center">
              Showing 5 of {subscriptions.length} subscriptions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 