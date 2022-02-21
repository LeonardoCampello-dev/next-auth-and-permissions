import { useContext } from 'react'

import { AuthContext } from '../contexts'
import { ValidateUserPermissions } from '../utils/validation'

export const useCan = ({ permissions = [], roles = [] }: useCanParams) => {
  const { user, isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) {
    return false
  }

  const userHasValidPermissions = ValidateUserPermissions({ user, permissions, roles })

  return userHasValidPermissions
}

type useCanParams = {
  permissions?: string[]
  roles?: string[]
}
