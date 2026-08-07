import {cn} from "@/lib/utils";

export default function PageHeader({
  icon: Icon,
  title,
  description,
  className,
}) {
  return (
    <div className={cn("flex items-start gap-3.5 pb-1", className)}>
      {Icon && (
        <div className="p-2.5 bg-gradient-to-tr from-primary/15 to-emerald-500/10 text-primary rounded-xl flex items-center justify-center shrink-0 shadow-xs border border-primary/10">
          <Icon className="size-6" />
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground font-sans">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
