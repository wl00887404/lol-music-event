import { sql } from "drizzle-orm";
import { db } from "../src/db.ts";

async function dropAllMaterializedViews() {
  const result = await db.execute(sql`
    SELECT matviewname
    FROM pg_matviews
    WHERE schemaname = 'public'
  `);

  const viewNames = result.rows.map((r) => r.matviewname as string);

  if (viewNames.length === 0) {
    console.log("No materialized views found.");
    return;
  }

  for (const name of viewNames) {
    await db.execute(
      sql.raw(`DROP MATERIALIZED VIEW IF EXISTS "${name}" CASCADE`),
    );
    console.log(`Dropped: ${name}`);
  }

  console.log("Done.");
}

dropAllMaterializedViews().catch(console.error);
