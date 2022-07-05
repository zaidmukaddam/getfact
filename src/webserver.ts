import { Application } from "./deps.ts";
import { router } from "./routes.ts";

const app = new Application();

// Initialize routes
app.use(router.routes());
app.use(router.allowedMethods());

export { app, router };
