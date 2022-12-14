import { Alert, Button } from '@neo4j-ndl/react'
import React, { useEffect, useState } from 'react'
import { GraphAcademyContext } from './graph-academy.context'
import { Sandbox } from './types/sandbox'
import { Driver } from 'neo4j-driver'

import { GetSandboxCredentials } from './stages/1-get-credentials'
import { WaitForSandboxIp } from './stages/2-wait-for-ip'
import { VerifyConnectivity } from './stages/3-verify-connectivity'
import {
  CONNECTED_STATE,
  ConnectionState,
  setActiveConnection,
  updateConnection
} from 'shared/modules/connections/connectionsDuck'
import { CONNECTION_ID } from 'shared/modules/discovery/discoveryDuck'
import { NATIVE } from 'services/bolt/boltHelpers'
import { withBus } from 'react-suber'
import { connect } from 'react-redux'
import { GlobalState } from 'shared/globalState'
import { setContent } from 'shared/modules/editor/editorDuck'
import Loading from './loading'
import { getSandboxHost } from './utils'

interface GraphAcademyProviderProps {
  children: React.ReactElement
  updateConnection: (sandbox: Sandbox) => void
  setCypherFromQueryString: () => void
  connection: string | null
  connectionState: ConnectionState
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

function GraphAcademyProvider(props: GraphAcademyProviderProps): JSX.Element {
  // graphacademy.neo4j.com/courses/app-nodejs/1-module/2-lesson/browser
  const [_course_ = 'courses', slug = 'app-nodejs', ...other] =
    window.location.pathname.split('/').filter(n => n !== '')

  const [sandbox, setSandbox] = useState<Sandbox>()
  const [error, setError] = useState<string>()
  const [driver, setDriver] = useState<Driver>()

  const { connectionState, updateConnection, setCypherFromQueryString } = props

  useEffect(() => {
    // Driver connected and updateConnection dispatched
    if (connectionState === CONNECTED_STATE && sandbox && driver) {
      setCypherFromQueryString()
    }
    // Sandbox has IP and connection verified
    else if (connectionState !== CONNECTED_STATE && sandbox && driver) {
      updateConnection(sandbox)
    }
  }, [
    driver,
    sandbox,
    connectionState,
    updateConnection,
    setCypherFromQueryString
  ])

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
    return (
      <GetSandboxCredentials
        course={slug}
        setSandbox={setSandbox}
        setError={setError}
      />
    )
  }

  // 2. Wait for Sandbox IP to be set
  else if (!sandbox.ip || sandbox.ip === undefined) {
    return (
      <WaitForSandboxIp
        course={slug}
        sandbox={sandbox}
        setSandbox={setSandbox}
        setError={setError}
      />
    )
  }

  // 3. Connect and verify connectivity
  else if (!driver) {
    return (
      <VerifyConnectivity
        sandbox={sandbox}
        setDriver={setDriver}
        setError={setError}
      />
    )
  }

  // 4. Await active connection
  else if (props.connectionState !== CONNECTED_STATE) {
    return <Loading message="Preparing connection" />
  }

  // 5. Render application
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

const mapStateToProps = (state: GlobalState) => {
  return {
    connectionState: state.connections.connectionState,
    connection: state.connections.activeConnection
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateConnection: (sandbox: Sandbox) => {
      const { username, password } = sandbox as Sandbox

      dispatch(
        updateConnection({
          id: CONNECTION_ID,
          host: getSandboxHost(sandbox),
          db: 'neo4j',
          username,
          password,
          authEnabled: true,
          authenticationMethod: NATIVE
        })
      )

      // setTimeout(() => {
      dispatch(setActiveConnection(CONNECTION_ID, true))
      // }, 10)
    },
    setCypherFromQueryString() {
      // @GraphAcademy - detect ?cmd=edit&arg={cypher}
      const url = new URL(window.location.href)
      const cmd = url.searchParams.get('cmd')
      const arg = url.searchParams.get('arg')

      if (cmd === 'edit' && arg && arg !== '') {
        setTimeout(() => {
          dispatch(setContent(arg))
        }, 200)
      }
    }
  }
}

export default withBus(
  connect(mapStateToProps, mapDispatchToProps)(GraphAcademyProvider)
)
