import { Alert, Button } from '@neo4j-ndl/react'
import React, { useState } from 'react'
import { GraphAcademyContext } from './graph-academy.context'
import { Sandbox } from './types/sandbox'
import { Driver } from 'neo4j-driver'

import { GetSandboxCredentials } from './stages/1-get-credentials'
import { WaitForSandboxIp } from './stages/2-wait-for-ip'
import { VerifyConnectivity } from './stages/3-verify-connectivity'

interface GraphAcademyProviderProps {
  children: React.ReactNode | React.ReactNode[] | null
}

declare global {
  interface Window {
    ga: {
      course?: {
        title: string
        usecase: string | undefined
      }
    }
  }
}

export default function GraphAcademyProvider(
  props: GraphAcademyProviderProps
): JSX.Element {
  const [sandbox, setSandbox] = useState<Sandbox>()
  const [error, setError] = useState<string>()
  const [driver, setDriver] = useState<Driver>()

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Alert
            description={error}
            icon
            type="danger"
            title="Error connecting to sandbox"
          >
            <p style={{ marginBottom: 24 }}>{error}</p>
            <Button color="danger" onClick={() => document.location.reload()}>
              Refresh Page
            </Button>
          </Alert>

          <div
            style={{
              marginTop: 24,
              maxWidth: 280,
              fontSize: '0.9rem',
              textAlign: 'center'
            }}
          >
            You can also log into{' '}
            <a
              href={`https://sandbox.neo4j.com/?usecase=${window.ga?.course?.usecase}`}
              style={{ fontWeight: 'bold', textDecoration: 'underline' }}
              rel="noreferrer"
              target="_blank"
            >
              Neo4j Sandbox
            </a>
            {window.ga?.course?.usecase
              ? ` and selecting the ${window.ga?.course?.usecase} use case`
              : ''}
            .
          </div>
        </div>
      </div>
    )
  }

  // 1. Load Sandbox for use case
  else if (!sandbox) {
    return <GetSandboxCredentials setSandbox={setSandbox} setError={setError} />
  }

  // 2. Wait for Sandbox IP to be set
  else if (!sandbox.ip || sandbox.ip === undefined) {
    return (
      <WaitForSandboxIp
        sandbox={sandbox}
        setSandbox={setSandbox}
        setError={setError}
      />
    )
  }

  // 3. Connect and verify connectivity
  else if (!driver) {
    window.localStorage.setItem(
      'neo4j.connections',
      JSON.stringify({
        allConnectionIds: ['$$discovery'],
        connectionsById: {
          $$discovery: {
            host: `${sandbox.scheme}://${sandbox.ip}:${sandbox.boltPort}`,
            id: '$$discovery',
            name: '$$discovery',
            type: 'bolt',
            username: sandbox.username,
            password: sandbox.password
          }
        },
        activeConnection: '$$discovery',
        connectionState: 1
      })
    )

    return (
      <VerifyConnectivity
        sandbox={sandbox}
        setDriver={setDriver}
        setError={setError}
      />
    )
  }

  // 4. Render application
  return (
    <GraphAcademyContext.Provider value={{ sandbox, driver }}>
      {/* <LoadingWrapper> */}
      {/* @ts-ignore */}
      {/* <Neo4jProvider driver={driver}> */}
      {props.children}
      {/* </Neo4jProvider> */}
      {/* </LoadingWrapper> */}
    </GraphAcademyContext.Provider>
  )
}
