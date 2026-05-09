
export const handlePaginatedDelete = async (
    dataLength: number,
    currentPage: number,
    setCurrentPage: (page: number) => void,
    onRefetch: () => void
) => {
    if (dataLength === 1 && currentPage > 1) {

        setCurrentPage(currentPage - 1);
        onRefetch();
    } else {
        onRefetch();
    }
};