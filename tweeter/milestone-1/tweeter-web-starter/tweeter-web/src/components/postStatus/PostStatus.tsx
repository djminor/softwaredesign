// AI-assisted: see AI-ATTRIBUTION.md
import "./PostStatus.css";
import { useState } from "react";
import { useMessageActions } from "../hooks/MessageHooks";
import { useUserInfo } from "../hooks/UserHooks";
import { PostStatusPresenter, PostStatusView } from "../../presenter/PostStatusPresenter"

interface Props {
  presenter?: PostStatusPresenter
}

const PostStatus = (props: Props) => {
  const { displayErrorMessage, displayInfoMessage, deleteMessage } = useMessageActions();
  const { currentUser, authToken } = useUserInfo();
  
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const listener: PostStatusView = {
    displayErrorMessage: (message: string) => displayErrorMessage(message),
    displayInfoMessage: (message: string, duration?: number) => {
      return displayInfoMessage(message, duration ?? 0);
    },
    deleteMessage: (messageId: string) => deleteMessage(messageId),
    clearPost: () => setPost(""),
    setIsLoading: (loading: boolean) => setIsLoading(loading),
  };

  const [presenter] = useState(() => props.presenter ? props.presenter : new PostStatusPresenter(listener));

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();
    await presenter.submitPost(post, currentUser, authToken);
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !authToken || !currentUser || isLoading;
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          aria-label="Post text"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          aria-label="Post status"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={checkButtonStatus()}
          style={{ width: "8em" }}
          onClick={submitPost}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          aria-label="Clear button"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={checkButtonStatus()}
          onClick={clearPost}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;