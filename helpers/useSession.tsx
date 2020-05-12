import useSWR from 'swr'
import _ from 'lodash'

// const SERVER_URL = process.env.SERVER_URL
const SERVER_URL = '/api/graphql'

export const fetcher = (url: string) =>
  fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `
            query {
              session {
                user {
                    username
                }
              }
            }
          `
    })
  }).then(r => r.json())

type User = {
  user: {
    username: string
  }
}

export type SessionData = {
  session: User | null
}

const useSession = (): SessionData => {
  const { data } = useSWR(SERVER_URL, fetcher)
  const session = _.get(data, 'data.session', {})
  return { session }
}

export default useSession
