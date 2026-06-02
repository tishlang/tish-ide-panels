import { execSync } from "child_process";
import fs from "fs";
execSync("tish build src/index.tish -o dist/index.js --target js", { stdio: 'inherit' });
execSync("tish build src/standalone-entry.tish -o dist/standalone-entry.js --target js", { stdio: 'inherit' });
execSync("tish build src/highlight/TishHighlight.tish -o dist/highlight/TishHighlight.js --target js", { stdio: 'inherit' });

fs.appendFileSync("dist/index.js", "\nexport { EditorPanel, TerminalPanel, WebPreviewPanel, FileBrowserPanel, SandboxIde, mountSandboxIde, StandalonePage, mountStandalonePage, MiniRunner, TishHighlight, useGlobalKeydown, useResize, runVm, compileToJsWithRuntime, runJsInIframe, runCompileAndExec, writeSandboxSession, readSandboxSession, parseSandboxSid, openSandboxBroadcast, encodeSharePayload, decodeSharePayload, parseShareFromUrl, readShareFromLocation, buildShareUrl, isEmbedRequested };\n");
fs.appendFileSync("dist/standalone-entry.js", "\nexport { mountSandboxIde, SandboxIde, mountStandalonePage, StandalonePage };\n");
fs.appendFileSync("dist/highlight/TishHighlight.js", "\nexport { TishHighlight };\n");
