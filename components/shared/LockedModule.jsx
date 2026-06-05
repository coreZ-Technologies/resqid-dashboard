// components/shared/LockedModule.jsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LockKeyhole, Sparkles } from "lucide-react";

/**
 * LockedModule – Displays a locked feature/module with upgrade CTA.
 * @param {Object} props
 * @param {string} props.title - Module title (e.g., "Advanced Analytics")
 * @param {string} props.description - What the module offers
 * @param {string} [props.requiredPlan] - Required plan (e.g., "Pro", "Enterprise")
 * @param {function} props.onUpgrade - Callback when upgrade button is clicked
 * @param {string} [props.buttonText] - Custom button text (default: "Upgrade to unlock")
 * @param {React.ReactNode} [props.icon] - Custom icon (default: LockKeyhole)
 */
export function LockedModule({
  title,
  description,
  requiredPlan = "Pro",
  onUpgrade,
  buttonText = "Upgrade to unlock",
  icon: Icon = LockKeyhole,
}) {
  return (
    <Card className="relative overflow-hidden border-dashed border-muted-foreground/30 transition-all hover:border-muted-foreground/50 animate-in fade-in zoom-in-95 duration-300">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/5 to-transparent pointer-events-none" />

      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-muted p-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {requiredPlan} required
          </Badge>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LockKeyhole className="h-4 w-4" />
          <span>This feature is locked. Upgrade your plan to access.</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={onUpgrade} className="w-full sm:w-auto group">
          <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}