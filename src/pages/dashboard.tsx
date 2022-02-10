import { NextPage } from 'next'

import { Fragment, useContext } from 'react'
import { AuthContext } from '../contexts'

const Dashboard: NextPage = () => {
  const { user } = useContext(AuthContext)

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
