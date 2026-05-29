interface Props {
    status: string;
}

export function StatusBadge({status}: Props) {
    const colorMap: Record<string,string> = {
        pending: "warning",
        accepted: "success",
        rejected: "secondary",
        available: "success",
        reserved: "warning",
        adopted: "primary",
        unavailable: "secondary",
    };

    return (
        <span className={`badge bg-${colorMap[status.toLocaleLowerCase()] || "secondary"}`}>
            {status.replace("_", " ")}
        </span>
    );
}
