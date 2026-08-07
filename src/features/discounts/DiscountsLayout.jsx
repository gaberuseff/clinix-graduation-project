import PageHeader from "@/components/ownUI/PageHeader";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {Percent} from "lucide-react";

function DiscountsLayout() {
  const {t} = useAppTranslation("dashboard");

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 space-y-4.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-3.5">
        <PageHeader icon={Percent} title={t("nav.discounts")} description={t("nav.discountsSubtitle")} />
      </div>

      <div>Discounts code</div>
    </div>
  );
}

export default DiscountsLayout;
