import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useTitles } from "../../hooks/useTitles";

export default function TitleData() {
  const { titles, loading, error } = useTitles();

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // adjust as desired

  if (loading) return <p>Loading titles…</p>;
  if (error)   return <p className="text-red-500">Error: {error}</p>;
  if (!titles.length) return <p>No titles found.</p>;

  const totalPages = Math.ceil(titles.length / pageSize);

  // only show the titles for this page
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx   = startIdx + pageSize;
  const pageItems = titles.slice(startIdx, endIdx);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Title Number – Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Last Amended Date
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Latest Issue Date
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Up to Date As Of
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {pageItems.map(({ number, name, lastAmendedOn, latestIssueDate, upToDateAsOf }) => (
                <TableRow key={number}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {number} – {name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {lastAmendedOn}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {latestIssueDate}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {upToDateAsOf}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination controls */}
      <nav className="flex items-center justify-center space-x-2">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>

        {/* page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </nav>
    </div>
  );
}
