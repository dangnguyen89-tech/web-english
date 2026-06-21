import { cn, formatPercent } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  total: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, total, label, className }: ProgressBarProps) {
  const percent = formatPercent(value, total);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">{percent}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
