# Get Fact API

This is a simple API that let you store fact about anything you want and
retrieve it later with an api key(uuid v4).

## Getting started

Documentation is available [here](https://getfact.deno.dev/)

## Prerequisites

- [Deno](https://deno.land/): ^1.19.0
- [Postgres](https://www.postgresql.org/) database

## Development

This project uses Postgres as a database, the easiest way is to use
[Supabase](https://supabase.com/) to setup postgres database.

1. Copy `.env.example` to create a new file `.env`

   ```sh
   cp .env.example .env
   ```

2. Get your postgres database connection string

3. Add your connection string to the `DATABASE_URL` variable

   ```env
   DATABASE_URL=postgres://user:password@host:port/database
   ```

4. Run the server

   ```sh
   deno run --allow-net --allow-env --allow-read --watch ./src/app.ts
   ```

5. To watch changes for documentation html and css files, run

   ```sh
   deno run --allow-net --allow-read --allow-write --watch ./src/public/index.ts
   ```
   note: you need to manually save the `/src/public/index.ts` file
## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022 Zaid Mukaddam
