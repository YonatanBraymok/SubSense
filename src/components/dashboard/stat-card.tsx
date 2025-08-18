// src/components/dashboard/stat-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, BarChart3, TrendingUp, Calendar } from "lucide-react";
import { motion } from "framer-motion";

type IconName = "dollar" | "bar" | "trending" | "calendar";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: IconName;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className = "",
}: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400";
      case "down":
        return "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={className}
    >
      <Card className="h-full transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-primary/10 p-1.5 text-primary">
            {icon === "dollar" && <DollarSign className="h-5 w-5" />}
            {icon === "bar" && <BarChart3 className="h-5 w-5" />}
            {icon === "trending" && <TrendingUp className="h-5 w-5" />}
            {icon === "calendar" && <Calendar className="h-5 w-5" />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className={getTrendColor()}>
                <span className="mr-1">{getTrendIcon()}</span>
                {trendValue}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 