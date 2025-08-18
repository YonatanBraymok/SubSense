// src/components/dashboard/welcome-header.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrendingUp, Plus } from "lucide-react";
import Link from "next/link";

interface WelcomeHeaderProps {
  userName?: string;
  userEmail?: string;
  className?: string;
}

export function WelcomeHeader({
  userName,
  userEmail,
  className = "",
}: WelcomeHeaderProps) {
  const displayName = userName || userEmail?.split('@')[0] || 'User';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your subscriptions, monitor spending, and stay on top of renewals
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <Link href="/subscriptions">
            <Button size="lg" className="gap-2">
              <TrendingUp className="h-5 w-5" />
              View All Subscriptions
            </Button>
          </Link>
          <Link href="/subscriptions">
            <Button variant="outline" size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add Subscription
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 