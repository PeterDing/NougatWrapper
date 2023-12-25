import { useState } from "react";

import { useAppDispatch, useAppSelector } from "../redux/store";
import { navigate } from "../redux/navigator-reducer";
import { DeleteAllJobs, DeleteOneJob } from "./trash";
import settings from "../database/settings";

function NougatIcon() {
  const currentScreen = useAppSelector(
    (state) => state.navigator.currentScreen
  );
  if (currentScreen === "loading") return null;

  return (
    <svg
      className="h-6 w-6 text-gray-600"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9.5 7.5-2 2a4.95 4.95 0 1 0 7 7l2-2a4.95 4.95 0 1 0-7-7Z" />
      <path d="M14 6.5v10" />
      <path d="M10 7.5v10" />
      <path d="m16 7 1-5 1.37.68A3 3 0 0 0 19.7 3H21v1.3c0 .46.1.92.32 1.33L22 7l-5 1" />
      <path d="m8 17-1 5-1.37-.68A3 3 0 0 0 4.3 21H3v-1.3a3 3 0 0 0-.32-1.33L2 17l5-1" />
    </svg>
  );
}

function ScreenCapture() {
  const dispatch = useAppDispatch();
  const hasNougatServerUrl = settings.nougatServerUrl !== "";

  return (
    <svg
      onClick={() =>
        hasNougatServerUrl ? dispatch(navigate("screencapture")) : null
      }
      className="h-6 w-6 text-gray-600"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="m17 8 5-5" />
      <path d="M17 3h5v5" />
    </svg>
  );
}

function Jobs() {
  const dispatch = useAppDispatch();
  const currentScreen = useAppSelector(
    (state) => state.navigator.currentScreen
  );

  const color = currentScreen === "job-list" ? "text-sky-500" : "text-gray-600";

  return (
    <svg
      onClick={() => {
        dispatch(navigate("job-list"));
      }}
      className={`h-6 w-6 ${color}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function Delete() {
  const jobId = useAppSelector((state) => state.navigator.currentJobId);

  const [toDelete, setToDelete] = useState(false);

  let deleteView = null;
  if (toDelete) {
    if (jobId === null) {
      deleteView = <DeleteAllJobs callBack={() => setToDelete(false)} />;
    } else {
      deleteView = <DeleteOneJob callBack={() => setToDelete(false)} />;
    }
  }

  return (
    <>
      <svg
        onClick={() => setToDelete(true)}
        className="h-6 w-6 text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </svg>
      {deleteView}
    </>
  );
}

function Settings() {
  const dispatch = useAppDispatch();
  const currentScreen = useAppSelector(
    (state) => state.navigator.currentScreen
  );

  const color = currentScreen === "settings" ? "text-sky-500" : "text-gray-600";

  return (
    <svg
      onClick={() => dispatch(navigate("settings"))}
      className={`h-6 w-6 ${color}`}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function Navigator() {
  return (
    <nav className="bg-white shadow py-2 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <ScreenCapture />
        <Jobs />
      </div>
      <div className="flex items-center space-x-4">
        <NougatIcon />
      </div>
      <div className="flex items-center space-x-4">
        <Delete />
        <Settings />
      </div>
    </nav>
  );
}
