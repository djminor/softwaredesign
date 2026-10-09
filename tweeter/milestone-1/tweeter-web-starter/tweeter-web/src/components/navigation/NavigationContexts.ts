import { createContext } from "react";
import { AuthToken, User } from "tweeter-shared";

interface NavigationActions {
    navigateToUser: (event: React.MouseEvent, featurePath: string) => Promise<void>,
    extractAlias: (value: string) => string,
    getUser: (
          authToken: AuthToken,
          alias: string
    ) => Promise<User | null>
}

const defaultNavigationActions: NavigationActions = {
    navigateToUser: () => Promise.resolve(),
    extractAlias: () => "",
    getUser: () => Promise.resolve(null)
}

export const NavigationContexts = createContext<NavigationActions>(defaultNavigationActions)