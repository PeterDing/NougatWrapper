import { getLocalDateString } from "../common/time";
import { IInferenceResult } from "../services/result";

/*
 * A job is a result of an inference request. It is stored in `jobs` table.
 *
 * id: Incrementing integer
 * by: The model that was used to generate the inference result
 * status: The status of the job. Can be "pending", "completed", or "failed"
 * createdAt: The time the job was created
 * updatedAt: The time the job was last updated
 * filename: The filename of the file that was used to generate the inference result
 *           The file location is `$APPLOCALDATA/images/${filename}`
 * inferenceResult: The result of the inference request
 * editedContent: The content that was edited by user
 */
export interface IJob {
  id: number;
  by: string;
  status: string; // "pending", "completed", or "failed"
  createdAt: string;
  updatedAt: string;
  filename: string;
  inferenceResult: IInferenceResult;
  editedContent: string;
}

export function newJob(by: string): IJob {
  const now = new Date();
  const filename = `screencapture-${getLocalDateString(now).replaceAll(
    ":",
    "-"
  )}.png`;

  return {
    id: 0,
    by,
    status: "pending",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    filename,
    inferenceResult: { output: "", score: 0.0 },
    editedContent: "",
  };
}
