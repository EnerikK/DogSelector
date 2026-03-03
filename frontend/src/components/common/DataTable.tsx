import React from "react";

export interface Column<T> {
  id: string;
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;     
  headerClassName?: string; 
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  footer?: React.ReactNode;
}

export function DataTable<T extends { id: number }>({
  data,
  columns,
  footer
}: Props<T>) {
  return (
    <div className="card shadow-sm">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th key={col.id} className={col.headerClassName || col.className}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.id} className={col.className}>
                    {typeof col.accessor === "function"
                      ? col.accessor(row)
                      : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer && (
        <div className="card-footer bg-white border-top py-2">
          {footer}
        </div>
      )}
    </div>
  );
}