import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/hooks/UserHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { UserAuthView } from "./presenter/UserAuthPresenter";
import { LoginPresenter } from "./presenter/LoginPresenter";
import { RegisterPresenter } from "./presenter/RegisterPresenter";
import { FeedItemPresenter } from "./presenter/FeedItemPresenter";
import { StoryItemPresenter } from "./presenter/StoryItemPresenter";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import ItemScroller from "./components/mainLayout/ItemScroller";
import UserItem from "./components/userItem/UserItem";
import { Service } from "./model.service/Service";
import StatusItem from "./components/statusItem/StatusItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route path="feed/:displayedUser" element={<ItemScroller<Status, Service> key={`feed-${displayedUser!.alias}`} itemComponentFactory={(item: Status) => <StatusItem status={item} url='feed' />} presenterFactory={(view: PagedItemView<Status>) => new FeedItemPresenter(view)} featureUrl='feed'/>} />
        <Route path="story/:displayedUser" element={<ItemScroller<Status, Service>  key={`story-${displayedUser!.alias}`} itemComponentFactory={(item: Status) => <StatusItem status={item} url='story' />} presenterFactory={(view: PagedItemView<Status>) => new StoryItemPresenter(view)} featureUrl='story'/>} />
        <Route path="followees/:displayedUser" element={<ItemScroller<User, Service> key={`followees-${displayedUser!.alias}`} featureUrl="followees" itemComponentFactory={(item: User) => <UserItem user={item} featurePath="/followees" />} presenterFactory={(view: PagedItemView<User>) => new FolloweePresenter(view)}/>} />
        <Route path="followers/:displayedUser" element={<ItemScroller<User, Service> key={`followers-${displayedUser!.alias}`} featureUrl="followers" itemComponentFactory={(item: User) => <UserItem user={item} featurePath="/followers" />} presenterFactory={(view: PagedItemView<User>) => new FolloweePresenter(view)}/>} />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login presenterFactory={(view: UserAuthView) => new LoginPresenter(location.pathname, view)}/>} />
      <Route path="/register" element={<Register presenterFactory={(view: UserAuthView) => new RegisterPresenter(location.pathname, view)}/>} />
      <Route path="*" element={<Login presenterFactory={(view: UserAuthView) => new LoginPresenter(location.pathname, view)} />} />
    </Routes>
  );
};

export default App;
