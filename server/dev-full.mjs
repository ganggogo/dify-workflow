import { spawn } from 'node:child_process'
import http from 'node:http'
import net from 'node:net'
import path from 'node:path'

const backendPort = Number(process.env.MOCK_SERVER_PORT || 5001)

const checkPort = port => new Promise((resolve) => {
  const tester = net.createServer()

  tester.once('error', (error) => {
    if (error.code === 'EADDRINUSE')
      resolve(false)
    else
      resolve(false)
  })

  tester.once('listening', () => {
    tester.close(() => resolve(true))
  })

  tester.listen(port, '127.0.0.1')
})

const requestMockStatus = port => new Promise((resolve) => {
  const req = http.get(`http://127.0.0.1:${port}/__mock/status`, (res) => {
    let body = ''
    res.setEncoding('utf8')
    res.on('data', chunk => body += chunk)
    res.on('end', () => {
      try {
        resolve({ statusCode: res.statusCode, body: JSON.parse(body) })
      }
      catch {
        resolve({ statusCode: res.statusCode, body: null })
      }
    })
  })

  req.on('error', () => resolve(null))
  req.setTimeout(1000, () => {
    req.destroy()
    resolve(null)
  })
})

let backend
let frontend

const shutdown = (exitCode = 0) => {
  backend?.kill()
  frontend?.kill()
  process.exit(exitCode)
}

const run = (cmd, args, opts = {}) => {
  const child = spawn(cmd, args, {
    stdio: 'inherit',
    ...opts,
  })

  child.on('error', (error) => {
    console.error(`Failed to start ${cmd}:`, error.message)
    shutdown(1)
  })

  return child
}

const isBackendPortFree = await checkPort(backendPort)

if (!isBackendPortFree) {
  const status = await requestMockStatus(backendPort)
  const isExistingMock = status?.statusCode === 200 && status.body?.name === 'dify-workflow-mock'

  console.error(`\nPort ${backendPort} is already in use.`)

  if (isExistingMock) {
    console.error(`A dify-workflow mock server is already running on http://127.0.0.1:${backendPort}.`)
    console.error('Close the old terminal/process first, then run `pnpm dev` again.')
  }
  else {
    console.error(`Another process is using http://127.0.0.1:${backendPort}.`)
    console.error('Stop that process, or run with another backend port and update the Vite proxy target.')
  }

  process.exit(1)
}

const viteBin = path.resolve('node_modules/vite/bin/vite.js')

backend = run(process.execPath, ['server/mock-workflow-server.mjs'])
frontend = run(process.execPath, [viteBin, '--host', '127.0.0.1'])

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
