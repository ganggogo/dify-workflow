import { useMemo } from 'react'

export const usePathname = () => {
  if (typeof window === 'undefined')
    return '/'

  return window.location.pathname
}

export const useSearchParams = () => {
  const search = typeof window === 'undefined' ? '' : window.location.search

  return useMemo(() => new URLSearchParams(search), [search])
}

export const useParams = <T extends Record<string, string | string[]> = Record<string, string>>() => {
  return {} as T
}

export const useSelectedLayoutSegment = () => null

export const useSelectedLayoutSegments = () => []

export const useRouter = () => {
  return {
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    prefetch: () => Promise.resolve(),
    push: (href: string) => {
      window.history.pushState(null, '', href)
      window.dispatchEvent(new PopStateEvent('popstate'))
    },
    refresh: () => window.location.reload(),
    replace: (href: string) => {
      window.history.replaceState(null, '', href)
      window.dispatchEvent(new PopStateEvent('popstate'))
    },
  }
}
