import type { PropsWithChildren } from 'react'
import type { AppContextValue } from '@/context/app-context'
import type { ICurrentWorkspace, UserProfileResponse } from '@/models/common'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEventEmitter } from 'ahooks'
import { useEffect, useMemo, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { ToastHost } from '@/app/components/base/ui/toast'
import { AppContext, initialLangGeniusVersionInfo, initialWorkspaceInfo, userProfilePlaceholder } from '@/context/app-context'
import { EventEmitterContext } from '@/context/event-emitter'
import { baseProviderContextValue, ProviderContext } from '@/context/provider-context'
import { createI18nextInstance } from '@/i18n-config/client'
import { namespaces, namespacesInFileName } from '@/i18n-config/resources'
import { getMe, getWorkspaceProfile } from './api'

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
  const [userProfile, setUserProfile] = useState<UserProfileResponse>(userProfilePlaceholder as UserProfileResponse)
  const [currentWorkspace, setCurrentWorkspace] = useState<ICurrentWorkspace>(initialWorkspaceInfo)
  const eventEmitter = useEventEmitter()
  const appContextValue = useMemo<AppContextValue>(() => ({
    userProfile,
    currentWorkspace,
    isCurrentWorkspaceManager: (currentWorkspace?.role === 'owner' || currentWorkspace?.role === 'admin') || false,
    isCurrentWorkspaceOwner: currentWorkspace?.role === 'owner' || false,
    isCurrentWorkspaceEditor: ['owner', 'admin', 'editor'].includes(currentWorkspace?.role || ''),
    isCurrentWorkspaceDatasetOperator: ['owner', 'admin', 'editor', 'dataset_operator'].includes(currentWorkspace?.role || ''),
    mutateUserProfile: () => {},
    mutateCurrentWorkspace: () => {},
    langGeniusVersionInfo: initialLangGeniusVersionInfo,
    useSelector: selector => selector({
      userProfile,
      currentWorkspace,
      isCurrentWorkspaceManager: (currentWorkspace?.role === 'owner' || currentWorkspace?.role === 'admin') || false,
      isCurrentWorkspaceOwner: currentWorkspace?.role === 'owner' || false,
      isCurrentWorkspaceEditor: ['owner', 'admin', 'editor'].includes(currentWorkspace?.role || ''),
      isCurrentWorkspaceDatasetOperator: ['owner', 'admin', 'editor', 'dataset_operator'].includes(currentWorkspace?.role || ''),
      mutateUserProfile: () => {},
      mutateCurrentWorkspace: () => {},
      langGeniusVersionInfo: initialLangGeniusVersionInfo,
      useSelector: (() => undefined) as any,
      isLoadingCurrentWorkspace: !currentWorkspace,
      isValidatingCurrentWorkspace: !currentWorkspace,
    }),
    isLoadingCurrentWorkspace: !currentWorkspace,
    isValidatingCurrentWorkspace: !currentWorkspace,
  }), [currentWorkspace, userProfile])

  useEffect(() => {
    Promise.all([getMe(), getWorkspaceProfile()])
      .then(([me, workspace]) => {
        setUserProfile({
          id: me.account.id,
          name: me.account.name,
          email: me.account.email,
          avatar: '',
          avatar_url: null,
          is_password_set: true,
        })
        setCurrentWorkspace({
          ...initialWorkspaceInfo,
          ...workspace,
          role: workspace.role || 'owner',
          providers: workspace.providers || [],
        })
      })
      .catch(() => {})
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <AppContext.Provider value={appContextValue as any}>
          <ProviderContext.Provider value={{ ...baseProviderContextValue, isFetchedPlan: true, isAPIKeySet: true }}>
            <EventEmitterContext.Provider value={{ eventEmitter }}>
              {children}
              <ToastHost timeout={5000} limit={3} />
            </EventEmitterContext.Provider>
          </ProviderContext.Provider>
        </AppContext.Provider>
      </QueryClientProvider>
    </I18nextProvider>
  )
}

export default StandaloneProviders
