import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { CaretLeft, CaretRight } from "@/components/icons";
import type { TablePagination } from "./types";

const addComma = (n: number) => n.toLocaleString("en-US");

const getPageNumbers = (
  currentPage: number,
  totalPages: number,
): (number | string)[] => {
  if (totalPages <= 5)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export function PaginationControls({
  pageIndex,
  pageSize,
  pageCount,
  totalItems,
  hasNextPage,
  hasPrevPage,
  setPageIndex,
}: TablePagination) {
  if (totalItems === 0) return null;

  const currentPage = pageIndex + 1;
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const arrowProps = {
    size: "sm",
    variant: "outline",
    bg: "transparent",
    color: "gray.300",
    borderColor: "gray.50",
    _hover: { bg: "gray.25", color: "gray.400" },
  } as const;

  return (
    <Flex
      as="nav"
      aria-label="Pagination"
      justify="space-between"
      align="center"
      wrap="wrap"
      gap="0.75rem"
      mt={4}
      px={4}
      py={3}
      bg="white"
      borderTop="1px solid"
      borderColor="gray.50"
    >
      <Text textStyle="small-regular" color="gray.300">
        Showing {addComma(startItem)} to {addComma(endItem)} of{" "}
        {addComma(totalItems)} items
      </Text>

      {pageCount > 1 && (
        <Flex align="center" gap={2}>
          <IconButton
            {...arrowProps}
            aria-label="Previous page"
            disabled={!hasPrevPage}
            onClick={() => setPageIndex(pageIndex - 1)}
          >
            <CaretLeft />
          </IconButton>

          {getPageNumbers(currentPage, pageCount).map((page, index) =>
            page === "..." ? (
              <Text
                key={`ellipsis-${index}`}
                px={2}
                color="gray.300"
                aria-hidden
              >
                ...
              </Text>
            ) : (
              <Button
                key={page}
                size="sm"
                variant="outline"
                bg={currentPage === page ? "primary.300" : "white"}
                color={currentPage === page ? "white" : "gray.300"}
                borderColor={currentPage === page ? "primary.300" : "gray.50"}
                _hover={currentPage === page ? undefined : { bg: "gray.25" }}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
                onClick={() => setPageIndex(Number(page) - 1)}
                minW="40px"
              >
                {page}
              </Button>
            ),
          )}

          <IconButton
            {...arrowProps}
            aria-label="Next page"
            disabled={!hasNextPage}
            onClick={() => setPageIndex(pageIndex + 1)}
          >
            <CaretRight />
          </IconButton>
        </Flex>
      )}
    </Flex>
  );
}
