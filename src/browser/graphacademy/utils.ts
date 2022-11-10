import { Sandbox } from './types/sandbox'

const debug = process.env.REACT_APP_DEBUG

export async function getSandboxForCourse(slug: string): Promise<Sandbox> {
  if (debug) {
    return new Promise(resolve => {
      setTimeout(
        () =>
          resolve({
            sandboxId: '139f44bf53e91b10e9465bb9918e1660',
            sandboxHashKey: '139f44bf53e91b10e9465bb9918e1660',
            scheme: 'neo4j',
            boltPort: '7687',
            host: 'neo4j',
            port: '7687',
            ip: '',
            username: 'neo4j',
            password: 'neo',
            usecase: 'movies',
            expires: 0,
            status: 'READY'
          }),
        2000
      )
    })
  }

  return fetch(`/courses/${slug}/sandbox.json`).then(res => res.json())
}

export async function getSandboxbyHashKey(hash: string): Promise<Sandbox> {
  if (debug) {
    return new Promise(resolve => {
      setTimeout(
        () =>
          resolve({
            sandboxId: '139f44bf53e91b10e9465bb9918e1660',
            sandboxHashKey: '139f44bf53e91b10e9465bb9918e1660',
            scheme: 'neo4j',
            boltPort: '7687',
            host: 'neo4j',
            port: '7687',
            ip: '127.0.0.1',
            username: 'neo4j',
            password: 'neo',
            usecase: 'movies',
            expires: 0,
            status: 'READY'
          }),
        2000
      )
    })
  }

  return fetch(`http://localhost:3000/api/sandboxes/${hash}/`).then(res =>
    res.json()
  )
}
