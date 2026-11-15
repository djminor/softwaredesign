import { MemoryRouter } from "react-router-dom"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@testing-library/jest-dom"
import { instance, mock, verify } from "@typestrong/ts-mockito"
import PostStatus from "../../../../../src/components/postStatus/PostStatus"
import { PostStatusPresenter } from "../../../../../src/presenter/PostStatusPresenter"
import { useUserInfo } from "../../../../../src/components/hooks/UserHooks";
import { AuthToken, User } from "tweeter-shared";

library.add(fab);

jest.mock("../../src/components/hooks/UserHooks.ts", () => ({
  ...jest.requireActual("../../src/components/hooks/UserHooks.ts"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

const mockUserInstance = new User("First", "Last", "@alias", "url");
const mockAuthTokenInstance = new AuthToken("token123", Date.now());

describe("Login component", () => {
    const authToken = new AuthToken("helloworld", Date.now())
    beforeAll(() => {
        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
        });
    })
    it("When first rendered the Post Status and Clear buttons are both disabled",  () => {
        const { postStatusButton, clearButton } = renderLoginAndGetElements()
        expect(postStatusButton).toBeDisabled()
        expect(clearButton).toBeDisabled()
    })

    it("Both buttons are enabled when the text field has text", async () => {
        const { postStatusButton, clearButton, postTextArea, user } = renderLoginAndGetElements()
        expect(postStatusButton).toBeDisabled()
        expect(clearButton).toBeDisabled()

        await user.type(postTextArea, "hello world")

        expect(postStatusButton).toBeEnabled()
        expect(clearButton).toBeEnabled()
    })

    it("Both buttons are disabled when the text field is cleared", async () => {
        const { postStatusButton, clearButton, postTextArea, user } = renderLoginAndGetElements()
        expect(postStatusButton).toBeDisabled()
        expect(clearButton).toBeDisabled()

        await user.type(postTextArea, "hello world")

        expect(postStatusButton).toBeEnabled()
        expect(clearButton).toBeEnabled()

        await user.clear(postTextArea)

        expect(postStatusButton).toBeDisabled()
        expect(clearButton).toBeDisabled()
    })

    it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed", async () => {
        const mockPresenter = mock<PostStatusPresenter>()
                const mockPresenterInstance = instance(mockPresenter)
        
                const { postStatusButton, postTextArea, user } = renderLoginAndGetElements(mockPresenterInstance)

                let postText = "a" 
                await user.type(postTextArea, postText)
        
                await user.click(postStatusButton)
        
                verify(mockPresenter.submitPost(postText, mockUserInstance, mockAuthTokenInstance)).once()
    })
})

function renderLogin(presenter?: PostStatusPresenter) {
    return render(
        <MemoryRouter>
            <PostStatus presenter={presenter} />
        </MemoryRouter>
    )
}

function renderLoginAndGetElements(presenter?: PostStatusPresenter) {
    const user = userEvent.setup();

    renderLogin(presenter);

    const postStatusButton = screen.getByLabelText("Post status")
    const clearButton = screen.getByLabelText("Clear button")
    const postTextArea = screen.getByLabelText("Post text")

    return { user, postStatusButton, clearButton, postTextArea }
}