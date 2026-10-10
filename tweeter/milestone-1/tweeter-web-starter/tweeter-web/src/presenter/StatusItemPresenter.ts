import { AuthToken, Status, User } from "tweeter-shared"
import { StatusService } from "../model.service/StatusService";

export interface StatusItemView {
    addItems: (items: Status[]) => void
    displayErrorMessage: (message: string) => void
}

export abstract class StatusItemPresenter {
    private _view: StatusItemView;
    private _hasMoreItems = true;
    private _lastItem: Status | null = null;
    private statusService: StatusService


    reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> {
        return this.statusService.getUser(authToken, alias)
    };

    protected constructor(view: StatusItemView) {
        this._view = view
        this.statusService = new StatusService()
    }

    protected get view() {
        return this._view
    }

    protected get lastItem() {
        return this._lastItem
    }

    protected set lastItem(value: Status | null) {
        this._lastItem = value
    }

    public get hasMoreItems() {
        return this._hasMoreItems
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value
    }

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}