import type { NextPage } from 'next'

import Head from 'next/head'
import Image from 'next/image'

import { FormEvent, Fragment, useContext, useState } from 'react'

import SecureBackgroundSVG from '../assets/secure-background.svg'

import { AuthContext } from '../contexts'
import { withSSRGuest } from '../utils/ssr'

import styles from '../styles/login/login.module.scss'

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
    <Fragment>
      <Head>
        <title>Login</title>
      </Head>

      <div className={styles['container']}>
        <form onSubmit={handleSubmit} className={styles['form']}>
          <input
            type="email"
            placeholder="example@domain.com"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="must have at least 6 characters"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />

          <button type="submit">Entrar</button>
        </form>

        <div className={styles['image-container']}>
          <Image src={SecureBackgroundSVG} alt="Secure background" />
        </div>
      </div>
    </Fragment>
  )
}

export default Home

export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {}
  }
})
