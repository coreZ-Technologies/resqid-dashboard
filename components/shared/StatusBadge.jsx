// components/shared/StatusBadge.jsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Circle,
  UserCheck,
  UserX,
  UserMinus,
  Users,
  Lock,
  ShieldCheck,
} from "lucide-react";

/**
 * StatusBadge – Displays status with appropriate color, icon, and animation.
 * @param {Object} props
 * @param {string} props.status - Status key (e.g., "present", "absent", "active", etc.)
 * @param {string} [props.label] - Override display label (defaults to status name)
 * @param {boolean} [props.animated] - Whether to show a subtle pulse animation
 * @param {string} [props.size] - "sm", "default", "lg"
 * @param {string} [props.className] - Additional classes
 * @param {React.ReactNode} [props.icon] - Custom icon (overrides default)
 */

const statusConfig = {
  // Attendance statuses
  present: {
    label: "Present",
    variant: "success",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  },
  absent: {
    label: "Absent",
    variant: "destructive",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  },
  manual: {
    label: "Manual",
    variant: "warning",
    icon: UserMinus,
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
  late: {
    label: "Late",
    variant: "warning",
    icon: Clock,
    className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
  },
  excused: {
    label: "Excused",
    variant: "secondary",
    icon: AlertCircle,
    className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  },

  // User / role statuses
  active: {
    label: "Active",
    variant: "success",
    icon: UserCheck,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  },
  inactive: {
    label: "Inactive",
    variant: "secondary",
    icon: UserX,
    className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  },
  pending: {
    label: "Pending",
    variant: "warning",
    icon: Clock,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
  },
  suspended: {
    label: "Suspended",
    variant: "destructive",
    icon: Lock,
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  },

  // Subscription / module
  active_subscription: {
    label: "Active",
    variant: "success",
    icon: ShieldCheck,
    className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  },
  expired: {
    label: "Expired",
    variant: "destructive",
    icon: AlertCircle,
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  },
  trial: {
    label: "Trial",
    variant: "info",
    icon: Clock,
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  },

  // Card/RFID status
  card_active: {
    label: "Active",
    variant: "success",
    icon: Circle,
    className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  },
  card_blocked: {
    label: "Blocked",
    variant: "destructive",
    icon: Lock,
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  },
};

export function StatusBadge({ status, label, animated = false, size = "default", className, icon: CustomIcon }) {
  const config = statusConfig[status] || {
    label: label || status?.replace(/_/g, " ") || "Unknown",
    variant: "secondary",
    icon: AlertCircle,
    className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  };

  const IconComponent = CustomIcon || config.icon;
  const displayLabel = label || config.label;
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    default: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizeClasses[size],
        config.className,
        animated && "animate-pulse",
        className
      )}
    >
      {IconComponent && <IconComponent className={cn("shrink-0", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />}
      {displayLabel}
    </Badge>
  );
}