import { useEffect, useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { marked } from "marked";

import { appCommon } from "../common/app";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { markdownTokenize } from "../common/tokenizer";

import "../markdown.css";
import { updateJob } from "../redux/jobs-reducer";
import { assert } from "../common/assertion";
import library from "../database/library";

export default function JobDetail() {
  const dispatch = useAppDispatch();

  const jobId = useAppSelector((state) => state.navigator.currentJobId);
  const job = useAppSelector((state) =>
    state.jobs.entities.find((job) => job.id === jobId)
  );

  if (!job) {
    return <div>Not found</div>;
  }

  const [edited, setEdited] = useState(job.editedContent !== "");
  const [output, setOutput] = useState(
    edited ? job.editedContent : job.inferenceResult.output
  );

  function saveEditedContent(content: string) {
    assert(job !== undefined, "Job is undefined");
    const newJob = {
      ...job,
      editedContent: content,
      updatedAt: new Date().toISOString(),
    };
    library.updateJob(newJob);
    dispatch(updateJob(newJob));
  }

  function resetContent() {
    assert(job !== undefined, "Job is undefined");
    const newJob = {
      ...job,
      editedContent: "",
      updatedAt: new Date().toISOString(),
    };
    library.updateJob(newJob);
    dispatch(updateJob(newJob));
    setEdited(false);
    setOutput(job.inferenceResult.output);
  }

  const thumbnail = convertFileSrc(appCommon.getImagePath(job.filename));
  const scorePercent = Math.floor(job.inferenceResult.score * 100);

  // Markdown with latex rendering process:
  // 1. Tokenize the original markdown text to get the latex tokens
  const tokens = markdownTokenize(output);
  const latexTokens = tokens.filter((token) => token.type === "latex");
  // 2. Only render the markdown text, and replace the latex tokens with a placeholder
  const markdown = tokens
    .map((token) => {
      if (token.type === "latex") {
        return "\\\\(@@@latex@@@@\\\\)";
      } else {
        return token.text;
      }
    })
    .join("");
  const markdownRendered = marked.parse(markdown) as string;
  // 3. Replace the placeholder with the latex tokens
  const afterTokens = markdownTokenize(markdownRendered);
  const htmlStr = afterTokens
    .map((token) => {
      if (token.type === "latex") {
        return latexTokens.shift()?.text;
      } else {
        return token.text;
      }
    })
    .join("");
  // 4. Let MathJax render the latex

  useEffect(() => {
    if (typeof (window as any)?.MathJax !== "undefined") {
      (window as any).MathJax.typesetClear();
      (window as any).MathJax.typesetPromise()
        .then(() => console.log("MathJax Typeset successful"))
        .catch((err: any) =>
          console.log("MathJax Typeset failed: " + err.message)
        );
    }
  }, [output]);

  return (
    <div>
      <div className="mx-auto justify-center items-center">
        <img className="mx-auto" src={thumbnail} />
      </div>

      <div
        className="bg-blue-100 min-h-20 py-5 px-12 font-serif text-lg"
        dangerouslySetInnerHTML={{ __html: htmlStr }}
      ></div>

      <div>
        <div className="relative max-w-2xl mx-auto mt-10">
          <div className="bg-gray-900 text-white p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Markdown:</span>
              <div>
                <button
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 mx-2 px-3 py-1 rounded-md focus:ring-4 focus:ring-gray-300"
                  style={{ display: edited ? "initial" : "none" }}
                  onClick={() => saveEditedContent(output)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 mx-2 px-3 py-1 rounded-md focus:ring-4 focus:ring-gray-300"
                  style={{ display: edited ? "initial" : "none" }}
                  onClick={() => resetContent()}
                >
                  Reset
                </button>
                <button
                  className="markdown-area bg-gray-800 hover:bg-gray-700 text-gray-300 mx-2 px-3 py-1 rounded-md focus:ring-4 focus:ring-gray-300"
                  data-clipboard-target="#markdown-latex"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <pre id="code" className="text-gray-300">
                <textarea
                  id="markdown-latex"
                  rows={5}
                  className="text-gray-300 bg-inherit block p-2.5 w-full text-sm"
                  value={output}
                  onChange={(e) => {
                    setOutput(e.target.value);
                    setEdited(true);
                  }}
                ></textarea>
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium dark:text-white mx-3 pt-10">
          Confidence:
        </div>
        <div className="flex items-center">
          <div className="w-full bg-sky-200 rounded-full h-1.5 mx-3">
            <div
              className="bg-sky-600 h-1.5 rounded-full"
              style={{ width: `${scorePercent}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium dark:text-white mr-3">
            {scorePercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
