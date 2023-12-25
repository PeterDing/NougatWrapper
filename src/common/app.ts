import { createDir } from "@tauri-apps/api/fs";
import { appDataDir, appLocalDataDir, sep } from "@tauri-apps/api/path";

export class AppCommon {
  public appDataDir: string;
  public appLocalDataDir: string;
  public imageDir: string;

  constructor() {
    this.appDataDir = "";
    this.appLocalDataDir = "";
    this.imageDir = "images";
    this.init();
  }

  public async init() {
    this.appDataDir = await appDataDir();
    this.appLocalDataDir = await appLocalDataDir();

    // Create image directory if it doesn't exist
    const imageDir = `${this.appLocalDataDir}${sep}${this.imageDir}`;
    await createDir(imageDir, { recursive: true });

    console.log("AppCommon initialized", this);
  }

  public getImagePath(filename: string): string {
    return `${this.appLocalDataDir}${sep}${this.imageDir}${sep}${filename}`;
  }
}

export const appCommon = new AppCommon();
