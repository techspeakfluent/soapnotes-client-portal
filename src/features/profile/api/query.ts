import type { QueryConfigType } from "@/lib/react-query";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import type { ApiResponse } from "@/shared/interface/api";
import type {
  INotificationPreferences,
  IPortalClient,
} from "@/shared/interface/portal";
import {
  addEmail,
  getActivity,
  getPreferences,
  removeEmail,
  setPrimaryEmail,
  updatePreferences,
  updateProfile,
} from "./service";

const useClientMutation = <A>(
  mutationFn: (arg: A) => Promise<ApiResponse<IPortalClient>>,
  successMessage: string,
  errorMessage: string,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (response) =>
      queryClient.setQueryData([customQueryKey.client.me], response),
    meta: {
      successMessage,
      errorMessage,
      invalidatesQueryKeys: [[customQueryKey.client.activity]],
    },
  });
};

export const useUpdateProfile = () =>
  useClientMutation(
    updateProfile,
    "Your details are saved",
    "We couldn't save your details. Please try again.",
  );

export const useAddEmail = () =>
  useClientMutation(
    addEmail,
    "Email added",
    "We couldn't add that email. Please try again.",
  );

export const useRemoveEmail = () =>
  useClientMutation(
    removeEmail,
    "Email removed",
    "We couldn't remove that email. Please try again.",
  );

export const useSetPrimaryEmail = () =>
  useClientMutation(
    setPrimaryEmail,
    "Primary email updated",
    "We couldn't change your primary email. Please try again.",
  );

export const useGetPreferences = (
  config?: QueryConfigType<typeof getPreferences>,
) =>
  useQuery({
    queryKey: [customQueryKey.client.preferences],
    queryFn: getPreferences,
    ...config,
  });

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  const key = [customQueryKey.client.preferences];
  return useMutation({
    mutationFn: updatePreferences,
    onMutate: async (change: Partial<INotificationPreferences>) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous =
        queryClient.getQueryData<ApiResponse<INotificationPreferences>>(key);
      if (previous) {
        queryClient.setQueryData(key, {
          ...previous,
          data: { ...previous.data, ...change },
        });
      }
      return { previous };
    },
    onError: (_error, _change, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    meta: {
      successMessage: "Preferences saved",
      errorMessage: "We couldn't save that preference. Please try again.",
    },
  });
};

export const useGetActivityFeed = (limit: number) =>
  useInfiniteQuery({
    queryKey: [customQueryKey.client.activity, limit],
    queryFn: ({ pageParam }) => getActivity({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metadata.hasNextPage
        ? lastPage.metadata.current_page + 1
        : undefined,
  });
