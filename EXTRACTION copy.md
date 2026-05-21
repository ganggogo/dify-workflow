# Dify Workflow Extraction
This folder is a standalone extraction workspace for the Dify workflow builder and workflow runtime UI.
## Included
- `src/app/components/workflow`: workflow canvas, node panels, run/debug panels, workflow stores, and workflow event handlers.
- `src/app/components/workflow-app`: Dify app-level workflow shell, draft sync hooks, run hooks, header/panel wiring.
- `src/service/workflow.ts`, `src/service/base.ts`, `src/service/log.ts`, `src/service/share.ts`: API/SSE helpers needed by editor/runtime flows.
- `src/types/workflow.ts`: workflow API and runtime types.
- Transitive local files imported by those modules, excluding tests, stories, mocks, `.next`, and `node_modules`.
## Recommended Next Refactor
The copied code still uses Dify path aliases and several Dify application services. For secondary development, keep the workflow code stable first, then replace these integration points with your own adapters:
- `src/service/base.ts`: HTTP client, auth headers, CSRF handling, SSE parsing.
- `src/service/workflow.ts`: draft fetch/sync, node single-run, workflow stop, inspect variable APIs.
- `src/app/components/workflow-app/hooks/use-workflow-init.ts`: initial draft loading and empty-draft creation.
- `src/app/components/workflow-app/hooks/use-workflow-run.ts`: run/stop orchestration and SSE callbacks.
- `src/app/components/workflow-app/hooks/use-nodes-sync-draft.ts`: debounce draft persistence.
- `src/app/components/workflow-app/index.tsx`: Dify app/workspace context dependencies.
## Entrypoints
- Re-export file: `src/standalone/workflow-exports.ts`.
- Original editor entry: `src/app/components/workflow/index.tsx`.
- Original app shell entry: `src/app/components/workflow-app/index.tsx`.
## Notes
- This extraction intentionally preserves original file paths under `src` so `@/` imports continue to work.
- The generated Vite demo page is only a neutral shell. Wire `WorkflowContextProvider`, `WorkflowWithDefaultContext`, and `WorkflowWithInnerContext` into your own product shell when you start replacing Dify services.
- If you move this folder outside the Dify monorepo, run `pnpm install` inside this folder. Dependencies have been written with concrete catalog versions where possible.
## Scope Boundary
This is not a full copy of `web`. It is the local import closure starting from workflow builder/runtime entries. Some non-workflow-looking directories exist because the original workflow code imports them directly as support UI:
- `app/components/base`: shared buttons, modals, editor pieces, icons, menus, and layout primitives used by workflow panels and nodes.
- `app/components/plugins`, `app/components/tools`, `app/components/header`: plugin/tool/model selectors used by tool, LLM, agent, and trigger nodes.
- `app/components/datasets`, `app/components/rag-pipeline`: knowledge retrieval and data-source node configuration UI.
- `app/components/app`, `app/components/billing`: Dify publish/header/limit UI pulled by the original workflow app shell.
For a truly slim product, the best next step is replacing those Dify shell integrations with your own adapters/components while keeping `app/components/workflow` stable.
## Verification
- Extraction script completed with `Unresolved local imports: 0`.
- `pnpm --dir workflow-extracted type-check` could not run under the shell Node.js v14.21.3 because this repo's pnpm requires Node.js >= 18.12.
- Running TypeScript with the Codex bundled newer Node reached source-level checks, but the extracted project still reports Dify-context type issues, mostly strict i18n typing and app-shell components outside the core workflow surface. Treat this folder as a faithful extraction workspace, not yet a fully productized standalone app.
## Extraction Stats
- Copied files: 2290
- Unresolved local imports: 0
