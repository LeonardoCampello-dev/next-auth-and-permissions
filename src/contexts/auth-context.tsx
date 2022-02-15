import { useRouter } from 'next/router'

import { setCookie, parseCookies } from 'nookies'
import { createContext, FC, useEffect, useState } from 'react'

import { api } from '../services/api'
import { CookiesEnum, Session, SignInCredentialsDTO, User } from '../types'
import { MaxAgeEnum } from '../types/enums/max-age-enum'
import { generateAuthToken } from '../utils/token/generate-auth-token'

type AuthContextStore = {
  user: User
  signIn: (credentials: SignInCredentialsDTO) => Promise<void>
  isAuthenticated: boolean
}

type AuthResponse = Session & User

export const AuthContext = createContext<AuthContextStore>({} as AuthContextStore)

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User>()

  const router = useRouter()

  const isAuthenticated = Boolean(user)

  const signIn = async ({ email, password }: SignInCredentialsDTO) => {
    try {
      const payload = {
        email,
        password
      }

      const response = await api.post<AuthResponse>('sessions', payload)

      const { permissions, roles, token, refreshToken } = response.data

      setUser({ email, permissions, roles })

      setCookie(undefined, CookiesEnum.AUTH_TOKEN, token, {
        maxAge: MaxAgeEnum.THIRTY_DAYS,
        path: '/'
      })

      setCookie(undefined, CookiesEnum.AUTH_REFRESH_TOKEN, refreshToken, {
        maxAge: MaxAgeEnum.THIRTY_DAYS,
        path: '/'
      })

      api.defaults.headers['Authorization'] = generateAuthToken(token)

      router.push('/dashboard')
    } catch (error) {
      console.info(error)
    }
  }

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()

    if (token) {
      api.get<User>('/me').then(response => {
        const { email, permissions, roles } = response.data

        setUser({ email, permissions, roles })
      })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}
