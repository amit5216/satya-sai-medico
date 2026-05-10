/**
 * ============================================================
 * DATA TABLE — Generic CRUD data table with search + pagination
 * ============================================================
 *
 * 🎓 WHY A GENERIC DATA TABLE?
 * DoctorManagement, PatientManagement, and MedicineManagement
 * all have the SAME pattern: search bar → table → pagination.
 * This component extracts that pattern into a reusable piece.
 *
 * Usage:
 *   <DataTable
 *     data={doctors}
 *     columns={[
 *       { key: 'name', header: 'Name' },
 *       { key: 'specialization', header: 'Specialty' },
 *       { key: 'status', header: 'Status', render: (doc) => <Badge>...</Badge> },
 *     ]}
 *     searchKeys={['name', 'specialization']}
 *     searchPlaceholder="Search doctors..."
 *     actions={(item) => <div>Edit | Delete</div>}
 *   />
 *
 * 🎓 INTERVIEW: "How do you avoid code duplication in CRUD pages?"
 * → "I built a generic DataTable component that accepts column
 *    definitions, search keys, and action renderers. Each CRUD page
 *    simply defines its columns and passes data. The search,
 *    pagination, and empty state logic lives in one place."
 */

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { EmptyState } from '../ui/empty-state';
import { cn } from '../../lib/utils';

function DataTable({
  data = [],
  columns = [],
  searchPlaceholder = 'Search...',
  searchKeys = [],
  itemsPerPage = 10,
  actions,
  emptyTitle = 'No data found',
  emptyDescription = 'Try adjusting your search or filters.',
  emptyIcon,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Multi-key search filtering
  const filteredData = searchKeys.length > 0
    ? data.filter(item =>
        searchKeys.some(key => {
          const value = item[key];
          return typeof value === 'string' &&
            value.toLowerCase().includes(searchQuery.toLowerCase());
        })
      )
    : data;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div>
      {/* Search Bar */}
      {searchKeys.length > 0 && (
        <div className="mb-4 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
      )}

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <tr>
              {columns.map((col) => (
                <TableHead key={String(col.key)} className={col.headerClassName}>
                  {col.header}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)} className={col.className}>
                    {col.render
                      ? col.render(item)
                      : String(item[col.key] ?? '—')}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="text-right">
                    {actions(item)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Empty State */}
        {paginatedData.length === 0 && (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            className="py-12"
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export { DataTable };
