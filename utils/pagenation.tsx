export const renderPageNumbers = (
  currentPage: number,
  totalPages: number,
  setCurrentPage: (page: number) => void
) => {
  const pageNumbers = [];
  const limit = 10;
  const startPage = Math.floor((currentPage - 1) / limit) * limit + 1;
  const endPage = Math.min(startPage + limit - 1, totalPages);

  if (startPage > 1) {
    pageNumbers.push(
      <button
        key="prevGroup"
        onClick={() => setCurrentPage(startPage - 1)}
        className="px-3 py-1 border rounded cursor-pointer"
      >
        &lt;
      </button>
    );
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(
      <button
        key={i}
        onClick={() => setCurrentPage(i)}
        className={`px-3 py-1 border rounded cursor-pointer ${
          currentPage === i ? "bg-gray-200 font-bold" : ""
        }`}
      >
        {i}
      </button>
    );
  }

  if (endPage < totalPages) {
    pageNumbers.push(
      <button
        key="nextGroup"
        onClick={() => setCurrentPage(endPage + 1)}
        className="px-3 py-1 border rounded cursor-pointer"
      >
        &gt;
      </button>
    );
  }

  return pageNumbers;
};
