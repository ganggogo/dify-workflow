import { AppModeEnum } from '@/types/app'

const now = Math.floor(Date.now() / 1000)

export const standaloneAppId = 'standalone-workflow-app'

export const standaloneAppDetail = {
  id: standaloneAppId,
  name: 'Standalone Workflow',
  description: 'Local workflow builder shell',
  author_name: 'Dify',
  icon_type: 'emoji',
  icon: 'W',
  icon_background: '#E0EAFF',
  icon_url: null,
  use_icon_as_answer_icon: false,
  mode: AppModeEnum.WORKFLOW,
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

export const standaloneWorkflowApps = [
  {
    ...standaloneAppDetail,
    name: '\u672c\u5730\u5de5\u4f5c\u6d41',
    description: '\u7528\u4e8e\u672c\u5730\u8c03\u8bd5\u548c\u540e\u7eed\u540e\u7aef\u63a5\u53e3\u5bf9\u63a5\u7684\u5de5\u4f5c\u6d41\u5e94\u7528\u3002',
    workflow: {
      id: 'standalone-workflow',
      created_at: now,
      updated_at: now,
    },
  },
]

export const standaloneWorkspace = {
  id: 'standalone-workspace',
  name: 'Local Workspace',
  plan: 'sandbox',
  status: 'normal',
  created_at: now,
  role: 'owner',
  providers: [],
  trial_credits: 200,
  trial_credits_used: 0,
  next_credit_reset_date: 0,
}

export const standaloneUserProfile = {
  id: 'local-user',
  name: 'Local Developer',
  email: 'local@example.com',
  avatar: '',
  avatar_url: '',
  is_password_set: true,
}
