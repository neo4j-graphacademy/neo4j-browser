import { QueryResult } from 'neo4j-driver'

import { BrowserRequest } from '../requests/requestsDuck'
import { METRICS_EVENT } from '../udc/udcDuck'
import { BrowserError } from 'services/exceptions'

// Get GA
const ls = window.localStorage.getItem('ga') || '{}'
const ga = JSON.parse(ls)

const GA_QUERY_EVENT = 'ga/query'

interface GAQueryEvent {
  cypher: string
}

interface GAQueryEventAction extends GAQueryEvent {
  type: typeof GA_QUERY_EVENT
}

const STATUS_SUCCESS = 'success'
const STATUS_ERROR = 'error'

const ALLOWED_STATUSES = [STATUS_SUCCESS, STATUS_ERROR]

export const trackQueryRequest = (action: BrowserRequest): void => {
  const { type: actionType, status, result } = action

  if (actionType !== 'cypher' || !ALLOWED_STATUSES.includes(status)) {
    return
  }

  let meta = {}

  if (status === STATUS_SUCCESS) {
    const { summary, records } = result as QueryResult
    const { counters, query, queryType, notifications } = summary

    meta = {
      type: 'result',
      records: records.length,
      query: query.text,
      queryType,
      counters: counters['_stats'],
      systemUpdates: counters['_systemUpdates'],
      notifications,
      updates: counters.updates ? counters.updates() : null
    }
  } else if (status === STATUS_ERROR) {
    // TODO: Get error message
    const { message, code } = result as BrowserError

    meta = {
      type: 'error',
      message,
      code
    }
  }

  fetch('/account/cypher', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      meta
    })
  })
}
