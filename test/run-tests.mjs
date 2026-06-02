#!/usr/bin/env node
import { JSDOM } from "jsdom";
import { spawnSync } from "child_process";
import { existsSync, readFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

if (!existsSync(resolve(root, "dist"))) {
  mkdirSync(resolve(root, "dist"));
}

const tish = spawnSync(
  "npx",
  [
    "--no-install",
    "tish",
    "build",
    "test/panels.test.tish",
    "-o",
    "dist/panels-test.js",
    "--target",
    "js",
  ],
  {
    cwd: root,
    encoding: "utf8",
  },
);

if (tish.status !== 0) {
  console.error("Compile failed:", tish.stderr || tish.stdout);
  process.exit(1);
}

const testPath = resolve(root, "dist/panels-test.js");
if (!existsSync(testPath)) {
  console.error("Compiled test not found:", testPath);
  process.exit(1);
}

const testCode = readFileSync(testPath, "utf8");

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  url: "http://localhost/"
});
const win = dom.window;
global.window = win;
global.document = win.document;
global.HTMLElement = win.HTMLElement;
global.Element = win.Element;
global.Node = win.Node;
global.Text = win.Text;
global.DocumentFragment = win.DocumentFragment;
global.HTMLDivElement = win.HTMLDivElement;
global.HTMLInputElement = win.HTMLInputElement;
global.HTMLButtonElement = win.HTMLButtonElement;
global.HTMLTextAreaElement = win.HTMLTextAreaElement;
global.addEventListener = win.addEventListener;
global.removeEventListener = win.removeEventListener;
global.queueMicrotask = queueMicrotask;
global.localStorage = win.localStorage;

try {
  eval(testCode);
} catch (e) {
  console.error("Test failed:", e);
  process.exit(1);
}
