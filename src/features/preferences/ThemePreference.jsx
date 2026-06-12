import React from "react";
import {useTheme} from "next-themes";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {Sun, Moon, Monitor} from "lucide-react";

function ThemePreference() {
  const {t} = useAppTranslation("preferences");
  const {theme, setTheme} = useTheme();

  return (
    <Card className="shadow-none border border-border/60 bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t("theme.title")}</CardTitle>
        <CardDescription className="text-sm">
          {t("theme.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ToggleGroup
          type="single"
          value={theme}
          onValueChange={(value) => value && setTheme(value)}
          className="flex flex-wrap gap-2 w-fit justify-start"
          size="sm"
          spacing={0}>
          <ToggleGroupItem
            value="light"
            className="flex items-center gap-1.5 border border-input rounded-lg data-[state=on]:border-primary data-[state=on]:bg-primary/5 cursor-pointer px-3 py-1.5 text-xs font-semibold">
            <Sun className="size-4 text-amber-500" />
            <span>{t("theme.light")}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="dark"
            className="flex items-center gap-1.5 border border-input rounded-lg data-[state=on]:border-primary data-[state=on]:bg-primary/5 cursor-pointer px-3 py-1.5 text-xs font-semibold">
            <Moon className="size-4 text-sky-400" />
            <span>{t("theme.dark")}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="system"
            className="flex items-center gap-1.5 border border-input rounded-lg data-[state=on]:border-primary data-[state=on]:bg-primary/5 cursor-pointer px-3 py-1.5 text-xs font-semibold">
            <Monitor className="size-4 text-muted-foreground" />
            <span>{t("theme.system")}</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
    </Card>
  );
}

export default ThemePreference;
