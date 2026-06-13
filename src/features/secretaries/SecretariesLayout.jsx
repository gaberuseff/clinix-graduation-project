import CreateSecretariesDrawer from "./CreateSecretariesDrawer";
import SecretariesTable from "./SecretariesTable";
import SecretariesTableOperations from "./SecretariesTableOperations";

function SecretariesLayout() {
  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 space-y-4.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-3.5">
        <h1 className="text-2xl font-bold tracking-tight font-heading">
          Secretaries
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <SecretariesTableOperations />
          <CreateSecretariesDrawer />
        </div>
      </div>

      <SecretariesTable />
    </div>
  );
}

export default SecretariesLayout;
