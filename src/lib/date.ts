export const formatDate = (dateString: string | null) => {
    if (!dateString) return "--";

    return new Date(dateString).toLocaleDateString("en-CA", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};
