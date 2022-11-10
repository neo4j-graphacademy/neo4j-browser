/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react'
import Loading from '../loading'
import { Sandbox } from '../types/sandbox'
import { getSandboxForCourse } from '../utils'

interface GetSandboxCredentialsProps {
  setSandbox: (sandbox: Sandbox) => void
  setError: (error: string) => void
}

export function GetSandboxCredentials({
  setSandbox,
  setError
}: GetSandboxCredentialsProps): JSX.Element {
  // graphacademy.neo4j.com/courses/app-nodejs/1-module/2-lesson/browser
  const [_course_ = 'courses', slug = 'app-nodejs', ...other] =
    window.location.pathname.split('/').filter(n => n !== '')

  useEffect(() => {
    getSandboxForCourse(slug)
      .then(json => {
        setSandbox(json)
      })
      .catch(e => setError(e.message))
  }, [slug, setError, setSandbox])

  return <Loading message="Getting Sandbox Credentials" />
}
