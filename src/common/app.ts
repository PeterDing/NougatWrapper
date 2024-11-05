import { mkdir } from "@tauri-apps/plugin-fs";
import {
  appDataDir,
  appLocalDataDir,
  BaseDirectory,
  sep,
} from "@tauri-apps/api/path";

export class AppCommon {
  public appDataDir: string;
  public appLocalDataDir: string;
  public imageDir: string;
  public sep: string;

  constructor() {
    this.appDataDir = "";
    this.appLocalDataDir = "";
    this.imageDir = "images";
    this.sep = sep();
    this.init();
  }

  public async init() {
    this.appDataDir = await appDataDir();
    this.appLocalDataDir = await appLocalDataDir();

    // Create image directory if it doesn't exist
    await mkdir(this.imageDir, {
      baseDir: BaseDirectory.AppLocalData,
      recursive: true,
    });

    console.log("AppCommon initialized", this);
  }

  public getImagePath(filename: string): string {
    return `${this.appLocalDataDir}${this.sep}${this.imageDir}${this.sep}${filename}`;
  }
}

export const appCommon = new AppCommon();
