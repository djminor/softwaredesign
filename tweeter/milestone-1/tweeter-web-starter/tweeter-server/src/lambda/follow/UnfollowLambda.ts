// AI-assisted: see AI-ATTRIBUTION.md
import { FollowToggleRequest, FollowToggleResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: FollowToggleRequest): Promise<FollowToggleResponse> => {
    const followService = new FollowService();
    const [followerCount, followeeCount] = await followService.unfollow(request.token, request.user);

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount,
    };
};
