import { LoadingSpinner } from '@neo4j-ndl/react'
import Loading from 'browser/graphacademy/loading'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withBus } from 'react-suber'
import { GlobalState } from 'shared/globalState'
import { serverConfigEpic } from 'shared/modules/dbMeta/epics'
import { isServerConfigDone } from 'shared/modules/dbMeta/state'
import { CSSProperties } from 'styled-components'

interface Props {
  children: React.ReactNode
  isServerConfigDone: boolean
}

const styles = {
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    backgroundColor: '#E3ECF5',
    zIndex: 9,
    display: 'flex',
    flexDirection: 'column',
    rowGap: 8,
    justifyContent: 'center',
    alignItems: 'center'
  } as CSSProperties
}

function LoadingWrapper(props: Props) {
  const { isServerConfigDone } = props

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isServerConfigDone) setIsLoading(false)

    // 20 sec fallback to avoid hanging
    setTimeout(() => {
      setIsLoading(false)
    }, 20 * 1000)
  }, [isServerConfigDone])

  return (
    <div>
      {isLoading && <Loading message="Connecting to Sandbox..." />}
      <div>{props.children}</div>
    </div>
  )
}

const mapStateToProps = (state: GlobalState) => {
  return {
    isServerConfigDone: isServerConfigDone(state)
  }
}

export default withBus(connect(mapStateToProps, null)(LoadingWrapper))
