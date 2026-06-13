import ClinicPricesForms from "./ClinicPricesForms";
import ClinicRegionalSettingsForm from "./ClinicRegionalSettingsForm";

function SettingsLayout() {
  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 space-y-4.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-3.5">
        <h1 className="text-2xl font-bold tracking-tight font-heading">
          Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ClinicRegionalSettingsForm />
        <ClinicPricesForms />
      </div>
    </div>
  );
}

export default SettingsLayout;
