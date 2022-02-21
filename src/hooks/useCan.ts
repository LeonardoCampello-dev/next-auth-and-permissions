import { useContext } from 'react'

import { AuthContext } from '../contexts'

export const useCan = ({ permissions = [], roles = [] }: useCanParams) => {
  const { user, isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) {
    return false
  }

  if (permissions.length) {
    const hasAllPermissions = permissions.every(permission => {
      return user.permissions.includes(permission)
    })

    if (!hasAllPermissions) {
      return false
    }
  }

  if (roles.length) {
    const hasAllRoles = roles.some(role => {
      return user.roles.includes(role)
    })

    if (!hasAllRoles) {
      return false
    }
  }

  return true
}

type useCanParams = {
  permissions?: string[]
  roles?: string[]
}
