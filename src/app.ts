import { app } from "./webserver.ts";

const port = 8080;

app.addEventListener(
  "listen",
  () => console.log(`Listening on http://localhost:${port}`),
);

app.addEventListener("error", (event) => {
  console.log(event.error);
});

await app.listen({
  port,
  // secure: true,
  // certFile: "cert.pem",
  // keyFile: "key.pem",
});
