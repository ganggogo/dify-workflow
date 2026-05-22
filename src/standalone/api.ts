import type { App } from '@/types/app'
import type { ICurrentWorkspace } from '@/models/common'

type LoginResponse = {
  token: string
  account: {
    id: string
    username: string
    name: string
    email: string
  }
}

const requestJSON = async <T,>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = response.statusText
    try {
      const data = await response.json() as { message?: string }
      message = data.message || message
    }
    catch {}
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export const login = (username: string, password: string) => {
  return requestJSON<LoginResponse>('/console/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export const getMe = () => {
  return requestJSON<LoginResponse>('/console/api/auth/me')
}

export const getWorkspaceProfile = () => {
  return requestJSON<ICurrentWorkspace>('/console/api/workspaces/current/profile')
}

export const logout = () => {
  return requestJSON<{ result: string }>('/console/api/auth/logout', { method: 'POST' })
}

export const createWorkflowApp = (payload: {
  name: string
  description?: string
  note?: string
}) => {
  return requestJSON<App>('/console/api/apps', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.name,
      description: payload.description || payload.note || '',
      mode: 'workflow',
      note: payload.note || '',
    }),
  })
}

export const updateWorkflowApp = (app: App, payload: {
  name: string
  description: string
}) => {
  return requestJSON<App>(`/console/api/apps/${app.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: payload.name,
      description: payload.description,
      icon_type: app.icon_type || 'emoji',
      icon: app.icon || 'W',
      icon_background: app.icon_background || '#E0EAFF',
    }),
  })
}
