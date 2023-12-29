import { useEffect, useRef, useState } from "react";

import { exists, readBinaryFile, removeFile } from "@tauri-apps/api/fs";
import { type as osType } from "@tauri-apps/api/os";
import { invoke, convertFileSrc } from "@tauri-apps/api/tauri";
import {
  // LogicalPosition,
  PhysicalPosition,
  PhysicalSize,
  appWindow,
  currentMonitor,
} from "@tauri-apps/api/window";

import { appCommon } from "../common/app";
import { newJob } from "../database/job";
import { assert } from "../common/assertion";
import {
  navigate,
  setCurrentJobId,
  setError,
} from "../redux/navigator-reducer";
import { useAppDispatch } from "../redux/store";
import { inferenceImage } from "../services/nougat-apis";
import settings from "../database/settings";
import library from "../database/library";
import { addJob } from "../redux/jobs-reducer";
import { sleep } from "../common/time";

export function ScreenshotWindow() {
  const dispatch = useAppDispatch();
  const [imgURL, setImgURL] = useState<string>("");
  const [isMoved, setIsMoved] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [position, setPosition] = useState<PhysicalPosition | null>(null);
  const [windowSize, setWindowSize] = useState<PhysicalSize | null>(null);
  const [mouseDownX, setMouseDownX] = useState(0);
  const [mouseDownY, setMouseDownY] = useState(0);
  const [mouseMoveX, setMouseMoveX] = useState(0);
  const [mouseMoveY, setMouseMoveY] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const [defaultImagePath, _] = useState(
    appCommon.getImagePath(`${crypto.randomUUID()}.png`)
  );
  let job = newJob("nougat");
  const imagePath = appCommon.getImagePath(job.filename);

  async function doInferenceImage() {
    dispatch(navigate("loading"));
    const ex = await exists(imagePath);
    if (ex) {
      const bytes = await readBinaryFile(imagePath);
      try {
        job.inferenceResult = await inferenceImage(
          settings.nougatServerUrl,
          bytes
        );
      } catch (e) {
        console.log("----- inference failed", e);
        dispatch(setError(`Inference server error: ${e}`));
        return;
      }

      job.status = "completed";
      job.id = await library.addJob(job);

      console.log("----- new Job", job);

      dispatch(addJob(job));
      dispatch(setCurrentJobId(job.id));
    } else {
      dispatch(navigate("job-list"));
      console.log("----- screenshot failed");
    }
  }

  async function showScreenCaptureWindow() {
    const monitor = await currentMonitor();
    if (!monitor) {
      return;
    }

    appWindow.setFocus();
    await appWindow.setResizable(false);
    await appWindow.setSkipTaskbar(true);

    if ((await osType()) === "Darwin") {
      const size = monitor.size;
      await appWindow.setSize(size);
    } else {
      await appWindow.setFullscreen(true);
    }

    const dpi = monitor.scaleFactor;
    await appWindow.setPosition(monitor.position.toLogical(dpi));
    // await appWindow.setAlwaysOnTop(true);

    await appWindow.show();
  }

  async function resizeWindow() {
    const monitor = await currentMonitor();
    if (!monitor) {
      return;
    }

    await appWindow.setResizable(true);
    await appWindow.setSkipTaskbar(false);
    // await appWindow.setAlwaysOnTop(false);
    await appWindow.setDecorations(true);

    if ((await osType()) !== "Darwin") {
      await appWindow.setFullscreen(false);
    }

    assert(windowSize !== null);
    const dpi = monitor.scaleFactor;
    await appWindow.setSize(windowSize.toLogical(dpi));

    assert(position !== null);
    await appWindow.setPosition(position);
    await appWindow.show();
  }

  async function removeDefaultImage() {
    if (await exists(defaultImagePath)) {
      await removeFile(defaultImagePath);
    }
  }

  useEffect(() => {
    async function doScreenCapture() {
      const monitor = await currentMonitor();
      if (!monitor) {
        return;
      }

      await removeDefaultImage();

      const windowPosition = await appWindow.outerPosition();
      setPosition(windowPosition);

      const windowSize = await appWindow.outerSize();
      setWindowSize(windowSize);

      await appWindow.setDecorations(false);
      await appWindow.hide();

      if ((await osType()) !== "Darwin") {
        // Windows and Linux has a bug that the window is not hidden immediately.
        await sleep(500);
      }

      const monitorPosition = monitor.position;
      await invoke("screencapture", {
        x: monitorPosition.x,
        y: monitorPosition.y,
        imagePath: defaultImagePath,
      });

      setImgURL(convertFileSrc(defaultImagePath));
    }
    doScreenCapture();
  }, []);

  return (
    <>
      <img
        ref={imgRef}
        src={imgURL}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          userSelect: "none",
        }}
        onLoad={() => {
          if (imgURL !== "" && imgRef.current?.complete) {
            showScreenCaptureWindow();
          }
        }}
      />
      <div
        style={{
          position: "fixed",
          border: "1px solid #2080f0",
          backgroundColor: "#2080f020",
          visibility: isMoved ? "visible" : "hidden",
          top: Math.min(mouseDownY, mouseMoveY),
          left: Math.min(mouseDownX, mouseMoveX),
          bottom: screen.height - Math.max(mouseDownY, mouseMoveY),
          right: screen.width - Math.max(mouseDownX, mouseMoveX),
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          cursor: "crosshair",
          userSelect: "none",
        }}
        onMouseDown={async (e) => {
          if (e.buttons === 1) {
            setIsDown(true);
            setMouseDownX(e.clientX);
            setMouseDownY(e.clientY);
          } else {
            // await currentWindow.close();
          }
        }}
        onMouseMove={(e) => {
          if (isDown) {
            setIsMoved(true);
            setMouseMoveX(e.clientX);
            setMouseMoveY(e.clientY);
          }
        }}
        onMouseUp={async (e) => {
          setIsDown(false);
          setIsMoved(false);
          if (!imgRef.current) {
            return;
          }
          const imgWidth = imgRef.current.naturalWidth;
          const dpi = imgWidth / screen.width;
          const x = Math.floor(Math.min(mouseDownX, e.clientX) * dpi);
          const y = Math.floor(Math.min(mouseDownY, e.clientY) * dpi);
          const right = Math.floor(Math.max(mouseDownX, e.clientX) * dpi);
          const bottom = Math.floor(Math.max(mouseDownY, e.clientY) * dpi);
          const width = right - x;
          const height = bottom - y;
          if (width <= 0 || height <= 0) {
            await removeDefaultImage();
            await resizeWindow();
            dispatch(navigate("job-list"));
          } else {
            invoke("cut_image", {
              x,
              y,
              width,
              height,
              inputPath: defaultImagePath,
              outputPath: imagePath,
            }).then(async () => {
              await removeDefaultImage();
              await resizeWindow();
              await doInferenceImage();
            });
          }
        }}
      />
    </>
  );
}
