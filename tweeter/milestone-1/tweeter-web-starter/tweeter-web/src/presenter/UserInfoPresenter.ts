import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";

export interface UserInfoView {
    displayErrorMessage: (message: string) => void
}

export class UserInfoPresenter {
    private _view: UserInfoView
    private followService: FollowService

    public constructor(view: UserInfoView) {
        this._view = view
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
}