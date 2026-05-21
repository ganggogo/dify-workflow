import type { App as AppType } from '@/types/app'
import { useState } from 'react'
import { RiArrowLeftLine } from '@remixicon/react'
import { useStore as useAppStore } from '@/app/components/app/store'
import WorkflowApp from '@/app/components/workflow-app'
import { standaloneAppDetail } from './mock-data'
import StandaloneProviders from './StandaloneProviders'
import type { CreateWorkflowPayload } from './WorkflowManager'
import WorkflowManager from './WorkflowManager'

const App = () => {
  const [selectedApp, setSelectedApp] = useState<AppType | null>(null)
  const setAppDetail = useAppStore(s => s.setAppDetail)

  const openWorkflow = (app: AppType) => {
    setAppDetail(app as any)
    setSelectedApp(app)
  }

  const createWorkflow = (payload: CreateWorkflowPayload) => {
    openWorkflow({
      ...(standaloneAppDetail as any),
      name: payload.name,
      description: payload.description || payload.note || '\u672c\u5730 mock \u6a21\u5f0f\u4e0b\u7684\u65b0\u5efa\u5de5\u4f5c\u6d41\u8349\u7a3f\u3002',
      standalone_note: payload.note,
    })
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
        {selectedApp
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
                <WorkflowApp />
              </>
            )
          : (
              <WorkflowManager
                onCreateWorkflow={createWorkflow}
                onOpenWorkflow={openWorkflow}
              />
            )}
      </div>
    </StandaloneProviders>
  )
}

export default App
