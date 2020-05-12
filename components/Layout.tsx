import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import AppNav from './AppNav'
import Footer from './Footer'
import _ from 'lodash'

import { GET_SESSION } from '../graphql/queries'

type Props = {
  children: React.ReactElement
}

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
