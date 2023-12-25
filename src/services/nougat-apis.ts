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

  const response = await fetch(url, { body, method: "POST" });
  const result: IInferenceResult = await response.json();
  return result;
}

export async function validateServer(url: string): Promise<boolean> {
  url = new URL("/ok", url).toString();

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response.ok;
  } catch (e) {
    clearTimeout(id);
    return false;
  }
}
