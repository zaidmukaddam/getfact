import { configAsync, Pool } from "../deps.ts";

await configAsync({ export: true });

const databaseUrl = Deno.env.get("DATABASE_URL");

const sbClient = new Pool(databaseUrl, 10, true);

const sbPg = await sbClient.connect();

try {
  // initialize the database schema
  await sbPg.queryObject`
        CREATE TABLE IF NOT EXISTS fact_table (
            api_key uuid PRIMARY KEY,
            fact text [50] NOT NULL
        )
    `;
} finally {
  sbPg.release();
}

export { sbClient };
