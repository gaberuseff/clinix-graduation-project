import {Input} from "@/components/ui/input";
import {RiSearchLine, RiCloseLine} from "@remixicon/react";
import {useState, useEffect} from "react";
import {useSearchParams} from "react-router-dom";

function Search({paramName = "search", placeholder = "Search...", className = ""}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get(paramName) || "");

  // Sync state with URL search param if it changes externally
  useEffect(() => {
    setQuery(searchParams.get(paramName) || "");
  }, [searchParams, paramName]);

  const handleSearch = () => {
    const nextSearchParams = new URLSearchParams(searchParams);
    if (query.trim()) {
      nextSearchParams.set(paramName, query.trim());
    } else {
      nextSearchParams.delete(paramName);
    }
    // Reset page to 1 when a new search is performed to prevent empty page views
    if (nextSearchParams.has("page")) {
      nextSearchParams.set("page", "1");
    }
    setSearchParams(nextSearchParams);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery("");
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete(paramName);
    if (nextSearchParams.has("page")) {
      nextSearchParams.set("page", "1");
    }
    setSearchParams(nextSearchParams);
  };

  return (
    <div className={`relative flex items-center w-full max-w-sm ${className}`}>
      <span className="absolute left-3.5 text-muted-foreground/60">
        <RiSearchLine className="size-4 pointer-events-none" />
      </span>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-10 pr-9 w-full"
      />
      {query && (
        <button
          onClick={handleClear}
          type="button"
          className="absolute right-3 text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer p-0.5 rounded-full hover:bg-muted/80">
          <RiCloseLine className="size-4" />
        </button>
      )}
    </div>
  );
}

export default Search;
