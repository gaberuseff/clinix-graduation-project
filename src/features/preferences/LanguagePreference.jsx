import React from "react";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";

function LanguagePreference() {
  const {t, i18n} = useAppTranslation("preferences");

  const changeLanguage = (lang) => {
    if (!lang) return;
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  };

  return (
    <Card className="shadow-none border border-border/60 bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t("language.title")}</CardTitle>
        <CardDescription className="text-sm">
          {t("language.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ToggleGroup
          type="single"
          value={i18n.language}
          onValueChange={changeLanguage}
          className="flex flex-wrap gap-2 w-fit justify-start"
          size="sm"
          spacing={0}>
          <ToggleGroupItem
            value="en"
            className="flex items-center gap-1.5 border border-input rounded-lg data-[state=on]:border-primary data-[state=on]:bg-primary/5 cursor-pointer px-3 py-1.5 text-xs font-semibold">
            <span className="font-bold text-[10px]">EN</span>
            <span>{t("language.en")}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="ar"
            className="flex items-center gap-1.5 border border-input rounded-lg data-[state=on]:border-primary data-[state=on]:bg-primary/5 cursor-pointer px-3 py-1.5 text-xs font-semibold">
            <span className="font-bold text-[10px]">AR</span>
            <span>{t("language.ar")}</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
    </Card>
  );
}

export default LanguagePreference;
