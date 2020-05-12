import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import AppNav from './AppNav'
import Footer from './Footer'
import _ from 'lodash'

type Props = {
  children: React.ReactElement
}

const GET_SESSION = gql`
  {
    session {
      user {
        id
        username
      }
    }
  }
`

const Layout: React.FC<Props> = ({ children }) => {
  const { loading, data } = useQuery(GET_SESSION)
  const username = _.get(data, 'session.user.username', null)

  if (username) {
    return (
      <>
        <AppNav username={username} loggedIn />
        <div className="container">{children}</div>
        <Footer />
      </>
    )
  }

  if (!loading) {
    return (
      <>
        <AppNav />
        <div className="container">{children}</div>
        <Footer />
      </>
    )
  }

  return <div />
}

export default Layout
