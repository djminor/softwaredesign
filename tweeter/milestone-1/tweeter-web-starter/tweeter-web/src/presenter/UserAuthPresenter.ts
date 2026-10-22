import { User, AuthToken } from "tweeter-shared"
import { Presenter, View } from "./Presenter"


export interface UserAuthView extends View{
    displayErrorMessage: (message: string) => void
}

export abstract class UserAuthPresenter extends Presenter<UserAuthView> {
    private _alias: string = ''
    private _password: string = ''
    private _isLoading: boolean = false
    private _rememberMe: boolean = false
    private _originalUrl: string = ''
    private _firstName: string = ''
    private _lastName: string = ''
    private _imageBytes: Uint8Array | null = null
    private _imageFileExtension: string = ''

    protected constructor(view: UserAuthView) {
        super(view)
    }

    public get firstName() {
        return this._firstName
    }

    public set firstName(firstName: string) {
        this._firstName = firstName
    }

    public get lastName() {
        return this._lastName
    }

    public set lastName(lastName: string) {
        this._lastName
    }

    public get imageBytes() {
        return this._imageBytes
    }

    public set imageBytes(imageBytes: Uint8Array | null) {
        this._imageBytes = imageBytes
    }

    public get imageFileExtension() {
        return this._imageFileExtension
    }

    public set imageFileExtension(imageFileExtension: string) {
        this._imageFileExtension = imageFileExtension
    }

    public get alias() {
        return this._alias
    }

    public get password() {
        return this._password
    }

    public set password(password: string) {
        this._password = password
    }

    public set alias(alias: string) {
        this._alias = alias
    }

    public get isLoading() {
        return this._isLoading
    }

    public set isLoading(isLoading: boolean) {
        this._isLoading = isLoading
    }

    public get rememberMe() {
        return this._rememberMe
    }

    public set rememberMe(rememberMe: boolean) {
        this._rememberMe = rememberMe
    }

    public get originalUrl() {
        return this._originalUrl
    }

    public set originalUrl(originalUrl: string) {
        this._originalUrl = originalUrl
    }

    public async doLoginOrRegister(updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void, navigate: (url: string) => void) {
        this.doFailureReportingOperation(async () => {
            
            if (!this.isValid()) {
            return;
            }

            this.isLoading = true;

            const [user, authToken] = await this.doAuth();

            updateUserInfo(user, user, authToken, this.rememberMe);

            if (!!this.originalUrl) {
            navigate(this.originalUrl);
            } else {
            navigate(`/feed/${user.alias}`);
            }
        }, this.authOperationDescription);
    };

    protected abstract isValid(): boolean;
    protected abstract doAuth(): Promise<[User, AuthToken]>;
    protected abstract get authOperationDescription(): string;
}