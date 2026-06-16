'use client';

interface AdminTableProps {
  headers: string[];
  children: React.ReactNode;
  loading?: boolean;
  empty?: string;
}

export default function AdminTable({
  headers,
  children,
  loading = false,
  empty = 'Geen resultaten gevonden.',
}: AdminTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {headers.map((header) => (
                <th
                  key={header}
                  className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={headers.length} className="text-center py-12">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
        {!loading && (
          <div id="admin-table-empty-check" className="hidden">
            {/* empty check is handled per-page */}
          </div>
        )}
      </div>
    </div>
  );
}

// Exported empty row helper for consistent empty state styling
export function AdminTableEmptyRow({
  colSpan,
  message = 'Geen resultaten gevonden.',
}: {
  colSpan: number;
  message?: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="text-center py-12 text-slate-400 text-sm"
      >
        {message}
      </td>
    </tr>
  );
}
