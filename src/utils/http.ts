import { Response, Status } from "../deps.ts";

function json(
  // deno-lint-ignore no-explicit-any
  data: any,
  response: Response,
  options: { status: Status } = { status: Status.OK },
): void {
  response.headers.set("content-type", "application/json");
  response.body = data;
  response.status = options.status;
}

export { json };
