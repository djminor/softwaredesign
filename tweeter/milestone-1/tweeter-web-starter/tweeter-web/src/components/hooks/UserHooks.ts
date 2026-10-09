import { User, AuthToken } from "tweeter-shared";
import { UserInfoActionsContext, UserInfoContext } from "../userInfo/UserInfoContexts";
import { useContext } from "react";

interface UserActions {
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
      ) => void,
      clearUserInfo: () => void,
      setDisplayedUser: (user: User) => void,
}

export const useUserActions = (): UserActions => {
    const { updateUserInfo, clearUserInfo, setDisplayedUser } = useContext(UserInfoActionsContext)
    return {
        updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => updateUserInfo(currentUser, displayedUser, authToken, remember),
        clearUserInfo: () => clearUserInfo,
        setDisplayedUser: (user: User) => setDisplayedUser(user)
    }
}

export const useUserInfo = () => {
    return useContext(UserInfoContext)
}