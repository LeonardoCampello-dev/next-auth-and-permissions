import type { GetServerSideProps, NextPage } from 'next'
import { parseCookies } from 'nookies'

import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../contexts'

import styles from '../styles/Home.module.css'
import { CookiesEnum } from '../types'
import { withSSRGuest } from '../utils/ssr/with-ssr-guest'

const Home: NextPage = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const { signIn } = useContext(AuthContext)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const data = { email, password }

    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" value={email} onChange={event => setEmail(event.target.value)} />
      <input type="password" value={password} onChange={event => setPassword(event.target.value)} />

      <button type="submit">Entrar</button>
    </form>
  )
}

export default Home

export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {}
  }
})
