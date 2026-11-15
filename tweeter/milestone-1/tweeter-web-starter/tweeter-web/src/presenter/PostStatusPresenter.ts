import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView } from "./Presenter";

export interface PostStatusView extends MessageView {
    clearPost(): void;
    setIsLoading(isLoading: boolean): void;
}

export class PostStatusPresenter {
    private view: PostStatusView;
    private _service: StatusService;

    public constructor(view: PostStatusView) {
        this.view = view;
        this._service = new StatusService();
    }

    public get service(): StatusService {
        return this._service;
    }

    public async submitPost(post: string, currentUser: User | null, authToken: AuthToken | null): Promise<void> {
        if (!authToken || !currentUser) {
            return;
        }

        let postingStatusToastId = "";

        try {
            this.view.setIsLoading(true);
            postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);

            const status = new Status(post, currentUser, Date.now());

            await this.service.postStatus(authToken, status);

            this.view.clearPost();
            this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to post the status because of exception: ${error}`
            );
        } finally {
            this.view.deleteMessage(postingStatusToastId);
            this.view.setIsLoading(false);
        }
    }
}