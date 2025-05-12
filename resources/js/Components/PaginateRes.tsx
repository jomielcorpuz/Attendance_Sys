import React from "react";
import { router } from "@inertiajs/react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination";

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationData {
  links: PaginationLink[];
  current_page: number;
  last_page: number;
}

export function PaginateRes({ pagination }: { pagination: PaginationData }) {
  console.log("Pagination component data:", pagination);

  if (!pagination || !pagination.links) {
    console.log("No pagination data available");
    return null;
  }

  const handlePageClick = (url: string | null, e: React.MouseEvent) => {
    if (url) {
      e.preventDefault();

      // Preserve current query parameters
      const currentQueryParams = new URLSearchParams(window.location.search);
      const newPageUrl = new URL(url, window.location.origin);

      newPageUrl.searchParams.forEach((value, key) => {
        currentQueryParams.set(key, value);
      });

      router.get(newPageUrl.pathname + "?" + currentQueryParams.toString(), {}, {
        preserveState: true,
        preserveScroll: true,
      });
    }
  };


  const { current_page, last_page } = pagination;
  const linksArray: PaginationLink[] = Object.values(pagination.links);
  const firstPageUrl = current_page > 1 ? linksArray[1].url : null;
  const lastPageUrl = current_page < last_page ? linksArray[linksArray.length - 2].url : null;
  const prevLink = linksArray[0];
  const nextLink = linksArray[linksArray.length - 1];

  // Determine which page numbers to show
  const pagesToShow: (number | "...")[] = [];
  if (last_page <= 5) {
    // If 5 or fewer pages, show all
    for (let i = 1; i <= last_page; i++) pagesToShow.push(i);
  } else {
    // Show first page
    pagesToShow.push(1);

    if (current_page > 3) pagesToShow.push("...");

    // Show pages around current page
    const start = Math.max(2, current_page - 1);
    const end = Math.min(last_page - 1, current_page + 1);
    for (let i = start; i <= end; i++) pagesToShow.push(i);

    if (current_page < last_page - 2) pagesToShow.push("...");

    // Show last page
    pagesToShow.push(last_page);
  }

  return (
    <Pagination className="mt-4">
      <PaginationContent>


        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href={prevLink.url || "#"}
            onClick={(e) => handlePageClick(prevLink.url, e)}
            className={!prevLink.url ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {pagesToShow.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={linksArray.find((link) => link.label == page.toString())?.url || "#"}
                onClick={(e) =>
                  handlePageClick(
                    linksArray.find((link) => link.label == page.toString())?.url || null,
                    e
                  )
                }
                isActive={page === current_page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>

        ))}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href={nextLink.url || "#"}
            onClick={(e) => handlePageClick(nextLink.url, e)}
            className={!nextLink.url ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>


      </PaginationContent>
    </Pagination>
  );
}

export default PaginateRes;
