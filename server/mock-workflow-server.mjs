import http from 'node:http'

const port = Number(process.env.MOCK_SERVER_PORT || 5001)

const now = Math.floor(Date.now() / 1000)
const appId = 'standalone-workflow-app'

const appDetail = {
  id: appId,
  name: '\u672c\u5730\u5de5\u4f5c\u6d41',
  description: '\u7528\u4e8e\u672c\u5730\u8c03\u8bd5\u548c\u540e\u7eed\u540e\u7aef\u63a5\u53e3\u5bf9\u63a5\u7684\u5de5\u4f5c\u6d41\u5e94\u7528\u3002',
  author_name: 'Dify',
  icon_type: 'emoji',
  icon: 'W',
  icon_background: '#E0EAFF',
  icon_url: null,
  use_icon_as_answer_icon: false,
  mode: 'workflow',
  enable_site: true,
  enable_api: true,
  api_rpm: 60,
  api_rph: 3600,
  is_demo: false,
  model_config: {},
  app_model_config: {},
  created_at: now,
  updated_at: now,
  site: {
    access_token: '',
    title: 'Standalone Workflow',
    description: '',
    chat_color_theme: '#155EEF',
    chat_color_theme_inverted: false,
    author: 'Dify',
    support_email: '',
    default_language: 'zh-Hans',
    customize_domain: '',
    theme: 'light',
    customize_token_strategy: 'not_allow',
    prompt_public: false,
    app_base_url: '',
    copyright: '',
    privacy_policy: '',
    custom_disclaimer: '',
    icon_type: 'emoji',
    icon: 'W',
    icon_background: '#E0EAFF',
    icon_url: null,
    show_workflow_steps: true,
    use_icon_as_answer_icon: false,
  },
  api_base_url: '',
  tags: [],
  workflow: {
    id: 'standalone-workflow',
    created_at: now,
    updated_at: now,
  },
  access_mode: 'public',
  has_draft_trigger: false,
}

const appListResponse = {
  data: [appDetail],
  has_more: false,
  limit: 30,
  page: 1,
  total: 1,
}

const workflowDraft = {
  id: 'draft-standalone',
  graph: {
    nodes: [
      {
        id: 'start-1',
        type: 'custom',
        position: { x: 80, y: 282 },
        data: {
          title: 'Start',
          desc: '',
          type: 'start',
          variables: [
            { variable: 'query', label: 'Query', type: 'text-input', required: true, options: [] },
          ],
        },
      },
      {
        id: 'llm-1',
        type: 'custom',
        position: { x: 380, y: 282 },
        data: {
          title: 'LLM',
          desc: 'Generate a response',
          type: 'llm',
          model: {
            provider: '',
            name: '',
            mode: 'chat',
            completion_params: { temperature: 0.7 },
          },
          prompt_template: [{ role: 'system', text: 'You are a helpful workflow assistant.' }],
          context: { enabled: false, variable_selector: [] },
          vision: { enabled: false },
        },
      },
      {
        id: 'end-1',
        type: 'custom',
        position: { x: 680, y: 282 },
        data: {
          title: 'End',
          desc: '',
          type: 'end',
          outputs: [
            { variable: 'text', value_selector: ['llm-1', 'text'] },
          ],
        },
      },
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-1',
        sourceHandle: 'source',
        target: 'llm-1',
        targetHandle: 'target',
        type: 'custom',
        data: { sourceType: 'start', targetType: 'llm' },
      },
      {
        id: 'e2',
        source: 'llm-1',
        sourceHandle: 'source',
        target: 'end-1',
        targetHandle: 'target',
        type: 'custom',
        data: { sourceType: 'llm', targetType: 'end' },
      },
    ],
    viewport: { x: 0, y: 0, zoom: 1 },
  },
  features: {
    opening_statement: 'Build, preview, and run workflows locally.',
    suggested_questions: ['What does this workflow do?', 'Can I add another node?'],
    suggested_questions_after_answer: { enabled: true },
    speech_to_text: { enabled: false },
    text_to_speech: { enabled: false },
    retriever_resource: { enabled: false },
    sensitive_word_avoidance: { enabled: false },
    file_upload: {
      enabled: false,
      allowed_file_types: ['image'],
      allowed_file_extensions: ['.png'],
      allowed_file_upload_methods: ['local_file', 'remote_url'],
      number_limits: 3,
      image: { enabled: false, number_limits: 3, transfer_methods: ['local_file', 'remote_url'] },
    },
  },
  created_at: now,
  created_by: { id: 'local-user', name: 'Local Developer', email: 'local@example.com' },
  hash: 'standalone-hash',
  updated_at: now,
  updated_by: { id: 'local-user', name: 'Local Developer', email: 'local@example.com' },
  tool_published: false,
  environment_variables: [],
  conversation_variables: [],
  version: '1',
  marked_name: '',
  marked_comment: '',
}

const json = (res, status, body, headers = {}) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...headers,
  })
  res.end(JSON.stringify(body))
}

const notFound = (res) => json(res, 404, { code: 'not_found', message: 'Mock endpoint not implemented' })

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const { pathname } = url

  if (req.method === 'GET' && pathname === '/__mock/status')
    return json(res, 200, { name: 'dify-workflow-mock', appId, port })

  if (req.method === 'GET' && pathname === '/console/api/files/upload')
    return json(res, 200, { batch_count_limit: 10, file_size_limit: 15728640, file_upload_limit: 5, image_file_batch_limit: 10, attachment_image_file_size_limit: 2097152, single_chunk_attachment_limit: 10 })

  if (req.method === 'POST' && pathname === '/console/api/workspaces/current')
    return json(res, 200, { id: 'standalone-workspace', name: 'Local Workspace', plan: 'sandbox', status: 'normal', created_at: now, role: 'owner', providers: [], trial_credits: 200, trial_credits_used: 0, next_credit_reset_date: 0 })

  if (req.method === 'GET' && pathname === '/console/api/apps')
    return json(res, 200, appListResponse)

  if (req.method === 'GET' && pathname === `/console/api/apps/${appId}`)
    return json(res, 200, appDetail)

  if (req.method === 'GET' && pathname === `/console/api/apps/${appId}/workflows/draft`)
    return json(res, 200, workflowDraft)

  if (req.method === 'GET' && pathname === `/console/api/apps/${appId}/workflows/publish`)
    return json(res, 200, workflowDraft)

  if (req.method === 'GET' && pathname === `/console/api/apps/${appId}/workflows/default-workflow-block-configs`)
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === `/console/api/apps/${appId}/triggers`)
    return json(res, 200, { data: [] })

  if (req.method === 'GET' && pathname === `/console/api/apps/${appId}/workflow-runs`)
    return json(res, 200, { data: [] })

  if (req.method === 'GET' && pathname === '/console/api/workspaces/current/tool-providers')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === '/console/api/workspaces/current/tools/builtin')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === '/console/api/workspaces/current/tools/api')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === '/console/api/workspaces/current/tools/workflow')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === '/console/api/workspaces/current/tools/mcp')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === '/console/api/spec/schema-definitions')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === '/console/api/version')
    return json(res, 200, { current_env: 'DEVELOPMENT', current_version: '0.1.0', latest_version: '0.1.0', release_date: '', release_notes: '', version: '0.1.0', can_auto_update: false })

  if (req.method === 'GET' && pathname === '/api/version')
    return json(res, 200, { current_env: 'DEVELOPMENT', current_version: '0.1.0', latest_version: '0.1.0', release_date: '', release_notes: '', version: '0.1.0', can_auto_update: false })

  if (req.method === 'GET' && pathname === '/api/files/upload')
    return json(res, 200, { batch_count_limit: 10, file_size_limit: 15728640, file_upload_limit: 5, image_file_batch_limit: 10, attachment_image_file_size_limit: 2097152, single_chunk_attachment_limit: 10 })

  if (req.method === 'GET' && pathname === '/api/apps')
    return json(res, 200, appListResponse)

  if (req.method === 'GET' && pathname === `/api/apps/${appId}`)
    return json(res, 200, appDetail)

  if (req.method === 'GET' && pathname === '/console/api/account/profile')
    return json(res, 200, { id: 'local-user', name: 'Local Developer', email: 'local@example.com', avatar: '', avatar_url: '', is_password_set: true }, { 'x-version': '0.1.0', 'x-env': 'DEVELOPMENT' })

  if (req.method === 'GET' && pathname === '/console/api/workspaces/current/model-providers')
    return json(res, 200, { data: [] })

  if (req.method === 'GET' && pathname === '/console/api/workspaces/current/agent-providers')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname.startsWith('/console/api/workspaces/current/models/model-types/'))
    return json(res, 200, { data: [] })

  if (req.method === 'GET' && pathname === '/console/api/workspaces/current/triggers')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname.startsWith('/console/api/workspaces/current/trigger-provider/'))
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === '/console/api/datasets/retrieval-setting')
    return json(res, 200, { retrieval_method: [] })

  if (req.method === 'GET' && pathname === '/console/api/apps/standalone-workflow-app/server')
    return json(res, 200, { data: null })

  if (req.method === 'GET' && pathname === '/console/api/apps/standalone-workflow-app/server/refresh')
    return json(res, 200, { data: null })

  if (req.method === 'GET' && pathname === '/api/apps/standalone-workflow-app/workflows/draft')
    return json(res, 200, workflowDraft)

  if (req.method === 'GET' && pathname === '/api/apps/standalone-workflow-app/workflows/publish')
    return json(res, 200, workflowDraft)

  if (req.method === 'GET' && pathname === '/api/apps/standalone-workflow-app/triggers')
    return json(res, 200, { data: [] })

  if (req.method === 'GET' && pathname === '/api/workspaces/current/tools/workflow')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === '/api/workspaces/current/tool-providers')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === '/api/workspaces/current/agent-providers')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname.startsWith('/api/workspaces/current/models/model-types/'))
    return json(res, 200, { data: [] })

  if (req.method === 'GET' && pathname === '/api/workspaces/current/triggers')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname.startsWith('/api/workspaces/current/trigger-provider/'))
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === '/api/workspaces/current/tools/builtin')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === '/api/workspaces/current/tools/api')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === '/api/workspaces/current/tools/mcp')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === '/api/spec/schema-definitions')
    return json(res, 200, [])

  if (req.method === 'GET' && pathname === '/api/files/upload')
    return json(res, 200, { batch_count_limit: 10, file_size_limit: 15728640, file_upload_limit: 5, image_file_batch_limit: 10, attachment_image_file_size_limit: 2097152, single_chunk_attachment_limit: 10 })

  if (req.method === 'GET' && pathname.endsWith('/workflows/draft/variables'))
    return json(res, 200, { items: [], total: 0, page: 1 })

  if (req.method === 'GET' && pathname.endsWith('/workflows/draft/system-variables'))
    return json(res, 200, { items: [] })

  if (req.method === 'GET' && pathname.endsWith('/workflows/draft/conversation-variables'))
    return json(res, 200, { items: [] })

  if (req.method === 'POST' && pathname.endsWith('/workflows/draft'))
    return json(res, 200, { updated_at: now, hash: 'standalone-hash' })

  if (req.method === 'POST' && pathname.endsWith('/workflows/trigger/run'))
    return json(res, 200, { result: 'ok' })

  if (req.method === 'POST' && pathname.endsWith('/workflow-runs/tasks/undefined/stop'))
    return json(res, 200, { result: 'ok' })

  if (req.method === 'GET' && pathname.endsWith('/workflows/draft/nodes/default'))
    return json(res, 200, {})

  return notFound(res)
})

server.listen(port, '127.0.0.1', () => {
  console.log(`mock workflow server listening on http://127.0.0.1:${port}`)
})
