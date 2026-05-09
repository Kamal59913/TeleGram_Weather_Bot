import Pagination from "../pagination/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

export interface Column<T> {
  header: string;
  accessor: (item: T, index: number) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  disableRowClick?: boolean; // NEW: Allow specific columns to disable row click
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  pagination?: {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  };
  currentPage?: number;
  limit?: number;
  onRowClick?: (item: T) => void; // NEW: Row click handler
  getRowClassName?: (item: T) => string; // NEW: Custom row styling
  minWidth?: string | number;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No Data",
  pagination,
  currentPage = 1,
  limit = 10,
  onRowClick, // NEW
  getRowClassName, // NEW
  minWidth,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div style={{ minWidth }}>
          <Table className="w-full border-b border-gray-200">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {columns.map((column, idx) => (
                  <TableCell
                    key={idx}
                    isHeader
                    className={
                      column.headerClassName ||
                      "px-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400"
                    }
                  >
                    {column.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {!isLoading && !data.length && (
                <TableRow>
                  <td
                    className="text-center px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400"
                    colSpan={columns.length}
                  >
                    {emptyMessage}
                  </td>
                </TableRow>
              )}
              {data.map((item, index) => (
                <TableRow
                  key={index}
                  className={`
                  ${onRowClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]" : ""}
                  ${getRowClassName ? getRowClassName(item) : ""}
                `}
                >
                  {columns.map((column, colIdx) => (
                    <TableCell
                      key={colIdx}
                      className={
                        column.cellClassName ||
                        "px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      }
                      onClick={(e) => {
                        // If column has disableRowClick or if click target has its own handler, don't trigger row click
                        if (column.disableRowClick) return;

                        // Check if the click target or any parent has its own onClick handler
                        const target = e.target as HTMLElement;
                        const hasClickHandler = target.closest(
                          'button, a, [role="button"], [onclick]'
                        );

                        if (!hasClickHandler && onRowClick) {
                          onRowClick(item);
                        }
                      }}
                    >
                      <>
                        {column.accessor(item, index + (currentPage - 1) * limit)}
                      </>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {pagination && (
          <Pagination
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
            onPageChange={pagination.onPageChange}
          />
        )}
      </div>
    </div>
  );
}
