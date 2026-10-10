import { User, AuthToken } from "tweeter-shared";
import { UserAuthPresenter, UserAuthView } from "./UserAuthPresenter";
import { RegisterService } from "../model.service/RegisterService";

export class RegisterPresenter extends UserAuthPresenter {

    private service: RegisterService

    public constructor(url: string, view: UserAuthView) {
        super(view)
        this.service = new RegisterService()
        this.originalUrl = url
    }

    public async doLoginOrRegister(updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void, navigate: (url: string) => void) {
    try {
      this.isLoading = true;

      if (!this.imageBytes) {
            this.view.displayErrorMessage("Profile picture is required.");
            return;
      }

      const [user, authToken] = await this.service.register(
        this.firstName,
        this.lastName,
        this.alias,
        this.password,
        this.imageBytes,
        this.imageFileExtension
      );

      updateUserInfo(user, user, authToken, this.rememberMe);
      navigate(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`,
      );
    } finally {
      this.isLoading = false;
    }
  };
}