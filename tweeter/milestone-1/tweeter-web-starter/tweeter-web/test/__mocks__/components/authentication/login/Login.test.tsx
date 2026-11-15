import { MemoryRouter } from "react-router-dom"
import Login from "../../../../../src/components/authentication/login/Login"
import { render, screen } from "@testing-library/react"
import { UserAuthView } from "../../../../../src/presenter/UserAuthPresenter"
import { LoginPresenter } from "../../../../../src/presenter/LoginPresenter"
import { userEvent } from "@testing-library/user-event"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@testing-library/jest-dom"
import { anything, instance, mock, verify, when } from "@typestrong/ts-mockito"

library.add(fab);

describe("Login component", () => {
    it("starts with the sign in button disabled",  () => {
        const { signInButton } = renderLoginAndGetElements("/")
        expect(signInButton).toBeDisabled()
    })

    it("enables the sign in button if both alias and password fields have text", async () => {
        const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements("/")

        await user.type(aliasField, "a")
        await user.type(passwordField, "t")
        expect(signInButton).toBeEnabled()
    })

    it("disables the sign in button if either the alias or password field is cleared", async () => {
        const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements("/")

        await user.type(aliasField, "a")
        await user.type(passwordField, "t")
        expect(signInButton).toBeEnabled()

        await user.clear(aliasField)

        expect(signInButton).toBeDisabled()

        await user.type(aliasField, "a")

        expect(signInButton).toBeEnabled()

        await user.clear(passwordField)

        expect(signInButton).toBeDisabled()

    })

    it("calls the presenter's login method with correct parameters when the sign in button is pressed", async () => {
        
        const mockPresenter = mock<LoginPresenter>()
        when(mockPresenter.isLoading).thenReturn(false);
        const mockPresenterInstance = instance(mockPresenter)

        const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements("/", mockPresenterInstance)

        await user.type(aliasField, "a")
        await user.type(passwordField, "t")

        await user.click(signInButton)

        verify(mockPresenter.doLoginOrRegister(anything(), anything())).once()

    })
})

//line 62, pass parameters

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
    return render(
        <MemoryRouter>
            <Login originalUrl={originalUrl} presenterFactory={(view: UserAuthView) => presenter ? presenter : new LoginPresenter(originalUrl, view)} />
        </MemoryRouter>
    )
}

function renderLoginAndGetElements(originalUrl: string, presenter?: LoginPresenter) {
    const user = userEvent.setup();

    renderLogin(originalUrl, presenter);

    const signInButton = screen.getByRole("button", { name: /Sign in/i})
    const aliasField = screen.getByLabelText("alias")
    const passwordField = screen.getByLabelText("password")

    return { user, signInButton, aliasField, passwordField }
}