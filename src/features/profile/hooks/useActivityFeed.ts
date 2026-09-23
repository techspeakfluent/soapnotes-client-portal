import { useGetActivityFeed } from "../api/query";

const PAGE_SIZE = 5;

export function useActivityFeed() {
  const query = useGetActivityFeed(PAGE_SIZE);

  return {
    activities: query.data?.pages.flatMap((page) => page.data) ?? [],
    isPending: query.isPending,
    error: query.error,
    retry: () => query.refetch(),
    isRetrying: query.isRefetching && !query.isFetchingNextPage,
    hasMore: !!query.hasNextPage,
    loadMore: () => query.fetchNextPage(),
    isLoadingMore: query.isFetchingNextPage,
  };
}
