import { readFileSync } from 'fs';
import { join } from 'path';
import { db } from './connection';

export async function runMigrations(): Promise<void> {
  try {
    console.log('Running database migrations...');
    // Always read from src/database/schema.sql
    const schemaPath = join(process.cwd(), 'src', 'database', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    await db.query(schema);
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}