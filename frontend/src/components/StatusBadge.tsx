interface Props {
    status: string;
}

export function StatusBadge({status}: Props) {
    const colorMap: Record<string,string> = {
        pending: "warning",
        accepted: "success",
        rejected: "secondary",
    };

    return (
        <span className={`badge bg-${colorMap[status.toLocaleLowerCase()] || "secondary"}`}>
            {status}
        </span>
    );
}