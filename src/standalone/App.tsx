import type { App as AppType } from '@/types/app'
import { useEffect, useState } from 'react'
import { RiArrowLeftLine, RiLogoutBoxRLine } from '@remixicon/react'
import { useStore as useAppStore } from '@/app/components/app/store'
import WorkflowApp from '@/app/components/workflow-app'
import { createWorkflowApp, getMe, login, logout, updateWorkflowApp } from './api'
import LoginPage from './LoginPage'
import StandaloneProviders from './StandaloneProviders'
import type { CreateWorkflowPayload } from './WorkflowManager'
import WorkflowManager from './WorkflowManager'

const App = () => {
  const [selectedApp, setSelectedApp] = useState<AppType | null>(null)
  const [isAuthed, setIsAuthed] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const setAppDetail = useAppStore(s => s.setAppDetail)

  useEffect(() => {
    getMe()
      .then(() => setIsAuthed(true))
      .catch(() => setIsAuthed(false))
      .finally(() => setIsCheckingAuth(false))
  }, [])

  const openWorkflow = (app: AppType) => {
    setAppDetail(app as any)
    setSelectedApp(app)
  }

  const handleLogin = async (username: string, password: string) => {
    await login(username, password)
    setIsAuthed(true)
  }

  const handleLogout = async () => {
    await logout()
    setSelectedApp(null)
    setAppDetail(undefined)
    setIsAuthed(false)
  }

  const createWorkflow = async (payload: CreateWorkflowPayload) => {
    const app = await createWorkflowApp(payload)
    openWorkflow(app)
  }

  const editWorkflowSettings = async (app: AppType, payload: { name: string, description: string }) => {
    const updated = await updateWorkflowApp(app, payload)
    if (selectedApp?.id === app.id) {
      setAppDetail(updated as any)
      setSelectedApp(updated)
    }
  }

  return (
    <StandaloneProviders>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          minHeight: '100vh',
          overflow: 'hidden',
          background: 'var(--color-components-panel-bg, #f9fafb)',
          position: 'relative',
        }}
      >
        {isCheckingAuth
          ? (
              <div className="flex h-full w-full items-center justify-center bg-background-body text-text-tertiary system-sm-regular">
                {'\u6b63\u5728\u521d\u59cb\u5316...'}
              </div>
            )
          : !isAuthed
              ? (
                  <LoginPage onLogin={handleLogin} />
                )
              : selectedApp
          ? (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="absolute left-4 top-4 z-50 inline-flex h-8 items-center gap-1.5 rounded-lg border border-components-button-secondary-border bg-components-button-secondary-bg px-3 text-components-button-secondary-text shadow-sm system-sm-medium hover:bg-components-button-secondary-bg-hover"
                >
                  <RiArrowLeftLine className="h-4 w-4" />
                  {'\u8fd4\u56de\u7ba1\u7406'}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="absolute right-4 top-4 z-50 inline-flex h-8 items-center gap-1.5 rounded-lg border border-components-button-secondary-border bg-components-button-secondary-bg px-3 text-components-button-secondary-text shadow-sm system-sm-medium hover:bg-components-button-secondary-bg-hover"
                >
                  <RiLogoutBoxRLine className="h-4 w-4" />
                  {'\u9000\u51fa\u767b\u5f55'}
                </button>
                <WorkflowApp />
              </>
            )
          : (
              <WorkflowManager
                onCreateWorkflow={createWorkflow}
                onOpenWorkflow={openWorkflow}
                onEditWorkflowSettings={editWorkflowSettings}
                onLogout={handleLogout}
              />
            )}
      </div>
    </StandaloneProviders>
  )
}

export default App
