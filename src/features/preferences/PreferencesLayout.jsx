import React from "react";
import {useAppTranslation} from "@/i18n/use-app-translation";
import ThemePreference from "./ThemePreference";
import LanguagePreference from "./LanguagePreference";

function PreferencesLayout() {
  const {t} = useAppTranslation("preferences");

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 space-y-4.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-3.5">
        <h1 className="text-2xl font-bold tracking-tight font-heading">
          {t("title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ThemePreference />
        <LanguagePreference />
      </div>
    </div>
  );
}

export default PreferencesLayout;
