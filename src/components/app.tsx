import { useAppDispatch, useAppSelector } from "../redux/store";
import Navigator from "./navigator";
import JobList from "./job-list";
import JobDetail from "./job";
import Loading from "./loading";
import Settings from "./settings";
import { ScreenshotWindow } from "./screencapture";
import ErrorView from "./error";
import settings from "../database/settings";
import { navigate } from "../redux/navigator-reducer";
import { getCurrentWindow } from "@tauri-apps/api/window";

(window as any).appWindow = getCurrentWindow();

export default function App() {
  const dispatch = useAppDispatch();
  const nougatServerUrl = settings.nougatServerUrl;
  const currentScreen = useAppSelector(
    (state) => state.navigator.currentScreen
  );
  const error = useAppSelector((state) => state.navigator.error);
  if (!nougatServerUrl && currentScreen !== "settings") {
    dispatch(navigate("settings"));
  }

  let mainView = null;
  switch (currentScreen) {
    case "job-list":
      mainView = <JobList />;
      break;
    case "job-detail":
      mainView = <JobDetail />;
      break;
    case "loading":
      mainView = <Loading />;
      break;
    case "settings":
      mainView = <Settings />;
      break;
    case "screencapture":
      return <ScreenshotWindow />;
    case "error":
      return <ErrorView error={error} />;
  }

  return (
    <div>
      <div className="sticky top-0 z-50">
        <Navigator />
      </div>
      <div className="relative">{mainView}</div>
    </div>
  );
}
