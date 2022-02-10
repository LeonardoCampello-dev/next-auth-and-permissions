import { createContext, FC } from 'react'

import { api } from '../services/api'

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextStore = {
  signIn: (credentials: SignInCredentials) => Promise<void>
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextStore>({} as AuthContextStore)

export const AuthProvider: FC = ({ children }) => {
  const isAuthenticated = false

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const response = await api.post('sessions', {
        email,
        password
      })

      console.log(response.data)
    } catch (error) {
      console.info(error)
    }
  }

  return <AuthContext.Provider value={{ signIn, isAuthenticated }}>{children}</AuthContext.Provider>
}
