import type { PropsWithChildren } from 'react'
import type { AppContextValue } from '@/context/app-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEventEmitter } from 'ahooks'
import { useEffect, useMemo, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { useStore as useAppStore } from '@/app/components/app/store'
import { AppContext, initialLangGeniusVersionInfo } from '@/context/app-context'
import { EventEmitterContext } from '@/context/event-emitter'
import { baseProviderContextValue, ProviderContext } from '@/context/provider-context'
import { createI18nextInstance } from '@/i18n-config/client'
import { namespaces, namespacesInFileName } from '@/i18n-config/resources'
import {
  standaloneAppDetail,
  standaloneUserProfile,
  standaloneWorkspace,
} from './mock-data'

useAppStore.setState({ appDetail: standaloneAppDetail as any })

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

const enFiles = import.meta.glob('../i18n/en-US/*.json', { eager: true, import: 'default' })
const zhFiles = import.meta.glob('../i18n/zh-Hans/*.json', { eager: true, import: 'default' })

const buildLocaleResources = (
  language: string,
  files: Record<string, unknown>,
  fallback?: Record<string, unknown>,
) => {
  return Object.fromEntries(namespaces.map((namespace, index) => {
    const filename = namespacesInFileName[index]
    const resource = files[`../i18n/${language}/${filename}.json`] ?? fallback?.[namespace] ?? {}
    return [namespace, resource]
  }))
}

const enUSResources = buildLocaleResources('en-US', enFiles)

const resources = {
  'en-US': enUSResources,
  'zh-Hans': buildLocaleResources('zh-Hans', zhFiles, enUSResources),
}

const StandaloneProviders = ({ children }: PropsWithChildren) => {
  const [i18n] = useState(() => createI18nextInstance('zh-Hans', resources))
  const eventEmitter = useEventEmitter()
  const setAppDetail = useAppStore(s => s.setAppDetail)
  const appContextValue = useMemo<AppContextValue>(() => ({
    userProfile: standaloneUserProfile as any,
    currentWorkspace: standaloneWorkspace as any,
    isCurrentWorkspaceManager: true,
    isCurrentWorkspaceOwner: true,
    isCurrentWorkspaceEditor: true,
    isCurrentWorkspaceDatasetOperator: true,
    mutateUserProfile: () => {},
    mutateCurrentWorkspace: () => {},
    langGeniusVersionInfo: initialLangGeniusVersionInfo,
    useSelector: selector => selector({
      userProfile: standaloneUserProfile as any,
      currentWorkspace: standaloneWorkspace as any,
      isCurrentWorkspaceManager: true,
      isCurrentWorkspaceOwner: true,
      isCurrentWorkspaceEditor: true,
      isCurrentWorkspaceDatasetOperator: true,
      mutateUserProfile: () => {},
      mutateCurrentWorkspace: () => {},
      langGeniusVersionInfo: initialLangGeniusVersionInfo,
      useSelector: (() => undefined) as any,
      isLoadingCurrentWorkspace: false,
      isValidatingCurrentWorkspace: false,
    }),
    isLoadingCurrentWorkspace: false,
    isValidatingCurrentWorkspace: false,
  }), [])

  useEffect(() => {
    setAppDetail(standaloneAppDetail as any)
  }, [setAppDetail])

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <AppContext.Provider value={appContextValue as any}>
          <ProviderContext.Provider value={{ ...baseProviderContextValue, isFetchedPlan: true, isAPIKeySet: true }}>
            <EventEmitterContext.Provider value={{ eventEmitter }}>
              {children}
            </EventEmitterContext.Provider>
          </ProviderContext.Provider>
        </AppContext.Provider>
      </QueryClientProvider>
    </I18nextProvider>
  )
}

export default StandaloneProviders
