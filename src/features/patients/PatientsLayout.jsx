import CreatePatientDrawer from "./CreatePatientDrawer";
import PatientsTable from "./PatientsTable";
import PatientsTableOperations from "./PatientsTableOperations";

function PatientsLayout() {
  return (
    <div className="max-w-[1400px] mx-auto w-full px-4">
      <div className="flex items-center justify-between my-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-semibold">Patients</h1>
          <PatientsTableOperations />
        </div>
        <CreatePatientDrawer />
      </div>
      <PatientsTable />
    </div>
  );
}

export default PatientsLayout;
