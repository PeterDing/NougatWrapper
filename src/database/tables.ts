export const JobTableSql = `
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  by TEXT,
  status TEXT,
  createdAt TEXT,
  updatedAt TEXT,
  filename TEXT,
  inferenceResult TEXT,
  editedContent TEXT
);
CREATE INDEX IF NOT EXISTS jobs_by ON jobs (by);
CREATE INDEX IF NOT EXISTS jobs_createdAt ON jobs (createdAt);
CREATE INDEX IF NOT EXISTS jobs_updatedAt ON jobs (updatedAt);
`;
