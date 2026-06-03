import {Button} from "@/components/ui/button";
import {RiRefreshLine} from "@remixicon/react";
import useSecretaries from "./useSecretaries";

function SecretariesTableOperations() {
  const {refetch, isFetching} = useSecretaries();

  return (
    <div className="flex items-center gap-2.5 w-full sm:w-auto">
      <Button
        variant="outline"
        size="icon"
        onClick={() => refetch()}
        disabled={isFetching}
        className="shrink-0"
        title="Refresh secretaries list">
        <RiRefreshLine
          className={`size-4 text-muted-foreground ${
            isFetching ? "animate-spin text-primary" : ""
          }`}
        />
      </Button>
    </div>
  );
}

export default SecretariesTableOperations;
