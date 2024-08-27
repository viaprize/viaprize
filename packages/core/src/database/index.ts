import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

export class ViaprizeDatabase {
  database: PostgresJsDatabase<Record<string, never>>;

  constructor({ databaseUrl }: { databaseUrl: string }) {
    this.database = drizzle(postgres(databaseUrl));
  }

  static async migrate(databaseUrl: string) {
    const migrationClient = postgres(databaseUrl, { max: 1 });

    await migrate(drizzle(migrationClient), {
      migrationsFolder: "./migrations",
      migrationsTable: "migrations",
    });
  }
}
