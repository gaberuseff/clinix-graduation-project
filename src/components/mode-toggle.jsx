import React from "react";
import {Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export function ModeToggle() {
  const {theme, setTheme} = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="size-9 rounded-full cursor-pointer relative transition-all duration-300 hover:bg-accent active:scale-95"
          aria-label="Toggle theme">
          {/* Sun Icon (Visible in Light Mode, hidden/rotated in Dark Mode) */}
          <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-out rotate-0 scale-100 dark:-rotate-90 dark:scale-0 text-amber-500" />

          {/* Moon Icon (Visible in Dark Mode, hidden/rotated in Light Mode) */}
          <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-out rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-sky-400" />

          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="font-sans px-2.5 py-1 text-xs rounded-lg"
        sideOffset={6}>
        <span>Toggle Theme</span>
      </TooltipContent>
    </Tooltip>
  );
}
