import { ComponentType, Fragment } from 'react'
import { useCan } from '../hooks/useCan'

export const Can: ComponentType<CanProps> = ({ children, permissions, roles }) => {
  const userCanSeeComponent = useCan({ permissions, roles })

  if (!userCanSeeComponent) {
    return null
  }

  return <Fragment>{children}</Fragment>
}

type CanProps = {
  permissions?: string[]
  roles?: string[]
}
