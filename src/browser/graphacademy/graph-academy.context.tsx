import { createContext } from 'react'
import { Sandbox } from './types/sandbox'
import { Driver } from 'neo4j-driver'

export interface GraphAcademyContextState {
  sandbox?: Sandbox
  driver?: Driver
}

export const GraphAcademyContext = createContext<GraphAcademyContextState>({})
