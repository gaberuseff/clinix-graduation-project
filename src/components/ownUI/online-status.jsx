import React from "react";
import {useOnlineStatus} from "@/hooks/use-online-status";
import {Wifi, WifiOff} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export function OnlineStatus() {
  const isOnline = useOnlineStatus();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`
            group relative flex items-center gap-2 rounded-4xl px-3 py-1.5 text-xs font-semibold
            border backdrop-blur-xs select-none transition-all duration-300
            ${isOnline ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25 " : "bg-destructive/10 text-destructive border-destructive/25 "}
          `}
          aria-label={isOnline ? "Online" : "Offline"}>
          <span className="relative flex h-2 w-2 items-center justify-center">
            {isOnline ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/60 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
              </>
            )}
          </span>

          <span className="font-heading font-medium tracking-wide">
            {isOnline ? "Online" : "Offline"}
          </span>

          <div className="relative flex items-center justify-center">
            {isOnline ? (
              <Wifi className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
            ) : (
              <WifiOff className="h-3.5 w-3.5 text-destructive animate-pulse transition-transform duration-300 group-hover:scale-110" />
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="font-sans px-3 py-2 text-xs border bg-card text-card-foreground shadow-lg rounded-xl max-w-[280px] text-left"
        sideOffset={6}>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            {isOnline ? "Clinic Online" : "Clinic Offline"}
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {isOnline
              ? "All clinical records, patients, and modifications are synchronized in real-time with the cloud."
              : "All edits and modifications are securely saved locally and will automatically synchronize once a network is found."}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
