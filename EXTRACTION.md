# Dify Workflow Extraction

这份文档是关于 Dify 工作流（Workflow）提取项目的说明，以下是为你准备的中文翻译：

---

### 📂 Dify 工作流提取项目

该文件夹是一个用于 Dify 工作流构建器和工作流运行时 UI 的独立提取工作区。

#### ✅ 包含内容

- `src/app/components/workflow`：工作流画布、节点面板、运行/调试面板、工作流状态管理（stores）以及工作流事件处理程序。
- `src/app/components/workflow-app`：Dify 应用层级的工作流外壳（shell）、草稿同步 Hooks、运行 Hooks、头部/面板连接逻辑。
- `src/service/workflow.ts`, `src/service/base.ts`, `src/service/log.ts`, `src/service/share.ts`：编辑器和运行时流程所需的 API / SSE（服务端发送事件）辅助工具。
- `src/types/workflow.ts`：工作流相关的 API 和运行时类型定义。
- 上述模块所引用的传递性本地文件（已排除测试文件、故事板 stories、模拟数据 mocks、`.next` 目录以及 `node_modules`）。

#### 🔧 推荐的后续重构方向

复制过来的代码目前仍在使用 Dify 的路径别名（path aliases）和若干 Dify 应用服务。为了进行二次开发，建议先保持工作流代码的稳定，然后将以下集成点替换为你自己的适配器：

- `src/service/base.ts`：HTTP 客户端、鉴权请求头、CSRF 处理、SSE 解析。
- `src/service/workflow.ts`：草稿获取/同步、单节点运行、工作流停止、检查变量等 API。
- `src/app/components/workflow-app/hooks/use-workflow-init.ts`：初始草稿加载以及空草稿的创建。
- `src/app/components/workflow-app/hooks/use-workflow-run.ts`：运行/停止的编排逻辑以及 SSE 回调。
- `src/app/components/workflow-app/hooks/use-nodes-sync-draft.ts`：草稿持久化的防抖处理。
- `src/app/components/workflow-app/index.tsx`：对 Dify 应用/工作空间上下文的依赖。

#### 🚀 入口文件

- 重新导出文件：`src/standalone/workflow-exports.ts`。
- 原始编辑器入口：`src/app/components/workflow/index.tsx`。
- 原始应用外壳入口：`src/app/components/workflow-app/index.tsx`。

#### 💡 注意事项

- 本次提取有意保留了 `src` 下的原始文件路径，以便 `@/` 别名导入能够继续正常工作。
- 生成的 Vite 演示页面仅作为一个中性的外壳。当你开始替换 Dify 服务时，请将 `WorkflowContextProvider`、`WorkflowWithDefaultContext` 和 `WorkflowWithInnerContext` 接入到你自己的产品外壳中。
- 如果你将此文件夹移出 Dify 单体仓库（monorepo），请在此文件夹内运行 `pnpm install`。依赖项已尽可能写明了具体的版本目录。

#### 📏 范围边界

这并不是 `web` 目录的完整副本。它是从工作流构建器/运行时入口开始的本地导入闭包。存在一些看起来不属于工作流的目录，是因为原始的工作流代码直接导入了它们作为支撑 UI：

- `app/components/base`：工作流面板和节点所使用的共享按钮、模态框、编辑器组件、图标、菜单以及布局原语。
- `app/components/plugins`, `app/components/tools`, `app/components/header`：工具节点、LLM 节点、Agent 节点和触发器节点所使用的插件/工具/模型选择器。
- `app/components/datasets`, `app/components/rag-pipeline`：知识库检索和数据源节点的配置 UI。
- `app/components/app`, `app/components/billing`：被原始工作流应用外壳引入的 Dify 发布/头部/限额相关 UI。 **如果想要一个真正精简的产品，下一步的最佳做法是：在保持 `app/components/workflow` 稳定的同时，用你自己的适配器/组件来替换这些 Dify 的外壳集成。**

#### ✔️ 验证情况

- 提取脚本已完成，`未解析的本地导入：0`。
- 由于当前 Shell 环境的 Node.js 版本为 v14.21.3，而本仓库的 pnpm 要求 Node.js >= 18.12，因此无法运行 `pnpm --dir workflow-extracted type-check`。
- 使用 Codex 捆绑的较新版本 Node 运行 TypeScript 进行了源码级别的检查，但提取出的项目仍然存在一些 Dify 上下文相关的类型问题，主要集中在严格的 i18n（国际化）类型以及核心工作流界面之外的应用外壳组件上。请将此文件夹视为一个忠实的提取工作区，而非已经完全产品化的独立应用。

#### 📊 提取统计

- 已复制文件数：2290
- 未解析的本地导入：0

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
