import { AuthToken, User } from "tweeter-shared"
import { anything, instance, mock, spy, verify, when } from '@typestrong/ts-mockito'
import { PostStatusPresenter, PostStatusView } from "../../../src/presenter/PostStatusPresenter"
import { StatusService } from "../../../src/model.service/StatusService"

describe("PostStatusPresenter ", () => {
    let mockPostStatusPresenterView: PostStatusView
    let postStatusPresenter: PostStatusPresenter
    let mockService: StatusService

    const authToken = new AuthToken("helloworld", Date.now())
    beforeEach(() => {
        mockPostStatusPresenterView = mock<PostStatusView>();
        const mockAppNavbarPresenterViewInstance = instance(mockPostStatusPresenterView);
        when(mockPostStatusPresenterView.displayInfoMessage(anything(), 0)).thenReturn("messageId123")

        postStatusPresenter = new PostStatusPresenter(mockAppNavbarPresenterViewInstance);
        const postStatusPresenterSpy = spy(postStatusPresenter)

        mockService = mock<StatusService>()
        when(postStatusPresenterSpy.service).thenReturn(instance(mockService))
    })

    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost("hello world", anything(), authToken)
        verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).once;
    })

    it("calls postStatus on the post status service with the correct status string and auth token", async () => {
        const user = new User("First", "Last", "alias", "url");
        
        await postStatusPresenter.submitPost("hello world", user, authToken)

        verify(mockService.postStatus(authToken, anything())).once()
    })

    it("When posting of the status is successful, the presenter tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message.", async () => {
        await postStatusPresenter.submitPost("hello world", anything(), authToken)

        verify(mockPostStatusPresenterView.displayErrorMessage(anything())).never()
        verify(mockPostStatusPresenterView.deleteMessage(anything())).once()
        verify(mockPostStatusPresenterView.clearPost()).once()
        verify(mockPostStatusPresenterView.displayInfoMessage(anything(), 0)).once()
    })
// 41 and 43, replace anything() with real val
    it("When posting of the status is not successful, the presenter tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message", async () => {
        let error = new Error("An error occurred")
        when(mockService.postStatus(authToken, anything())).thenThrow(error)
        await postStatusPresenter.submitPost("hello world", anything(), authToken)

        verify(mockPostStatusPresenterView.displayErrorMessage(`Failed to post the status because of exception: ${error}`)).once()
        verify(mockPostStatusPresenterView.deleteMessage(anything())).once()
        verify(mockPostStatusPresenterView.clearPost()).never()
        verify(mockPostStatusPresenterView.displayInfoMessage(anything(), 0)).never()
    })
})