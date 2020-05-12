import * as React from 'react'
import _ from 'lodash'
import { useRouter } from 'next/router'
import AppNav from '../components/AppNav'
import LandingPage from '../components/LandingPage'
import Footer from '../components/Footer'
import withQueryLoader, { WithQueryProps } from '../containers/withQueryLoader'
import { GET_APP } from '../graphql/queries'
import { Session } from '../@types/session'

const IndexPage: React.FC<WithQueryProps> = ({ queryData }) => {
  const router = useRouter()
  const { session }: { session: Session } = queryData
  const emailVerificationToken = _.get(
    session,
    'user.emailVerificationToken',
    null
  )

  if (session && emailVerificationToken) {
    router.push('/success')
    return null
  }

  if (session && !emailVerificationToken) {
    router.push('/curriculum')
    return null
  }

  return (
    <>
      <AppNav loggedIn={false} />
      <LandingPage />
      <Footer footerType="py-5 bg-white text-muted" />
    </>
  )
}

export default withQueryLoader(
  {
    query: GET_APP
  },
  IndexPage
)
