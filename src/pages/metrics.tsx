import { NextPage } from 'next'

import { Fragment } from 'react'
import { setupAPIClient } from '../services/'
import { withSSRAuth } from '../utils/ssr'

const Metrics: NextPage = () => {
  return (
    <Fragment>
      <h1>Metrics</h1>
    </Fragment>
  )
}

export default Metrics

export const getServerSideProps = withSSRAuth(
  async context => {
    const api = setupAPIClient(context)

    const response = await api.get('/me')

    return {
      props: {}
    }
  },
  {
    permissions: ['metrics.list'],
    roles: ['administrator']
  }
)
