import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { parseCookies } from 'nookies'

import { CookiesEnum } from '../../types'

export const withSSRGuest = <TResult = object>(fn: GetServerSideProps<TResult>) => {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<TResult>> => {
    const cookies = parseCookies(context)

    if (cookies[CookiesEnum.AUTH_TOKEN]) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
        }
      }
    }

    return await fn(context)
  }
}
