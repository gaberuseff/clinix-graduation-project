import {useTranslation} from "react-i18next";
import {Button} from "../ui/button";

export default function LanguageSwitcher() {
  const {i18n} = useTranslation();

  const changeLanguage = (language) => {
    localStorage.setItem("language", language);

    i18n.changeLanguage(language);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="destructive"
        onClick={() => changeLanguage("en")}
        className="flex-1">
        English
      </Button>

      <Button
        variant="outline"
        onClick={() => changeLanguage("ar")}
        className="flex-1">
        العربية
      </Button>
    </div>
  );
}
