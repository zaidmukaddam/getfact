import { randomAlphanumericString } from "../utils/string.ts";

import { emptyDirSync, init, transform } from "../deps.ts";

await init();

const publicBuildPath = `./public/build`;
const cssPath = `./src/public/styles/styles.css`;
const htmlPath = `./src/public/index.html`;
const css = await Deno.readTextFile(cssPath);
const html = await Deno.readTextFile(htmlPath);

const { code } = transform({
  filename: "styles.css",
  code: new TextEncoder().encode(css),
  minify: true,
});

const processedCss = new TextDecoder().decode(code);

const cssFiles: string[] = [];

for await (const dirEntry of Deno.readDirSync(`${publicBuildPath}/styles`)) {
  if (dirEntry.isFile) {
    cssFiles.push(dirEntry.name);
  }
}

const oldCss = Deno.readTextFileSync(
  `${publicBuildPath}/styles/${cssFiles[0]}`,
);
console.log(oldCss);

if (oldCss === processedCss) {
  console.log("No change in css");
} else {
  emptyDirSync(`${publicBuildPath}/styles`);

  const randomHash = randomAlphanumericString(8);

  const processedHtml = html.replace(
    "[GENERATED-CSS-STYLES]",
    `styles-${randomHash}`,
  );

  await Deno.writeTextFile(`${publicBuildPath}/index.html`, processedHtml);

  await Deno.writeTextFile(
    `${publicBuildPath}/styles/styles-${randomHash}.css`,
    processedCss,
  );
}
