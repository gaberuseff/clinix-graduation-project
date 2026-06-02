import Search from "@/components/ownUI/Search";
import {Button} from "@/components/ui/button";
import usePatients from "@/features/patients/usePatients";
import {RiRefreshLine} from "@remixicon/react";

function PatientsTableOperations() {
  const {refetch, isFetching} = usePatients();

  return (
    <div className="flex items-center gap-2.5 w-full sm:w-auto">
      <Search placeholder="Search patients by name or phone..." />
      <Button
        variant="outline"
        size="icon"
        onClick={() => refetch()}
        disabled={isFetching}
        className="h-10 w-10 rounded-xl cursor-pointer hover:bg-muted/80 transition-all active:scale-95 border-input/60 bg-input/10 shrink-0"
        title="Refresh patients list">
        <RiRefreshLine
          className={`size-4 text-muted-foreground ${
            isFetching ? "animate-spin text-primary" : ""
          }`}
        />
      </Button>
    </div>
  );
}

export default PatientsTableOperations;
