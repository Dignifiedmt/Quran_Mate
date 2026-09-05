// SQLite database interface using sql.js with disk persistence
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDbPath() {
  const envPath = process.env.SQLITE_PATH;
  if (envPath && !envPath.includes('://')) {
    return path.resolve(envPath);
  }
  return path.resolve(process.cwd(), 'quran_mate.sqlite');
}

const DB_PATH = getDbPath();

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    dbInstance = new SQL.Database(fileBuffer);
  } else {
    dbInstance = new SQL.Database();
  }

  // Initialize schema
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    dbInstance.exec(schemaSql);
    // Safe progressive migrations for columns
    try {
      dbInstance.exec("ALTER TABLE users ADD COLUMN memorized_from_surah INTEGER DEFAULT 1;");
    } catch (e) {
      // Column may already exist
    }
    try {
      dbInstance.exec("ALTER TABLE users ADD COLUMN memorized_to_surah INTEGER DEFAULT 114;");
    } catch (e) {
      // Column may already exist
    }
    persist();
  }

  return dbInstance;
}

export function persist() {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  } catch (err) {
    console.error('Error persisting SQLite to disk:', err);
  }
}

// Database helper functions
export async function query(sql, params = []) {
  const db = await getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

export async function get(sql, params = []) {
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function run(sql, params = []) {
  const db = await getDb();
  db.run(sql, params);
  // Get last inserted id and changes
  const lastIdRes = db.exec("SELECT last_insert_rowid() as id, changes() as changes;");
  persist();
  if (lastIdRes.length > 0 && lastIdRes[0].values.length > 0) {
    const [id, changes] = lastIdRes[0].values[0];
    return { lastInsertRowid: id, changes };
  }
  return { lastInsertRowid: null, changes: 0 };
}

export async function exec(sql) {
  const db = await getDb();
  db.exec(sql);
  persist();
}
