import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border/40 bg-card/45 backdrop-blur-xs shadow-xs animate-pulse">
      <div className="overflow-x-auto w-full">
        <Table className="w-full text-left border-collapse">
          <TableHeader className="bg-muted/40">
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i} className="py-4 pl-6">
                  <Skeleton className="h-5 w-24 bg-muted-foreground/10" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="border-b border-border/25">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex} className="py-5 pl-6">
                    <Skeleton 
                      className={`h-5 bg-muted-foreground/10 rounded-lg ${
                        colIndex === 0 
                          ? "w-32" 
                          : colIndex === columns - 1 
                          ? "w-16" 
                          : "w-24"
                      }`} 
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default TableSkeleton;
