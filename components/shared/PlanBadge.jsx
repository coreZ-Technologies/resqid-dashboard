// components/shared/PlanBadge.jsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * PlanBadge – Displays subscription plan with variant styles.
 * @param {Object} props
 * @param {string} props.plan - Plan name: "Basic", "Pro", "Enterprise", or custom.
 * @param {string} [props.variant] - Optional style variant (default maps to plan).
 * @param {boolean} [props.animated] - Whether to show a subtle pulse animation.
 * @param {string} [props.className] - Additional classes.
 */
const planConfig = {
  Basic: {
    label: "Basic",
    variant: "outline",
    className: "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400",
    icon: null,
  },
  Pro: {
    label: "Pro",
    variant: "default",
    className: "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600",
    icon: "✨",
  },
  Enterprise: {
    label: "Enterprise",
    variant: "secondary",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    icon: "🏢",
  },
  Trial: {
    label: "Trial",
    variant: "outline",
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
    icon: "⚡",
  },
};

export function PlanBadge({ plan, variant, animated = false, className }) {
  const config = planConfig[plan] || {
    label: plan,
    variant: "secondary",
    className: "",
    icon: null,
  };

  const displayVariant = variant || config.variant;

  return (
    <Badge
      variant={displayVariant}
      className={cn(
        "gap-1 px-3 py-1 text-xs font-medium",
        config.className,
        animated && "animate-pulse",
        className
      )}
    >
      {config.icon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  );
}