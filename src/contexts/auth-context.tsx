import { useRouter } from 'next/router'

import { createContext, FC, useState } from 'react'

import { api } from '../services/api'

type User = {
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

export const AuthContext = createContext<AuthContextStore>({} as AuthContextStore)

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User>()

  const router = useRouter()

  const isAuthenticated = Boolean(user)

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const response = await api.post('sessions', {
        email,
        password
      })

      const { permissions, roles } = response.data

      setUser({ email, permissions, roles })

      router.push('/dashboard')
    } catch (error) {
      console.info(error)
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}
