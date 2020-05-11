import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import Card from '../../components/Card'
import Button from '../../components/Button'

const ConfirmEmail = () => {
  const router = useRouter()
  const { confirm } = router.query
  if (!confirm) {
    return (
      <Layout>
        <Card fail={true} title="You already confirmed your email!">
          <div>
            <Button
              btnType="border btn-primary overflow-hidden text-truncate py-2 px-4"
              text="Go Back"
            />
          </div>
        </Card>
      </Layout>
    )
  }
  // TODO: Add logic for confirm email mutating
  return (
    <Layout>
      <Card success={true} title="Thank You for Confirming Your Email!">
        <div>
          <Button
            btnType="border btn-primary overflow-hidden text-truncate py-2 px-4"
            text="Start Learning"
          />
        </div>
      </Card>
    </Layout>
  )
}

export default ConfirmEmail
