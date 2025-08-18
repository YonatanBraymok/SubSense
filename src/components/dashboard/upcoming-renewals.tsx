// src/components/dashboard/upcoming-renewals.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import type { SubscriptionRow } from "@/types/subscription";
// Simple date formatting for client components
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

interface UpcomingRenewalsProps {
  subscriptions: SubscriptionRow[];
  className?: string;
}

export function UpcomingRenewals({
  subscriptions,
  className = "",
}: UpcomingRenewalsProps) {
  // Get upcoming renewals (next 30 days)
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const upcomingRenewals = subscriptions
    .filter(sub => {
      const renewalDate = new Date(sub.nextRenewal);
      return renewalDate >= now && renewalDate <= thirtyDaysFromNow;
    })
    .sort((a, b) => new Date(a.nextRenewal).getTime() - new Date(b.nextRenewal).getTime())
    .slice(0, 3);

  if (upcomingRenewals.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Renewals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 bg-green-50 dark:bg-green-950 rounded-full flex items-center justify-center mb-3">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              No renewals in the next 30 days
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Renewals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingRenewals.map((subscription, index) => {
            const renewalDate = new Date(subscription.nextRenewal);
            const daysUntilRenewal = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            const getUrgencyColor = () => {
              if (daysUntilRenewal <= 3) return "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400";
              if (daysUntilRenewal <= 7) return "text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400";
              return "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400";
            };

            const getUrgencyIcon = () => {
              if (daysUntilRenewal <= 3) return <AlertTriangle className="h-3 w-3" />;
              if (daysUntilRenewal <= 7) return <Clock className="h-3 w-3" />;
              return <Calendar className="h-3 w-3" />;
            };

            return (
              <motion.div
                key={subscription.id}
                initial={{ opacity: 0, x: 20 }}
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatDate(renewalDate)}</span>
                  </div>
                </div>
                <Badge variant="secondary" className={getUrgencyColor()}>
                  {getUrgencyIcon()}
                  <span className="ml-1">
                    {daysUntilRenewal === 0 ? "Today" : 
                     daysUntilRenewal === 1 ? "Tomorrow" : 
                     `${daysUntilRenewal} days`}
                  </span>
                </Badge>
              </motion.div>
            );
          })}
        </div>
        {upcomingRenewals.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Showing next 30 days
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 