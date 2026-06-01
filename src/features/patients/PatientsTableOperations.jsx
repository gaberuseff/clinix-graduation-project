import Search from "@/components/Search";

function PatientsTableOperations() {
  return (
    <div className="flex items-center gap-4 w-full sm:w-auto">
      <Search placeholder="Search patients by name or phone..." />
    </div>
  );
}

export default PatientsTableOperations;
