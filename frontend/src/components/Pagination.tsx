function getPageItems(
  page: number,
  totalPages: number,
  siblingCount = 2
) {
  const items: (number | "...")[] = [];

  const firstPage = 1;
  const lastPage = totalPages;

  const left = Math.max(page - siblingCount, 2);
  const right = Math.min(page + siblingCount, totalPages - 1);

  items.push(firstPage);

  if (left > 2) items.push("...");

  for (let p = left; p <= right; p++) {
    items.push(p);
  }

  if (right < totalPages - 1) items.push("...");

  if (totalPages > 1) items.push(lastPage);

  return items;
}

interface Props {
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (page: number) => void;
}

export function Pagination({
    total,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange
}: Props) {
    const totalPages = Math.ceil(total / pageSize);
    const pageItems = getPageItems(page, totalPages, 2);

    return (
        <div className="d-flex align-items-center justify-content-center gap-3 mt-3">            
            <span>Total {total} items</span>

            <ul className="pagination mb-0">

                {/* Previous */}
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => page > 1 && onPageChange(page - 1)}
                    >
                        &lt;
                    </button>
                </li>

                {/* Page Numbers */}
                {pageItems.map((item, idx) =>
                item === "..." ? (
                    <li key={`dots-${idx}`} className="page-item disabled">
                    <span className="page-link">…</span>
                    </li>
                ) : (
                    <li
                    key={item}
                    className={`page-item ${item === page ? "active" : ""}`}
                    >
                    <button className="page-link" onClick={() => onPageChange(item)}>
                        {item}
                    </button>
                    </li>
                )
                )}

                {/* Next */}
                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => page < totalPages && onPageChange(page + 1)}
                    >
                        &gt;
                    </button>
                </li>

            </ul>

            <select
                className="form-select w-auto"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
            </select>
        </div>
    );
}