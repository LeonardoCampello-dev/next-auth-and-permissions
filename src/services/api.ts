import axios, { AxiosError } from 'axios'

import { parseCookies, setCookie } from 'nookies'

import { signOut } from '../contexts'
import { CookiesEnum, HttpStatusCode } from '../types/'
import { MaxAgeEnum } from '../types/enums/max-age-enum'
import { generateAuthToken } from '../utils/token/generate-auth-token'

let cookies = parseCookies()

let isRefreshing = false
let failedRequestsQueue = []

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: generateAuthToken(cookies[CookiesEnum.AUTH_TOKEN])
  }
})

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const { status, data } = error.response

    if (status === HttpStatusCode.Unauthorized) {
      if (data?.code === 'token.expired') {
        cookies = parseCookies()

        const { 'nextauth.refreshToken': refreshToken } = cookies

        const { config: originalConfig } = error

        if (!isRefreshing) {
          isRefreshing = true

          api
            .post<{ token: string; refreshToken: string }>('/refresh', {
              refreshToken
            })
            .then(response => {
              const { token, refreshToken: newRefreshToken } = response.data

              setCookie(undefined, CookiesEnum.AUTH_TOKEN, token, {
                maxAge: MaxAgeEnum.THIRTY_DAYS,
                path: '/'
              })

              setCookie(undefined, CookiesEnum.AUTH_REFRESH_TOKEN, newRefreshToken, {
                maxAge: MaxAgeEnum.THIRTY_DAYS,
                path: '/'
              })

              api.defaults.headers['Authorization'] = generateAuthToken(token)

              failedRequestsQueue.forEach(request => request.onSuccess(token))
              failedRequestsQueue = []
            })
            .catch(error => {
              failedRequestsQueue.forEach(request => request.onFailure(error))
              failedRequestsQueue = []
            })
            .finally(() => {
              isRefreshing = false
            })
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = generateAuthToken(token)

              resolve(api(originalConfig))
            },
            onFailure: (error: AxiosError) => {
              reject(error)
            }
          })
        })
      } else {
        signOut()
      }
    }

    return Promise.reject(error)
  }
)
