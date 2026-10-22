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

    protected isValid(): boolean {
      if (!this.imageBytes) {
        this.view.displayErrorMessage("Profile picture is required.");
        return false;
      }
      return true;
    }

    protected async doAuth(): Promise<[User, AuthToken]> {
      return this.service.register(
        this.firstName,
        this.lastName,
        this.alias,
        this.password,
        this.imageBytes!,
        this.imageFileExtension
      );
    }

    protected get authOperationDescription(): string {
      return "register user";
    }
}