// deno-lint-ignore-file
import { Status } from "../deps.ts";
import type { Request, Response } from "../deps.ts";
import { sbClient } from "../services/supabase.ts";
import { json } from "../utils/http.ts";

const defaultResponseBody = {
  title: "Get Fact API",
  summary: "Get a random or all fact from the database",
  description: "Get a random or all fact from the database that you store",
  lincese: {
    name: "MIT",
  },
  version: "1.0.0",
  data: {},
  error: {},
};

/**
 * Type for the fact table
 */
interface Fact {
  "api_key": string;
  fact: string[];
}

/**
 * Get fact from the database
 *
 * @param request Request
 * @param response Response
 * @returns Promise<void>
 */
async function getFact(
  request: Request,
  response: Response,
): Promise<void> {
  const connection = await sbClient.connect();

  const { searchParams } = request.url;

  const apiKey = searchParams.get("api_key");
  const ignore = searchParams.get("ignore");
  const single = searchParams.get("single") ?? true;

  try {
    if (!apiKey) {
      json(
        {
          ...defaultResponseBody,
          error: {
            message: "Missing api key",
            Status: Status.BadRequest,
          },
        },
        response,
        { status: Status.BadRequest },
      );
      return;
    }

    const queryResult = await connection.queryObject<Fact>(
      `SELECT
                api_key, fact
              FROM
                fact_table
              WHERE
                api_key='${apiKey}';
      `,
    );

    const facts = queryResult.rows;

    if (facts.length === 0) {
      json({
        ...defaultResponseBody,
        method: request.method,
        data: {
          api_key: apiKey,
          fact: [],
        },
      }, response);
      return;
    }

    if (typeof single === "string" && single === "false") {
      if (facts[0].fact.length === 0) {
        json({
          ...defaultResponseBody,
          method: request.method,
          data: {
            api_key: apiKey,
            fact: [],
          },
        }, response);
        return;
      }

      json({
        ...defaultResponseBody,
        method: request.method,
        data: {
          api_key: apiKey,
          fact: facts[0].fact,
        },
      }, response);
      return;
    }

    const filteredFacts = facts[0].fact.filter((fact: any) => fact !== ignore);

    if (filteredFacts.length === 0 || filteredFacts.length === 0) {
      json({
        ...defaultResponseBody,
        method: request.method,
        data: {
          api_key: apiKey,
          fact: [],
        },
      }, response);
      return;
    }

    const zeroToResultsLength = Math.floor(
      Math.random() * filteredFacts.length,
    );
    const randomFact = filteredFacts[zeroToResultsLength];

    json({
      ...defaultResponseBody,
      method: request.method,
      data: {
        api_key: apiKey,
        fact: [randomFact],
      },
    }, response);
  } catch (error) {
    console.error(error);

    json(
      {
        ...defaultResponseBody,
        error: {
          message: error.message,
          Status: Status.InternalServerError,
        },
      },
      response,
      { status: Status.InternalServerError },
    );
  } finally {
    connection.release();
  }
}

/**
 * Set fact from the database
 *
 * @param request Request
 * @param response Response
 * @returns Promise<void>
 */
async function setFact(
  request: Request,
  response: Response,
): Promise<void> {
  const connection = await sbClient.connect();

  const { api_key: apiKey, fact } = await request.body().value;

  try {
    if (typeof apiKey !== "string" || typeof fact !== "string") {
      json(
        {
          ...defaultResponseBody,
          error: {
            message: "Missing api key and/or fact",
            Status: Status.BadRequest,
          },
        },
        response,
        { status: Status.BadRequest },
      );
      return;
    }

    const queryResult = await connection.queryObject<Fact>(
      `INSERT INTO
                fact_table (api_key, fact)
              VALUES
                ('${apiKey}', ARRAY ['${fact}'])
              ON CONFLICT
                (api_key)
              DO UPDATE SET
                fact = array_cat(fact_table.fact, EXCLUDED.fact);
      `,
    );

    if (queryResult.rowCount === 1) {
      json(
        {
          ...defaultResponseBody,
          method: request.method,
          data: {
            api_key: apiKey,
            fact,
          },
        },
        response,
        { status: Status.Created },
      );
      return;
    }

    json(
      {
        ...defaultResponseBody,
        error: {
          message: "Failed to create fact",
          Status: Status.InternalServerError,
        },
      },
      response,
      { status: Status.InternalServerError },
    );
  } catch (error) {
    console.error(error);

    json(
      {
        ...defaultResponseBody,
        error: {
          message: error.message,
          Status: Status.InternalServerError,
        },
      },
      response,
      { status: Status.InternalServerError },
    );
  } finally {
    connection.release();
  }
}

/**
 * Delete fact from the database
 *
 * @param request Request
 * @param response Response
 * @returns Promise<void>
 */
async function removeFact(
  request: Request,
  response: Response,
): Promise<void> {
  const connection = await sbClient.connect();

  const { api_key: apiKey, fact } = await request.body().value;

  try {
    if (typeof apiKey !== "string" || typeof fact !== "string") {
      json(
        {
          ...defaultResponseBody,
          error: {
            message: "Missing api key and/or fact",
            Status: Status.BadRequest,
          },
        },
        response,
        { status: Status.BadRequest },
      );

      return;
    }

    const queryResult = await connection.queryObject<Fact>(`
              UPDATE
                fact_table
              SET
                fact = array_remove(fact, '${fact}')
              WHERE
                api_key='${apiKey}';
      `);

    if (queryResult.rowCount === 1) {
      json({
        ...defaultResponseBody,
        method: request.method,
        data: {
          api_key: apiKey,
          fact,
        },
      }, response);
      return;
    }

    json(
      {
        ...defaultResponseBody,
        error: {
          message: "Failed to remove fact",
          Status: Status.InternalServerError,
        },
      },
      response,
      { status: Status.InternalServerError },
    );
  } catch (error) {
    console.error(error);

    json(
      {
        ...defaultResponseBody,
        error: {
          message: error.message,
          Status: Status.InternalServerError,
        },
      },
      response,
      { status: Status.InternalServerError },
    );
  } finally {
    connection.release();
  }
}

export { getFact, removeFact, setFact };
