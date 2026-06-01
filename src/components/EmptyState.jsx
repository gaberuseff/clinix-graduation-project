import {RiInboxLine} from "@remixicon/react";

export function EmptyState({
  title = "No data available",
  description = "There are no records to display at the moment.",
  icon: Icon = RiInboxLine,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="p-4 bg-muted/40 text-muted-foreground/50 rounded-full mb-4 border border-border/20">
        <Icon className="size-12" />
      </div>
      <h3 className="text-lg font-semibold text-foreground font-sans mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground text-sm max-w-sm font-sans">
          {description}
        </p>
      )}
    </div>
  );
}

export default EmptyState;
