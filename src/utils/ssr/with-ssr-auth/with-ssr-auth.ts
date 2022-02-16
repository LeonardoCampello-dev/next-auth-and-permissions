import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { destroyCookie, parseCookies } from 'nookies'

import { AuthTokenError } from '../../../errors/auth-token-error'
import { CookiesEnum } from '../../../types'

export const withSSRAuth = <TResult = object>(fn: GetServerSideProps<TResult>) => {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<TResult>> => {
    const cookies = parseCookies(context)

    if (!cookies[CookiesEnum.AUTH_TOKEN]) {
      return {
        redirect: {
          destination: '/',
          permanent: false
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
