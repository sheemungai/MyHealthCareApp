// components/PatientsTable.tsx
import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { useGetPatientQuery, useDeletePatient } from '@/hooks/patientsHook';
import type { TPatient } from '@/Types/types';

export const PatientsTable = () => {
  const [search, setSearch] = useState('');
 
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError } = useGetPatientQuery(
    pagination.pageIndex + 1,
    pagination.pageSize,
    search
  );

  const deleteMutation = useDeletePatient();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

 

  const columns = useMemo<ColumnDef<TPatient>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'patient_id',
        size: 80,
      },
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Date of Birth',
        cell: ({ row }) => formatDate(row.original.dob),
      },
      {
        header: 'Gender',
        accessorKey: 'gender',
      },
      {
        header: 'Phone',
        accessorKey: 'phone',
        cell: ({ row }) => (
          <span className="font-mono">{row.original.phone}</span>
        ),
      },
      {
        header: 'Address',
        accessorKey: 'address',
        cell: ({ row }) => (
          <span className="truncate max-w-xs inline-block">
            {row.original.address}
          </span>
        ),
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${row.original.name}?`)) {
                deleteMutation.mutate(row.original.patient_id);
              }
            }}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        ),
        size: 100,
      },
    ],
    [deleteMutation]
  );

  const table = useReactTable({
    data: data || [],
    columns,
    pageCount: Math.ceil((data?.total || 0) / pagination.pageSize),
    state: {
      pagination,
      globalFilter: search,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Error loading patients. Please try again.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{ width: header.getSize() }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td 
                      key={cell.id} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={pagination.pageSize}
              onChange={(e) => {
                setPagination({
                  ...pagination,
                  pageSize: Number(e.target.value),
                  pageIndex: 0,
                });
              }}
              className="border rounded-md p-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {[10, 20, 30, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Page {pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                «
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                ‹
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                ›
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};