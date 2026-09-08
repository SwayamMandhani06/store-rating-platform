import { ArrowUp, ArrowDown, ArrowUpDown, Inbox } from 'lucide-react';

export default function SortableTable({
  columns,
  rows,
  sortBy,
  order,
  onSort,
  emptyText = 'No records found',
}) {
  function handleHeaderClick(col) {
    if (!col.sortable || !onSort) return;
    onSort(col.key);
  }

  return (
    <div>
      {/* Desktop / Tablet Table View */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleHeaderClick(col)}
                  className={`px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 select-none ${
                    col.sortable ? 'cursor-pointer hover:text-slate-800 transition-colors' : ''
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortBy === col.key ? (
                          order === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-brand-600" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-brand-600" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-300 group-hover:text-slate-400" />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Inbox className="w-8 h-8 mb-2 text-slate-300 stroke-[1.5]" />
                    <p className="text-sm font-medium">{emptyText}</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-slate-50/70 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5 text-slate-700 font-normal">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View (< sm breakpoint) */}
      <div className="block sm:hidden space-y-3">
        {rows.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
            <Inbox className="w-8 h-8 mb-2 text-slate-300 mx-auto stroke-[1.5]" />
            <p className="text-sm text-slate-400 font-medium">{emptyText}</p>
          </div>
        ) : (
          rows.map((row, i) => (
            <div
              key={row.id ?? i}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5"
            >
              {columns.map((col) => {
                if (!col.label && col.key === 'actions') {
                  return (
                    <div key={col.key} className="pt-2 border-t border-slate-100 flex justify-end">
                      {col.render ? col.render(row) : row[col.key]}
                    </div>
                  );
                }
                return (
                  <div key={col.key} className="flex items-start justify-between gap-2 text-sm">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      {col.label}
                    </span>
                    <span className="text-slate-800 text-right font-medium">
                      {col.render ? col.render(row) : row[col.key]}
                    </span>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
