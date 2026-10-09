import { AuthToken, User } from "tweeter-shared";
import { NavigationContexts } from "../navigation/NavigationContexts";
import { useContext } from "react";


export interface NavigationActions {
    navigateToUser: (event: React.MouseEvent, featureUrl: string) => Promise<void>,
    extractAlias: (value: string) => string,
    getUser: (
        authToken: AuthToken,
        alias: string
    ) => Promise<User | null>
}

export const useNavigationActions = (): NavigationActions => {
    const { navigateToUser, extractAlias, getUser } = useContext(NavigationContexts)
    return {
        navigateToUser: (event: React.MouseEvent, featureUrl: string) => navigateToUser(event, featureUrl),
        extractAlias: (value: string) => extractAlias(value),
        getUser: (authToken: AuthToken, alias: string) => getUser(authToken, alias)
    }
}