import { httpRequest } from "../common/http";
import { IInferenceResult } from "./result";

export async function inferenceImage(
  url: string,
  imageBytes: Uint8Array
): Promise<IInferenceResult> {
  url = new URL("/inference/image", url).toString();

  const body = new FormData();
  body.append(
    "file",
    new Blob([imageBytes], { type: "image/png" }),
    "some.png"
  );

  const response = await httpRequest(url, { body, method: "POST" }, 30_000);
  const result: IInferenceResult = await response.json();
  return result;
}

export async function validateServer(url: string): Promise<boolean> {
  url = new URL("/ok", url).toString();

  try {
    const response = await httpRequest(url, undefined, 2000);
    return response.ok;
  } catch (e) {
    return false;
  }
}
