import type { FormEvent } from 'react'
import { useState } from 'react'
import { RiLockLine } from '@remixicon/react'

type LoginPageProps = {
  onLogin: (username: string, password: string) => Promise<void>
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('12345678')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onLogin(username.trim(), password)
    }
    catch (error) {
      setError(error instanceof Error ? error.message : '\u767b\u5f55\u5931\u8d25')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-background-body px-4 text-text-primary">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[360px] rounded-lg border border-components-panel-border bg-components-panel-bg p-5 shadow-xs"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-components-button-primary-bg text-components-button-primary-text">
            <RiLockLine className="h-5 w-5" />
          </div>
          <div>
            <h1 className="title-xl-semi-bold">{'\u5de5\u4f5c\u6d41\u540e\u53f0\u767b\u5f55'}</h1>
            <p className="system-xs-regular mt-0.5 text-text-tertiary">
              {'\u4f7f\u7528\u521d\u59cb\u5316\u8d26\u53f7\u8fdb\u5165\u5de5\u4f5c\u6d41\u7ba1\u7406\u3002'}
            </p>
          </div>
        </div>

        <label className="mb-3 flex flex-col gap-1.5">
          <span className="system-sm-medium text-text-secondary">{'\u8d26\u53f7'}</span>
          <input
            value={username}
            onChange={event => setUsername(event.target.value)}
            className="h-10 rounded-lg border border-components-input-border bg-components-input-bg px-3 outline-none system-sm-regular focus:border-components-input-border-active"
            autoComplete="username"
          />
        </label>

        <label className="mb-4 flex flex-col gap-1.5">
          <span className="system-sm-medium text-text-secondary">{'\u5bc6\u7801'}</span>
          <input
            value={password}
            onChange={event => setPassword(event.target.value)}
            className="h-10 rounded-lg border border-components-input-border bg-components-input-bg px-3 outline-none system-sm-regular focus:border-components-input-border-active"
            type="password"
            autoComplete="current-password"
          />
        </label>

        {error && <p className="mb-3 system-xs-regular text-text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-components-button-primary-bg px-3 text-components-button-primary-text system-sm-medium hover:bg-components-button-primary-bg-hover disabled:opacity-60"
        >
          {loading ? '\u767b\u5f55\u4e2d...' : '\u767b\u5f55'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage
