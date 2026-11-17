// AI-assisted: see AI-ATTRIBUTION.md
import { Link } from "react-router-dom";
import { User } from "tweeter-shared";
import { useNavigationActions } from "../hooks/NavigationHooks";

interface Props {
  user: User;
  featurePath: string;
}

const UserItem = (props: Props) => {
  const { navigateToUser } = useNavigationActions();
  const path = props.featurePath.startsWith("/")
    ? props.featurePath
    : `/${props.featurePath}`;

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.user.firstName} {props.user.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={`${path}/${props.user.alias}`}
                onClick={(e) => navigateToUser(e, path)}
              >
                {props.user.alias}
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
