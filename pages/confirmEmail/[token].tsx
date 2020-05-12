import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import _ from 'lodash'
import { useMutation } from '@apollo/react-hooks'

import Card from '../../components/Card'
import Layout from '../../components/Layout'
import Button from '../../components/Button'
import { CONFIRM_EMAIL } from '../../graphql/queries'

const ConfirmEmail = () => {
  const router = useRouter()
  const confirm = _.get(router, 'query.confirm', null)
  const [confirmEmail, { data, loading, error }] = useMutation(CONFIRM_EMAIL)
  useEffect(() => {
    if (confirm && !loading) {
      confirmEmail({ variables: { confirm } })
    }
  }, [confirm])
  if ((!confirm && !loading) || (!loading && error)) {
    return (
      <Layout>
        <Card fail={true} title="Invalid Email Confirmation">
          <div>
            <Button
              btnType="border btn-primary overflow-hidden text-truncate py-2 px-4"
              text="Go Back"
              onClick={() => {
                router.back()
              }}
            />
          </div>
        </Card>
      </Layout>
    )
  }
  if (data) {
    return (
      <Layout>
        <Card success={true} title="Thank You for Confirming Your Email!">
          <div>
            <Link href="/curriculum">
              <a className="border btn-primary overflow-hidden text-truncate py-2 px-4">
                Start Learning
              </a>
            </Link>
          </div>
        </Card>
      </Layout>
    )
  }

  return <div />
}

export default ConfirmEmail
