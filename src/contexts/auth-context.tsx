import { useRouter } from 'next/router'

import { setCookie, parseCookies } from 'nookies'
import { createContext, FC, useEffect, useState } from 'react'

import { api } from '../services/api'

interface User {
  email: string
  permissions: string[]
  roles: string[]
}

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextStore = {
  user: User
  signIn: (credentials: SignInCredentials) => Promise<void>
  isAuthenticated: boolean
}

interface Session {
  token: string
  refreshToken: string
}

type AuthResponse = Session & User

export const AuthContext = createContext<AuthContextStore>({} as AuthContextStore)

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User>()

  const router = useRouter()

  const isAuthenticated = Boolean(user)

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const response = await api.post<AuthResponse>('sessions', {
        email,
        password
      })

      const { permissions, roles, token, refreshToken } = response.data

      setUser({ email, permissions, roles })

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

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
