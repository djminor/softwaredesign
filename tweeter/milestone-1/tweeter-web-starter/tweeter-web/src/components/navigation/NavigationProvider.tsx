import { AuthToken, User, FakeData } from "tweeter-shared";
import { useUserActions, useUserInfo } from "../hooks/UserHooks";
import { useMessageActions } from "../hooks/MessageHooks";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { NavigationContexts } from "./NavigationContexts";


interface Props {
    children: React.ReactNode
}

const NavigationProvider: React.FC<Props> = ({children}) => {
    const { setDisplayedUser } = useUserActions()
    const { displayErrorMessage } = useMessageActions()
    const { displayedUser, authToken } = useUserInfo();
    const navigate = useNavigate();
    
    const navigateToUser = async (event: React.MouseEvent, featurePath: string): Promise<void> => {
        event.preventDefault();

        try {
        const alias = extractAlias(event.target.toString());

        const toUser = await getUser(authToken!, alias);

        if (toUser) {
            if (!toUser.equals(displayedUser!)) {
            setDisplayedUser(toUser);
            navigate(`${featurePath}/${toUser.alias}`);
            }
        }
        } catch (error) {
        displayErrorMessage(
            `Failed to get user because of exception: ${error}`
        );
        }
    };
    const extractAlias = (value: string): string => {
      const index = value.indexOf("@");
      return value.substring(index);
    };
  
    const getUser = async (
      authToken: AuthToken,
      alias: string
    ): Promise<User | null> => {
      // TODO: Replace with the result of calling server
      return FakeData.instance.findUserByAlias(alias);
    };

    const navigateFunctions = {
        navigateToUser,
        extractAlias,
        getUser
    }

    return (
        <NavigationContexts.Provider value={navigateFunctions}>
            {children}
        </NavigationContexts.Provider>
      );
}

NavigationProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default NavigationProvider;