import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import ClipboardJS from "clipboard";

import "./index.css";

import "./database/library"; // First import to initialize database
import "./database/settings"; // First import to initialize database

import globalStore from "./redux/store";
import App from "./components/app";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={globalStore}>
    <App />
  </Provider>
);

new ClipboardJS(".markdown-area");
