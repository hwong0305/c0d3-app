import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { DocumentNode } from 'apollo-boost'
import LoadingSpinner from '../components/LoadingSpinner'
import NoData from '../components/NoData'

type QueryProps = {
  query: DocumentNode
  getParams?: Function
}

export type WithQueryProps = {
  queryData: any
}

const withQueryLoader = (
  { query, getParams = () => ({}) }: QueryProps,
  Component: React.FC<any>
) => (props: any) => {
  const { loading, data } = useQuery(query, getParams(props))

  if (loading) {
    return <LoadingSpinner />
  }

  if (data) {
    return <Component queryData={data} {...props} />
  }

  return <NoData />
}

export default withQueryLoader
