// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { Presenter, View } from "./Presenter";


export class UserInfoPresenter extends Presenter<View>{
    private followService: FollowService

    public constructor(view: View) {
        super(view)
        this.followService = new FollowService()
    }

    public async getIsFollowerStatus (
          authToken: AuthToken,
          user: User,
          selectedUser: User,
        ): Promise<boolean> {
          return this.followService.getIsFollowerStatus(authToken, user, selectedUser)
        };

    public async getFolloweeCount (
          authToken: AuthToken,
          user: User,
        ): Promise<number> {
          return this.followService.getFolloweeCount(authToken, user)
        };

    public async getFollowerCount (
          authToken: AuthToken,
          user: User,
        ): Promise<number> {
          return this.followService.getFollowerCount(authToken, user)
        };

    public async follow (
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.followService.follow(authToken, userToFollow);
  };

  public async unfollow (
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.followService.unfollow(authToken, userToUnfollow);
  };
}