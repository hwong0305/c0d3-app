import React from 'react'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Link from 'next/link'

const NoData = () => {
  return (
    <Layout>
      <Card title="You must be logged in to access this page">
        <div>
          <Link href="/login">
            <a className="border btn btn-primary overflow-hidden py-2 px-4">
              Login
            </a>
          </Link>
        </div>
      </Card>
    </Layout>
  )
}

export default NoData
