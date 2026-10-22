import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { Service } from "../model.service/Service";
import { UserService } from "../model.service/UserService";

export const PAGE_SIZE = 10


export interface PagedItemView<T> extends View {
    addItems: (items: T[]) => void
}

export abstract class PagedItemPresenter<T, U extends Service> extends Presenter<PagedItemView<T>> {
    private _hasMoreItems = true;
    private _lastItem: T | null = null;
    private _service: U;
    private userService = new UserService()

    reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> {
        return this.userService.getUser(authToken, alias)
    };

    protected constructor(view: PagedItemView<T>) {
        super(view)
        this._service = this.serviceFactory()
    }

    protected get lastItem() {
        return this._lastItem
    }

    protected get service() {
        return this._service
    }

    protected set lastItem(value: T | null) {
        this._lastItem = value
    }

    public get hasMoreItems() {
        return this._hasMoreItems
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
      this.doFailureReportingOperation(async () => {
        const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias)
    
          this.hasMoreItems = hasMore;
          this.lastItem = newItems.length < 0 ? null : newItems[newItems.length - 1];          
          this.view.addItems(newItems);
      }, "load followers")
    };

    protected abstract itemDescription(): string;

    protected abstract serviceFactory(): U

    protected abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>

}