import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE, PagedItemView } from "./PagedItemPresenter";

export class FeedItemPresenter extends StatusItemPresenter {

    public constructor(view: PagedItemView<Status>) {
        super(view)
    }

    protected itemDescription(): string {
        return "load followers";
    }
    
    protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
        return this.service.loadMoreFeedItems(authToken, userAlias, PAGE_SIZE, this.lastItem);
    }
}