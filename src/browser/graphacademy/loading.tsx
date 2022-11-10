import { LoadingSpinner } from '@neo4j-ndl/react'
import React from 'react'

interface LoadingProps {
  message: string
}

export default function Loading({ message }: LoadingProps): JSX.Element {
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
        <LoadingSpinner size="large" />
        <p className="label n-py-4">{message}</p>
      </div>
    </div>
  )
}
