import React from 'react'
import Layout from '../components/Layout'
import Card from '../components/Card'

const Success = () => {
  return (
    <Layout>
      <Card success={true} title="Account Created Succesfully">
        <div>
          <p>
            A confirmation email has been sent to your email address. Please
            follow the instructions to activate your account
          </p>
        </div>
      </Card>
    </Layout>
  )
}

export default Success
