/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react'
import Loading from '../loading'
import { Sandbox } from '../types/sandbox'
import { getSandboxForCourse } from '../utils'

interface GetSandboxCredentialsProps {
  course: string
  setSandbox: (sandbox: Sandbox) => void
  setError: (error: string) => void
}

export function GetSandboxCredentials({
  course,
  setSandbox,
  setError
}: GetSandboxCredentialsProps): JSX.Element {
  useEffect(() => {
    getSandboxForCourse(course)
      .then(json => {
        setSandbox(json)
      })
      .catch(e => setError(e.message))
  }, [course, setError, setSandbox])

  return <Loading message="Getting Sandbox Credentials" />
}
