export const getPageNumbersResponsive = (
  currentPage: number,
  totalPages: number,
  pagesToShow = 5
): number[] => {
  // enforce sane minimum
  if (pagesToShow < 3) pagesToShow = 3;

  // if small amount of pages, show all
  if (totalPages <= pagesToShow) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const middleCount = pagesToShow - 2; // exclude first & last
  let left = Math.max(2, currentPage - Math.floor(middleCount / 2));
  let right = Math.min(totalPages - 1, left + middleCount - 1);
  left = Math.max(2, right - middleCount + 1);

  const pages: number[] = [1];

  if (left > 2) pages.push(-1); // leading ellipsis

  for (let i = left; i <= right; i++) pages.push(i);

  if (right < totalPages - 1) pages.push(-1); // trailing ellipsis

  pages.push(totalPages);

  return pages;
};
