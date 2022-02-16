import { NextPage } from 'next'

import { Fragment, useContext, useEffect } from 'react'

import { AuthContext } from '../contexts'
import { api, setupAPIClient } from '../services/'
import { withSSRAuth } from '../utils/ssr'

const Dashboard: NextPage = () => {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    api
      .get('/me')
      .then(response => console.log({ response }))
      .catch(error => console.log({ error }))
  })

  return (
    <Fragment>
      <h1>Dashboard</h1>

      <p>{user?.email}</p>

      {user?.permissions.map(permission => (
        <div key={permission}>{permission}</div>
      ))}
    </Fragment>
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
