import decode from 'jwt-decode'

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { destroyCookie, parseCookies } from 'nookies'

import { AuthTokenError } from '../../../errors/auth-token-error'
import { CookiesEnum, User } from '../../../types'
import { ValidateUserPermissions } from '../../validation'

export const withSSRAuth = <TResult = object>(
  fn: GetServerSideProps<TResult>,
  options?: WithSSRAuthOptions
) => {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<TResult>> => {
    const cookies = parseCookies(context)

    const token = cookies[CookiesEnum.AUTH_TOKEN]

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    if (options) {
      const user = decode<User>(token)

      const { permissions, roles } = options

      const userHasValidPermissions = ValidateUserPermissions({ user, permissions, roles })

      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false
          }
        }
      }
    }

    try {
      return await fn(context)
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(context, CookiesEnum.AUTH_TOKEN)
        destroyCookie(context, CookiesEnum.AUTH_REFRESH_TOKEN)

        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }
  }
}

type WithSSRAuthOptions = {
  permissions?: string[]
  roles?: string[]
}
