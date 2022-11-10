import React, { useEffect, useState } from 'react'
import Loading from '../loading'
import { Sandbox } from '../types/sandbox'
import { getSandboxbyHashKey } from '../utils'

interface WaitForSandboxIpProps {
  sandbox: Sandbox
  setSandbox: (sandbox: Sandbox) => void
  setError: (error: string) => void
}

export function WaitForSandboxIp({
  sandbox,
  setSandbox,
  setError
}: WaitForSandboxIpProps): JSX.Element {
  const maxAttempts = process.env.REACT_APP_WAIT_IP_ATTEMPTS || 3
  const [attempt, setAttempt] = useState<number>(1)

  useEffect(() => {
    getSandboxbyHashKey(sandbox.sandboxHashKey)
      .then(json => {
        if (process.env.REACT_APP_DEBUG && attempt < maxAttempts) {
          throw new Error('[FAKE ERROR]')
        }

        if (json.ip) {
          setSandbox(json)
        } else {
          setAttempt(attempt + 1)
        }
      })
      .catch(e => {
        if (attempt === maxAttempts) {
          setError(e.message)
        } else {
          setAttempt(attempt + 1)
        }
      })
  }, [sandbox, attempt, setSandbox, setError])

  return <Loading message="Configuring Sandbox, please wait..." />
}
