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

    public async doLoginOrRegister(updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void, navigate: (url: string) => void) {
            try {
              this.isLoading = true;
        
              const [user, authToken] = await this.service.login(this.alias, this.password);
        
              updateUserInfo(user, user, authToken, this.rememberMe);
        
              if (!!this.originalUrl) {
                navigate(this.originalUrl);
              } else {
                navigate(`/feed/${user.alias}`);
              }
            } catch (error) {
              this.view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
              );
            } finally {
              this.isLoading = false;
            }
    };

}