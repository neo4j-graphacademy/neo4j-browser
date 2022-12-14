import React, { useEffect, useState } from 'react'
import { Sandbox } from '../types/sandbox'
import neo4j, { Driver } from 'neo4j-driver'
import Loading from '../loading'
import { getSandboxHost } from '../utils'

interface VerifyConnectivityProps {
  sandbox: Sandbox
  setError: (error: string) => void
  setDriver: (driver: Driver) => void
}

export function VerifyConnectivity({
  sandbox,
  setDriver,
  setError
}: VerifyConnectivityProps): JSX.Element {
  const maxAttempts = process.env.REACT_APP_VERIFY_CONNECTIVITY_ATTEMPTS || 20
  const [attempt, setAttempt] = useState<number>(1)

  useEffect(() => {
    const uri = getSandboxHost(sandbox)

    const driver = neo4j.driver(
      uri,
      neo4j.auth.basic(sandbox.username, sandbox.password)
    )

    driver
      .verifyConnectivity()
      .then(() => {
        if (process.env.REACT_APP_DEBUG && attempt < maxAttempts) {
          throw new Error('[FAKE ERROR]')
        } else {
          setDriver(driver)
        }
      })
      .catch(e => {
        if (attempt === maxAttempts) {
          setError(e.message)
        } else {
          setTimeout(() => setAttempt(attempt + 1), 400)
        }
      })
  }, [sandbox, attempt, setDriver, setError, maxAttempts])

  let message = ``

  if (attempt > 10) {
    message = 'Still trying...'
  } else if (attempt > 5) {
    message += ' This may take a few seconds...'
  } else {
    message += 'Connecting to Sandbox Instance.'
  }

  return <Loading message={message} />
}
