import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCommunitiesUseCase } from '../../../features/community/application/get-community.usecase';
import communityRepository from '../../../features/community/infrastructure/repositories/community.repository';

export const COMMUNITY_KEYS = {
  all: ['communities'] as const,
  lists: () => [...COMMUNITY_KEYS.all, 'list'] as const,
  details: (id: string) => [...COMMUNITY_KEYS.all, 'detail', id] as const,
};

export function useCommunities() {
  return useQuery({
    queryKey: COMMUNITY_KEYS.lists(),
    queryFn: () => getCommunitiesUseCase(communityRepository),
  });
}

export function useJoinCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (communityId: string) => communityRepository.joinCommunity(communityId),
    onSuccess: () => {
      // Invalidate the list so it refetches (to update member count/joined status)
      queryClient.invalidateQueries({ queryKey: COMMUNITY_KEYS.lists() });
    },
  });
}