import { AuthToken } from "tweeter-shared"
import { AppNavbarPresenter, AppNavbarView } from "../../../src/presenter/AppNavbarPresenter"
import { anything, instance, mock, spy, verify, when } from '@typestrong/ts-mockito'
import { UserService } from "../../../src/model.service/UserService"

describe("AppNavbarPresenter ", () => {
    let mockAppNavbarPresenterView: AppNavbarView
    let appNavbarPresenter: AppNavbarPresenter
    let mockService: UserService

    const authToken = new AuthToken("helloworld", Date.now())
    beforeEach(() => {
        mockAppNavbarPresenterView = mock<AppNavbarView>();
        const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);
        when(mockAppNavbarPresenterView.displayInfoMessage(anything(), 0)).thenReturn("messageId123")

        appNavbarPresenter = new AppNavbarPresenter(mockAppNavbarPresenterViewInstance);
        const appNavbarPresenterSpy = spy(appNavbarPresenter)

        mockService = mock<UserService>()
        when(appNavbarPresenterSpy.service).thenReturn(instance(mockService))
    })

    it("tells the view to display a logging out message", async () => {
        await appNavbarPresenter.logOut(authToken)
        verify(mockAppNavbarPresenterView.displayInfoMessage("Logging out...", 0)).once;
    })

    it("calls logout on the user service with the correct auth token", async () => {
        await appNavbarPresenter.logOut(authToken)
        verify(mockService.logout(authToken)).once()

        // let[capturedAuthToken] = capture(mockService.logout).last()
        // expect(capturedAuthToken).toEqual(authToken)
    })

    it("When the logout is successful, the presenter tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page", async () => {
        await appNavbarPresenter.logOut(authToken)

        verify(mockAppNavbarPresenterView.displayErrorMessage(anything())).never()
        verify(mockAppNavbarPresenterView.deleteMessage(anything())).once()
        verify(mockAppNavbarPresenterView.clearUserInfo()).once()
        verify(mockAppNavbarPresenterView.navigateToLogin()).once()
    })

    it("When the logout is unsuccessful, the presenter tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page", async () => {
        let error = new Error("An error occurred")
        when(mockService.logout(anything())).thenThrow(error)
        await appNavbarPresenter.logOut(authToken)

        verify(mockAppNavbarPresenterView.displayErrorMessage(`Failed to log user out because of exception: ${error}`)).once()
        verify(mockAppNavbarPresenterView.deleteMessage(anything())).never()
        verify(mockAppNavbarPresenterView.clearUserInfo()).never()
        verify(mockAppNavbarPresenterView.navigateToLogin()).never()
    })
})
