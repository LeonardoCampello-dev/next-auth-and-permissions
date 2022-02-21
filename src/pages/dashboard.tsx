import { NextPage } from 'next'
import Link from 'next/link'

import { useContext, useEffect } from 'react'
import { Can } from '../components/can'

import { AuthContext } from '../contexts'
import { api, setupAPIClient } from '../services/'
import { withSSRAuth } from '../utils/ssr'

import styles from '../styles/dashboard/dashboard.module.scss'

const Dashboard: NextPage = () => {
  const { user, signOut } = useContext(AuthContext)

  useEffect(() => {
    api
      .get('/me')
      .then(response => console.log({ response }))
      .catch(error => console.log({ error }))
  })

  return (
    <div className={styles['container']}>
      <h1>Dashboard</h1>

      <button onClick={signOut} className={styles['sign-out']}>
        Sair
      </button>

      <p className={styles['email']}>e-mail: {user?.email}</p>

      {user?.permissions.map(permission => (
        <div key={permission} className={styles['permission']}>
          {permission}
        </div>
      ))}

      <Can permissions={['metrics.list']}>
        <Link href="/metrics" passHref>
          <button className={styles['metrics']}>Métricas</button>
        </Link>
      </Can>
    </div>
  )
}

export default Dashboard

export const getServerSideProps = withSSRAuth(async context => {
  const api = setupAPIClient(context)

  const response = await api.get('/me')

  console.log(response.data)

  return {
    props: {}
  }
})
