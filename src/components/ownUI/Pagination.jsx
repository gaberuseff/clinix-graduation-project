import {useSearchParams} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {RiArrowLeftSLine, RiArrowRightSLine} from "@remixicon/react";
import {PAGE_SIZE} from "@/utils/constants";

export function Pagination({count, pageSize = PAGE_SIZE, resourceName = "items"}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const pageCount = Math.ceil((count || 0) / pageSize);

  if (pageCount <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, count || 0);

  function handlePrevPage() {
    if (page > 1) {
      searchParams.set("page", page - 1);
      setSearchParams(searchParams);
    }
  }

  function handleNextPage() {
    if (page < pageCount) {
      searchParams.set("page", page + 1);
      setSearchParams(searchParams);
    }
  }

  return (
    <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/20">
      <p className="text-xs text-muted-foreground font-medium font-sans">
        Showing <span className="font-semibold text-foreground">{from}</span> to{" "}
        <span className="font-semibold text-foreground">{to}</span> of{" "}
        <span className="font-semibold text-foreground">{count}</span> {resourceName}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={page === 1}
          className="h-8 gap-1 pl-2.5 font-sans"
        >
          <RiArrowLeftSLine className="size-4" />
          <span>Previous</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={page === pageCount}
          className="h-8 gap-1 pr-2.5 font-sans"
        >
          <span>Next</span>
          <RiArrowRightSLine className="size-4" />
        </Button>
      </div>
    </div>
  );
}
