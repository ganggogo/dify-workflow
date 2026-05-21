import type { App } from '@/types/app'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import {
  RiAddLine,
  RiArrowRightLine,
  RiEditLine,
  RiFlowChart,
  RiRefreshLine,
  RiSearchLine,
  RiTimeLine,
} from '@remixicon/react'
import { useAppList } from '@/service/use-apps'
import { AppModeEnum } from '@/types/app'
import { cn } from '@/utils/classnames'
import { standaloneWorkflowApps } from './mock-data'

type WorkflowManagerProps = {
  onCreateWorkflow: (payload: CreateWorkflowPayload) => void
  onOpenWorkflow: (app: App) => void
}

export type CreateWorkflowPayload = {
  name: string
  description: string
  note: string
}

const text = {
  noTime: '\u6682\u65e0\u65f6\u95f4',
  title: '\u5de5\u4f5c\u6d41\u7ba1\u7406',
  description: '\u7ba1\u7406\u5de5\u4f5c\u6d41\u5e94\u7528\uff0c\u5e76\u8fdb\u5165\u7f16\u6392\u5668\u7f16\u8f91\u8282\u70b9\u4e0e\u53d1\u5e03\u914d\u7f6e\u3002',
  create: '\u65b0\u5efa\u5de5\u4f5c\u6d41',
  createTitle: '\u65b0\u5efa\u5de5\u4f5c\u6d41',
  createDescription: '\u586b\u5199\u57fa\u672c\u4fe1\u606f\u540e\u8fdb\u5165\u5de5\u4f5c\u6d41\u7f16\u6392\u5668\u3002',
  name: '\u540d\u79f0',
  intro: '\u7b80\u4ecb',
  note: '\u5907\u6ce8',
  namePlaceholder: '\u4f8b\u5982\uff1a\u5ba2\u670d\u95ee\u7b54\u5de5\u4f5c\u6d41',
  introPlaceholder: '\u7b80\u8981\u8bf4\u660e\u8fd9\u4e2a\u5de5\u4f5c\u6d41\u7684\u7528\u9014',
  notePlaceholder: '\u53ef\u9009\uff0c\u8bb0\u5f55\u63a5\u53e3\u3001\u8d23\u4efb\u4eba\u6216\u5f85\u529e\u4e8b\u9879',
  nameRequired: '\u8bf7\u8f93\u5165\u5de5\u4f5c\u6d41\u540d\u79f0',
  cancel: '\u53d6\u6d88',
  createAndEdit: '\u521b\u5efa\u5e76\u7f16\u8f91',
  total: '\u5de5\u4f5c\u6d41\u603b\u6570',
  workspace: '\u5f53\u524d\u5de5\u4f5c\u533a',
  mockStatus: 'Mock \u72b6\u6001',
  mockConnected: '\u5df2\u8fde\u63a5\u672c\u5730\u63a5\u53e3',
  apps: '\u5de5\u4f5c\u6d41\u5e94\u7528',
  appsDescription: '\u540e\u7eed\u53ef\u7531\u771f\u5b9e\u540e\u7aef\u8fd4\u56de\u591a\u4e2a\u5de5\u4f5c\u6d41\u5e94\u7528\u3002',
  search: '\u641c\u7d22\u5de5\u4f5c\u6d41',
  refresh: '\u5237\u65b0',
  noDescription: '\u6682\u65e0\u63cf\u8ff0',
  updatedAt: '\u66f4\u65b0\u4e8e',
  settings: '\u8bbe\u7f6e',
  edit: '\u7f16\u8f91\u5de5\u4f5c\u6d41',
  empty: '\u6ca1\u6709\u627e\u5230\u5de5\u4f5c\u6d41',
}

const formatTime = (timestamp?: number) => {
  if (!timestamp)
    return text.noTime

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp * 1000)
}

const WorkflowManager = ({ onCreateWorkflow, onOpenWorkflow }: WorkflowManagerProps) => {
  const [keyword, setKeyword] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState<CreateWorkflowPayload>({
    name: '',
    description: '',
    note: '',
  })
  const [createError, setCreateError] = useState('')
  const { data, isFetching, refetch } = useAppList({
    page: 1,
    limit: 30,
    mode: AppModeEnum.WORKFLOW,
    name: keyword,
  })

  const apps = useMemo(() => {
    const list = (data?.data?.length ? data.data : standaloneWorkflowApps) as App[]
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword)
      return list

    return list.filter(app => `${app.name} ${app.description}`.toLowerCase().includes(normalizedKeyword))
  }, [data?.data, keyword])

  const total = data?.total ?? apps.length
  const updateCreateForm = (key: keyof CreateWorkflowPayload, value: string) => {
    setCreateForm(form => ({ ...form, [key]: value }))
    if (key === 'name' && value.trim())
      setCreateError('')
  }

  const resetCreateForm = () => {
    setCreateForm({ name: '', description: '', note: '' })
    setCreateError('')
    setShowCreateModal(false)
  }

  const submitCreateForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const name = createForm.name.trim()
    if (!name) {
      setCreateError(text.nameRequired)
      return
    }

    onCreateWorkflow({
      name,
      description: createForm.description.trim(),
      note: createForm.note.trim(),
    })
    resetCreateForm()
  }

  return (
    <div className="flex h-full w-full flex-col bg-background-body text-text-primary">
      <header className="border-b border-divider-subtle bg-background-default px-8 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-components-button-primary-bg text-components-button-primary-text">
                <RiFlowChart className="h-5 w-5" />
              </div>
              <div>
                <h1 className="title-2xl-semi-bold text-text-primary">{text.title}</h1>
                <p className="system-sm-regular mt-1 text-text-tertiary">{text.description}</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-components-button-primary-bg px-3 text-components-button-primary-text system-sm-medium hover:bg-components-button-primary-bg-hover"
          >
            <RiAddLine className="h-4 w-4" />
            {text.create}
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-auto px-8 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-5">
          <section className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-components-panel-border bg-components-panel-bg p-4 shadow-xs">
              <p className="system-xs-medium text-text-tertiary">{text.total}</p>
              <p className="title-4xl-semi-bold mt-2 text-text-primary">{total}</p>
            </div>
            <div className="rounded-lg border border-components-panel-border bg-components-panel-bg p-4 shadow-xs">
              <p className="system-xs-medium text-text-tertiary">{text.workspace}</p>
              <p className="title-md-semi-bold mt-2 truncate text-text-primary">Local Workspace</p>
            </div>
            <div className="rounded-lg border border-components-panel-border bg-components-panel-bg p-4 shadow-xs">
              <p className="system-xs-medium text-text-tertiary">{text.mockStatus}</p>
              <p className="title-md-semi-bold mt-2 text-text-success">{text.mockConnected}</p>
            </div>
          </section>

          <section className="rounded-lg border border-components-panel-border bg-components-panel-bg shadow-xs">
            <div className="flex items-center justify-between gap-4 border-b border-divider-subtle px-4 py-3">
              <div>
                <h2 className="title-md-semi-bold text-text-primary">{text.apps}</h2>
                <p className="system-xs-regular mt-0.5 text-text-tertiary">{text.appsDescription}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex h-9 w-72 items-center gap-2 rounded-lg border border-components-input-border bg-components-input-bg px-3">
                  <RiSearchLine className="h-4 w-4 shrink-0 text-text-quaternary" />
                  <input
                    value={keyword}
                    onChange={event => setKeyword(event.target.value)}
                    placeholder={text.search}
                    className="h-full min-w-0 flex-1 bg-transparent text-text-primary outline-none system-sm-regular placeholder:text-text-quaternary"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-components-button-secondary-border bg-components-button-secondary-bg px-3 text-components-button-secondary-text system-sm-medium hover:bg-components-button-secondary-bg-hover"
                >
                  <RiRefreshLine className={cn('h-4 w-4', isFetching && 'animate-spin')} />
                  {text.refresh}
                </button>
              </div>
            </div>

            <div className="divide-y divide-divider-subtle">
              {apps.map(app => (
                <article key={app.id} className="flex items-center gap-4 px-4 py-4 hover:bg-state-base-hover">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg font-semibold"
                    style={{ background: app.icon_background || '#E0EAFF' }}
                  >
                    {app.icon || 'W'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="title-md-semi-bold truncate text-text-primary">{app.name}</h3>
                      <span className="rounded-md bg-state-success-hover px-1.5 py-0.5 text-text-success system-2xs-medium">
                        Workflow
                      </span>
                    </div>
                    <p className="system-sm-regular mt-1 truncate text-text-tertiary">
                      {app.description || text.noDescription}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-text-quaternary system-xs-regular">
                      <span className="inline-flex items-center gap-1">
                        <RiTimeLine className="h-3.5 w-3.5" />
                        {text.updatedAt} {formatTime(app.updated_at)}
                      </span>
                      <span>ID: {app.id}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-components-button-secondary-border bg-components-button-secondary-bg px-3 text-components-button-secondary-text system-sm-medium hover:bg-components-button-secondary-bg-hover"
                    >
                      <RiEditLine className="h-4 w-4" />
                      {text.settings}
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenWorkflow(app)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-components-button-primary-bg px-3 text-components-button-primary-text system-sm-medium hover:bg-components-button-primary-bg-hover"
                    >
                      {text.edit}
                      <RiArrowRightLine className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}

              {!apps.length && (
                <div className="flex h-48 flex-col items-center justify-center text-text-tertiary">
                  <RiFlowChart className="mb-2 h-8 w-8 text-text-quaternary" />
                  <p className="system-sm-medium">{text.empty}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={submitCreateForm}
            className="w-full max-w-[520px] rounded-lg border border-components-panel-border bg-components-panel-bg shadow-xl"
          >
            <div className="border-b border-divider-subtle px-5 py-4">
              <h2 className="title-lg-semi-bold text-text-primary">{text.createTitle}</h2>
              <p className="system-sm-regular mt-1 text-text-tertiary">{text.createDescription}</p>
            </div>
            <div className="flex flex-col gap-4 px-5 py-4">
              <label className="flex flex-col gap-1.5">
                <span className="system-sm-medium text-text-secondary">{text.name}</span>
                <input
                  autoFocus
                  value={createForm.name}
                  onChange={event => updateCreateForm('name', event.target.value)}
                  placeholder={text.namePlaceholder}
                  className="h-10 rounded-lg border border-components-input-border bg-components-input-bg px-3 text-text-primary outline-none system-sm-regular placeholder:text-text-quaternary focus:border-components-input-border-active"
                />
                {createError && <span className="system-xs-regular text-text-destructive">{createError}</span>}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="system-sm-medium text-text-secondary">{text.intro}</span>
                <textarea
                  value={createForm.description}
                  onChange={event => updateCreateForm('description', event.target.value)}
                  placeholder={text.introPlaceholder}
                  rows={3}
                  className="resize-none rounded-lg border border-components-input-border bg-components-input-bg px-3 py-2 text-text-primary outline-none system-sm-regular placeholder:text-text-quaternary focus:border-components-input-border-active"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="system-sm-medium text-text-secondary">{text.note}</span>
                <textarea
                  value={createForm.note}
                  onChange={event => updateCreateForm('note', event.target.value)}
                  placeholder={text.notePlaceholder}
                  rows={3}
                  className="resize-none rounded-lg border border-components-input-border bg-components-input-bg px-3 py-2 text-text-primary outline-none system-sm-regular placeholder:text-text-quaternary focus:border-components-input-border-active"
                />
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-divider-subtle px-5 py-4">
              <button
                type="button"
                onClick={resetCreateForm}
                className="inline-flex h-9 items-center rounded-lg border border-components-button-secondary-border bg-components-button-secondary-bg px-3 text-components-button-secondary-text system-sm-medium hover:bg-components-button-secondary-bg-hover"
              >
                {text.cancel}
              </button>
              <button
                type="submit"
                className="inline-flex h-9 items-center rounded-lg bg-components-button-primary-bg px-3 text-components-button-primary-text system-sm-medium hover:bg-components-button-primary-bg-hover"
              >
                {text.createAndEdit}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default WorkflowManager
