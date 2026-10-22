import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { LoginService } from "../model.service/LoginService";
import { User } from "tweeter-shared";
import { UserAuthPresenter, UserAuthView } from "./UserAuthPresenter";

export class LoginPresenter extends UserAuthPresenter {

    private service: LoginService;

    public constructor(url: string, view: UserAuthView) {
        super(view)
        this.service = new LoginService()
        this.originalUrl = url
    }

    protected isValid(): boolean {
      return true;
    }

    protected async doAuth(): Promise<[User, AuthToken]> {
      return this.service.login(this.alias, this.password);
    }

    protected get authOperationDescription(): string {
      return "log user in";
    }

}