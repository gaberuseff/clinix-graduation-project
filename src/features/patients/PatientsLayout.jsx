import CreatePatientDrawer from "./CreatePatientDrawer";
import PatientsTable from "./PatientsTable";
import PatientsTableOperations from "./PatientsTableOperations";

function PatientsLayout() {
  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight font-heading">
          Patients
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <PatientsTableOperations />
          <CreatePatientDrawer />
        </div>
      </div>

      <PatientsTable />
    </div>
  );
}

export default PatientsLayout;
