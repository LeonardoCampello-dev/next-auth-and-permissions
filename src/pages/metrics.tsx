import { NextPage } from 'next'

import { Fragment } from 'react'
import { setupAPIClient } from '../services/'
import { withSSRAuth } from '../utils/ssr'

import styles from '../styles/metrics/metrics.module.scss'

const Metrics: NextPage = () => {
  return (
    <div className={styles['container']}>
      <h1>Metrics</h1>
    </div>
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
