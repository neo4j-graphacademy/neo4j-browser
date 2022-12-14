import { Sandbox } from './types/sandbox'

export async function getSandboxForCourse(
  slug: string,
  verifyConnectivity = false
): Promise<Sandbox> {
  return fetch(
    `/courses/${slug}/sandbox.json${
      verifyConnectivity ? 'verifyConnectivity=true' : ''
    }`
  ).then(res => res.json())
}

export async function getSandboxbyHashKey(hash: string): Promise<Sandbox> {
  return fetch(`/api/sandboxes/${hash}/`).then(res => res.json())
}

export function getSandboxHost(sandbox: Sandbox): string {
  return window.location.protocol === 'https:'
    ? `${sandbox.scheme}://${sandbox.host}:${sandbox.boltPort}`
    : `bolt://${sandbox.ip}:${sandbox.boltPort}`
}
