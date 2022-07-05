import { Router, send, Status } from "./deps.ts";
import { getFact, removeFact, setFact } from "./controllers/fact.ts";

const router = new Router();

router.get("/", async ({ response }) => {
  const html = await Deno.readFile("./public/build/index.html");
  response.body = html;
  response.headers.set("content-type", "text/html; charset=utf-8");
  response.status = Status.OK;
});

router.get("/public/:path+", async (ctx) => {
  ctx.response.headers.set("X-Content-Type-Options", "nosniff");
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}`,
    maxage: 31536000000,
    immutable: true,
  });
});

router.get("/api/v1/fact", async ({ request, response }) => {
  await getFact(request, response);
});

router.post("/api/v1/fact", async ({ request, response }) => {
  await setFact(request, response);
});

router.delete("/api/v1/fact", async ({ request, response }) => {
  await removeFact(request, response);
});

export { router };
