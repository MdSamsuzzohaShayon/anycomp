import { ChevronLeft, ChevronRight } from "lucide-react";

// Pagination Component
function Pagination({
    currentPage,
    totalPages,
    onPageChange
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    const pageNumbers: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="px-4 md:px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-1 md:gap-2">
                {/* Previous */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-2 md:px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                </button>

                {/* First page + ellipsis */}
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className={`w-8 h-8 flex items-center justify-center text-sm rounded transition-colors ${
                                1 === currentPage
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="px-1 md:px-2 text-gray-500">...</span>}
                    </>
                )}

                {/* Visible page numbers */}
                {pageNumbers.map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber)}
                        className={`w-8 h-8 flex items-center justify-center text-sm rounded transition-colors ${
                            pageNumber === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {pageNumber}
                    </button>
                ))}

                {/* Last page + ellipsis */}
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-1 md:px-2 text-gray-500">...</span>}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className={`w-8 h-8 flex items-center justify-center text-sm rounded transition-colors ${
                                totalPages === currentPage
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-2 md:px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next page"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default Pagination;