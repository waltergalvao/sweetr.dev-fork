import { Box, BoxProps, Button, Skeleton, Stack } from "@mantine/core";
import { CardPullRequest } from "../../../../components/card-pull-request";
import {
  PullRequest,
  PullRequestOwnerType,
  PullRequestState,
} from "@sweetr/graphql-types/frontend/graphql";
import { useWorkspace } from "../../../../providers/workspace.provider";
import { usePullRequestsInfiniteQuery } from "../../../../api/pull-request.api";
import { useAuthenticatedUser } from "../../../../providers/auth.provider";
import { parseISO } from "date-fns";
import { parseNullableISO } from "../../../../providers/date.provider";
import { LoadableContent } from "../../../../components/loadable-content";
import { PageEmptyState } from "../../../../components/page-empty-state";
import { IconMilkshake } from "@tabler/icons-react";
import { getPullRequestChanges } from "../../../../providers/pull-request.provider";

export const MyOpenPullRequests = (props: BoxProps) => {
  const { user } = useAuthenticatedUser();
  const { workspace } = useWorkspace();

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isFetchedAfterMount,
  } = usePullRequestsInfiniteQuery(
    {
      input: {
        ownerIds: [user.id],
        ownerType: PullRequestOwnerType.PERSON,
        states: [PullRequestState.OPEN, PullRequestState.DRAFT],
      },
      workspaceId: workspace.id,
    },
    {
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => {
        const lastPullRequest = lastPage.workspace.pullRequests.at(-1);

        if (lastPage.workspace.pullRequests.length < 10) return undefined;

        return lastPullRequest?.id || undefined;
      },
    },
  );

  const pullRequests = data?.pages
    .flatMap((page) => page.workspace.pullRequests)
    .filter((pullRequest): pullRequest is PullRequest => !!pullRequest);

  const isLoading =
    (isFetching && !pullRequests) ||
    (isFetchedAfterMount &&
      isFetching &&
      (pullRequests?.length === 0 || !pullRequests));

  const isEmpty = !!(pullRequests && pullRequests.length === 0 && !isLoading);

  return (
    <LoadableContent
      {...props}
      isLoading={isLoading}
      isEmpty={isEmpty}
      whenEmpty={
        <Box mt="lg">
          <PageEmptyState
            message="You're all caught up."
            icon={IconMilkshake}
          />
        </Box>
      }
      whenLoading={
        <Stack>
          <Skeleton height={85} />
          <Skeleton height={85} />
        </Stack>
      }
      content={
        <Stack {...props}>
          {pullRequests?.map((pr) => (
            <CardPullRequest key={pr.id} pullRequest={pr} />
          ))}
          {hasNextPage && (
            <Box ta="center">
              <Button
                variant="outline"
                fullWidth={false}
                onClick={() => {
                  fetchNextPage();
                }}
                loading={isFetchingNextPage}
              >
                Load more
              </Button>
            </Box>
          )}
        </Stack>
      }
    />
  );
};
