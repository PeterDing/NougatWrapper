import { useState } from "react";

import settings from "../database/settings";
import { validateServer } from "../services/nougat-apis";

export default function Settings() {
  const [inner, setInner] = useState({
    url: settings.nougatServerUrl || "",
    status: "unknown",
  });

  let nougatServerUrlInputMessage = null;
  let nougatServerUrlInputColor = "black";
  switch (inner.status) {
    case "unknown":
      nougatServerUrlInputColor = "black";
      break;
    case "ok":
      nougatServerUrlInputColor = "green";
      nougatServerUrlInputMessage = "Nougat server is running";
      break;
    case "error":
      nougatServerUrlInputColor = "red";
      nougatServerUrlInputMessage = "Nougat server is not running";
      break;
  }

  const checkNougatServerUrl = async (url: string) => {
    const ok = await validateServer(url);
    if (ok) {
      setInner((d) => ({ ...d, status: "ok" }));
    } else {
      setInner((d) => ({ ...d, status: "error" }));
    }
  };
  const setNougatServerUrl = async (url: string) => {
    const ok = await validateServer(url);
    if (ok) {
      await settings.setNougatServerUrl(url);
      setInner((d) => ({ ...d, status: "ok" }));
    } else {
      setInner((d) => ({ ...d, status: "error" }));
    }
  };

  return (
    <div className="m-8">
      <div className="mb-6">
        <label
          htmlFor="nougat-server-url"
          className={`block mb-2 text-sm font-medium`}
        >
          Nougat Server URL
        </label>
        <div className="flex">
          <input
            type="url"
            id="nougat-server-url"
            className={`mr-3 bg-${nougatServerUrlInputColor}-50 border border-${nougatServerUrlInputColor}-500 text-${nougatServerUrlInputColor}-900 placeholder-${nougatServerUrlInputColor}-700 text-sm rounded-lg focus:ring-${nougatServerUrlInputColor}-500 focus:border-${nougatServerUrlInputColor}-500 block w-full p-2.5`}
            placeholder="http://127.0.0.1:7860"
            value={inner.url}
            onChange={(e) => {
              setInner({ url: e.target.value, status: "unknown" });
            }}
          />
          <button
            className="text-white bg-yellow-500 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
            onClick={() => checkNougatServerUrl(inner.url)}
          >
            Check
          </button>
        </div>
        <p className={`mt-2 text-sm text-${nougatServerUrlInputColor}-600`}>
          {nougatServerUrlInputMessage}
        </p>
      </div>

      <div>
        <button
          className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          onClick={() => setNougatServerUrl(inner.url)}
        >
          Save
        </button>
      </div>
    </div>
  );
}
