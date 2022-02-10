import { createContext, FC } from 'react'

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
    console.log({ email, password })
  }

  return <AuthContext.Provider value={{ signIn, isAuthenticated }}>{children}</AuthContext.Provider>
}
