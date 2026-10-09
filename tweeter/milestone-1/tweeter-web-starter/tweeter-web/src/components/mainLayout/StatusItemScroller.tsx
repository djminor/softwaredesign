import InfiniteScroll from "react-infinite-scroll-component";
import StatusItem from "../statusItem/StatusItem";
import { useState, useEffect } from "react";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import { useParams } from "react-router-dom";
import { useMessageActions } from "../hooks/MessageHooks";
import { useUserActions, useUserInfo } from "../hooks/UserHooks";

interface Props {
    loadStoryOrFeed: Function,
    url: string
}

export const PAGE_SIZE = 10

export const StatusItemScroller = (props: Props) => {
    const { displayErrorMessage } = useMessageActions();
    const [items, setItems] = useState<Status[]>([]);
    const { displayedUser, authToken } = useUserInfo();
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [lastItem, setLastItem] = useState<Status | null>(null);
    const addItems = (newItems: Status[]) =>
    setItems((previousItems) => [...previousItems, ...newItems]);
    const { setDisplayedUser } = useUserActions();
    const { displayedUser: displayedUserAliasParam } = useParams();
    
    const getUser = async (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> => {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    };

    // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
      useEffect(() => {
        if (
          authToken &&
          displayedUserAliasParam &&
          displayedUserAliasParam != displayedUser!.alias
        ) {
          getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
            if (toUser) {
              setDisplayedUser(toUser);
            }
          });
        }
      }, [displayedUserAliasParam]);

    // Initialize the component whenever the displayed user changes
    useEffect(() => {
        reset();
        loadMoreItems(null);
    }, [displayedUser]);

    const reset = async () => {
        setItems(() => []);
        setLastItem(() => null);
        setHasMoreItems(() => true);
    };
    
    const loadMoreItems = async (lastItem: Status | null) => {
        try {
          const [newItems, hasMore] = await props.loadStoryOrFeed(
            authToken!,
            displayedUser!.alias,
            PAGE_SIZE,
            lastItem
          );
    
          setHasMoreItems(() => hasMore);
          setLastItem(() => newItems[newItems.length - 1]);
          addItems(newItems);
        } catch (error) {
          displayErrorMessage(
            `Failed to load story items because of exception: ${error}`
          );
        }
      };
    return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() => loadMoreItems(lastItem)}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <StatusItem status={item} url={props.url} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}