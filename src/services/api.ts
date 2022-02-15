import axios, { AxiosError } from 'axios'

import { parseCookies, setCookie } from 'nookies'

let cookies = parseCookies()

let isRefreshing = false
let failedRequestsQueue = []

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['nextauth.token']}`
  }
})

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const { status, data } = error.response

    if (status === 401) {
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

              setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/'
              })

              setCookie(undefined, 'nextauth.refreshToken', newRefreshToken, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/'
              })

              api.defaults.headers['Authorization'] = `Bearer ${token}`

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
              originalConfig.headers['Authorization'] = `Bearer ${token}`

              resolve(api(originalConfig))
            },
            onFailure: (error: AxiosError) => {
              reject(error)
            }
          })
        })
      } else {
        // TODO logout
      }
    }
  }
)
