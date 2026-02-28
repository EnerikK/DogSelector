import React from "react";

export interface Column<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;     
  headerClassName?: string; 
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
}

export function DataTable<T extends { id: number }>({
  data,
  columns,
}: Props<T>) {
  return (
    <div className="card shadow-sm p-3">
      <table className="table table-hover align-middle">
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
  );
}