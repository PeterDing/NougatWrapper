import Database from "tauri-plugin-sql-api";
import { JobTableSql } from "./tables";
import { IJob } from "./job";

const dbPath = "sqlite:library.sqlite";

class Library {
  private db: Database;

  constructor() {
    this.db = new Database(dbPath);
    this.init();
  }

  private async init() {
    this.db = await Database.load(dbPath);
    await this.db.execute(JobTableSql);
  }

  public async getJobs(): Promise<IJob[]> {
    const rows: any[] = await this.db.select("SELECT * FROM jobs ORDER BY id");
    const jobs = rows.map((row) => ({
      ...row,
      inferenceResult: JSON.parse(row.inferenceResult),
    }));
    return jobs;
  }

  public async getJob(jobId: number): Promise<IJob | null> {
    const rows: any[] = await this.db.select(
      "SELECT * FROM jobs WHERE id = ?",
      [jobId]
    );
    const job =
      rows.map((row) => ({
        ...row,
        inferenceResult: JSON.parse(row.inferenceResult),
      }))[0] || null;
    return job;
  }

  /*
   * Add a job into the database.
   * Return the id of the inserted job.
   */
  public async addJob(job: IJob): Promise<number> {
    const inferenceResultString = JSON.stringify(job.inferenceResult);
    const result = await this.db.execute(
      "INSERT INTO jobs (by, status, createdAt, updatedAt, filename, inferenceResult, editedContent) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        job.by,
        job.status,
        job.createdAt,
        job.updatedAt,
        job.filename,
        inferenceResultString,
        job.editedContent,
      ]
    );
    return result.lastInsertId;
  }

  public async updateJob(job: IJob) {
    const inferenceResultString = JSON.stringify(job.inferenceResult);
    await this.db.execute(
      "UPDATE jobs SET status = ?, updatedAt = ?, inferenceResult = ?, editedContent = ? WHERE id = ?",
      [
        job.status,
        job.updatedAt,
        inferenceResultString,
        job.editedContent,
        job.id,
      ]
    );
  }

  public async deleteJob(jobId: number) {
    await this.db.execute("DELETE FROM jobs WHERE id = ?", [jobId]);
  }

  public async deleteAllJobs() {
    await this.db.execute("DELETE FROM jobs");
  }
}

export default new Library();
