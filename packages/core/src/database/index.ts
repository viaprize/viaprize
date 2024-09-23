import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

export type ViaprizeClientDatabase = PostgresJsDatabase<typeof schema>;

// export type TableNames =   ExtractTableRelationsFromSchema<keyof schema>;
export class ViaprizeDatabase {
  database: ViaprizeClientDatabase;

  constructor({ databaseUrl }: { databaseUrl: string }) {
    this.database = drizzle(postgres(databaseUrl), {
      schema,
    });
  }

  async refreshCache(name: schema.DonationViewNames) {
    await this.database.refreshMaterializedView(schema[name]).concurrently();
  }

  static async migrate(databaseUrl: string) {
    const migrationClient = postgres(databaseUrl, { max: 1 });

    await migrate(drizzle(migrationClient), {
      migrationsFolder: "./migrations",
    });
  }
}
