# Standalone 工作流模块改动与后端接口说明

本文记录当前 `dify-workflow` standalone 版本为了本地运行、工作流管理、工作流编排和 mock 后端所做的关键改动。后续接真实后端时，可以优先按本文的接口清单逐步替换 mock。

## 一、前端重要变更

### 1. standalone 入口

涉及文件：

- `src/main.tsx`
- `src/standalone/App.tsx`
- `src/standalone/StandaloneProviders.tsx`
- `src/standalone/mock-data.ts`

当前入口不再直接只显示工作流编排器，而是增加了一层 standalone 壳：

- 默认显示“工作流管理”页面。
- 点击列表里的“编辑工作流”进入原来的工作流编排器。
- 点击编排器左上角“返回管理”回到工作流管理页。
- `StandaloneProviders` 负责注入：
  - `I18nextProvider`
  - `QueryClientProvider`
  - `AppContext`
  - `ProviderContext`
  - `EventEmitterContext`
  - 当前 app detail、workspace、user profile mock 数据

### 2. 工作流管理页

新增文件：

- `src/standalone/WorkflowManager.tsx`

当前包含：

- 工作流管理页头部。
- 工作流总数、当前工作区、Mock 状态三个统计块。
- 工作流应用列表。
- 工作流搜索框。
- 刷新按钮，调用 `useAppList` 重新请求 `/apps`。
- “新建工作流”按钮。
- “新建工作流”弹窗表单。

新建表单字段：

- `name`：名称，必填。
- `description`：简介，可选。
- `note`：备注，可选。

当前限制：

- 由于 mock 后端目前只有固定的 `standalone-workflow-app` 草稿接口，新建后仍复用这个固定 appId 进入编排器。
- 后续接真实后端时，应把新建动作改成调用 `POST /console/api/apps`，由后端返回真实 `app.id`，然后再进入 `/apps/:appId/workflows/draft` 对应的编排器。

### 3. 工作流编排器接入

复用原组件：

- `src/app/components/workflow-app/index.tsx`
- `src/app/components/workflow-app/components/workflow-main.tsx`
- `src/app/components/workflow/**`

`src/standalone/App.tsx` 在进入编排器前会把当前 app 写入：

- `src/app/components/app/store.ts` 的 `appDetail`

编排器依赖 `appDetail.id` 拉取：

- 草稿工作流
- 发布工作流
- 默认节点配置
- triggers
- workflow runs
- 模型、工具、文件上传等辅助数据

### 4. 中文语言

涉及文件：

- `src/standalone/StandaloneProviders.tsx`
- `src/standalone/mock-data.ts`

当前 standalone 默认语言为 `zh-Hans`，并使用 `en-US` 作为 fallback。

注意：

- 一些 standalone 新增文案目前直接写在 `WorkflowManager.tsx` 中。
- 更完整的做法是后续把这些文案迁移到 `src/i18n/zh-Hans/*.json` 和 `src/i18n/en-US/*.json`。

### 5. 样式与主题

涉及文件：

- `index.html`
- `src/app/styles/globals.css`
- `src/themes/light.css`
- `src/themes/dark.css`
- `src/tailwind.config.ts`
- `src/tailwind-common-config.ts`
- `vite.config.ts`

关键点：

- `index.html` 设置了 light theme，避免 CSS 变量未生效导致页面背景透明。
- `globals.css` 引入 theme、preflight、组件样式和 Tailwind。
- `tailwind.config.ts` 扫描 `./src/**/*.{js,ts,jsx,tsx}`，确保抽取后的组件类名能生成。
- `vite.config.ts` 接入 `@tailwindcss/vite`。
- `vite.config.ts` 把 `/console/api` 和 `/api` 代理到 mock 后端 `http://127.0.0.1:5001`。

### 6. 图标 fallback

涉及文件：

- `src/tailwind-common-config.ts`
- `package.json`

当前安装并使用：

- `@iconify-json/ri`
- `@iconify-json/heroicons`

原因：

- 原 Dify 自定义图标包 `@dify/iconify-collections` 在当前 registry 下不可用。
- 为避免 `i-custom-vender-*` 类名无法生成，当前把常用 custom-vender 图标映射到 `ri` 近似图标。

后续建议：

- 如果能拿到 Dify 原图标包，优先恢复原包。
- 如果继续用 fallback，页面上发现哪个图标不准确，就继续在 `customVenderIcons` 中补映射。

### 7. Next 运行时 shim

涉及文件：

- `src/next/navigation.ts`

原因：

- 当前 standalone 是 Vite SPA，不在 Next.js App Router 环境中。
- 原组件里使用了 `usePathname`、`useRouter`、`useSearchParams` 等 Next API，因此需要 browser shim。

### 8. 启动脚本

涉及文件：

- `package.json`
- `server/dev-full.mjs`
- `server/mock-workflow-server.mjs`

当前命令：

```powershell
pnpm dev
```

会同时启动：

- mock 后端：`http://127.0.0.1:5001`
- Vite 前端：`http://127.0.0.1:5173`

`server/dev-full.mjs` 已处理：

- 启动前检查 `5001` 是否被占用。
- 如果已有 mock server 或其它进程占用，会提示并退出。
- Windows 下使用 `process.execPath` 启动子进程，避免之前的 `spawn EINVAL`。

## 二、当前 mock 后端接口

mock 文件：

- `server/mock-workflow-server.mjs`

### 1. 健康检查

#### `GET /__mock/status`

用途：

- 给 `server/dev-full.mjs` 判断当前占用 `5001` 的是否是本项目 mock server。

返回：

```json
{
  "name": "dify-workflow-mock",
  "appId": "standalone-workflow-app",
  "port": 5001
}
```

### 2. 工作流应用管理

#### `GET /console/api/apps`

用途：

- 工作流管理页列表。
- `src/service/use-apps.ts` 的 `useAppList` 会请求这个接口。

当前 query 参数：

- `page`
- `limit`
- `name`
- `mode=workflow`

当前 mock 返回：

```json
{
  "data": [
    {
      "id": "standalone-workflow-app",
      "name": "本地工作流",
      "description": "用于本地调试和后续后端接口对接的工作流应用。",
      "mode": "workflow",
      "icon_type": "emoji",
      "icon": "W",
      "icon_background": "#E0EAFF",
      "workflow": {
        "id": "standalone-workflow",
        "created_at": 0,
        "updated_at": 0
      }
    }
  ],
  "has_more": false,
  "limit": 30,
  "page": 1,
  "total": 1
}
```

真实后端需要：

- 支持分页。
- 支持按 `mode=workflow` 过滤。
- 支持按 `name` 搜索。
- 返回字段尽量满足 `src/types/app.ts` 的 `App` 类型。

#### `GET /console/api/apps/:appId`

用途：

- 获取 app detail。

当前 mock：

- 返回同一个 `appDetail`。

#### 后续建议新增：`POST /console/api/apps`

用途：

- 新建工作流应用。

建议请求体：

```json
{
  "name": "客服问答工作流",
  "description": "处理客服问答流程",
  "mode": "workflow",
  "note": "可选备注"
}
```

建议返回：

```json
{
  "id": "new-app-id",
  "name": "客服问答工作流",
  "description": "处理客服问答流程",
  "mode": "workflow",
  "workflow": {
    "id": "new-workflow-id",
    "created_at": 0,
    "updated_at": 0
  }
}
```

接入真实后端后，前端 `src/standalone/App.tsx` 的 `createWorkflow` 应从本地构造 app 改成调用该接口。

#### 后续建议新增：`PATCH /console/api/apps/:appId`

用途：

- 编辑工作流应用的名称、简介、备注、图标等基础信息。

#### 后续建议新增：`DELETE /console/api/apps/:appId`

用途：

- 删除工作流应用。

### 3. 工作流草稿与发布版本

#### `GET /console/api/apps/:appId/workflows/draft`

用途：

- 编排器初始化主接口。

当前 mock 返回：

- `graph.nodes`
- `graph.edges`
- `graph.viewport`
- `features`
- `environment_variables`
- `conversation_variables`
- `tool_published`
- `hash`
- `created_at`
- `updated_at`

当前 mock graph 包含：

- Start 节点
- LLM 节点
- End 节点

真实后端注意：

- 节点结构必须匹配 `src/app/components/workflow` 内部使用的数据结构。
- `graph.nodes[].data.type` 是关键字段。
- `graph.edges[].data.sourceType` / `targetType` 会影响连线和节点行为。

#### `POST /console/api/apps/:appId/workflows/draft`

用途：

- 保存草稿。
- 当前 mock 对所有以 `/workflows/draft` 结尾的 POST 返回固定结果。

当前 mock 返回：

```json
{
  "updated_at": 0,
  "hash": "standalone-hash"
}
```

真实后端需要：

- 接收完整 workflow draft。
- 返回新的 `hash` 和 `updated_at`。
- 后续如果做并发编辑，需要校验 hash。

#### `GET /console/api/apps/:appId/workflows/publish`

用途：

- 获取已发布工作流。
- 编排器发布面板、恢复发布版本等逻辑会用到。

当前 mock：

- 直接返回同一份 draft。

#### 后续建议：`POST /console/api/apps/:appId/workflows/publish`

用途：

- 发布当前工作流。

当前前端已有发布相关逻辑，真实后端应按 Dify 原接口补齐。

### 4. 默认节点配置

#### `GET /console/api/apps/:appId/workflows/default-workflow-block-configs`

用途：

- 编排器初始化各节点默认配置。

当前 mock：

```json
[]
```

真实后端需要：

- 返回每种 block type 的默认配置。
- 如果缺少配置，部分节点面板可能显示不完整。

#### `GET */workflows/draft/nodes/default`

用途：

- 某些节点创建或默认配置读取。

当前 mock：

```json
{}
```

### 5. triggers

#### `GET /console/api/apps/:appId/triggers`

用途：

- 当前 app 的触发器列表。

当前 mock：

```json
{
  "data": []
}
```

#### `GET /console/api/workspaces/current/triggers`

用途：

- 当前 workspace 支持的 trigger provider 列表。

当前 mock：

```json
[]
```

#### `GET /console/api/workspaces/current/trigger-provider/*`

用途：

- 获取某个 trigger provider 的详情或配置。

当前 mock：

```json
[]
```

### 6. workflow runs

#### `GET /console/api/apps/:appId/workflow-runs`

用途：

- 编排器运行历史或调试记录。

当前 mock：

```json
{
  "data": []
}
```

#### `POST */workflows/trigger/run`

用途：

- 触发运行。

当前 mock：

```json
{
  "result": "ok"
}
```

#### `POST */workflow-runs/tasks/undefined/stop`

用途：

- 当前 mock 兜底停止任务请求。

当前 mock：

```json
{
  "result": "ok"
}
```

真实后端应改成真实 taskId：

```text
POST /console/api/apps/:appId/workflow-runs/tasks/:taskId/stop
```

### 7. workflow variables

当前 mock 对以下路径做兜底：

- `GET */workflows/draft/variables`
- `GET */workflows/draft/system-variables`
- `GET */workflows/draft/conversation-variables`

返回：

```json
{
  "items": []
}
```

其中 `/variables` 还返回：

```json
{
  "items": [],
  "total": 0,
  "page": 1
}
```

真实后端需要：

- 返回环境变量、系统变量、会话变量。
- 支持变量新增、编辑、删除、重置等接口时，再按前端调用补齐。

### 8. 模型与 provider

#### `GET /console/api/workspaces/current/model-providers`

当前 mock：

```json
{
  "data": []
}
```

#### `GET /console/api/workspaces/current/agent-providers`

当前 mock：

```json
[]
```

#### `GET /console/api/workspaces/current/models/model-types/:type`

当前 mock：

```json
{
  "data": []
}
```

前端曾出现过这些 404：

- `/console/api/workspaces/current/models/model-types/text-embedding`
- `/console/api/workspaces/current/models/model-types/rerank`

真实后端需要支持的常见 `type`：

- `llm`
- `text-embedding`
- `rerank`
- 其它 Dify 支持的模型类型

#### `GET /console/api/workspaces/current/default-model?model_type=llm`

当前不在 mock server 中实现，而是在 `src/service/base.ts` 的 standalone 内联 mock 中兜底。

真实后端建议实现：

```json
{
  "data": {
    "model": "",
    "model_type": "llm",
    "provider": {
      "provider": "",
      "icon_small": {
        "en_US": "",
        "zh_Hans": ""
      }
    }
  }
}
```

### 9. 工具与 schema

当前 mock：

- `GET /console/api/workspaces/current/tool-providers`
- `GET /console/api/workspaces/current/tools/builtin`
- `GET /console/api/workspaces/current/tools/api`
- `GET /console/api/workspaces/current/tools/workflow`
- `GET /console/api/workspaces/current/tools/mcp`
- `GET /console/api/spec/schema-definitions`

返回：

```json
[]
```

真实后端需要：

- 按 Dify 工具市场、内置工具、API 工具、workflow tool、MCP 工具的数据结构返回。
- `schema-definitions` 会影响工具参数表单和 JSON schema 编辑。

### 10. 文件上传配置

#### `GET /console/api/files/upload`

#### `GET /api/files/upload`

当前 mock 返回：

```json
{
  "batch_count_limit": 10,
  "file_size_limit": 15728640,
  "file_upload_limit": 5,
  "image_file_batch_limit": 10,
  "attachment_image_file_size_limit": 2097152,
  "single_chunk_attachment_limit": 10
}
```

### 11. 用户、工作区、系统特性

#### `GET /console/api/account/profile`

当前 mock 返回本地用户。

#### `POST /console/api/workspaces/current`

当前 mock 返回本地 workspace。

注意：

- 这里当前是 `POST`，因为现有前端调用路径如此；真实后端如果是 `GET`，需要同步前端或兼容两个方法。

#### `GET /console/api/system-features`

当前由 `src/service/base.ts` 内联 mock 兜底，不在 mock server 中。

真实后端需要返回 `src/types/feature.ts` 中的 system features 结构。

### 12. 数据集检索配置

#### `GET /console/api/datasets/retrieval-setting`

当前 mock：

```json
{
  "retrieval_method": []
}
```

用于知识检索节点相关配置。

### 13. app server 信息

当前 mock：

- `GET /console/api/apps/standalone-workflow-app/server`
- `GET /console/api/apps/standalone-workflow-app/server/refresh`

返回：

```json
{
  "data": null
}
```

### 14. `/api` 前缀兼容

mock server 同时对部分 `/api/...` 路径做了兼容：

- `/api/version`
- `/api/files/upload`
- `/api/apps`
- `/api/apps/:appId`
- `/api/apps/:appId/workflows/draft`
- `/api/apps/:appId/workflows/publish`
- `/api/apps/:appId/triggers`
- `/api/workspaces/current/*`
- `/api/spec/schema-definitions`

原因：

- 原 Dify 代码里有些请求走 `API_PREFIX`，有些 public/share 逻辑会走 `/api`。

## 三、前端内联 mock

文件：

- `src/service/base.ts`

当前 `getStandaloneMockResponse` 会拦截：

- `/system-features`
- `/workspaces/current/default-model`
- `/workspaces/current/agent-providers`
- `/workspaces/current/triggers`
- `/workspaces/current/models/model-types/*`

作用：

- 即使 mock server 没覆盖某些路径，也能避免前端白屏。

后续建议：

- 真实后端补齐后，可以逐步删除或关闭这些内联 mock。
- 不建议长期保留，否则容易掩盖真实接口错误。

## 四、后端优先实现顺序

建议先实现这些接口，页面最容易稳定：

1. `GET /console/api/apps`
2. `POST /console/api/apps`
3. `GET /console/api/apps/:appId`
4. `GET /console/api/apps/:appId/workflows/draft`
5. `POST /console/api/apps/:appId/workflows/draft`
6. `GET /console/api/apps/:appId/workflows/publish`
7. `POST /console/api/apps/:appId/workflows/publish`
8. `GET /console/api/apps/:appId/workflows/default-workflow-block-configs`
9. `GET /console/api/workspaces/current/model-providers`
10. `GET /console/api/workspaces/current/default-model`
11. `GET /console/api/workspaces/current/models/model-types/:type`
12. `GET /console/api/workspaces/current/tool-providers`
13. `GET /console/api/workspaces/current/tools/*`
14. `GET /console/api/files/upload`
15. `GET /console/api/system-features`

管理功能继续完善时再补：

- `PATCH /console/api/apps/:appId`
- `DELETE /console/api/apps/:appId`
- workflow run 历史
- trigger 创建、编辑、启停
- 版本历史
- app 访问控制
- API key 管理

## 五、当前验证结果

已验证：

```powershell
node --check server\mock-workflow-server.mjs
pnpm build
```

均通过。

注意：

- 构建时仍会出现大量 `"use client" was ignored` 和部分 SVG alias warning，这是因为抽取自 Next/Dify 的组件在 Vite 下打包；目前不影响构建产物。
- 当前不会自动启动服务。需要手动运行：

```powershell
pnpm dev
```

如果 `5001` 被占用，先关闭旧终端或旧进程，再重新运行。
