import { User } from '../../../types'

export const ValidateUserPermissions = ({
  user,
  permissions,
  roles
}: ValidateUserPermissionsParams) => {
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

type ValidateUserPermissionsParams = {
  user: User
  permissions?: string[]
  roles?: string[]
}
