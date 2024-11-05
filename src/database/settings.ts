import { Store, load } from "@tauri-apps/plugin-store";

const storePath = "settings.dat"; // $APPLOCALDATA/settings.dat

class AppSettings {
  private store!: Store;

  public nougatServerUrl: string;
  public static nougatServerUrlKey: string = "nougat-server-url";

  constructor() {
    this.nougatServerUrl = "";
    this.init();
  }

  private async init() {
    this.store = await load(storePath);
    this.nougatServerUrl = (await this.get("nougat-server-url")) ?? "";
  }

  public async get(key: string): Promise<string | null> {
    return (await this.store.get(key)) || null;
  }

  public async set(key: string, value: unknown) {
    await this.store.set(key, value);
    await this.store.save();
  }

  public async delete(key: string) {
    await this.store.delete(key);
    await this.store.save();
  }

  public async setNougatServerUrl(url: string) {
    await this.set(AppSettings.nougatServerUrlKey, url);
    this.nougatServerUrl = url;
  }
}

export default new AppSettings();
