import CreateSecretariesDrawer from "./CreateSecretariesDrawer";
import SecretariesTable from "./SecretariesTable";
import SecretariesTableOperations from "./SecretariesTableOperations";

function SecretariesLayout() {
  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight font-heading">
          Secretaries
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <SecretariesTableOperations />
          <CreateSecretariesDrawer />
        </div>
      </div>

      <SecretariesTable />
    </div>
  );
}

export default SecretariesLayout;
