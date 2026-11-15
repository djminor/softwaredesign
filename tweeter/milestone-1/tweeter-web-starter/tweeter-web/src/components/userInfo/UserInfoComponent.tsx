import "./UserInfoComponent.css";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { useMessageActions } from "../hooks/MessageHooks";
import { useUserActions, useUserInfo } from "../hooks/UserHooks";
import { UserInfoPresenter } from "../../presenter/UserInfoPresenter";
import { PagedItemView } from "../../presenter/PagedItemPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayErrorMessage, displayInfoMessage, deleteMessage } = useMessageActions();

  const { currentUser, authToken, displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserActions();
  const navigate = useNavigate();
  const location = useLocation();

  const listener: PagedItemView<User> = {
    displayErrorMessage,
    addItems: function (items: User[]): void {
      throw new Error("Function not implemented.");
    }
  };

  const presenterRef = useRef<UserInfoPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserInfoPresenter(listener);
  }

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  useEffect(() => {
    setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
    setNumbFollowees(authToken!, displayedUser!);
    setNumbFollowers(authToken!, displayedUser!);
  }, [displayedUser]);

  const setIsFollowerStatus = async (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) => {
    try {
      if (currentUser === displayedUser) {
        setIsFollower(false);
      } else {
        setIsFollower(
          await presenterRef.current!.getIsFollowerStatus(authToken!, currentUser!, displayedUser!),
        );
      }
    } catch (error) {
      displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  };

  const setNumbFollowees = async (
    authToken: AuthToken,
    displayedUser: User,
  ) => {
    try {
      setFolloweeCount(await presenterRef.current!.getFolloweeCount(authToken, displayedUser));
    } catch (error) {
      displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  };

  const setNumbFollowers = async (
    authToken: AuthToken,
    displayedUser: User,
  ) => {
    try {
      setFollowerCount(await presenterRef.current!.getFollowerCount(authToken, displayedUser));
    } catch (error) {
      displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  };

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
    navigate(`${getBaseUrl()}/${currentUser!.alias}`);
  };

  const getBaseUrl = (): string => {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };

  const toggleFollow = async (
  event: React.MouseEvent,
): Promise<void> => {
  event.preventDefault();

  let toastId = "";
  const currentlyFollowing = isFollower;
  const actionText = currentlyFollowing ? "Unfollowing" : "Following";

  try {
    setIsLoading(true);
    toastId = displayInfoMessage(
      `${actionText} ${displayedUser!.name}...`,
      0,
    );

    const [followerCount, followeeCount] = currentlyFollowing
      ? await presenterRef.current!.unfollow(authToken!, displayedUser!)
      : await presenterRef.current!.follow(authToken!, displayedUser!);

    setIsFollower(!currentlyFollowing);
    setFollowerCount(followerCount);
    setFolloweeCount(followeeCount);
  } catch (error) {
    displayErrorMessage(
      `Failed to ${currentlyFollowing ? "unfollow" : "follow"} user because of exception: ${error}`
    );
  } finally {
    deleteMessage(toastId);
    setIsLoading(false);
  }
};

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {!displayedUser.equals(currentUser) && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={`./${currentUser.alias}`}
                    onClick={switchToLoggedInUser}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {!displayedUser.equals(currentUser) && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      disabled={isLoading}
                      onClick={toggleFollow}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      disabled={isLoading}
                      onClick={toggleFollow}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
